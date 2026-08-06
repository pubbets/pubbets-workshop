// ui.js — the options panel: tab bar + step wizards.
//
// Structure ported from the old Pubbets Lab builder:
//   • One category on screen at a time, chosen from a tab bar (with Prev/Next).
//   • Simple categories ("grid") show a flat list of choices.
//   • Deep categories ("steps") are wizards over "dimensions" —
//     e.g. nose = shape -> size -> colour, hair = length -> style -> colour.
//   • NO auto-advance: picking an option never jumps you to another tab, so you
//     can freely compare colours/styles. You move on with Next (or the tabs).

export class PanelUI {
  constructor(config, handlers) {
    this.cfg = config;
    this.on = handlers;                 // { onChange(catId, resolved), onTabChange(cat) }
    // Categories flagged "hidden" still build the puppet but get no tab
    // (e.g. the base body — there's only one, so a tab would be redundant).
    const firstVisible = config.categories.find(c => !c.hidden);
    this.activeTab = (firstVisible || config.categories[0]).id;
    this.sel = {};                      // catId -> resolved selection object
    this.stepIndex = {};                // catId -> which dimension step is showing
    this.dimSel = {};                   // catId -> { dimKey: valueId }
    this.filterSel = {};                // catId -> { filterKey: valueId }
    config.categories.forEach(c => {
      this.stepIndex[c.id] = 0;
      this.dimSel[c.id] = {};
      (c.filters || []).forEach(f => {
        this.filterSel[c.id] = this.filterSel[c.id] || {};
        this.filterSel[c.id][f.key] = f.values[0].id;
      });
    });
  }

  // ---------- helpers ----------

  cat(id) { return this.cfg.categories.find(c => c.id === id); }

  // Categories can be hidden by another category's choice
  // (e.g. old app hid Glasses when Oval eyes were picked).
  isHidden(c) {
    if (c.hidden) return true;
    if (!c.hideWhen) return false;
    return Object.entries(c.hideWhen).some(([path, val]) => {
      const [catId, dimKey] = path.split('.');
      const picked = this.dimSel[catId] || {};
      return picked[dimKey] === val;
    });
  }

  visibleTabs() { return this.cfg.categories.filter(c => !this.isHidden(c)); }

  // Hidden *because of another choice* (oval eyes hide glasses) — as opposed to
  // permanently hidden categories like the base body, which must stay on the puppet.
  isConditionallyHidden(c) { return !c.hidden && this.isHidden(c); }

  // Values available at a given dimension, honouring `when` (depends on earlier
  // picks) and any active filters (e.g. gender).
  valuesFor(c, dim) {
    const picked = this.dimSel[c.id] || {};
    const filters = this.filterSel[c.id] || {};
    return dim.values.filter(v => {
      if (v.when && !Object.entries(v.when).every(([k, val]) => picked[k] === val)) return false;
      for (const [fk, fv] of Object.entries(filters)) {
        if (fv !== 'all' && v[fk] && v[fk] !== 'all' && v[fk] !== fv) return false;
      }
      return true;
    });
  }

  // Build the final selection object once every dimension has a pick.
  resolve(c) {
    if (c.ui !== 'steps') return this.sel[c.id] || null;
    const picked = this.dimSel[c.id] || {};
    if (!c.dimensions.every(d => picked[d.key])) return null;

    const parts = [], names = [];
    let price = 0, color = null, shape = null, scale = 1;
    for (const d of c.dimensions) {
      const v = d.values.find(x => x.id === picked[d.key] &&
        (!x.when || Object.entries(x.when).every(([k, val]) => picked[k] === val)));
      if (!v) return null;
      parts.push(v.id); names.push(v.name);
      price += v.price || 0;
      if (v.color) color = v.color;
      if (v.shape) shape = v.shape;
      if (v.scale) scale *= v.scale;   // e.g. nose Size steps resize one model
    }
    if (c.surcharge) price += c.surcharge;

    let model = c.modelPattern || '';
    for (const [k, val] of Object.entries(picked)) model = model.replace(`{${k}}`, val);
    if (model.includes('{')) model = '';   // pattern not fully filled

    return {
      id: parts.join('-'),
      name: names.join(' · '),
      model, price, shape, scale,
      color: color || '#cccccc',
      tint: !!c.tintable,          // recolour the loaded model to the chosen colour
      baseScale: c.baseScale || null,
      dims: { ...picked }
    };
  }

  totalPrice() {
    let t = this.cfg.meta.basePrice || 0;
    for (const c of this.cfg.categories) {
      if (this.isHidden(c)) continue;
      const s = this.sel[c.id];
      if (s) t += s.price || 0;
    }
    return t;
  }

  // ---------- rendering ----------

  mount(tabsEl, panelEl) {
    this.tabsEl = tabsEl;
    this.panelEl = panelEl;
    this.renderTabs();
    this.renderPanel();
  }

  renderTabs() {
    const tabs = this.visibleTabs();
    this.tabsEl.innerHTML = tabs.map(c => {
      const active = c.id === this.activeTab;
      const done = !!this.sel[c.id];
      return `<button class="tab ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}"
                data-tab="${c.id}" aria-pressed="${active}" title="${c.label}">
                <span class="tab-emoji">${c.emoji || ''}</span>
                <span class="tab-label">${c.label}</span>
                ${done ? '<span class="tab-tick">✓</span>' : ''}
              </button>`;
    }).join('');
    this.tabsEl.querySelectorAll('[data-tab]').forEach(b =>
      b.addEventListener('click', () => this.setTab(b.dataset.tab)));
  }

  setTab(id) {
    if (this.activeTab === id) return;
    this.activeTab = id;
    this.renderTabs();
    this.renderPanel();
    const c = this.cat(id);
    if (this.on.onTabChange) this.on.onTabChange(c);
  }

  step(dir) {
    const tabs = this.visibleTabs();
    const i = tabs.findIndex(c => c.id === this.activeTab);
    const next = tabs[i + dir];
    if (next) this.setTab(next.id);
  }

  renderPanel() {
    const c = this.cat(this.activeTab);
    if (!c) return;
    const html = c.ui === 'steps' ? this.stepsHTML(c) : this.gridHTML(c);
    const tabs = this.visibleTabs();
    const i = tabs.findIndex(x => x.id === c.id);

    this.panelEl.innerHTML = `
      <div class="cat-head">
        <h2 class="cat-title">${c.emoji || ''} ${c.label}</h2>
        ${c.hint ? `<p class="cat-hint">${c.hint}</p>` : ''}
      </div>
      ${this.filtersHTML(c)}
      ${html}
      <div class="panel-nav">
        <button class="nav-btn" data-nav="-1" ${i <= 0 ? 'disabled' : ''}>‹ Back</button>
        <span class="nav-count">${i + 1} / ${tabs.length}</span>
        <button class="nav-btn primary-ghost" data-nav="1" ${i >= tabs.length - 1 ? 'disabled' : ''}>Next ›</button>
      </div>`;

    this.panelEl.querySelectorAll('[data-nav]').forEach(b =>
      b.addEventListener('click', () => this.step(+b.dataset.nav)));
    this.wireOptionButtons(c);
    this.panelEl.parentElement.scrollTop = 0;
  }

  filtersHTML(c) {
    if (!c.filters) return '';
    return c.filters.map(f => `
      <div class="filter-row">
        <span class="filter-label">${f.label}</span>
        <div class="filter-btns">
          ${f.values.map(v => `<button class="chip ${this.filterSel[c.id][f.key] === v.id ? 'is-active' : ''}"
             data-filter="${f.key}" data-val="${v.id}">${v.name}</button>`).join('')}
        </div>
      </div>`).join('');
  }

  gridHTML(c) {
    const sel = this.sel[c.id];
    const clear = c.optional
      ? `<button class="swatch clear ${!sel ? 'selected' : ''}" data-clear="1">
           <span class="dot dot-none">∅</span><span class="name">None</span><span class="plus">&nbsp;</span></button>` : '';
    const items = c.options.map(o => this.swatchHTML(o, sel && sel.id === o.id)).join('');
    return `<div class="swatches">${clear}${items}</div>`;
  }

  // A swatch shows a real thumbnail image when the option has one,
  // otherwise falls back to a coloured dot.
  faceHTML(o) {
    if (o.thumb) return `<span class="thumb"><img src="${o.thumb}" alt="" loading="lazy"></span>`;
    if (o.color) return `<span class="dot" style="background:${o.color}"></span>`;
    return `<span class="dot dot-shape">${(o.name || '?').charAt(0)}</span>`;
  }

  swatchHTML(o, selected) {
    const price = o.price > 0 ? `<span class="plus">+$${o.price}</span>` : '<span class="plus">&nbsp;</span>';
    return `<button class="swatch ${o.thumb ? 'has-thumb' : ''} ${selected ? 'selected' : ''}" data-opt="${o.id}">
              ${this.faceHTML(o)}
              <span class="name">${o.name}</span>${price}</button>`;
  }

  stepsHTML(c) {
    const idx = this.stepIndex[c.id] || 0;
    const dim = c.dimensions[idx];
    const picked = this.dimSel[c.id] || {};
    const values = this.valuesFor(c, dim);

    // Breadcrumb of the steps, clickable to jump back.
    const crumbs = c.dimensions.map((d, i) => {
      const v = d.values.find(x => x.id === picked[d.key]);
      const state = i === idx ? 'is-active' : (picked[d.key] ? 'is-done' : '');
      return `<button class="crumb ${state}" data-step="${i}" ${i > idx && !picked[d.key] ? 'disabled' : ''}>
                <span class="crumb-n">${i + 1}</span>
                <span class="crumb-t">${v ? v.name : d.label}</span></button>`;
    }).join('<span class="crumb-sep">›</span>');

    const clear = c.optional
      ? `<button class="swatch clear ${!this.sel[c.id] ? 'selected' : ''}" data-clear="1">
           <span class="dot dot-none">∅</span><span class="name">None</span><span class="plus">&nbsp;</span></button>` : '';

    const items = values.map(v => {
      const isSel = picked[dim.key] === v.id;
      const price = v.price ? `<span class="plus">+$${v.price}</span>` : '<span class="plus">&nbsp;</span>';
      return `<button class="swatch ${v.thumb ? 'has-thumb' : ''} ${isSel ? 'selected' : ''}"
                data-dim="${dim.key}" data-val="${v.id}">
                ${this.faceHTML(v)}<span class="name">${v.name}</span>${price}</button>`;
    }).join('');

    const surcharge = c.surcharge
      ? `<p class="surcharge-note">Any ${c.label.toLowerCase()} adds $${c.surcharge.toFixed(2)}</p>` : '';

    return `<div class="crumbs">${crumbs}</div>
            ${surcharge}
            <div class="step-label">${dim.label}</div>
            <div class="swatches">${idx === 0 ? clear : ''}${items}</div>`;
  }

  wireOptionButtons(c) {
    const el = this.panelEl;

    el.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
      this.filterSel[c.id][b.dataset.filter] = b.dataset.val;
      this.renderPanel();
    }));

    el.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
      this.stepIndex[c.id] = +b.dataset.step;
      this.renderPanel();
    }));

    el.querySelectorAll('[data-clear]').forEach(b => b.addEventListener('click', () => {
      this.sel[c.id] = null;
      this.dimSel[c.id] = {};
      this.stepIndex[c.id] = 0;
      this.commit(c, null);
    }));

    el.querySelectorAll('[data-opt]').forEach(b => b.addEventListener('click', () => {
      const o = c.options.find(x => x.id === b.dataset.opt);
      this.sel[c.id] = o;
      this.commit(c, o);
    }));

    el.querySelectorAll('[data-dim]').forEach(b => b.addEventListener('click', () => {
      const key = b.dataset.dim;
      this.dimSel[c.id][key] = b.dataset.val;

      // Clear later dimensions whose options may no longer apply.
      const idx = c.dimensions.findIndex(d => d.key === key);
      c.dimensions.slice(idx + 1).forEach(d => { delete this.dimSel[c.id][d.key]; });

      // Move to the next step within THIS category only (never jumps tabs).
      if (idx < c.dimensions.length - 1) this.stepIndex[c.id] = idx + 1;

      const resolved = this.resolve(c);
      this.sel[c.id] = resolved;
      this.commit(c, resolved);
    }));

    el.querySelectorAll('.swatch').forEach(b =>
      b.addEventListener('mouseenter', () => this.on.onHover && this.on.onHover()));
  }

  commit(c, resolved) {
    this.renderTabs();
    this.renderPanel();
    if (this.on.onChange) this.on.onChange(c, resolved);
  }

  // Choose sensible defaults on first load (required categories only).
  defaults() {
    const out = [];
    for (const c of this.cfg.categories) {
      if (c.ui === 'grid') {
        if (c.required && c.options.length) { this.sel[c.id] = c.options[0]; out.push([c, c.options[0]]); }
      } else if (c.required) {
        c.dimensions.forEach(d => {
          const vals = this.valuesFor(c, d);
          if (vals.length) this.dimSel[c.id][d.key] = vals[0].id;
        });
        const r = this.resolve(c);
        if (r) { this.sel[c.id] = r; out.push([c, r]); }
      }
    }
    return out;
  }
}

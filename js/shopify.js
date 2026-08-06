// shopify.js — sends the finished puppet design to Shopify for payment.
//
// How it works: we open Shopify's cart with a single "Custom Puppet" variant,
// attaching the full design as line-item properties. Those properties show up
// on the order in your Shopify admin, so you know exactly what to build.
//
// SETUP (one time): in data/options.json, set:
//   shopify.storeDomain           -> "your-store.myshopify.com"
//   shopify.customPuppetVariantId -> the numeric variant ID of a product you
//                                    create in Shopify called "Custom Puppet".

export function checkout(shopifyConfig, selection, totalPrice) {
  const domain = shopifyConfig?.storeDomain;
  const variantId = shopifyConfig?.customPuppetVariantId;

  // Build human-readable line-item properties from the selection.
  const props = {};
  for (const [catId, opt] of Object.entries(selection)) {
    if (opt && opt.name) props[catId] = opt.name;
  }
  props['_design_json'] = JSON.stringify(
    Object.fromEntries(Object.entries(selection).map(([k, v]) => [k, v?.id]))
  );
  props['Estimated total'] = '$' + totalPrice;

  if (!domain || domain.startsWith('YOUR-') || !variantId || String(variantId).startsWith('REPLACE')) {
    // Not configured yet — show the payload so James can confirm it's correct.
    console.info('[shopify] Not configured yet. Design payload:', { variantId, props });
    return {
      configured: false,
      message: 'Shopify isn’t connected yet. Your design was captured — see the console.',
      payload: props
    };
  }

  // Shopify cart permalink with line-item properties.
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(props)) params.set(`properties[${k}]`, v);
  const url = `https://${domain}/cart/${variantId}:1?${params.toString()}`;
  window.open(url, '_blank');
  return { configured: true, url };
}

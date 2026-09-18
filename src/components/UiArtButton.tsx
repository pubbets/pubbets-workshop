import type { ButtonHTMLAttributes, ReactNode } from 'react';

/** Inline SVG icons for the felt buttons — crisp at any size, no raster assets. */
const icons: Record<string, ReactNode> = {
  back: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  reset: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M4 3v4h4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  randomise: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" fill="currentColor" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" fill="currentColor" opacity="0.55" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" fill="currentColor" opacity="0.55" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" fill="currentColor" />
    </svg>
  ),
  soundOn: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" />
      <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  soundOff: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 7L4 12l5 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h9a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  tick: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export type UiArtButtonAsset =
  | 'back' | 'next' | 'reset' | 'randomiseSquare' | 'randomiseWide'
  | 'soundOn' | 'soundOff' | 'undo' | 'startBuilding' | 'skipThisStep'
  | 'completeTick' | 'ok' | 'noThanks';

const assetIcon: Record<UiArtButtonAsset, string | undefined> = {
  back: 'back',
  next: 'next',
  reset: 'reset',
  randomiseSquare: 'randomise',
  randomiseWide: 'randomise',
  soundOn: 'soundOn',
  soundOff: 'soundOff',
  undo: 'undo',
  startBuilding: undefined,
  skipThisStep: undefined,
  completeTick: 'tick',
  ok: undefined,
  noThanks: undefined
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  asset: UiArtButtonAsset;
  label: string;
  size?: 'wide' | 'long' | 'square' | 'badge';
  /** Extra hint line shown under the main label (e.g. "Skip this step"). */
  sublabel?: string;
};

export function UiArtButton({ asset, label, size = 'wide', sublabel, className = '', ...props }: Props) {
  const icon = assetIcon[asset];
  return (
    <button
      className={`ui-art-button ui-art-button--${size} ui-art-button--asset-${asset} ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      {icon && <span className="ui-art-button__icon" aria-hidden="true">{icons[icon]}</span>}
      <span className="ui-art-button__text">
        <span className="ui-art-button__label">{label}</span>
        {sublabel && <span className="ui-art-button__sub">{sublabel}</span>}
      </span>
    </button>
  );
}

export function UiArtImage({ asset, label, size = 'wide', className = '' }: Pick<Props, 'asset' | 'label' | 'size' | 'className'>) {
  const icon = assetIcon[asset];
  return (
    <span className={`ui-art-image ui-art-button--${size} ui-art-button--asset-${asset} ${className}`.trim()} aria-label={label} role="img">
      {icon && <span className="ui-art-button__icon" aria-hidden="true">{icons[icon]}</span>}
      <span className="ui-art-button__text">
        <span className="ui-art-button__label">{label}</span>
      </span>
    </span>
  );
}

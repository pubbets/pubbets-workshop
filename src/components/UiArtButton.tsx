import type { ButtonHTMLAttributes } from 'react';

const buttonAssets = {
  back: new URL('../../assets/ui/buttons/ui-button-back-clean.png', import.meta.url).href,
  completeTick: new URL('../../assets/ui/buttons/ui-button-complete-tick-clean.png', import.meta.url).href,
  next: new URL('../../assets/ui/buttons/ui-button-next-clean.png', import.meta.url).href,
  noThanks: new URL('../../assets/ui/buttons/ui-button-no-thanks-clean.png', import.meta.url).href,
  ok: new URL('../../assets/ui/buttons/ui-button-ok-clean.png', import.meta.url).href,
  randomiseSquare: new URL('../../assets/ui/buttons/ui-button-randomise-square-clean.png', import.meta.url).href,
  randomiseWide: new URL('../../assets/ui/buttons/ui-button-randomise-wide-clean.png', import.meta.url).href,
  reset: new URL('../../assets/ui/buttons/ui-button-reset-clean.png', import.meta.url).href,
  saveBuildSheet: new URL('../../assets/ui/buttons/ui-button-save-build-sheet-clean.png', import.meta.url).href,
  skipThisStep: new URL('../../assets/ui/buttons/ui-button-skip-this-step-clean.png', import.meta.url).href,
  soundOff: new URL('../../assets/ui/buttons/ui-button-sound-off-clean.png', import.meta.url).href,
  soundOn: new URL('../../assets/ui/buttons/ui-button-sound-on-clean.png', import.meta.url).href,
  startBuilding: new URL('../../assets/ui/buttons/ui-button-start-building-clean.png', import.meta.url).href,
  undo: new URL('../../assets/ui/buttons/ui-button-undo-clean.png', import.meta.url).href
};

export type UiArtButtonAsset = keyof typeof buttonAssets;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  asset: UiArtButtonAsset;
  label: string;
  size?: 'wide' | 'long' | 'square' | 'badge';
};

export function UiArtButton({ asset, label, size = 'wide', className = '', ...props }: Props) {
  return (
    <button className={`ui-art-button ui-art-button--${size} ${className}`.trim()} aria-label={label} {...props}>
      <img src={buttonAssets[asset]} alt="" aria-hidden="true" draggable={false} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function UiArtImage({ asset, label, size = 'wide', className = '' }: Pick<Props, 'asset' | 'label' | 'size' | 'className'>) {
  return (
    <span className={`ui-art-image ui-art-button--${size} ${className}`.trim()} aria-label={label} role="img">
      <img src={buttonAssets[asset]} alt="" aria-hidden="true" draggable={false} />
    </span>
  );
}

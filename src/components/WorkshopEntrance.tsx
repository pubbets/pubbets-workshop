import { useEffect, useRef, useState } from 'react';
import pubbetsWorkshopLogo from '../../assets/ui/logo/pubbets-workshop-logo.png';
import workshopExteriorLandscape from '../../assets/ui/backgrounds/workshop-exterior-landscape.webp';
import workshopExteriorPortrait from '../../assets/ui/backgrounds/workshop-exterior-portrait.webp';

type Props = {
  onEnter: () => void;
  onEntered: () => void;
};

export function WorkshopEntrance({ onEnter, onEntered }: Props) {
  const [opening, setOpening] = useState(false);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
  }, []);

  const enterWorkshop = () => {
    if (opening) return;

    // This must run inside the click itself so mobile browsers allow the theme music.
    onEnter();
    setOpening(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    transitionTimer.current = window.setTimeout(onEntered, prefersReducedMotion ? 80 : 900);
  };

  return (
    <main className={`workshop-entrance${opening ? ' is-opening' : ''}`}>
      <picture className="entrance-scene" aria-hidden="true">
        <source media="(orientation: portrait)" srcSet={workshopExteriorPortrait} />
        <img src={workshopExteriorLandscape} alt="" />
      </picture>
      <div className="entrance-light" aria-hidden="true" />
      <header className="entrance-brand">
        <img src={pubbetsWorkshopLogo} alt="Pubbets Workshop" />
      </header>
      <button className="entrance-door" type="button" onClick={enterWorkshop} aria-label="Open the door and enter Pubbets Workshop">
        <span>Tap the door to enter</span>
      </button>
    </main>
  );
}

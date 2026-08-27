import { useEffect, useRef, useState } from 'react';
import pubbetsWorkshopLogo from '../../assets/ui/logo/pubbets-workshop-logo.png';
import workshopExteriorLandscape from '../../assets/ui/backgrounds/workshop-exterior-landscape.webp';
import workshopExteriorPortrait from '../../assets/ui/backgrounds/workshop-exterior-portrait.webp';
import workshopExteriorTablet from '../../assets/ui/backgrounds/workshop-exterior-tablet.webp';
import homePegboardBackground from '../../assets/ui/backgrounds/home-pegboard-background.png';
import startBuildingButton from '../../assets/ui/buttons/ui-button-start-building-clean.png';
import randomiseButton from '../../assets/ui/buttons/ui-button-randomise-wide-clean.png';

const entranceDuration = 420;

type PromptMotion = 'jiggle' | 'pulse' | null;

type Props = {
  onEnter: () => void;
  onEntered: () => void;
};

export function WorkshopEntrance({ onEnter, onEntered }: Props) {
  const [opening, setOpening] = useState(false);
  const [promptMotion, setPromptMotion] = useState<PromptMotion>(null);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
  }, []);

  useEffect(() => {
    // The title screen uses large illustrated assets. Warm them into the browser
    // cache while the user is looking at the entrance so the reveal is instant.
    [homePegboardBackground, pubbetsWorkshopLogo, startBuildingButton, randomiseButton].forEach((source) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = source;
    });
  }, []);

  useEffect(() => {
    if (opening || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cueTimer: number | null = null;
    let resetTimer: number | null = null;
    const scheduleCue = () => {
      cueTimer = window.setTimeout(() => {
        setPromptMotion(Math.random() < 0.55 ? 'jiggle' : 'pulse');
        resetTimer = window.setTimeout(() => {
          setPromptMotion(null);
          scheduleCue();
        }, 850);
      }, 2800 + Math.random() * 4200);
    };

    scheduleCue();
    return () => {
      if (cueTimer !== null) window.clearTimeout(cueTimer);
      if (resetTimer !== null) window.clearTimeout(resetTimer);
    };
  }, [opening]);

  const enterWorkshop = () => {
    if (opening) return;

    // This must run inside the click itself so mobile browsers allow the theme music.
    onEnter();
    setOpening(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    transitionTimer.current = window.setTimeout(onEntered, prefersReducedMotion ? 40 : entranceDuration);
  };

  return (
    <main className={`workshop-entrance${opening ? ' is-opening' : ''}`}>
      <picture className="entrance-scene" aria-hidden="true">
        <source media="(orientation: portrait) and (min-aspect-ratio: 3 / 5)" srcSet={workshopExteriorTablet} />
        <source media="(orientation: portrait)" srcSet={workshopExteriorPortrait} />
        <img src={workshopExteriorLandscape} alt="" />
      </picture>
      <div className="entrance-light" aria-hidden="true" />
      <div className="entrance-wash" aria-hidden="true" />
      <header className="entrance-brand">
        <img src={pubbetsWorkshopLogo} alt="Pubbets Workshop" />
      </header>
      <button className="entrance-door" type="button" onClick={enterWorkshop} aria-label="Open the door and enter Pubbets Workshop">
        <span className="entrance-portal" aria-hidden="true" />
        <span className="entrance-sparkles" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
        </span>
        <span className={`entrance-prompt${promptMotion ? ` is-${promptMotion}` : ''}`}>Tap the door to enter</span>
      </button>
    </main>
  );
}

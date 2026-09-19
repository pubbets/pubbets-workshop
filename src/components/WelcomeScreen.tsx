import { useEffect, useMemo, useRef, useState } from 'react';
import { UiArtButton } from './UiArtButton';
import pubbetsWorkshopLogo from '../../assets/ui/logo/pubbets-workshop-logo.png';
import { bodyRenderPath } from '../data/catalog';
import { catalog } from '../data/catalog';

type Props = {
  onStart: () => void;
  onRandomize: () => void;
  soundEnabled: boolean;
  tunePlaying: boolean;
  onToggleSound: () => void;
  onPlayTune: () => void;
};

const BODY_COLOURS = [
  'blue', 'dark-green', 'green', 'light-brown', 'light-orange',
  'light-pink', 'light-purple', 'yellow', 'beige', 'deep-blue',
  'brown', 'coral-pink', 'orange', 'purple', 'red',
];

export function WelcomeScreen({ onStart, onRandomize, soundEnabled, tunePlaying, onToggleSound, onPlayTune }: Props) {
  const tuneRequested = useRef(false);

  const [currentBody, setCurrentBody] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBody((prev) => (prev + 1) % BODY_COLOURS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const requestTune = () => {
    if (tunePlaying || tuneRequested.current) return;
    tuneRequested.current = true;
    onPlayTune();
  };

  const bodyRenderUrl = useMemo(() => bodyRenderPath(BODY_COLOURS[currentBody]), [currentBody]);

  return (
    <main
      className={`welcome-screen${tunePlaying ? ' is-tune-playing' : ''}`}
      onPointerDownCapture={requestTune}
      onKeyDownCapture={requestTune}
    >
      <UiArtButton
        asset={soundEnabled ? 'soundOn' : 'soundOff'}
        label={soundEnabled ? 'Mute all sound' : 'Enable sound and play home tune'}
        size="square"
        className="welcome-settings"
        onClick={onToggleSound}
        title={soundEnabled ? 'Mute all sound' : 'Enable sound and play home tune'}
      />
      <header className="welcome-brand" aria-label="Pubbets Workshop">
        <img className="welcome-logo" src={pubbetsWorkshopLogo} alt="Pubbets Workshop" />
      </header>
      <div className="welcome-puppet-stage" aria-hidden="true">
        {bodyRenderUrl && <img className="welcome-puppet" src={bodyRenderUrl} alt="" />}
      </div>
      <div className="welcome-actions">
        <UiArtButton asset="startBuilding" label="Start building" size="long" onClick={onStart} />
        <UiArtButton asset="randomiseWide" label="In a hurry? Randomise!" size="long" onClick={onRandomize} />
      </div>
    </main>
  );
}
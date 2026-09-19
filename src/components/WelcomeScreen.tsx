import { useEffect, useRef, useState } from 'react';
import { UiArtButton } from './UiArtButton';
import pubbetsWorkshopLogo from '../../assets/ui/logo/pubbets-workshop-logo.png';

// Statically import all body renders — relative from src/components/
import bodyBlue from '../assets/body-renders/body-blue.png';
import bodyDarkGreen from '../assets/body-renders/body-dark-green.png';
import bodyGreen from '../assets/body-renders/body-green.png';
import bodyLightBrown from '../assets/body-renders/body-light-brown.png';
import bodyLightOrange from '../assets/body-renders/body-light-orange.png';
import bodyLightPink from '../assets/body-renders/body-light-pink.png';
import bodyLightPurple from '../assets/body-renders/body-light-purple.png';
import bodyYellow from '../assets/body-renders/body-yellow.png';
import bodyBeige from '../assets/body-renders/body-beige.png';
import bodyDeepBlue from '../assets/body-renders/body-deep-blue.png';
import bodyBrown from '../assets/body-renders/body-brown.png';
import bodyCoralPink from '../assets/body-renders/body-coral-pink.png';
import bodyOrange from '../assets/body-renders/body-orange.png';
import bodyPurple from '../assets/body-renders/body-purple.png';
import bodyRed from '../assets/body-renders/body-red.png';

const bodyRenderUrls: Record<string, string> = {
  blue: bodyBlue,
  'dark-green': bodyDarkGreen,
  green: bodyGreen,
  'light-brown': bodyLightBrown,
  'light-orange': bodyLightOrange,
  'light-pink': bodyLightPink,
  'light-purple': bodyLightPurple,
  yellow: bodyYellow,
  beige: bodyBeige,
  'deep-blue': bodyDeepBlue,
  brown: bodyBrown,
  'coral-pink': bodyCoralPink,
  orange: bodyOrange,
  purple: bodyPurple,
  red: bodyRed,
};

const bodyColourIds = Object.keys(bodyRenderUrls);

type Props = {
  onStart: () => void;
  onRandomize: () => void;
  soundEnabled: boolean;
  tunePlaying: boolean;
  onToggleSound: () => void;
  onPlayTune: () => void;
};

export function WelcomeScreen({ onStart, onRandomize, soundEnabled, tunePlaying, onToggleSound, onPlayTune }: Props) {
  const tuneRequested = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bodyColourIds.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const requestTune = () => {
    if (tunePlaying || tuneRequested.current) return;
    tuneRequested.current = true;
    onPlayTune();
  };

  const colourId = bodyColourIds[currentIndex];
  const currentRenderUrl = bodyRenderUrls[colourId] ?? null;

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
        {currentRenderUrl && <img className="welcome-puppet" src={currentRenderUrl} alt="" />}
      </div>
      <div className="welcome-actions">
        <UiArtButton asset="startBuilding" label="Start building" size="long" onClick={onStart} />
        <UiArtButton asset="randomiseWide" label="In a hurry? Randomise!" size="long" onClick={onRandomize} />
      </div>
    </main>
  );
}
import { useRef } from 'react';
import { UiArtButton } from './UiArtButton';
import pubbetsWorkshopLogo from '../../assets/ui/logo/pubbets-workshop-logo.png';

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

  const requestTune = () => {
    if (tuneRequested.current) return;
    tuneRequested.current = true;
    onPlayTune();
  };

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
      <div className="welcome-actions">
        <UiArtButton asset="startBuilding" label="Start building" size="long" onClick={onStart} />
        <UiArtButton asset="randomiseWide" label="In a hurry? Randomise!" size="long" onClick={onRandomize} />
      </div>
    </main>
  );
}

import { UiArtButton } from './UiArtButton';
import pubbetsWorkshopLogo from '../../assets/ui/logo/pubbets-workshop-logo.png';

type Props = {
  onStart: () => void;
  onRandomize: () => void;
};

export function WelcomeScreen({ onStart, onRandomize }: Props) {
  return (
    <main className="welcome-screen">
      <button className="utility-button welcome-settings" aria-label="Workshop settings">⚙</button>
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

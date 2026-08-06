type Props = { onStart: () => void };

export function WelcomeScreen({ onStart }: Props) {
  return (
    <main className="welcome-screen">
      <button className="utility-button welcome-settings" aria-label="Workshop settings">⚙</button>
      <div className="bunting" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <header className="welcome-brand" aria-label="Pubbets Workshop">
        <div className="felt-letters" aria-hidden="true">
          {'PUBBETS'.split('').map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}
        </div>
        <div className="leather-ribbon">Workshop</div>
        <p>Build a one-of-a-kind friend, stitched by hand just for you.</p>
      </header>
      <div className="welcome-hero" aria-hidden="true">
        <div className="thread-spool thread-spool--left" />
        <div className="welcome-puppet"><span className="welcome-puppet__eye" /><span className="welcome-puppet__eye" /><span className="welcome-puppet__smile" /></div>
        <div className="thread-spool thread-spool--right" />
      </div>
      <button className="start-button" onClick={onStart}>Start building <span aria-hidden="true">→</span></button>
      <p className="welcome-footnote">Nine playful steps · your choices are saved as you go</p>
    </main>
  );
}

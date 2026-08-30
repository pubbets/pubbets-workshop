# Pubbets Workshop sound set

These effects are original procedural audio generated for Pubbets Workshop.
They use deterministic synthesis and contain no third-party samples, voices,
recordings, or copyrighted melodies.

Run `node scripts/generate-audio.cjs` from the repository root to regenerate
the WAV files. Pass sound names to rebuild only those files:

```
node scripts/generate-audio.cjs select-felt-01 select-felt-02
```

The generated files are mono, 44.1 kHz, 16-bit PCM and are kept short for
browser delivery.

## Selection ticks

Closed-beta UI selection uses the felt pair, not the older wood ticks:

- `select-felt-01.wav` — muted E5 pluck, ~128 ms, peak about −11 dBFS
- `select-felt-02.wav` — muted G5 pluck (three semitones up), same shape

They are wired in `src/hooks/useWorkshopSound.ts` at volume **0.20**, under
the home tune (0.24). The two files alternate. `select-wood-01.wav` and
`select-wood-02.wav` stay in this folder unused.

Wizard forward/back keep their handmade cues; their playback volumes are
slightly softer so the felt select stays the quietest UI tick.

## Unlock

The workshop door tap is the first user gesture. That click must call
`unlock()` and `play('homeTune')` in the same handler so browsers allow
HTMLAudio. Unlock plays a tiny silent buffer and preloads the other cues
so the first option tap is instant. If `audio.play()` is rejected, the
next user gesture retries instead of failing silently. The home tune
file itself is unchanged.

Do not autoplay before the door. Honour the mute preference. Stop and
require a fresh unlock when the tab is hidden.

Creative direction: a cheerful handmade puppet workshop using soft wood,
felt, fabric rustles, buttons, and toy percussion; playful without
electronic game sounds or continuous background music. Selection should
feel like Animal Crossing / Zelda menus: soft, short, rounded, never a
dry click.

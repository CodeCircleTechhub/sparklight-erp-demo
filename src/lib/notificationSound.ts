// Two-tone notification chime synthesised with the Web Audio API — no audio
// asset needed. Browsers block audio until the user has interacted with the
// page, so an early failure is swallowed silently.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Ctor = W.AudioContext || W.webkitAudioContext;
    if (!Ctor) return null;
    if (!ctx) ctx = new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function playNotificationSound(): void {
  const ac = getCtx();
  if (!ac) return;
  try {
    const now = ac.currentTime;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    gain.connect(ac.destination);

    // soft "ding-dong"
    [880, 1174.66].forEach((freq, i) => {
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.18);
      osc.connect(gain);
      osc.start(now + i * 0.18);
      osc.stop(now + 0.6);
    });
  } catch {
    // audio unavailable — never break the UI for a sound
  }
}

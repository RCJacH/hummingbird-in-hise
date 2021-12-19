namespace Noises {
  const var PICKNOISE = 1;
  const var WEAKBUZZ = 2;
  const var PICKBUZZ = 3;
  const var PICKSTOP = 4;
  const var FRETNOISE = 5;
  const var FINGERRELEASE = 6;
  const var GLIDEDOWN = 7;
  const var OPENSTRING= 8;

  inline function trigger(string, index) {
    local func;
    local settings;
    switch (index) {
      case WEAKBUZZ:
        func = NoteTrigger.triggerPickBuzz;
        settings = g_noises.weakBuzz;
        break;
      case PICKBUZZ:
        func = NoteTrigger.triggerPickBuzz;
        settings = g_noises.pickBuzz;
        break;
      case PICKNOISE:
        func = NoteTrigger.triggerPickNoise;
        settings = g_noises.pickNoise;
        break;
      case PICKSTOP:
        func = NoteTrigger.triggerPickStop;
        settings = g_noises.pickStop;
        break;
      case FRETNOISE:
        func = NoteTrigger.triggerFretNoise;
        settings = g_noises.fretNoise;
        break;
      case FINGERRELEASE:
        func = NoteTrigger.triggerFingerRelease;
        settings = g_noises.fingerRelease;
        break;
      case GLIDEDOWN:
        func = NoteTrigger.triggerGlideDown;
        settings = g_noises.glideDown;
        break;
      case OPENSTRING:
        func = NoteTrigger.triggerOpenString;
        settings = g_noises.openString;
        break;
      default:
        return;
    }
    if (shouldTrigger(settings)) {
      string.pending.setGain(getVolume(settings));
      MIDI.timestamp += getDelay(settings);
      func();
    }
  }

  inline function shouldTrigger(settings) {
    return (
      (!settings.threshold ||
      (
      (settings.threshold > 0 && MIDI.value > settings.threshold) ||
      (settings.threshold < 0 && MIDI.value < -settings.threshold)
      )) &&
      Math.random() < settings.probability
    )
  }

  inline function getVolume(settings) {
    local vol = settings.humanize * settings.volume;
    local rnd = Math.random() * 2 - 1;
    return Engine.getDecibelsForGainFactor(
      settings.volume + Math.sign(rnd) * Math.sin(Math.pow(rnd, 2)) * vol
    )
  }

  inline function getDelay(settings) {
    if (!settings.delay) { return; }

    local delay = settings.humanize * settings.delay;
    local rnd = Math.random() * 2 - 1;
    return Delays.inSamples(
      settings.delay + Math.sign(rnd) * Math.sin(Math.pow(rnd, 2)) * delay
    )
  }
}

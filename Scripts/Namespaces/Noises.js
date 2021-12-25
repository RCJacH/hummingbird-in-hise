namespace Noises {
  const var PICKNOISE = 1;
  const var WEAKBUZZ = 2;
  const var PICKBUZZ = 3;
  const var PICKSTOP = 4;
  const var FRETNOISE = 5;
  const var FRETNOISEDOWN = 6;
  const var FRETNOISEUP = 7;
  const var FINGERRELEASE = 8;
  const var GLIDEDOWN = 9;
  const var OPENSTRING = 10;

  const var TOTALARTICULATIONS = 11;

  inline function _initFlags(indice) {
    local i = 0;
    for (index in indice) {
      i |= 1 << (index - 1);
    }
    return i
  }

  const var PICKFLAG = _initFlags([PICKNOISE]);
  const var BUZZFLAG = _initFlags([PICKBUZZ]);
  const var PICKnBUZZFLAG = PICKFLAG + BUZZFLAG;

  const var RELEASEFLAG = _initFlags([
    PICKBUZZ, PICKSTOP, FRETNOISE, FINGERRELEASE, GLIDEDOWN, OPENSTRING
  ]);

  inline function trigger(string, index, func) {
    local settings;
    local articulation;
    local note = MIDI.number;
    local velocity = MIDI.value;
    local delay = 0;
    switch (index) {
      case WEAKBUZZ:
        articulation = Articulations.PICKBUZZ;
        settings = g_noises.weakBuzz;
        velocity = g_pressedKeys.getValue(g_keys.releaseWeakBuzz);
        break;
      case PICKBUZZ:
        articulation = Articulations.PICKBUZZ;
        settings = g_noises.pickBuzz;
        break;
      case PICKNOISE:
        articulation = Articulations.PICKNOISE;
        settings = g_noises.pickNoise;
        break;
      case PICKSTOP:
        articulation = Articulations.PICKSTOP;
        settings = g_noises.pickStop;
        velocity = g_pressedKeys.getValue(g_keys.releasePickStop);
        break;
      case FRETNOISE:
        articulation = Articulations.FRETNOISE;
        settings = g_noises.fretNoise;
        velocity = g_pressedKeys.getValue(g_keys.releaseFretNoise);
        note = 0 + (Math.random() >= 0.5) * 2;
        delay = Delays.inSamples(80 - 60 * (velocity / 127));
        break;
      case FRETNOISEDOWN:
        articulation = Articulations.FRETNOISE;
        settings = g_noises.positionChange;
        note = 0;
        break;
      case FRETNOISEUP:
        articulation = Articulations.FRETNOISE;
        settings = g_noises.positionChange;
        note = 2;
        break;
      case FINGERRELEASE:
        articulation = Articulations.FINGERRELEASE;
        settings = g_noises.fingerRelease;
        velocity = g_pressedKeys.getValue(g_keys.releaseFingerRelease);
        break;
      case GLIDEDOWN:
        articulation = Articulations.GLIDEDOWN;
        settings = g_noises.glideDown;
        velocity = g_pressedKeys.getValue(g_keys.releaseGlideDown);
        if (velocity == -1) {
          velocity = g_pressedKeys.getValue(g_keys.glideDown);
        }
        break;
      case OPENSTRING:
        articulation = Articulations.SUSTAIN;
        settings = g_noises.openString;
        velocity = g_pressedKeys.getValue(g_keys.releaseOpenString);
        note = string.openNote;
        break;
      default:
        return;
    }
    if (shouldTrigger(settings)) {
      string.pending.setGain(string.pending.getGain + getVolume(settings));
      func(articulation, note, velocity, MIDI.timestamp + delay + getDelay(settings));
    }
  }

  inline function shouldTrigger(settings) {
    return (
      (!settings.threshold ||
      (
        Math.sign(settings.threshold) * MIDI.value - settings.threshold > 0
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

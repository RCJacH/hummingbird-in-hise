namespace EventParser {
  const var STRUM_CHANNEL = 15;
  const var CONTROL_CHANNEL = 16;

  inline function _isNote() {
    return MIDI.number <=84 && (g_lh.isSilent || MIDI.number >= 40)
  }

  inline function parseKeySwitchOn() {
    local string = g_strings[MIDI.channel];
    local isKS = 1;
    switch (MIDI.number) {
      case g_keys.glideDown:
        g_noises.glideDown.probability += 1;
        GuitarString.forAllStrings(
          function (string) { GuitarString.clearFret(string, string.fret); }
        );
        break;
      case g_keys.releaseWeakBuzz:
        g_noises.weakBuzz.probability += 1;
        break;
      case g_keys.releasePickStop:
        g_noises.pickStop.probability += 1;
        break;
      case g_keys.releaseFretNoise:
        g_noises.fretNoise.probability += 1;
        break;
      case g_keys.releaseFingerRelease:
        g_noises.fingerRelease.probability += 1;
        break;
      case g_keys.releaseGlideDown:
        g_noises.glideDown.probability += 1;
        break;
      case g_keys.releaseOpenString:
        g_noises.openString.probability += 1;
        break;
      case g_keys.sustain:
        GuitarString.setArticulation(string, Articulations.SUSTAIN, 1);
        break;
      case g_keys.muted:
      case g_keys.muted2:
        GuitarString.setArticulation(string, Articulations.MUTED, MIDI.value);
        break;
      case g_keys.palmMuted:
      case g_keys.palmMuted2:
        GuitarString.setArticulation(string, Articulations.PALMMUTED, MIDI.value);
        break;
      case g_keys.silent:
        LeftHand.setSilent(MIDI.value);
        break;
      default:
        isKS = 0;
    }
    return isKS
  }

  inline function parseKeySwitchOff() {
    local string = g_strings[MIDI.channel];
    local isKS = 1;
    switch (MIDI.number) {
      case g_keys.glideDown:
        g_noises.glideDown.probability %= 1;
        break;
      case g_keys.releaseWeakBuzz:
        g_noises.weakBuzz.probability %= 1;
        break;
      case g_keys.releasePickStop:
        g_noises.pickStop.probability %= 1;
        break;
      case g_keys.releaseFretNoise:
        g_noises.fretNoise.probability %= 1;
        break;
      case g_keys.releaseFingerRelease:
        g_noises.fingerRelease.probability %= 1;
        break;
      case g_keys.glideDown:
      case g_keys.releaseGlideDown:
        g_noises.glideDown.probability %= 1;
        break;
      case g_keys.releaseOpenString:
        g_noises.openString.probability %= 1;
        break;
      case g_keys.muted:
      case g_keys.muted2:
        GuitarString.releaseArticulation(string, Articulations.MUTED);
        break;
      case g_keys.palmMuted:
      case g_keys.palmMuted2:
        GuitarString.releaseArticulation(string, Articulations.PALMMUTED);
        break;
      case g_keys.silent:
        LeftHand.setSilent(MIDI.value);
        break;
      default:
        isKS = 0;
    }
    return isKS
  }

  inline function triggerControlNoteOn() {
    if (_isNote()) {
      return;
    }
    switch (MIDI.number) {
      case g_keys.addString:
        RightHand.setAddString(MIDI.value);
        break;
      case g_keys.missString:
        RightHand.setMissString(MIDI.value);
        break;
      case g_keys.fullD:
        Strum.noteOn(6, 1, Strum.DOWNSTROKE);
        break;
      case g_keys.fullU:
        Strum.noteOn(6, 1, Strum.UPSTROKE);
        break;
      case g_keys.lowD:
        Strum.noteOn(6, 4, Strum.DOWNSTROKE);
        break;
      case g_keys.lowU:
        Strum.noteOn(6, 4, Strum.UPSTROKE);
        break;
      case g_keys.lowMidD:
        Strum.noteOn(5, 3, Strum.DOWNSTROKE);
        break;
      case g_keys.lowMidU:
        Strum.noteOn(5, 3, Strum.UPSTROKE);
        break;
      case g_keys.highMidD:
        Strum.noteOn(4, 2, Strum.DOWNSTROKE);
        break;
      case g_keys.highMidU:
        Strum.noteOn(4, 2, Strum.UPSTROKE);
        break;
      case g_keys.highD:
        Strum.noteOn(3, 1, Strum.DOWNSTROKE);
        break;
      case g_keys.highU:
        Strum.noteOn(3, 1, Strum.UPSTROKE);
        break;
      case g_keys.string1:
        Strum.noteOn(1, 1, Strum.DOWNSTROKE);
        break;
      case g_keys.string2:
        Strum.noteOn(2, 2, Strum.DOWNSTROKE);
        break;
      case g_keys.string3:
        Strum.noteOn(3, 3, Strum.DOWNSTROKE);
        break;
      case g_keys.string4:
        Strum.noteOn(4, 4, Strum.DOWNSTROKE);
        break;
      case g_keys.string5:
        Strum.noteOn(5, 5, Strum.DOWNSTROKE);
        break;
      case g_keys.string6:
        Strum.noteOn(6, 6, Strum.DOWNSTROKE);
        break;
      case g_keys.repeatD:
        Strum.noteOn(null, null, Strum.DOWNSTROKE);
        break;
      case g_keys.repeatU:
        Strum.noteOn(null, null, Strum.UPSTROKE);
        break;
      case g_keys.glideDown:
        g_noises.glideDown.probability += 1;
        GuitarString.forAllStrings(
          function (string) { GuitarString.clearFret(string, string.fret); }
        );
        break;
      case g_keys.releaseWeakBuzz:
        g_noises.weakBuzz.probability += 1;
        break;
      case g_keys.releasePickStop:
        g_noises.pickStop.probability += 1;
        break;
      case g_keys.releaseFretNoise:
        g_noises.fretNoise.probability += 1;
        break;
      case g_keys.releaseFingerRelease:
        g_noises.fingerRelease.probability += 1;
        break;
      case g_keys.releaseGlideDown:
        g_noises.glideDown.probability += 1;
        break;
      case g_keys.releaseOpenString:
        g_noises.openString.probability += 1;
        break;
      case g_keys.sustain:
        GuitarString.forAllStrings(
          function (string) {
            GuitarString.setArticulation(string, Articulations.SUSTAIN, 1);
          }
        );
        break;
      case g_keys.muted:
      case g_keys.muted2:
        GuitarString.forAllStrings(
          function (string) {
            GuitarString.setArticulation(string, Articulations.MUTED, MIDI.value);
          }
        );
        break;
      case g_keys.palmMuted:
      case g_keys.palmMuted2:
        GuitarString.forAllStrings(
          function (string) {
            GuitarString.setArticulation(string, Articulations.PALMMUTED, MIDI.value);
          }
        );
        break;
      case g_keys.silent:
        LeftHand.setSilent(MIDI.value);
        break;
      case g_keys.timeDirection:
        RightHand.startDirectionDetection();
        break;
    }
  }

  inline function triggerControlNoteOff() {
    if (_isNote()) {
      return;
    }
    switch (MIDI.number) {
      case g_keys.addString:
        g_rh.addString = 0;
        break;
      case g_keys.missString:
        g_rh.missString = 0;
        break;
      case g_keys.fullD:
      case g_keys.fullU:
      case g_keys.lowD:
      case g_keys.lowU:
      case g_keys.lowMidD:
      case g_keys.lowMidU:
      case g_keys.highMidD:
      case g_keys.highMidU:
      case g_keys.highD:
      case g_keys.highU:
      case g_keys.string1:
      case g_keys.string2:
      case g_keys.string3:
      case g_keys.string4:
      case g_keys.string5:
      case g_keys.string6:
      case g_keys.repeatD:
      case g_keys.repeatU:
        Strum.noteOff(MIDI.number);
        break;
      case g_keys.releaseWeakBuzz:
        g_noises.weakBuzz.probability %= 1;
        break;
      case g_keys.releasePickStop:
        g_noises.pickStop.probability %= 1;
        break;
      case g_keys.releaseFretNoise:
        g_noises.fretNoise.probability %= 1;
        break;
      case g_keys.releaseFingerRelease:
        g_noises.fingerRelease.probability %= 1;
        break;
      case g_keys.glideDown:
      case g_keys.releaseGlideDown:
        g_noises.glideDown.probability %= 1;
        break;
      case g_keys.releaseOpenString:
        g_noises.openString.probability %= 1;
        break;
      case g_keys.muted:
        GuitarString.forAllStrings(
          function (string) {
            GuitarString.releaseArticulation(string, Articulations.MUTED);
          }
        );
        break;
      case g_keys.palmMuted:
        GuitarString.forAllStrings(
          function (string) {
            GuitarString.releaseArticulation(string, Articulations.PALMMUTED);
          }
        );
        break;
      case g_keys.silent:
        LeftHand.setSilent(0);
        break;
      case g_keys.timeDirection:
        RightHand.stopDirectionDetection();
        break;
    }
  }

  inline function triggerNoteOn() {
    if (parseKeySwitchOn()) { return; }
    local string = g_strings[MIDI.channel];
    RightHand.setDirectionFromBeatPosition(Transport.getCurrentPosition());
    GuitarString.pressFret(string, GuitarString.getFret(string));
  }

  inline function triggerNoteOff() {
    if (parseKeySwitchOff()) { return; }
    local string = g_strings[MIDI.channel];
    GuitarString.releaseFret(string, GuitarString.getFret(string));
  }

  inline function parseNoteOn() {
    Message.makeArtificial();
    Message.ignoreEvent(true);
    MIDI.parseNoteOn();
    g_pressedKeys.setValue(MIDI.number, MIDI.value);
    switch (MIDI.channel) {
      case CONTROL_CHANNEL:
      case STRUM_CHANNEL:
        triggerControlNoteOn();
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        triggerNoteOn();
        break;
    }
  }

  inline function parseNoteOff() {
    Message.makeArtificial();
    Message.ignoreEvent(true);
    MIDI.parseNoteOff();
    g_pressedKeys.setValue(MIDI.number, -1);
    switch (MIDI.channel) {
      case CONTROL_CHANNEL:
      case STRUM_CHANNEL:
        triggerControlNoteOff();
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        triggerNoteOff();
        break;
    }
  }

  inline function parseController() {
    MIDI.parseController();

    Message.ignoreEvent(true);
    switch (MIDI.number) {
      case g_cc.frettingPosition:
        LeftHand.changePosition(MIDI.value);
        break;
      case g_cc.pickingDirection:
        RightHand.setDirection(Math.ceil(MIDI.value/64) - 1);
        break;
      case g_cc.strumSpeed:
        RightHand.setSpeed(MIDI.value/127);
        break;
      case g_cc.strumDivision:
        RightHand.setStrumDivision(MIDI.value/127);
        break;
      case g_cc.vibratoDepth:
        LeftHand.setVibratoDepth(MIDI.value/127);
        break;
      case g_cc.vibratoSpeed:
        LeftHand.setVibratoSpeed(MIDI.value/127);
        break;
      case g_cc.palmMuted:
        GuitarString.forAllStrings(
          function (string) {
            if (MIDI.value < g_settings.keyswitchThreshold) {
              GuitarString.releaseArticulation(string, Articulations.PALMMUTED);
            } else {
              GuitarString.setArticulation(string, Articulations.PALMMUTED, 1);
            }
          }
        );
        break;
      case g_cc.muted:
        GuitarString.forAllStrings(
          function (string) {
            if (MIDI.value < g_settings.keyswitchThreshold) {
              GuitarString.releaseArticulation(string, Articulations.MUTED);
            } else {
              GuitarString.setArticulation(string, Articulations.MUTED, 1);
            }
          }
        );
        break;
      case g_cc.silent:
        LeftHand.setSilent(MIDI.value >= g_settings.keyswitchThreshold);
        break;
      case g_cc.accelleration:
        RightHand.setAccelleration(MIDI.value/127);
        break;
      case g_cc.crescendo:
        RightHand.setCrescendo(MIDI.value/127);
        break;
      case g_cc.humanizeRightHand:
        RightHand.setHumanize(MIDI.value/127);
        break;
      case g_cc.humanizeVelocity:
        g_settings.humanize.velocity = MIDI.value/127;
        break;
      case g_cc.humanizeVolume:
        g_settings.humanize.volume = MIDI.value/127;
        break;
      case g_cc.humanizeTiming:
        g_settings.humanize.timing = MIDI.value/127;
        break;
    }
  }
}

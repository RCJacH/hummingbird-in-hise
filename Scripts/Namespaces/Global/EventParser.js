namespace EventParser {
  const var STRUM_CHANNEL = 15;
  const var CONTROL_CHANNEL = 16;

  inline function _isNote() {
    return MIDI.number <=84 && (g_lh.isSilent || MIDI.number >= 40)
  }

  inline function triggerControlNoteOn() {
    if (_isNote()) {
      ChordParser.analyze();
      return;
    }
    Message.ignoreEvent(true);
    switch (MIDI.number) {
      case g_keys["addString"]:
        RightHand.setAddString(MIDI.value);
        break;
      case g_keys["missString"]:
        RightHand.setMissString(MIDI.value);
        break;
      case g_keys["fullD"]:
        Strum.noteOn(6, 1, Strum.DOWNSTROKE);
        break;
      case g_keys["fullU"]:
        Strum.noteOn(6, 1, Strum.UPSTROKE);
        break;
      case g_keys["lowD"]:
        Strum.noteOn(6, 4, Strum.DOWNSTROKE);
        break;
      case g_keys["lowU"]:
        Strum.noteOn(6, 4, Strum.UPSTROKE);
        break;
      case g_keys["lowMidD"]:
        Strum.noteOn(5, 3, Strum.DOWNSTROKE);
        break;
      case g_keys["lowMidU"]:
        Strum.noteOn(5, 3, Strum.UPSTROKE);
        break;
      case g_keys["highMidD"]:
        Strum.noteOn(4, 2, Strum.DOWNSTROKE);
        break;
      case g_keys["highMidU"]:
        Strum.noteOn(4, 2, Strum.UPSTROKE);
        break;
      case g_keys["highD"]:
        Strum.noteOn(3, 1, Strum.DOWNSTROKE);
        break;
      case g_keys["highU"]:
        Strum.noteOn(3, 1, Strum.UPSTROKE);
        break;
      case g_keys["string1"]:
        Strum.noteOn(1, 1, Strum.DOWNSTROKE);
        break;
      case g_keys["string2"]:
        Strum.noteOn(2, 2, Strum.DOWNSTROKE);
        break;
      case g_keys["string3"]:
        Strum.noteOn(3, 3, Strum.DOWNSTROKE);
        break;
      case g_keys["string4"]:
        Strum.noteOn(4, 4, Strum.DOWNSTROKE);
        break;
      case g_keys["string5"]:
        Strum.noteOn(5, 5, Strum.DOWNSTROKE);
        break;
      case g_keys["string6"]:
        Strum.noteOn(6, 6, Strum.DOWNSTROKE);
        break;
    }
  }

  inline function triggerControlNoteOff() {
    if (_isNote()) {
      return;
    }
    Message.ignoreEvent(true);
    switch (MIDI.number) {
      case g_keys["addString"]:
        g_rh.addString = 0;
        break;
      case g_keys["missString"]:
        g_rh.missString = 0;
        break;
      case g_keys["fullD"]:
      case g_keys["fullU"]:
      case g_keys["lowD"]:
      case g_keys["lowU"]:
      case g_keys["lowMidD"]:
      case g_keys["lowMidU"]:
      case g_keys["highMidD"]:
      case g_keys["highMidU"]:
      case g_keys["highD"]:
      case g_keys["highU"]:
      case g_keys["string1"]:
      case g_keys["string2"]:
      case g_keys["string3"]:
      case g_keys["string4"]:
      case g_keys["string5"]:
      case g_keys["string6"]:
        Strum.noteOff(MIDI.number);
        break;
    }
  }

  inline function triggerNoteOn() {

  }

  inline function triggerNoteOff() {

  }

  inline function parseNoteOn() {
    switch (Message.getChannel()) {
      case CONTROL_CHANNEL:
      case STRUM_CHANNEL:
        MIDI.parseNoteOn();
        triggerControlNoteOn();
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        MIDI.parseNoteOn();
        triggerNoteOn();
        break;
      default:
        Message.ignoreEvent(true);
    }
  }

  inline function parseNoteOff() {
    switch (Message.getChannel()) {
      case CONTROL_CHANNEL:
      case STRUM_CHANNEL:
        MIDI.parseNoteOff();
        triggerControlNoteOff();
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        MIDI.parseNoteOff();
        triggerNoteOff();
        break;
      default:
        Message.ignoreEvent(true);
    }
  }

  inline function parseController() {
    MIDI.parseController();

    Message.ignoreEvent(true);
    switch (MIDI.number) {
      case g_cc["frettingPosition"]:
        LeftHand.changePosition(MIDI.value/127);
        break;
      case g_cc["strumSpeed"]:
        RightHand.setSpeed(MIDI.value/127);
        break;
      case g_cc["strumDivision"]:
        RightHand.setStrumDivision(MIDI.value/127);
        break;
      case g_cc["vibratoDepth"]:
        LeftHand.setVibratoDepth(MIDI.value/127);
        break;
      case g_cc["vibratoSpeed"]:
        LeftHand.setVibratoSpeed(MIDI.value/127);
        break;
      case g_cc["palmMute"]:
        LeftHand.setPalmMute(MIDI.value>=g_settings["keyswitchThreshold"]);
        break;
      case g_cc["silent"]:
        LeftHand.setSilent(MIDI.value>=g_settings["keyswitchThreshold"]);
        break;
      case g_cc["accelleration"]:
        RightHand.setAccelleration(MIDI.value/127);
        break;
      case g_cc["crescendo"]:
        RightHand.setCrescendo(MIDI.value/127);
        break;
      case g_cc["humanize"]:
        RightHand.setHumanize(MIDI.value/127);
        break;
    }
  }
}

function triggerNoteOn() {
  MIDI.parseNoteOn();

  Message.ignoreEvent(MIDI.number < 40 || MIDI.number > 84);
  switch (MIDI.number) {
    case Keys.addString:
      RightHand.setAddString(MIDI.value);
      break;
    case Keys.missString:
      RightHand.setMissString(MIDI.value);
      break;
    case Keys.fullD:
      RightHand.setStrum(0, 6, 1);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.fullU:
      RightHand.setStrum(1, 6, 1);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.lowD:
      RightHand.setStrum(0, 6, 4);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.lowU:
      RightHand.setStrum(1, 6, 4);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.lowMidD:
      RightHand.setStrum(0, 5, 3);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.lowMidU:
      RightHand.setStrum(1, 5, 3);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.highMidD:
      RightHand.setStrum(0, 4, 2);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.highMidU:
      RightHand.setStrum(1, 4, 2);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.highD:
      RightHand.setStrum(0, 3, 1);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.highU:
      RightHand.setStrum(1, 3, 1);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.string1:
      RightHand.setStrum(0, 1, 1);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.string2:
      RightHand.setStrum(0, 2, 2);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.string3:
      RightHand.setStrum(0, 3, 3);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.string4:
      RightHand.setStrum(0, 4, 4);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.string5:
      RightHand.setStrum(0, 5, 5);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
    case Keys.string6:
      RightHand.setStrum(0, 6, 6);
      RightHand.strum(MIDI.number, MIDI.value);
      break;
  }
}

function triggerNoteOff() {
  MIDI.parseNoteOff();

  Message.ignoreEvent(MIDI.number < 40 || MIDI.number > 84);
  switch (MIDI.number) {
    case Keys.addString:
      g_rh.addString = 0;
      break;
    case Keys.missString:
      g_rh.missString = 0;
      break;
    case Keys.fullD:
      RightHand.setStrum(0, 6, 1);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.fullU:
      RightHand.setStrum(1, 6, 1);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.lowD:
      RightHand.setStrum(0, 6, 4);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.lowU:
      RightHand.setStrum(1, 6, 4);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.lowMidD:
      RightHand.setStrum(0, 5, 3);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.lowMidU:
      RightHand.setStrum(1, 5, 3);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.highMidD:
      RightHand.setStrum(0, 4, 2);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.highMidU:
      RightHand.setStrum(1, 4, 2);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.highD:
      RightHand.setStrum(0, 3, 1);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.highU:
      RightHand.setStrum(1, 3, 1);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.string1:
      RightHand.setStrum(0, 1, 1);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.string2:
      RightHand.setStrum(0, 2, 2);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.string3:
      RightHand.setStrum(0, 3, 3);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.string4:
      RightHand.setStrum(0, 4, 4);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.string5:
      RightHand.setStrum(0, 5, 5);
      RightHand.strumNoteOff(MIDI.number);
      break;
    case Keys.string6:
      RightHand.setStrum(0, 6, 6);
      RightHand.strumNoteOff(MIDI.number);
      break;
  }
}

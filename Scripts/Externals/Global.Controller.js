function triggerController() {
  MIDI.parseController();

  Message.ignoreEvent(true);
  switch (MIDI.number) {
    case CCs.frettingPosition:
      LeftHand.changePosition(MIDI.value/127);
      break;
    case CCs.strumSpeed:
      RightHand.setSpeed(MIDI.value/127);
      break;
    case CCs.strumDivision:
      RightHand.setStrumDivision(MIDI.value/127);
      break;
    case CCs.vibratoDepth:
      LeftHand.setVibratoDepth(MIDI.value/127);
      break;
    case CCs.vibratoSpeed:
      LeftHand.setVibratoSpeed(MIDI.value/127);
      break;
    case CCs.palmMute:
      LeftHand.setPalmMute(MIDI.value>=g_keyswitchThreshold);
      break;
    case CCs.silent:
      LeftHand.setSilent(MIDI.value>=g_keyswitchThreshold);
      break;
    case CCs.accelleration:
      RightHand.setAccelleration(MIDI.value/127);
      break;
    case CCs.crescendo:
      RightHand.setCrescendo(MIDI.value/127);
      break;
    case CCs.humanize:
      RightHand.setHumanize(MIDI.value/127);
      break;
  }
}

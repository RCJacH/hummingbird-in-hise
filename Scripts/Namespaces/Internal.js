namespace Internal {
  inline function clearAllStrings() {
    GuitarString.forAllStrings(
      function (string) { GuitarString.clearFret(string, -1); }
    );
  }

  inline function stopAllStrings() {
    GuitarString.forAllStrings(
      function (string) {
        GuitarString.setReleaseTime(string, MIDI.value);
        GuitarString.stop(string, MIDI.value, MIDI.timestamp);
      }
    );
    if (MIDI.value > 64) {
      ExtraNoise.stringMuteBuzz(MIDI.value, MIDI.timestamp);
    } else {
      ExtraNoise.bridgeMute(MIDI.value, MIDI.timestamp);
    }
  }

  inline function setAllReleaseTime(releaseTime) {
    GuitarString.forAllStrings(
      function (string) { string.releaseTime = releaseTime; }
    );
  }

  inline function handsOff() {
    GuitarString.clearAllStrings();
    ExtraNoise.release();
    RightHand.reset();
    LeftHand.reset();
  }
}

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
  }
}

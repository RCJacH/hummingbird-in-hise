namespace LeftHand {

  inline function setVibratoDepth(float) {

  }

  inline function setVibratoSpeed(float) {

  }

  inline function setPalmMute(boolean) {

  }

  inline function isSilent() {
    return g_lh.isSilent
  }

  inline function setSilent(velocity) {
    if (!velocity) {
      g_lh.isSilent = g_lh.isSilent&2;
    } else {
      g_lh.isSilent = (
        velocity < g_settings.keyswitchThreshold ?
        g_lh.isSilent|1 : g_lh.isSilent^2
      );
    }
  }

  inline function setMuted(velocity) {
    if (!velocity) {
      g_lh.isMuted = g_lh.isMuted&2;
    } else {
      g_lh.isMuted = (
        velocity < g_settings.keyswitchThreshold ?
        g_lh.isMuted|1 : g_lh.isMuted^2
      );
    }
  }

  inline function isOffString() {
    return g_lh.pressedStrings.isEmpty()
  }

  inline function pressedStrings() {
    return g_lh.pressedStrings
  }

  inline function isStringPressed(index) {
    return g_lh.pressedStrings.contains(index);
  }

  inline function pressString(index) {
    if (isStringPressed(index)) { return; }
    g_lh.pressedStrings.insert(index);
  }

  inline function unpressString(index) {
    g_lh.pressedStrings.remove(index);
  }

  inline function changePosition(velocity) {
    local pos = velocity > 120 ? velocity - 108 : Math.floor(velocity / 10);
    g_lh.position = pos;
    local func = (
      g_lh.pressedStrings.isEmpty() ?
      GuitarString.changePosition :
      GuitarString.preparePositionChange
    );
    GuitarString.forAllStrings(
      function (string) {
        return func(string)
      }
    );
  }
}

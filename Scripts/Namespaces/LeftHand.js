namespace LeftHand {
  inline function setVibratoDepth(float) {

  }

  inline function setVibratoSpeed(float) {

  }

  inline function setPalmMute(boolean) {

  }

  inline function isStringPressed(string) {
    return g_lh.pressedStrings.contains(string);
  }

  inline function pressString(string) {
    if (isStringPressed(string)) { return; }
    g_lh.pressedStrings.insert(string);
  }

  inline function unpressString(string) {
    g_lh.pressedStrings.remove(string);
  }

  inline function changePosition(string) {
    
  }

}
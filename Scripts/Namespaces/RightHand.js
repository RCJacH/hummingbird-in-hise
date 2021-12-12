namespace RightHand {
  reg pressedKeys = [];

  inline function setAddString(value) {
    g_rh.addString = Math.ceil(value / g_settings["keyswitchThreshold"]);
  }

  inline function setMissString(value) {
    g_rh.missString = Math.ceil(value / g_settings["keyswitchThreshold"]);
  }

  inline function setSpeed(float) {
    g_rh.speed = 1.5 - float;
  }

  inline function setAcceleration(float) {
    g_rh.accelleration = 1.5 + float;
  }

  inline function setCrescendo(float) {
    g_rh.crescendo = 0.5 + float;
  }

  inline function setHumanize(float) {
    g_rh.humanize = float;
  }
}

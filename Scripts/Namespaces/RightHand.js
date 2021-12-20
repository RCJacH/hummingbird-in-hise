namespace RightHand {
  reg pressedKeys = [];

  inline function create() {
    local rh = {
      direction: 0,
      division: 0.5,
      speed: 0.6,
      bottomString: 6,
      topString: 1,
      accelleration: 1,
      crescendo: 1,
      humanize: 0.2,
      addString: 0,
      missString: 0,
    };

    return rh;
  }

  inline function setAddString(value) {
    g_rh.addString = Math.ceil(value / g_settings.keyswitchThreshold);
  }

  inline function setMissString(value) {
    g_rh.missString = Math.ceil(value / g_settings.keyswitchThreshold);
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

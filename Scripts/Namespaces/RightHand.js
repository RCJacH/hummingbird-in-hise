namespace RightHand {
  reg startTime = 0;
  reg time = Engine.getMilliSecondsForQuarterBeats(0.5);
  const var pressedKeys = [];

  const var vel2speed = [];
  for (i=127;i--;) {
    vel2speed.push(.5 + Math.exp(Math.log(Math.pow((i - 1) / 126, 1.2))));
  }

  inline function setAddString(value) {
    g_rh.addString = Math.ceil(value / g_settings.keyswitchThreshold);
  }

  inline function setMissString(value) {
    g_rh.missString = Math.ceil(value / g_settings.keyswitchThreshold);
  }

  inline function setDivision() {
    g_rh.division = Engine.getQuarterBeatsForMilliSeconds(time);
  }

  inline function setDirection(direction) {
    g_rh.direction = direction;
  }

  inline function setSpeed(float) {
    g_rh.speed = 1.5 - float;
  }

  inline function setSpeedFromVelocity(velocity) {
    g_rh.speed = vel2speed[velocity];
    Strum.setBaseDelay();
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

  inline function startDirectionDetection() {
    startTime = Transport.getCurrentTime();
  }

  inline function stopDirectionDetection() {
    time = Transport.getCurrentTime() - startTime;
    setDivision();
  }

  inline function setDirectionFromBeatPosition(pos) {
    g_rh.autoDirection = Math.fmod(
      pos - g_rh.division / 2, g_rh.division * 2
    ) >= g_rh.division;
  }
}

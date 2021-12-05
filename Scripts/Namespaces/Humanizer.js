namespace Humanizer {
  reg baseVel = 0;
  reg baseDelay = 0;
  reg baseRnd = 0;

  inline function setBaseDelay() {
    baseDelay = Math.pow(
      Engine.getSamplesForMilliSeconds(32), g_rh.speed
    );
  }

  inline function setBaseVel(velocity) {
    local range = g_rh.bottomString - g_rh.topString;
    baseVel = (
      velocity * (
        Math.random() * g_rh.humanize * g_rh.crescendo
        )
      - velocity
    ) / range;
  }

  inline function setStrum(velocity) {
    setBaseDelay();
    setBaseVel(velocity);
  }

  inline function humanizeDelay(index) {
    return (baseDelay *
      Math.pow(
        g_rh.accelleration + (Math.random() * g_rh.humanize), index
      )
    );
  }

  inline function humanizeVelocity(index, velocity) {
    return Math.range(
      Math.round(
        velocity + (baseVel + Math.random() * g_rh.humanize) * index
      ),
      1,
      127
    );

  }
}
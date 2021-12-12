namespace Humanizer {
  reg baseVel = 0;
  reg baseDelay = 0;
  reg baseRnd = 0;

  inline function setBaseDelay() {
    baseDelay = Math.pow(Delays.inSamples(32), g_rh.speed);
  }

  inline function setBaseVel(velocity, range) {
    local rand = Math.random() * g_rh.humanize - g_rh.humanize * 0.5;
    baseVel = (velocity * g_rh.crescendo - velocity) / range + velocity * rand;
  }

  inline function setStrum(velocity, range) {
    setBaseDelay();
    setBaseVel(velocity, range);
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
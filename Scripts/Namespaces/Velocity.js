namespace Velocity {
  const var mutedFactor = 0.5;
  const var openFactor = 0.8;
  reg hvThreshold = 127;

  inline function toDecibel(velocity, muted) {
    return Engine.getDecibelsForGainFactor(
      1 - (hvThreshold - velocity) / 127 * (muted ? mutedFactor : openFactor)
    )
  }
}

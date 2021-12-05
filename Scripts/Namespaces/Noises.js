namespace Noises {
  inline function shouldTrigger(articulation, velocity) {
    local art = g_noises[articulation];
    return (
      art.threshold &&
      (
      (art.threshold > 0 && velocity > art.threshold) ||
      (art.threshold < 0 && velocity < -art.threshold)
      ) &&
      Math.random() < art.probability
    )
  }

  inline function getVolume(articulation, velocity) {
    local art = g_noises[articulation];
    return Engine.getDecibelsForGainFactor(
      art.volume * velocity * velocity / (127 * 127) + art.humanize * (Math.random() - 0.5)
    )
  }

  inline function getDelay(articulation) {
    local art = g_noises[articulation];
    local delay = art.humanize * art.delay;
    return Math.max(art.delay + Math.random() * delay - delay * 0.5, 0)
  }
}
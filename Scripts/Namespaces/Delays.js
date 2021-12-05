namespace Delays {
  const var base = 15;
  reg preAttack = -10; // -20 ~ 0ms
  reg pickNote = 1; // 0 ~ 20ms
  reg strumNoise = 10; // 0 ~ 20ms
  reg nextString = 15; // 0 ~ 20ms
  reg fade = 10;

  inline function inSamples(ms) {
    return Engine.getSamplesForMilliSeconds(ms)
  }

  inline function preAttackSamples() {
    return inSamples(preAttack)
  }

  inline function pickNoteSamples() {
    return inSamples(
      base + preAttack + pickNote
    )
  }

  inline function noteStrumSamples () {
    return inSamples(
      base + preAttack + pickNote + strumNoise
    )
  }

  inline function nextStringSamples() {
    return inSamples(
      base + preAttack + pickNote + preAttack + nextString
    )
  }

  inline function fadeSamples() {
    return inSamples(fade)
  }
}

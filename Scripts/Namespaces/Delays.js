namespace Delays {
  const var time = g_settings["delays"];

  inline function inSamples(ms) {
    return Engine.getSamplesForMilliSeconds(ms)
  }

  inline function preAttackSamples() {
    return inSamples(time["preAttack"])
  }

  inline function pickNoteSamples() {
    return inSamples(
      time["base"] + time["preAttack"] + time["pickNote"]
    )
  }

  inline function noteStrumSamples () {
    return inSamples(
      time["base"] + time["preAttack"] + time["pickNote"] + time["strumNoise"]
    )
  }

  inline function nextStringSamples() {
    return inSamples(
      time["base"] + time["preAttack"] +
      time["pickNote"] + time["preAttack"] + time["nextString"]
    )
  }

}

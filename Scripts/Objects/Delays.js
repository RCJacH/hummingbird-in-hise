function Delays() {
  var obj = {
    base: 15,
    preAttack: -10, // -20 ~ 0ms
    pickNote: 1, // 0 ~ 20ms
    strumNoise: 10, // 0 ~ 20ms
    nextString: 15, // 0 ~ 20ms
  };

  obj.inSamples = function(ms) {
    return Engine.getSamplesForMilliSeconds(ms)
  };

  obj.preAttackSamples = function() {
    return this.inSamples(this.preAttack)
  };

  obj.pickNoteSamples = function() {
    return this.inSamples(
      this.base + this.preAttack + this.pickNote
    )
  };

  obj.noteStrumSamples = function() {
    return this.inSamples(
      this.base + this.preAttack + this.pickNote + this.strumNoise
    )
  };

  obj.nextStringSamples = function() {
    return this.inSamples(
      this.base + this.preAttack + this.pickNote + this.preAttack + this.nextString
    )
  };

  return obj;
}

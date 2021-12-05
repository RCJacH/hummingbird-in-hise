function LH() {
  var obj = {
    position: 0,
    reach: 5,
    topSpeed: 128,
    isSilent: false,
    pressedStrings: [],
    vibrato: {},
    pitchbend: {},
  };

  obj.changePosition = function(target) {
    target = Math.floor(target * 0.2);
    reg oldpos = this.position;
    this.position = target;
    if (!oldpos || !target) {
      return;
    }
    for (stringIndex in pressedStrings) {
      this.getStringObj(stringIndex).changePosition(Math.min(target, 20) - oldpos);
    }
  };
  obj.isStringPressed = function(string) {
    return this.pressedStrings.contains(string)
  };
  obj.pressString = function(string) {
    this.pressedStrings.push(string);
  };
  obj.releaseString = function(string) {
    this.pressedStrings.remove(string);
  };
  obj.getStringObj = function(string) {
    return g_strings[string]
  };

  return obj;
}

function DEBUG(isOn) {
  var obj = {
    isOn: isOn
  };

  obj.print = function(message) {
    if (this.isOn) {
      Console.print(message);
    }
  };

  obj.printMIDI = function() {
    this.print(
      "Channel: " + MIDI.channel + ";" +
      "Note: " + MIDI.number + ";" +
      "Velocity: " + MIDI.value + ";" +
      "Delay: " + MIDI.timestamp
    );
  };

  return obj;
}

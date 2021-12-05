namespace MIDI {
  reg channel = 0;
  reg number = 0;
  reg value = 0;
  reg timestamp = 0;

  inline function parseNoteOn() {
    channel = Message.getChannel();
    number = Message.getNoteNumber();
    value = Message.getVelocity();
    timestamp = Message.getTimestamp();
  }

  inline function parseNoteOff() {
    channel = Message.getChannel();
    number = Message.getNoteNumber();
    value = 0;
    timestamp = Message.getTimestamp();
  }

  inline function parseController() {
    channel = Message.getChannel();
    number = Message.getControllerNumber();
    value = Message.getControllerValue();
    timestamp = Message.getTimestamp();
  }
}

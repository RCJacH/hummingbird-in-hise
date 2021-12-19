include("Namespaces/Articulations.js");
include("Namespaces/Delays.js");
include("Namespaces/EventChaser.js");
include("Namespaces/LeftHand.js");
include("Namespaces/MIDI.js");
include("Namespaces/Noises.js");
include("Namespaces/NoteTrigger.js");

namespace String {
  const var name = Synth.getIdList('Container')[0];
  const var string = g_strings[parseInt(name.substring(6, 7))];

  inline function isOtherString(channel) {
    return channel != string.index;
  }

  inline function notCurrentEvent() {
    return (
      (g_controlEventId != -1) &&
      (string.triggerEventId != g_controlEventId)
    );
  }

  inline function playNoise(flags) {
    for (i=0; i<7; i++) {
      if (flags&(1<<i)) {
        Noises.trigger(string, i);
      }
    }
  }

  inline function playNote() {
    local articulation = Math.ceil(string.articulation / 2);
    switch (articulation) {
      case Articulations.SUSTAIN:
      case Articulations.PALMMUTED:
      case Articulations.VIBRATO:
        playNoise(7);
        string.pending.setGain(0);
        MIDI.timestamp = Message.getTimestamp() + Delays.pickNoteSamples();
        NoteTrigger.triggerBody(articulation);
        break;
      case Articulations.MUTED:
        playNoise(7);
        break;
      case Articulations.CHORD:
        playNoise(6);
        string.pending.setGain(0);
        MIDI.timestamp = Message.getTimestamp() + Delays.pickNoteSamples();
        NoteTrigger.triggerBody(articulation);
        break;
      case Articulation.HARMONIC:
        playNoise(1);
        string.pending.setGain(0);
        MIDI.timestamp = Message.getTimestamp() + Delays.pickNoteSamples();
        NoteTrigger.triggerBody(articulation);
        break;
      case Articulations.TAP:
        playNoise(2);
        string.pending.setGain(0);
        NoteTrigger.triggerBody(articulation);
        break;
    }
    Message.ignoreEvent(true);
  }

  inline function playRelease() {
    local pressedFrets = string.pressedFrets;
    MIDI.number = pressedFrets[pressedFrets.length - 1] + string.openNote;
    playNoise(248);
  }

  inline function triggerNoteOn() {
    Message.ignoreEvent(true);

    if (isOtherString(Message.getChannel())) { return; }

    MIDI.parseNoteOn();
    Message.store(string.pending);

    if (!MIDI.number) {
      playRelease();
    } else {
      playNote();
    }
  }

  inline function triggerNoteOff() {
    if (isOtherString(Message.getChannel())) { return; }

    MIDI.parseNoteOff();
  }

  inline function triggerController() {
    Message.ignoreEvent(true);
    if (String.isOtherString(Message.getChannel())) { return; }

    MIDI.parseController();
  }
}
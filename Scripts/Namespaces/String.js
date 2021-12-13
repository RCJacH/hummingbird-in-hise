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

  inline function playNote() {
    local articulation = Math.ceil(string.articulation / 2);
    switch (articulation) {
      case Articulations.SUSTAIN:
      case Articulations.PALMMUTED:
        NoteTrigger.triggerPreAttack();
        NoteTrigger.triggerPickBuzz();
        MIDI.timestamp += Delays.pickNoteSamples();
        NoteTrigger.triggerBody(articulation);
        break;
      case Articulations.MUTED:
        NoteTrigger.triggerPreAttack();
        NoteTrigger.triggerPickBuzz();
        break;
    }
  }

  inline function playNoise() {
    NoteTrigger.triggerFretNoise();
    // NoteTrigger.triggerPickStop();
    // NoteTrigger.triggerOpenstring();
  }

  inline function triggerNoteOn() {
    Message.ignoreEvent(true);

    if (isOtherString(Message.getChannel())) { return; }

    MIDI.parseNoteOn();

    if (!MIDI.number) {
      playNoise();
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
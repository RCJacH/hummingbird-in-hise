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
  const var midiList = Engine.createMidiList();
  const var holder = Engine.createMessageHolder();
  const var pressedNotes = [];

  inline function getArticulation() {
    return (
      string.isMuted ? Articulations.MUTED :
      string.isPalmMuted ? Articulations.PALMMUTED :
      Articulations.SUSTAIN
    );
  }

  inline function isOtherString(channel) {
    return channel != string.index;
  }

  inline function isOffString() {
    return !string.isMuted && (
      MIDI.number < string.openNote || MIDI.number > string.topNote
    );
  }

  inline function notCurrentEvent() {
    return (
      (g_controlEventId != -1) &&
      (string.triggerEventId != g_controlEventId)
    );
  }

  inline function parseKeySwitch() {
    switch (MIDI.number) {
      case g_keys["mute"]:
        string.setArticulation(Articulations.PALMMUTED, MIDI.value);
        return 1;
      default:
        return 0;
    }
  }

  inline function isPressed(number) {
    return pressedNotes.contains(number);
  }

  inline function clearFret() {
    string.fret = -1;
    pressedNotes.clear();
    midiList.fill(-1);
    LeftHand.unpressString(string);
    EventChaser.clearPendingAttackNoteOff();
  }

  inline function pressFret() {
    local fret = MIDI.number - string.openNote;
    if (fret < 0 || fret > 20) { return; }

    string.fret = fret;
    pressedNotes.push(MIDI.number);
    midiList.setValue(MIDI.number, MIDI.value);
    LeftHand.pressString(string);
    EventChaser.clearPendingReleaseNoteOff();
  }

  inline function releaseFret() {
    if (!pressedNotes.length) {
      EventChaser.clearPendingAttackNoteOff();
      return 0;
    }

    local topNote = pressedNotes[pressedNotes.length - 1];
    pressedNotes.remove(MIDI.number);
    midiList.setValue(MIDI.number, -1);
    if (!pressedNotes.length) {
      playNoise();
      clearFret();
      return 0;
    }

    MIDI.number = pressedNotes[pressedNotes.length - 1];
    if (MIDI.number == topNote) { return 0; }
    MIDI.value = midiList.getValue(MIDI.number);
    pressedNotes.remove(MIDI.number);

    pressFret();
    playNote();
    return 1
  }

  inline function playNote() {
    EventChaser.clearPendingAttackNoteOff();

    local articulation = getArticulation();
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

    string.reset();
  }

  inline function playNoise() {
    NoteTrigger.triggerFretNoise();
    // NoteTrigger.triggerPickStop();
    // NoteTrigger.triggerOpenstring();
  }

  inline function triggerNoteOn() {
    if (EventChaser.isPendingAttackEvent()) { return; }

    Message.ignoreEvent(true);

    if (isOtherString(Message.getChannel())) { return; }

    MIDI.parseNoteOn();

    if (notCurrentEvent()) { return; }
    if (parseKeySwitch()) { return; }

    if (isOffString()) { return; }

    pressFret();
    playNote();
  }

  inline function triggerNoteOff() {
    if (EventChaser.isPendingReleaseEvent()) { return; }

    Message.ignoreEvent(true);

    if (isOtherString(Message.getChannel())) { return; }

    MIDI.parseNoteOff();

    if (parseKeySwitch()) { return; }

    if (releaseFret()) { playNoise(); }
  }

  inline function triggerController() {
    Message.ignoreEvent(true);
    if (String.isOtherString(Message.getChannel())) { return; }

    MIDI.parseController();
  }
}
include('Namespaces/Articulations.js');
include('Namespaces/CCs.js');
include('Namespaces/Keys.js');
include('Namespaces/LeftHand.js');
include('Namespaces/MIDI.js');
include('Namespaces/Noises.js');
include('Namespaces/NoteTrigger.js');

namespace String {
  reg string = null;
  reg pressedNotes = [];
  reg midiList = Engine.createMidiList();
  reg holder = Engine.createMessageHolder();

  inline function parseState(note) {
    switch (note) {
      case Keys.mute:
        string.setPalmMute(note);
        break;
    }
  }

  inline function getArticulation() {
    return (
      string.isMuted ? Articulations.muted :
      string.isPalmMuted ? Articulations.palmMuted :
      Articulations.sustain
    );
  }

  inline function isOtherString(channel) {
    return channel != string.index;
  }

  inline function isOffString(number) {
    return !string.isMuted && (
      number < string.openNote || number > string.topNote
    );
  }

  inline function setPalmMute(value) {
    if (value > 100) {
      string.palmMuteToggle = !string.palmMuteToggle;
    }
    string.isPalmMuted = string.palmMuteToggle || value;
  }

  inline function setMuted(isMuted) {
    string.isMuted = isMuted;
  }

  inline function notCurrentNote() {
    return (
      (g_controlEventId != -1) &&
      (string.triggerEventId != g_controlEventId)
    );
  }

  inline function parseNote(isNoteOff) {
    if (
      (isNoteoff && NoteTrigger.isPendingAttackEvent()) ||
      NoteTrigger.isPendingReleaseEvent()
    ) {
      return;
    }

    Message.ignoreEvent(true);
    if (String.isOtherString(Message.getChannel())) { return; }

    isNoteOff ? MIDI.parseNoteOff() : MIDI.parseNoteOn();
    if (isOffString(MIDI.number)) { return; }

    return 1;
  }

  inline function parseNoteOn() {
    return parseNote(0);
  }

  inline function parseNoteOff() {
    return parseNote(1);
  }

  inline function isPressed(number) {
    return pressedNotes.contains(number);
  }

  inline function clearFret() {
    string.fret = -1;
    string.isMuted = false;
    pressedNotes.clear();
    midiList.fill(0);
    LeftHand.unpressString(string);
    NoteTrigger.clearPendingAttackNoteOff();
  }

  inline function pressFret(noteNumber) {
    local fret = noteNumber - string.openNote;
    if (fret < 0 || fret > 20) { return; }

    string.fret = fret;
    string.isMuted = false;
    pressedNotes.push(noteNumber);
    midiList.setValue(noteNumber, MIDI.value);
    LeftHand.pressString(string);
    NoteTrigger.clearPendingReleaseNoteOff();
  }

  inline function releaseFret(noteNumber) {
    if (!pressedNotes.length) {
      NoteTrigger.clearPendingAttackNoteOff();
      return;
    }

    local topNote = pressedNotes[pressedNotes.length - 1];
    pressedNotes.remove(noteNumber);
    midiList.setValue(noteNumber, 0);
    if (!pressedNotes.length) {
      NoteTrigger.release();
      clearFret();
      return;
    }

    MIDI.number = pressedNotes[pressedNotes.length - 1];
    if (MIDI.number == topNote) { return; }

    pressFret(MIDI.number);
    MIDI.value = midiList.getValue(MIDI.number);
    NoteTrigger.trigger(getArticulation());
    NoteTrigger.clearPendingAttackNoteOff();
  }

  inline function triggerNoteOn() {
    // g_debug.printMIDI();
    if (MIDI.number == Keys.mute) {
      string.setPalmMute(MIDI.value);
      return;
    }

    NoteTrigger.clearPendingReleaseNoteOff();
    if (string.isMuted) {
      NoteTrigger.trigger(Articulations.muted);
      string.isMuted = false;
      return;
    }

    pressFret(MIDI.number);
    NoteTrigger.trigger(getArticulation());
  }

  inline function triggerNoteOff() {
    if (MIDI.number == Keys.mute) {
      string.setPalmMute(0);
      return;
    }

    // g_debug.printMIDI();
    if (string.isMuted) {
      clearFret();
      return;
    }

    releaseFret(MIDI.number);
    NoteTrigger.release();
  }

  inline function triggerController() {
    Message.ignoreEvent(true);
    if (String.isOtherString(Message.getChannel())) { return; }

    MIDI.parseController();
  }
}
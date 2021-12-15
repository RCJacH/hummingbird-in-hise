namespace GuitarString {
  inline function create(index) {
    local stringSettings = g_settings["string"];
    local string = {
      index: index,
      articulation: 1,
      fret: 0,
      openNote: stringSettings["tuning"][index],
      topNote: stringSettings["tuning"][index] + stringSettings["frets"],
      pending: Engine.createMessageHolder(),
      midiList: Engine.createMidiList(),
      attackEventIds: Engine.createUnorderedStack(),
      releaseEventIds: Engine.createUnorderedStack(),
      pressedNotes: [],
      triggerEventId: 0,
    };

    string.pressedNotes.reserve(64);
    return string
  }

  inline function setArticulation(string, artIndex, velocity) {
    string.articulation = artIndex * (
      1 + velocity > g_settings["keyswitchThreshold"]
    );
  }

  inline function resetArticulation(string) {
    if (string.articulation % 2) { string.articulation = 1; }
  }

  inline function getNote(string) {
    return (string.fret == -1 ? 0 : string.openNote + string.fret)
  }

  inline function getFret(string) {
    return MIDI.number - string.openNote
  }

  inline function pick(string, note, vel, delay) {
    return Synth.addNoteOn(string.index, note, vel, delay)
  }

  inline function stop(string, delay) {
    EventChaser.clearPendingNoteOff(string.attackEventIds);
    return Synth.addNoteOn(string.index, 0, 0, delay)
  }

  inline function clearFret(string) {
    EventChaser.clearPendingNoteOff(string.attackEventIds);
    stop(string, MIDI.timestamp);
    string.pressedNotes.clear();
    string.fret = 0;
    LeftHand.unpressString(string);
  }

  inline function pressFret(string, fret) {
    if (fret < 0 || fret > 20) { return; }

    string.fret = fret;
    string.pressedNotes.push(fret);
    string.midiList.setValue(fret, MIDI.value);
    LeftHand.pressString(string);
    EventChaser.clearPendingNoteOff(string.releaseEventIds);
    if (g_lh.isSilent) { return; }
    EventChaser.clearPendingNoteOff(string.attackEventIds);
    pick(string, getNote(string), MIDI.value, MIDI.timestamp);
  }

  inline function releaseFret(string, fret) {
    if (fret < 0 || fret > 20) { return; }

    local pressedNotes = string.pressedNotes;
    if (!pressedNotes.length) {
      clearFret(string);
      return;
    }

    local lastFret = pressedNotes[pressedNotes.length - 1];
    local midiList = string.midiList;
    pressedNotes.remove(fret);
    midiList.setValue(fret, -1);
    if (!pressedNotes.length) {
      clearFret(string);
      return;
    }

    local newFret = pressedNotes[pressedNotes.length - 1];
    if (newFret == lastFret) { return 0; }
    MIDI.value = midiList.getValue(newFret);
    pressedNotes.remove(newFret);

    pressFret(string, newFret);
  }
}
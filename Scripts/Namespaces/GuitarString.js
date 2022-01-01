namespace GuitarString {

  inline function forAllStrings(func) {
    for (string in g_strings) {
      if (!string) { continue; }
      func(string);
    }
  }

  inline function forPressedStrings(func) {
    local pressedStrings = LeftHand.pressedStrings();
    for (i=0;pressedStrings.size();i++) {
      func(g_strings[pressedStrings[i]]);
    }
  }

  inline function setArticulation(string, artIndex, velocity) {
    string.lastArticulation = string.articulation;
    string.articulation = (artIndex << 1) - (
      velocity < g_settings.keyswitchThreshold
    );
  }

  inline function getArticulation(string) {
    return ((string.articulation + 1) >> 1)
  }

  inline function resetArticulation(string) {
    if (string.articulation % 2) { string.articulation = 1; }
  }

  inline function releaseArticulation(string, artIndex) {
    if (getArticulation(string) == artIndex) {
      resetArticulation(string);
    }
  }

  inline function getNote(string) {
    return (string.fret == -1 ? 0 : string.openNote + string.fret)
  }

  inline function getFret(string) {
    return MIDI.number - string.openNote
  }

  inline function setMuted(string) {
    if (getArticulation(string) == Articulations.MUTED) {
      resetArticulation(string);
    }
  }

  inline function setPalmMuted(string) {
    if (getArticulation(string) == Articulations.PALMMUTED) {
      resetArticulation(string);
    }
  }

  inline function changePosition(string) {
    string.pendingPosChange = false;
    return Synth.addNoteOn(string.index, 1, 127, MIDI.timestamp)
  }

  inline function preparePositionChange(string) {
    string.pendingPosChange = true;
  }

  inline function setReleaseTime(string, velocity) {
    string.releaseTime = Math.exp(Math.round(
      Math.log(10) + ((128 - velocity) / 127) * (Math.log(1000) - Math.log(10))
    ));
  }

  inline function pick(string, note, vel) {
    string.pending.ignoreEvent(false);
    string.pending.setChannel(string.index);
    string.pending.setNoteNumber(note);
    string.pending.setVelocity(vel);
    EventChaser.clearPendingNoteOff(string.attackEventIds);
    return Synth.addMessageFromHolder(string.pending);
  }

  inline function stop(string, vel, delay) {
    EventChaser.clearPendingNoteOff(string.attackEventIds);
    return Synth.addNoteOn(string.index, 0, vel, delay)
  }

  inline function clearFret(string, fret) {
    string.lastFret = fret;
    stop(string, 0, MIDI.timestamp);
    string.pressedFrets.clear();
    string.fret = -1;
    LeftHand.unpressString(string.index);
    if (string.pendingPosChange) {
      changePosition(string);
    }
  }

  inline function pressFret(string, fret) {
    if (fret < -1 || fret > 20) { return; }

    string.lastFret = string.fret;
    string.fret = fret;
    string.pressedFrets.push(fret);
    string.midiList.setValue(fret, MIDI.value);
    Message.store(string.pending);
    LeftHand.pressString(string.index);
    EventChaser.clearPendingNoteOff(string.releaseEventIds);
    if (LeftHand.isSilent()) { return; }
    pick(string, getNote(string), MIDI.value);
  }

  inline function releaseFret(string, fret) {
    if (fret < -1 || fret > 20) { return; }

    local pressedFrets = string.pressedFrets;
    if (!pressedFrets.length) {
      string.pendingPosChange = false;
      return;
    }

    local lastFret = pressedFrets[pressedFrets.length - 1];
    local midiList = string.midiList;
    pressedFrets.remove(fret);
    midiList.setValue(fret, 0);
    if (!pressedFrets.length) {
      if (!g_strumKeys.isEmpty()) { return; }
      clearFret(string, fret);
      return;
    }

    local newFret = pressedFrets[pressedFrets.length - 1];
    if (newFret == lastFret) { return 0; }
    MIDI.value = midiList.getValue(newFret);
    pressedFrets.remove(newFret);

    pressFret(string, newFret);
  }
}
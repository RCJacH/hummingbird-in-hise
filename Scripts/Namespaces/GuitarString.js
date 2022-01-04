namespace GuitarString {

  inline function stopAllStrings(velocity, timestamp) {
    for (string in g_strings) {
      setReleaseTime(string, velocity);
      stop(string, velocity, timestamp);
    }
  }

  inline function clearAllStrings() {
    for (string in g_strings) { clearFret(string, string.fret); }
  }

  inline function forAllStrings(func) {
    for (string in g_strings) {
      func(string);
    }
  }

  inline function forPressedStrings(func) {
    for (string in LeftHand.pressedStrings()) {
      func(string);
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
    return Synth.addMessageFromHolder(string.pending)
  }

  inline function stop(string, vel, delay) {
    EventChaser.clearPendingNoteOff(string.attackEventIds);
    string.pending.ignoreEvent(false);
    string.pending.setChannel(string.index);
    string.pending.setNoteNumber(0);
    string.pending.setVelocity(vel);
    string.pending.setTimestamp(delay);
    string.pending.setType(vel ? 1 : 2);
    return Synth.addMessageFromHolder(string.pending)
  }

  inline function clearFret(string, lastFret) {
    string.lastFret = lastFret;
    stop(string, 0, MIDI.timestamp);
    string.pressedFrets.clear();
    string.fret = -1;
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
    EventChaser.clearPendingNoteOff(string.releaseEventIds);
    if (LeftHand.isSilent()) { return; }
    pick(string, getNote(string), MIDI.value);
  }

  inline function releaseFret(string, fret) {
    if (fret < -1 || fret > 20) { return 0; }

    if (!string.pressedFrets.length) {
      string.pendingPosChange = false;
      return 1;
    }

    local lastFret = string.pressedFrets[string.pressedFrets.length - 1];
    string.pressedFrets.remove(fret);
    string.midiList.setValue(fret, 0);
    if (!string.pressedFrets.length) {
      if (!g_strumKeys.isEmpty()) {
        string.lastFret = fret;
        string.fret = -1;
        return 1;
      }
      clearFret(string, fret);
      return 1;
    }

    local newFret = string.pressedFrets[string.pressedFrets.length - 1];
    if (newFret == lastFret) { return 0; }
    MIDI.value = string.midiList.getValue(newFret);
    string.pressedFrets.remove(newFret);

    pressFret(string, newFret);
    return 0
  }
}

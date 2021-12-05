namespace NoteTrigger {
  reg attackEventIds = [];
  reg releaseEventIds = [];

  inline function isPendingNote(eventIds) {
    return eventIds.contains(Message.getEventId());
  }

  inline function isPendingAttackEvent() {
    return isPendingNote(attackEventIds);
  }

  inline function isPendingReleaseEvent() {
    return isPendingNote(releaseEventIds);
  }

  inline function triggerAttack(articulation) {
    attackEventIds.push(
      Synth.addNoteOn(articulation, MIDI.number, MIDI.value, MIDI.timestamp)
    );
    }

  inline function triggerRelease(articulation, note, velocity) {
    releaseEventIds.push(
      Synth.addNoteOn(
      articulation,
      note || MIDI.number,
      velocity || MIDI.value,
      MIDI.timestamp
      )
    );
  }

  inline function clearPendingNoteOff(eventIds) {
    for (eventId in eventIds) {
      Synth.noteOffByEventId(eventId);
    }
    eventIds.clear();
  }

  inline function clearPendingAttackNoteOff() {
    clearPendingNoteOff(attackEventIds);
  }

  inline function clearPendingReleaseNoteOff() {
    clearPendingNoteOff(releaseEventIds);
  }

  function triggerPreAttack() {
    triggerAttack(Articulations.pickNoise);
  }

  function triggerPickBuzz() {
    if (Noises.shouldTrigger('pickBuzz', MIDI.value)) {
      triggerAttack(Articulations.pickBuzz);
    }
  }

  function triggerNote(articulation) {
    triggerAttack(articulation);
  }

  function triggerFretNoise() {
    if (Noises.shouldTrigger('fretNoise', MIDI.value)) {
      triggerRelease(Articulations.fretNoise, 0, 0);
    }
  }

  function triggerPickStop() {
    if (Noises.shouldTrigger('pickStop', MIDI.value)) {
      triggerRelease(Articulations.pickStop, 0, 0);
    }
  }

  function triggerOpenstring(string) {
    if (Noises.shouldTrigger('openString', MIDI.value)) {
      triggerRelease(
        Articulations.vibrato,
        string.openString,
        0
      );
    }
  }

  function trigger(articulation) {
    switch (articulation) {
      case Articulations.sustain:
      case Articulations.palmMuted:
        triggerPreAttack();
        triggerPickBuzz();
        triggerNote(articulation);
        break;
      case Articulations.muted:
        MIDI.number = String.string.openNote + g_lh.position;
        Message.setNoteNumber(MIDI.number);
        triggerPreAttack();
        triggerPickBuzz();
        break;
    }
  }

    function release() {
      triggerFretNoise();
      triggerPickStop();
      triggerOpenstring();
    }
}
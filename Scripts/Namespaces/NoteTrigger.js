namespace NoteTrigger {
  const var string = g_strings[
    parseInt(Synth.getIdList('Container')[0].substring(6, 7))
  ];

  inline function trigger(eventIds, articulation) {
    string.pending.ignoreEvent(false);
    string.pending.setChannel(articulation);
    string.pending.setNoteNumber(MIDI.number);
    string.pending.setVelocity(MIDI.value);
    string.pending.setTimestamp(MIDI.timestamp);
    EventChaser.addEvent(
      eventIds,
      Synth.addMessageFromHolder(string.pending)
    );
  }
  inline function triggerAttack(articulation) {
    trigger(string.attackEventIds, articulation);
  }

  inline function triggerRelease(articulation) {
    trigger(string.releaseEventIds, articulation);
  }

  function triggerPickNoise() {
    triggerAttack(Articulations.PICKNOISE);
  }

  function triggerPickBuzz() {
    triggerAttack(Articulations.PICKBUZZ);
  }

  function triggerBody(articulation) {
    triggerAttack(articulation);
  }

  function triggerFretNoise() {
    triggerRelease(Articulations.FRETNOISE);
  }

  function triggerPickStop() {
    triggerRelease(Articulations.PICKSTOP);
  }

  function triggerGlideDown() {
    triggerRelease(Articulations.GLIDEDOWN);
  }

  function triggerOpenstring() {
    triggerRelease(Articulations.VIBRATO);
    }
  }
}

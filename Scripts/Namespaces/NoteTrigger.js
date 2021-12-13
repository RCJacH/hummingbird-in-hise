namespace NoteTrigger {
  const var string = g_strings[
    parseInt(Synth.getIdList('Container')[0].substring(6, 7))
  ];

  inline function triggerAttack(articulation) {
    EventChaser.addEvent(
      string.attackEventIds,
      Synth.addNoteOn(articulation, MIDI.number, MIDI.value, MIDI.timestamp)
    );
  }

  inline function triggerRelease(articulation) {
    EventChaser.addEvent(
      string.releaseEventIds,
      Synth.addNoteOn(articulation, MIDI.number, MIDI.value, MIDI.timestamp)
    );
  }

  function triggerPreAttack() {
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

  function triggerOpenstring() {
    triggerRelease(Articulations.VIBRATO);
    }
  }
}

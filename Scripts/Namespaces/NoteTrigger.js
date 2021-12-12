namespace NoteTrigger {
  inline function triggerAttack(articulation) {
    EventChaser.addAttackEvent(
      Synth.addNoteOn(articulation, MIDI.number, MIDI.value, MIDI.timestamp)
    );
  }

  inline function triggerRelease(articulation) {
    EventChaser.addReleaseEvent(
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

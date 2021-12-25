namespace NoteTrigger {
  const var string = g_strings[
    parseInt(Synth.getIdList('Container')[0].substring(6, 7))
  ];

  inline function trigger(eventIds, articulation, note, velocity, timestamp) {
    string.pending.ignoreEvent(false);
    string.pending.setChannel(articulation);
    string.pending.setNoteNumber(note);
    string.pending.setVelocity(velocity);
    string.pending.setTimestamp(timestamp);
    EventChaser.addEvent(
      eventIds,
      Synth.addMessageFromHolder(string.pending)
    );
  }
  inline function triggerAttack(articulation, note, velocity, timestamp) {
    trigger(string.attackEventIds, articulation, note, velocity, timestamp);
  }

  inline function triggerRelease(articulation, note, velocity, timestamp) {
    trigger(string.releaseEventIds, articulation, note, velocity, timestamp);
  }

  function triggerBody(articulation) {
    MIDI.value = Message.getVelocity();
    triggerAttack(articulation, MIDI.number, MIDI.value, MIDI.timestamp);
  }
}

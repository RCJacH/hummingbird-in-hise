namespace NoteTrigger {
  const var string = g_stringsChannel[
    parseInt(Synth.getIdList('Container')[0].substring(6, 7))
  ];

  inline function trigger(eventIds, articulation, note, velocity, timestamp) {
    string.pending.ignoreEvent(false);
    string.pending.setChannel(articulation);
    string.pending.setNoteNumber(note);
    string.pending.setVelocity(velocity);
    string.pending.setTimestamp(timestamp);
    local eventId = Synth.addMessageFromHolder(string.pending);
    if (eventIds != null) { EventChaser.addEvent(eventIds, eventId); }
  }

  inline function triggerPreAttack(articulation, note, velocity, timestamp) {
    trigger(null, articulation, note, velocity, timestamp);
  }

  inline function triggerAttack(articulation, note, velocity, timestamp) {
    trigger(string.attackEventIds, articulation, note, velocity, timestamp);
  }

  inline function triggerRelease(articulation, note, velocity, timestamp) {
    trigger(string.releaseEventIds, articulation, note, velocity, timestamp);
  }

  function triggerBody(articulation) {
    triggerAttack(articulation, MIDI.number, Message.getVelocity(), MIDI.timestamp);
  }
}

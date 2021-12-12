namespace EventChaser {
  reg attackEventIds = [];
  reg releaseEventIds = [];

  inline function isPending(eventIds) {
    return eventIds.contains(Message.getEventId());
  }

  inline function isPendingAttackEvent() {
    return isPending(attackEventIds);
  }

  inline function isPendingReleaseEvent() {
    return isPending(releaseEventIds);
  }

  inline function addAttackEvent(eventID) {
    attackEventIds.push(eventID);
  }

  inline function addReleaseEvent(eventID) {
    releaseEventIds.push(eventID);
  }

  inline function noteOff(eventId) {
    Synth.noteOffByEventId(eventId);
  }

  inline function delayedNoteOff(eventId, delay) {
    Synth.noteOffDelayedByEventId(eventId, delay);
  }

  inline function clearPendingNoteOff(eventIds) {
    for (eventId in eventIds) {
      noteOff(eventId);
    }
    eventIds.clear();
  }

  inline function clearPendingAttackNoteOff() {
    clearPendingNoteOff(attackEventIds);
  }

  inline function clearPendingReleaseNoteOff() {
    clearPendingNoteOff(releaseEventIds);
  }

}

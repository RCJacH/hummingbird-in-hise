namespace EventChaser {
  inline function isPending(eventIds) {
    return eventIds.contains(Message.getEventId());
  }

  inline function addEvent(eventIds, eventID) {
    eventIds.insert(eventID);
  }

  inline function clearPendingNoteOff(eventIds) {
    local a = [];
    eventIds.copyTo(a);
    for (eventId in a) {
      Synth.noteOffByEventId(eventId);
    }
    eventIds.clear();
  }

}

namespace ExtraNoise {
  const var MUTEDSTRUMNOTE = 21;
  const var BRIDGEMUTENOTE = 22;
  const var PALMHITNOTE = 23;
  const var FINGERHITNOTE = 24;
  const var STRINGMUTEBUZZNOTE = 25;
  const var PICKGUARDHITNOTE = 26;

  const var strumEventIds = Engine.createUnorderedStack();

  inline function stopStrum() {
    EventChaser.clearPendingNoteOff(strumEventIds);
  }

  inline function strum(note, velocity, timestamp) {
    if (LeftHand.isOffString()) {
      return mutedStrum(velocity, timestamp);
    }

    EventChaser.addEvent(
      strumEventIds, Synth.addNoteOn(15, note, velocity, timestamp)
    );
  }

  inline function mutedStrum(velocity, timestamp) {
    EventChaser.addEvent(
      strumEventIds, Synth.addNoteOn(15, MUTEDSTRUMNOTE, velocity, timestamp)
    );
  }

  inline function bridgeMute(velocity, timestamp) {
    if (velocity) {
      Synth.addNoteOn(15, BRIDGEMUTENOTE, velocity, timestamp);
    } else {
      Synth.addNoteOff(15, BRIDGEMUTENOTE, timestamp);
    }
  }

  inline function positionChange(velocity, timestamp) {
  }

  inline function palmHit(velocity, timestamp) {
    if (velocity) {
      Synth.addNoteOn(15, PALMHITNOTE, velocity, timestamp);
    } else {
      Synth.addNoteOff(15, PALMHITNOTE, timestamp);
    }
  }

  inline function fingerHit(velocity, timestamp) {
    if (velocity) {
      Synth.addNoteOn(15, FINGERHITNOTE, velocity, timestamp);
    } else {
      Synth.addNoteOff(15, FINGERHITNOTE, timestamp);
    }
  }

  inline function stringMuteBuzz(velocity, timestamp) {
    if (velocity) {
      Synth.addNoteOn(15, STRINGMUTEBUZZNOTE, velocity, timestamp);
    } else {
      Synth.addNoteOff(15, STRINGMUTEBUZZNOTE, timestamp);
    }
  }

  inline function pickguardHit(velocity, timestamp) {
    if (velocity) {
      Synth.addNoteOn(15, PICKGUARDHITNOTE, velocity, timestamp);
    } else {
      Synth.addNoteOff(15, PICKGUARDHITNOTE, timestamp);
    }
  }
}
namespace ExtraNoise {
  const var MUTEDSTRUMNOTE = 21;
  const var BRIDGEMUTENOTE = 22;
  const var PALMHITNOTE = 23;
  const var FINGERHITNOTE = 24;
  const var STRINGMUTEBUZZNOTE = 25;
  const var PICKGUARDHITNOTE = 26;

  const var strumEventIds = Engine.createUnorderedStack();
  const var pending = Engine.createMessageHolder();

  inline function trigger(note, velocity, timestamp, gain) {
    Message.store(pending);
    pending.ignoreEvent(false);
    pending.setChannel(15);
    pending.setNoteNumber(note);
    pending.setVelocity(velocity);
    pending.setTimestamp(timestamp);
    if (gain) { pending.setGain(gain); }
    return Synth.addMessageFromHolder(pending);
  }

  inline function release() {
    EventChaser.clearPendingNoteOff(strumEventIds);
  }

  inline function stop(velocity, timestamp) {
    local linear;
    switch (Math.ceil(velocity / 32)) {
      case 0:
        Synth.addNoteOff(15, STRINGMUTEBUZZNOTE, timestamp);
        Synth.addNoteOff(15, BRIDGEMUTENOTE, timestamp);
        break;
      case 1:
        linear = Math.sin((velocity / 64 - 0.5) * Math.PI) + 1;
        trigger(
          BRIDGEMUTENOTE, velocity, timestamp,
          Engine.getDecibelsForGainFactor(linear * 0.5)
        );
        break;
      case 2:
      case 3:
        linear = Math.sin(((velocity - 32) / 127 + 0.5) * Math.PI);
        trigger(
          BRIDGEMUTENOTE, velocity, timestamp,
          Engine.getDecibelsForGainFactor(linear * 0.5)
        );
        linear = Math.sin(((velocity - 32) / 96 - 0.5) * Math.PI) / 2 + 0.5;

        trigger(
          STRINGMUTEBUZZNOTE, velocity, timestamp,
          Engine.getDecibelsForGainFactor(linear * 0.5)
        );
        break;
      case 4:
        linear = Math.sin(((velocity - 32) / 96 - 0.5) * Math.PI) / 2 + 0.5;
        trigger(
          STRINGMUTEBUZZNOTE, velocity, timestamp,
          Engine.getDecibelsForGainFactor(linear * 0.5)
        );
        break;
    }
  }

  inline function strum(note, velocity, timestamp) {
    if (LeftHand.isOffString()) {
      return mutedStrum(velocity, timestamp);
    }

    EventChaser.addEvent(
      strumEventIds, trigger(note, velocity, timestamp, null)
    );
  }

  inline function mutedStrum(velocity, timestamp) {
    EventChaser.addEvent(
      strumEventIds, trigger(MUTEDSTRUMNOTE, velocity, timestamp, null)
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
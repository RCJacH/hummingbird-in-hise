namespace ExtraNoise {
  const var MUTEDSTRUMNOTE = 21;
  const var BRIDGEMUTENOTE = 22;
  const var PALMHITNOTE = 23;
  const var FINGERHITNOTE = 24;
  const var STRINGMUTEBUZZNOTE = 25;
  const var PICKGUARDHITNOTE = 26;

  inline function strum(note, velocity, timestamp) {
    if (LeftHand.isOffString()) {
      return mutedStrum(velocity, timestamp);
    }
    Synth.addNoteOn(15, note, velocity, timestamp);
  }

  inline function mutedStrum(velocity, timestamp) {
    Synth.addNoteOn(15, MUTEDSTRUMNOTE, velocity, timestamp);
  }

  inline function bridgeMute(velocity, timestamp) {
    Synth.addNoteOn(15, BRIDGEMUTENOTE, velocity, timestamp);
  }

  inline function positionChange(velocity, timestamp) {
  }

  inline function palmHit(velocity, timestamp) {
    Synth.addNoteOn(15, PALMHITNOTE, velocity, timestamp);
  }

  inline function fingerHit(velocity, timestamp) {
    Synth.addNoteOn(15, FINGERHITNOTE, velocity, timestamp);
  }

  inline function stringMuteBuzz(velocity, timestamp) {
    Synth.addNoteOn(15, STRINGMUTEBUZZNOTE, velocity, timestamp);
  }

  inline function pickguardHit(velocity, timestamp) {
    Synth.addNoteOn(15, PICKGUARDHITNOTE, velocity, timestamp);
  }
}
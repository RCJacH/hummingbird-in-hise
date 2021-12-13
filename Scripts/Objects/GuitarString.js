const var standardTuning = [0, 64, 59, 55, 50, 45, 40];

function changePosition(frets) {
  if (g_noises.triggerState('positionChange, velocity')) {
    Synth.addNoteOn(
      this.index,
      this.getNote(),
      Math.round(
        g_lh.topSpeed /
        60000 / Engine.getHostBpm() * g_rh.division / g_rh.speed *
        127
      ),
      0
    );
  }
}

function GuitarString(index) {
  var obj = {
    index: parseInt(index),
    articulation: 1,
    isMuted: false,
    fret: 0,
    openNote: standardTuning[index],
    topNote: standardTuning[index] + 20,
    pending: Engine.createMessageHolder(),
    midiList: Engine.createMidiList(),
    attackEventIds: Engine.createUnorderedStack(),
    releaseEventIds: Engine.createUnorderedStack(),
    pressedNotes: [],
    triggerEventId: 0,
  };

  obj.pressedNotes.reserve(64);

  return obj;
}

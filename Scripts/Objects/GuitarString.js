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
    isMuted: false,
    isPalmMuted: false,
    palmMuteToggle: false,
    fret: -1,
    openNote: standardTuning[index],
    topNote: standardTuning[index] + 20,
    pending: Engine.createMessageHolder(),
    triggerEventId: 0,
  };

  obj.getNote = function() {
    return (this.fret == -1 ? 0 : this.openNote + this.fret);
  };

  obj.trigger = function(note, vel, delay) {
    return Synth.addNoteOn(this.index, note, vel, delay);
  };

  obj.releaseStrum = function() {
    Synth.addNoteOff(this.index, this.openNote, 0);
  };

  return obj;
}

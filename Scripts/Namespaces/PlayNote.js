include("Namespaces/Articulations.js");
include("Namespaces/RR.js");
include("Namespaces/Velocity.js");

namespace PlayNote {
  const var sampler = Synth.getSampler(Synth.getIdList("Sampler")[0]);
  sampler.enableRoundRobin(false);

  const var name = Synth.getIdList("Sampler")[0];
  const var string = g_strings[parseInt(name.substring(3, 4))];
  const var filter = Synth.getEffect("Str" + string.index + "Body LP");
  const var nharmFrets = [
    [3, 31], [5, 24], [7, 19], [9, 28], [12, 12], [15, 28], [17, 19], [19, 28], [20, 24]
  ];

  inline function getGain(articulation, velocity) {
    local linear = 1;
    switch (articulation) {
      case Articulations.SUSTAIN:
        linear = 0.2 + g_mod.linear[velocity] * 0.8;
        break;
      case Articulations.PALMMUTED:
        linear = 0.5 + g_mod.linear[velocity] * 0.5;
        break;
      case Articulations.VIBRATO:
        linear = 0.25 + g_mod.linear[velocity] * 0.75;
        break;
      case Articulations.CHORD:
        linear = Math.min(1, 0.5 + g_mod.linear[velocity] * 0.58);
        break;
      case Articulations.HARMONIC:
        linear = g_mod.harmonicVel2Gain[velocity];
        break;
    }
    return Engine.getDecibelsForGainFactor(linear)
  }

  inline function getLP(articulation, velocity) {
    switch (articulation) {
      case Articulations.SUSTAIN:
      case Articulations.PALMMUTED:
      case Articulations.VIBRATO:
        return 20000;
      case Articulations.CHORD:
        return g_mod.chordVel2LP[velocity];
      case Articulations.HARMONIC:
        return g_mod.harmonicVel2LP[velocity];
    }
  }

  inline function _getHarmonicNote() {
    local interval = MIDI.number - string.openNote;
    for (fret in nharmFrets) {
      if (fret[0] < g_lh.position) { continue; }
      if (fret[1] == interval) {return nharmFrets.indexOf(fret); }
    }
    return -1
  }

  inline function setSample(articulation, velocity) {
    local direction = g_rh.direction;
    local baseVel;
    switch (articulation) {
      case Articulations.SUSTAIN:
        baseVel = 1;
        break;
      case Articulations.PALMMUTED:
        baseVel = 41;
        break;
      case Articulations.VIBRATO:
        baseVel = 81;
        break;
      case Articulations.CHORD:
        baseVel = 101;
        break;
      case Articulations.HARMONIC:
        local noteNumber = _getHarmonicNote();
        if (noteNumber == -1) { return; }

        Message.setNoteNumber(noteNumber);
        Message.setVelocity(RR.get(articulation) + 1);
        return;
      default:
        Message.ignoreEvent(true);
        return;
      }

    local velLayer = Velocity.getLayer(articulation, velocity);
    local totalRR = RR.total(articulation);
    Message.setVelocity(
      baseVel
      + totalRR * (Velocity.total(articulation) * direction + velLayer)
      + RR.get(articulation)
    );
    RR.next(articulation);
  }

  inline function setAudio(articulation, velocity) {
    filter.setAttribute(1, getLP(articulation, velocity));
    Message.setGain(getGain(articulation, velocity));
  }

  inline function triggerNoteOn() {
    if (!Articulations.isBody(Message.getChannel())) {
      Message.ignoreEvent(true);
      return;
    }

    local velocity = Message.getVelocity();
    local articulation = Message.getChannel();

    setAudio(articulation, velocity);
    setSample(articulation, velocity);

  }

  inline function triggerNoteOff() {
    if (!Articulations.isBody(Message.getChannel())) {
      Message.ignoreEvent(true);
      return;
    }
  }
}

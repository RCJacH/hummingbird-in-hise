include("Namespaces/Articulations.js");
include("Namespaces/RR.js");
include("Namespaces/Velocity.js");

namespace PlayNote {
  const var sampler = Synth.getSampler(Synth.getIdList("Sampler")[0]);
  sampler.enableRoundRobin(false);

  const var name = Synth.getIdList("Sampler")[0];
  const var string = g_strings[parseInt(name.substring(3, 4))];
  const var filter = Synth.getEffect("Str" + string.index + "Body LP");

  inline function getGain(articulation, velocity) {
    local linear = 1;
    switch (articulation) {
      case Articulations.SUSTAIN:
        linear = 0.2 + g_mod["linear"][velocity] * 0.8;
        break;
      case Articulations.PALMMUTED:
        linear = 0.5 + g_mod["linear"][velocity] * 0.5;
        break;
      case Articulations.HARMONIC:
        linear = g_mod["harmonicVel2Gain"][velocity];
        break;
    }
    return Engine.getDecibelsForGainFactor(linear)
  }

  inline function getLP(articulation, velocity) {
    switch (articulation) {
      case Articulations.SUSTAIN:
      case Articulations.PALMMUTED:
        return 20000;
      case Articulations.HARMONIC:
        return g_mod["harmonicVel2LP"][velocity];
    }
  }

  inline function setSample(articulation, velocity) {
    local direction = g_rh.direction;

    switch (articulation) {
      case Articulations.SUSTAIN:
      case Articulations.PALMMUTED:
        Message.setVelocity(
          Velocity.getLayer(articulation, velocity) +
          RR.total(articulation) * direction
        );
        break;
      case Articulations.HARMONIC:
        Message.setVelocity(getTotalRR(articulation));
        RR.next(articulation);
        break;
      default:
        Message.ignoreEvent(true);
    }

    sampler.setActiveGroup(articulation);
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

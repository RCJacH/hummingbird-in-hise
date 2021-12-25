include("Namespaces/Articulations.js");
include("Namespaces/RR.js");
include("Namespaces/Velocity.js");

namespace PlayNoise {
  const var sampler = Synth.getSampler(Synth.getIdList("Sampler")[0]);
  sampler.enableRoundRobin(false);

  const var name = Synth.getIdList("Sampler")[0];
  const var string = g_strings[parseInt(name.substring(3, 4))];
  const var filter = Synth.getEffect(name +" LP");

  inline function getGain(articulation, velocity) {
    local linear = 1;
    switch (articulation) {
      case Articulations.PICKNOISE:
        linear = g_mod.doubleRamp[velocity];
        break;
      case Articulations.PICKBUZZ:
        linear = 0.8 + 0.2 * g_mod.linear[velocity];
        break;
      case Articulations.PICKSTOP:
        linear = 0.4 + 0.6 * g_mod.linear[velocity];
        break;
      case Articulations.FRETNOISE:
      case Articulations.FINGERRELEASE:
        linear = 0.5 + 0.2 * g_mod.linear[velocity];
        break;
      case Articulations.GLIDEDOWN:
        linear = g_mod.linear[velocity];
    }
    return (
      g_settings.volume.noises +
      Message.getGain() + Engine.getDecibelsForGainFactor(linear)
    )
  }

  inline function getLP(articulation, velocity) {
    local freq = 20000;
    switch (articulation) {
      case Articulations.PICKNOISE:
        freq *= g_mod.doubleRamp[velocity];
    }

    return freq
  }

  inline function setSample(articulation, velocity) {
    local direction = g_rh.direction == -1 ? g_rh.autoDirection : g_rh.direction;
    switch (articulation) {
      case Articulations.PICKNOISE:
        Message.setVelocity(
          1 + RR.get(articulation)
          + Velocity.getLayer(articulation, velocity) * 10
          + direction * 20
        );
        break;
      case Articulations.PICKBUZZ:
        Message.setVelocity(41 + RR.get(articulation) + direction * 20);
        break;
      case Articulations.PICKSTOP:
        Message.setVelocity(61 + RR.get(articulation));
        break;
      case Articulations.FRETNOISE:
        Message.setNoteNumber(Message.getNoteNumber() + RR.get(articulation));
        break;
      case Articulations.FINGERRELEASE:
        Message.setVelocity(71 + RR.get(articulation));
        break;
      case Articulations.GLIDEDOWN:
        Message.setVelocity(121 + g_settings.glideSpeed);
        local rate = MIDI.value / 127;
        Synth.addVolumeFade(
          Message.getEventId(),
          200 - 100 * rate,
          Message.getGain() - 3 - 3 * rate
        );
        Message.setGain(-32);
        break;
      default:
        Message.ignoreEvent(true);
    }
    RR.next(articulation);
  }

  inline function setAudio(articulation, velocity) {
    filter.setAttribute(1, getLP(articulation, velocity));
    Message.setGain(getGain(articulation, velocity));
  }

  inline function triggerNoteOn() {
    if (!Articulations.isNoise(Message.getChannel())) {
      Message.ignoreEvent(true);
      return;
    }

    local velocity = Message.getVelocity();
    local articulation = Message.getChannel();

    setAudio(articulation, velocity);
    setSample(articulation, velocity);
  }

  inline function triggerNoteOff() {
    if (!Articulations.isNoise(Message.getChannel())) {
      Message.ignoreEvent(true);
      return;
    }
  }
}

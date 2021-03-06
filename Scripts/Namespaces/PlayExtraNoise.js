include("Namespaces/Articulations.js");
include("Namespaces/MIDI.js");
include("Namespaces/RR.js");
include("Namespaces/Velocity.js");

namespace PlayExtraNoise {
  const var NONE = 0;
  const var STRUM = 1;
  const var SLOWSTRUM = 2;
  const var MUTEDSTRUM = 3;
  const var BRIDGEMUTE = 4;
  const var POSITIONCHANGE = 5;
  const var PALMHIT = 6;
  const var FINGERHIT = 7;
  const var STRINGMUTEBUZZ = 8;
  const var PICKGUARDHIT = 9;

  const var name = Synth.getIdList("Sampler")[0];
  const var ar = Synth.getModulator(name + " AR");
  ar.setAttribute(0, 0);
  const var filter = Synth.getEffect(name + " LP");

  inline function getStrumArticulation() {
    return g_rh.speed > 1.08 ? NONE : g_rh.speed > 0.7 ? SLOWSTRUM : STRUM
  }

  inline function _getStrumType() {
    switch (g_rh.bottomString - g_rh.topString) {
      case 0:
      case 1:
        return -1;
      case 2:
      case 3:
      case 4:
        return (g_rh.bottomString < 4) ? 2 : 1;
      case 5:
      case 6:
        return 0;
    }
  }

  inline function _getSlowStrumType() {
    switch (g_rh.bottomString - 6) {
      case 0:
        return 0;
      default:
        return 1;
    }
  }

  inline function getStrumType(articulation) {
    switch (articulation) {
      case STRUM:
        return _getStrumType();
      case SLOWSTRUM:
        return _getSlowStrumType();
      default:
        return 0;
    }
  }

  inline function getGain(articulation, velocity) {
    local linear = 1;
    switch (articulation) {
      case STRUM:
      case MUTEDSTRUM:
      case POSITIONCHANGE:
        linear = 0.4 + Math.pow(0.6 * g_mod.linear[velocity], 1.5);
        break;
      case SLOWSTRUM:
        linear = 0.4 + Math.pow(0.6 * g_mod.linear[velocity], 1.5);
        linear *= 1 - (g_rh.speed - 0.7) / 0.4;
        break;
      case BRIDGEMUTE:
        linear = 0.45 + 0.55 * g_mod.linear[velocity];
        break;
      case PALMHIT:
      case FINGERHIT:
      case PICKGUARDHIT:
        linear = 0.5 + 0.5 * g_mod.linear[velocity];
        break;
      case STRINGMUTEBUZZ:
        linear = 0.4 + 0.6 * g_mod.linear[velocity];
        break;
      default:
        linear = g_mod.linear[velocity];
    }
    return Message.getGain() + Engine.getDecibelsForGainFactor(linear)
  }

  inline function getLP(articulation, velocity) {
    local freq = 2000;
    switch(articulation) {
      case STRUM:
      case SLOWSTRUM:
      case MUTEDSTRUM:
        freq = 20000 * g_mod.doubleRamp[velocity];
        break;
      case BRIDGEMUTE:
        local ramp = velocity <= 72 ? (
            0.4 + 0.6 * velocity / 72
          ) : (
            0.7 + 0.3 * (velocity - 72) / 55
          );
        freq = 20000 * ramp;
        break;
    }
    return freq
  }

  inline function setSample(articulation, velocity) {
    local baseVel = 1;
    local articulationOffset = articulation + 16;
    local totalVel = Velocity.total(articulationOffset);
    local totalRR = RR.total(articulationOffset);
    local velLayer = Velocity.getLayer(articulationOffset, velocity);
    local direction = g_rh.direction == -1 ? g_rh.autoDirection : g_rh.direction;
    local strumType = getStrumType(articulation);

    switch (articulation) {
      case STRUM:
        if (strumType == -1) { return; }
        break;
      case MUTEDSTRUM:
        if (strumType == -1) { return; }
        direction = 0;
        break;
      case SLOWSTRUM:
        if (strumType == -1) { return; }
        baseVel = 61;
        break;
      case POSITIONCHANGE:
        baseVel = 101;
        direction = 0;
        break;
      default:
        direction = 0;
        break;
    }

    Message.setVelocity(
      baseVel
      + totalRR * totalVel * 2 * strumType
      + totalRR * (totalVel * direction + velLayer)
      + RR.get(articulation)
    );
    RR.next(articulation, totalRR);
  }

  inline function setAudio(articulation, velocity) {
    filter.setAttribute(1, getLP(articulation, velocity));
    Message.setGain(getGain(articulation, velocity));
  }

  inline function triggerNoteOn() {
    if (Message.getChannel() != 15) {
      Message.ignoreEvent(true);
      return;
    }

    MIDI.parseNoteOn();

    local articulation;
    local velocity = Message.getVelocity();

    switch(Message.getNoteNumber()) {
      case 21:
        articulation = MUTEDSTRUM;
        break;
      case 22:
        articulation = BRIDGEMUTE;
        break;
      case 23:
        articulation = PALMHIT;
        break;
      case 24:
        articulation = FINGERHIT;
        break;
      case 25:
        articulation = STRINGMUTEBUZZ;
        break;
      case 26:
        articulation = PICKGUARDHIT;
        break;
      case 127:
        articulation = POSITIONCHANGE;
        break;
      default:
        articulation = getStrumArticulation();
        break;
    }

    if (!articulation) { Message.ignoreEvent(true); return; }

    setAudio(articulation, velocity);
    setSample(articulation, velocity);
  }

  inline function triggerNoteOff() {
    if (Message.getChannel() != 15) {
      Message.ignoreEvent(true);
      return;
    }

  }
}

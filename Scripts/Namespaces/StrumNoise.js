namespace StrumNoise {
  const var totalRR = 5;
  const var FULL = 2;
  const var UPPER = 1;
  const var LOWER = 0;
  const var NONE = -1;
  const var vel2lp = [];
  vel2lp.reserve(128);
  const var sampler = Synth.getSampler(Synth.getIdList('Sampler')[0]);
  sampler.enableRoundRobin(false);
  const var filter = Synth.getEffect("BrPN LP");

  reg currentRR = 1;

  inline function updateVel2LPTable(breakpoint) {
    local i = 0;
    local v = 0;
    for (i; i < 128; i++) {
      if (i > (breakpoint)) {
        v = 0.5 + 0.5 * Math.pow((i - breakpoint + 1)/(126 - breakpoint), 2);
      } else {
        v = 0.01 + Math.pow(i / (breakpoint - 1), 1.5);
      }
      vel2lp[i] = 20000 * v;
    }
  }

  inline function getStrumType() {
    local type = NONE;

    switch (g_rh.bottomString - g_rh.topString) {
      case 0:
      case 1:
        break;
      case 2:
      case 3:
        type = (g_rh.bottomString < 4) ? UPPER : LOWER;
        break;
      case 4:
      case 5:
      case 6:
        type = FULL;
        break;
    }

    return type;
  }

  inline function nextRR() {
    currentRR = (currentRR + 1) % totalRR;
  }

  inline function setFilter() {
    filter.setAttribute(1, vel2lp[Message.getVelocity()]);
  }

  inline function triggerNoteOn() {
    sampler.setActiveGroup(1 + (Message.getVelocity() > 110) + g_rh.direction * 2);
    nextRR();
    Message.setNoteNumber(52 + g_lh.position);
    setFilter();
    Message.setVelocity(1 + currentRR + getStrumType() * totalRR);
  }

  inline function triggerNoteOff() {
  }

  updateVel2LPTable(110);
}
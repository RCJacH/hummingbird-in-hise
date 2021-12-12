namespace GlobalModulations {
  inline function linear() {
    local a = [];
    a.reserve(128);
    for (i = 0; i < 128; i++) {
      a[i] = (i / 127);
    }

    return a
  }

  inline function linearGain() {
    local a = [];
    a.reserve(128);
    for (i = 0; i < 128; i++) {
      a[i] =  20 * Math.log10(i / 127);
    }

    return a
  }

  inline function max() {
    local a = [];
    a.reserve(128);
    for (i = 0; i < 128; i++) {
      a[i] = 127;
    }
    return a
  }

  inline function doubleRamp() {
    local a = [];
    a.reserve(128);
    for (i=0; i<128; i++) {
      if (i > (110)) {
        a[i] = 0.5 + 0.5 * Math.pow((i - 110 + 1)/(126 - 110), 2);
      } else {
        a[i] = 0.01 + Math.pow(i / (110 - 1), 1.5);
      }
    }

    return a
  }

  inline function strumNoiseCCGain() {
    local a = [];
    a.reserve(128);
    for (i=0; i<128; i++) {
      a[i] = 0.2 + 0.8 * Math.pow(Math.min(i / 125, 1), 2);
    }

    return a
  }

  inline function mutedVel2Gain() {
    local a = [];
    a.reserve(128);
    for (i=0; i<128; i++) {
      a[i] = 20 * Math.log10(0.85 + 0.15 * i/127);
    }

    return a
  }

  inline function harmonicVel2Gain() {
    local a = [];
    a.reserve(128);
    for (i=0; i < 128; i++) {
      a[i] = Math.min(1, .3 + .7 * i / 101);
    }

    return a
  }

  inline function harmonicVel2LP() {
    local a = [];
    a.reserve(128);
    for (i=0; i < 128; i++) {
      a[i] = 20000 * Math.min(1, 0.3 + 0.7 * Math.pow(i / 98, 1.5));
    }

    return a
  }

  inline function pickBuzzVel2Gain() {
    local a = [];
    a.reserve(128);
    for (i=0; i < 128; i++) {
      a[i] = 20 * Math.log10(0.8 + 0.2 * (i / 127));
    }

    return a
  }

  inline function pickStopHOPOVel2Gain() {
    local a = [];
    a.reserve(128);
    for (i=0; i < 128; i++) {
      a[i] = 20 * Math.log10(0.4 + 0.6 * (i / 127));
    }

    return a
  }

  inline function init() {
    return {
      "linear": linear(),
      "linearGain": linearGain(),
      "max": max(),
      "doubleRamp": doubleRamp(),
      "strumNoiseCCGain": strumNoiseCCGain(),
      "mutedVel2Gain": mutedVel2Gain(),
      "harmonicVel2Gain": harmonicVel2Gain(),
      "harmonicVel2LP": harmonicVel2LP(),
      "pickBuzzVel2Gain": pickBuzzVel2Gain(),
      "pickStopHOPOVel2Gain": pickStopHOPOVel2Gain(),
    }
  }
}
namespace Articulations {
  const var SUSTAIN = 1;
  const var PALMMUTED = 2;
  const var MUTED = 3;
  const var HO = 4;
  const var PO = 5;
  const var HARMONIC = 6;
  const var TAP = 7;
  const var SLIDE = 8;
  const var VIBRATO = 9;
  const var CHORD = 10;
  const var PICKNOISE = 11;
  const var PICKBUZZ = 12;
  const var PICKSTOP = 13;
  const var FRETNOISE = 14;
  const var FRETSLIDENOISE = 15;
  const var GLIDEDOWN = 16;

  const var articulations = [
    "sustain",
    "palmMuted",
    "muted",
    "HO",
    "PO",
    "harmonic",
    "tap",
    "slide",
    "vibrato",
    "chord",
    "pickNoise",
    "pickBuzz",
    "pickStop",
    "fretNoise",
    "fretSlideNoise",
    "glideDown",
  ]

  inline function fromIndex(channel) {
    return articulations[channel - 1]
  }

  inline function fromName(name) {
    switch (name.toLowerCase()) {
      case 'sust':
      case 'sustain':
        return SUSTAIN;
      case 'mute':
      case 'muted':
        return PALMMUTED;
      case 'ho':
      case 'hammer-on':
        return HO;
      case 'po':
      case 'pull-off':
        return PO;
      case 'harm':
      case 'harmonic':
        return HARMONIC;
      case 'tap':
        return TAP;
      case 'slide':
        return SLIDE;
      case 'pkn':
      case 'pick noise':
        return PICKNOISE;
      case 'pkbz':
      case 'pick buzz':
        return PICKBUZZ;
      case 'frn':
      case 'fret noise':
        return FRETNOISE;
      case 'svdf':
      case 'vibrato':
        return VIBRATO;
      case 'pstop':
      case 'pick stop':
        return PICKSTOP;
      case 'fn':
      case 'fret slide noise':
        return FRETSLIDENOISE;
      case 'sgdwn':
      case 'glide down':
        return GLIDEDOWN

    }
  }

  inline function isBody(channel) {
    switch (channel) {
      case SUSTAIN:
      case MUTED:
      case HARMONIC:
      case TAP:
      case CHORD:
        return true;
      default:
        return false;
    }
  }

  inline function isNoise(channel) {
    switch (channel) {
      case PICKNOISE:
      case PICKBUZZ:
      case PICKSTOP:
      case FRETNOISE:
      case FRETSLIDENOISE:
      case GLIDEDOWN:
        return true;
      default:
        return false;
    }
  }
}

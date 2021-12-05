namespace Articulations {
  const var sustain = 1;
  const var palmMuted = 2;
  const var muted = 3;
  const var ho = 4;
  const var po = 5;
  const var harmonic = 6;
  const var tap = 7;
  const var slide = 8;
  const var vibrato = 9;
  const var pickNoise = 10;
  const var pickBuzz = 11;
  const var pickStop = 12;
  const var fretNoise = 13;
  const var fretSlideNoise = 14;

  inline function fromName(name) {
    switch (name.toLowerCase()) {
      case 'sust':
      case 'sustain':
        return sustain;
      case 'mute':
      case 'muted':
        return palmMuted;
      case 'ho':
      case 'hammer-on':
        return ho;
      case 'po':
      case 'pull-off':
        return po;
      case 'harm':
      case 'harmonic':
        return harmonic;
      case 'tap':
        return tap;
      case 'slide':
        return slide;
      case 'pkn':
      case 'pick noise':
        return pickNoise;
      case 'pkbz':
      case 'pick buzz':
        return pickBuzz;
      case 'frn':
      case 'fret noise':
        return fretNoise;
      case 'svdf':
      case 'vibrato':
        return vibrato;
      case 'pstop':
      case 'pick stop':
        return pickStop;
      case 'fn':
      case 'fret slide noise':
        return fretSlideNoise;
    }
  }
}

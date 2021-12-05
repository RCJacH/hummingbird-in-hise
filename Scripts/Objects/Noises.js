global g_noises = {
  weakBuzz: {
    threshold: -20,
    volume: 0.75,
    probability: 0.5,
    delay: 25,
    humanize: 1,
  },
  pickBuzz: {
    threshold: 64,
    volume: 1,
    probability: 1,
    delay: 0,
    humanize: 0,
  },
  positionChange: {
    threshold: 0,
    probability: 0.8,
    volume: 1,
    delay: 0,
    humanize: 0,
  },
  fretSlideNoise: {
    threshold: 0,
    probability: 0,
    volume: 0.75,
    delay: 0,
    humanize: 0,
  },
  pickStop: {
    threshold: 0,
    probability: 0,
    volume: 0.75,
    delay: 0,
    humanize: 0,
  },
  fretNoise: {
    threshold: 0,
    probability: 0,
    volume: 0.9,
    delay: 0,
    humanize: 0,
  },
  openString: {
    threshold: 0,
    probability: 0,
    volume: 0.75,
    delay: 0,
    humanize: 0,
  }
};

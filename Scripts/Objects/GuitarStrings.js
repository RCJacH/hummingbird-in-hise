function _createGuitarString(index) {
  var string = {
    index: index,
    articulation: 1,
    lastArticulation: 1,
    fret: -1,
    lastFret: -1,
    isStrummed: false,
    openNote: g_settings.string.tuning[index],
    topNote: g_settings.string.tuning[index] + g_settings.string.frets,
    pending: Engine.createMessageHolder(),
    pendingPosChange: false,
    midiList: Engine.createMidiList(),
    attackEventIds: Engine.createUnorderedStack(),
    releaseEventIds: Engine.createUnorderedStack(),
    pressedFrets: [],
    triggerEventId: 0,
  };

  string.pressedFrets.reserve(64);
  return string
}

global g_strings = [
  null,
  _createGuitarString(1),
  _createGuitarString(2),
  _createGuitarString(3),
  _createGuitarString(4),
  _createGuitarString(5),
  _createGuitarString(6)
];
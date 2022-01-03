function _createGuitarString(index) {
  var string = {
    index: index,
    flag: 1 << (index - 1),
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
    releaseTime: 11,
  };

  string.pressedFrets.reserve(64);
  return string
}

global g_string1 = _createGuitarString(1);
global g_string2 = _createGuitarString(2);
global g_string3 = _createGuitarString(3);
global g_string4 = _createGuitarString(4);
global g_string5 = _createGuitarString(5);
global g_string6 = _createGuitarString(6);

global g_stringsChannel = [
  null, g_string1, g_string2, g_string3, g_string4, g_string5, g_string6
];

global g_strings = [
  g_string1, g_string2, g_string3, g_string4, g_string5, g_string6
];

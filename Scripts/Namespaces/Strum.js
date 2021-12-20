namespace Strum {
  const var DOWNSTROKE = 0;
  const var UPSTROKE = 1;

  inline function setup(bottom, top, direction) {
    local rh = g_rh;
    rh.direction = direction;
    local b = bottom + (rh.direction ? rh.addString : -rh.missString);
    local t = top + (rh.direction ? -rh.missString : rh.addString);
    rh.bottomString = Math.range(b, Math.max(t, 1), 6);
    rh.topString = Math.range(top, 1, Math.min(6, b));
  }

  inline function _getStrings(bottom, top, direction) {
    local range = bottom - top;
    local strings = [];
    local index = 0;
    local stringIndex = 0;
    for (i=0; i<=range; i++) {
      index = direction ? range - i : i;
      stringIndex = bottom - index;
      strings.push([index, g_strings[stringIndex]]);
    }
    return strings;
  }

  inline function _getFrettedNote(item, lastFret) {
    local string = item[1];
    local fret = string.fret;
    if (fret == -1) {
      GuitarString.setArticulation(string, Articulations.MUTED, 1);
      fret = lastFret;
    }
    item.push(string.openNote + fret);
    return fret;
  }

  inline function _getNotes(bottom, top, direction) {
    local fret = g_lh.position;
    local lastFret = fret;
    local strings = _getStrings(bottom, top, direction);
    local isEmpty = !g_lh.pressedStrings.length;
    for (item in strings) {lastFret = _getFrettedNote(item, lastFret);}
    return strings;
  }

  inline function _addNoise(note, velocity, timestamp) {
    Synth.addNoteOn(15, note, velocity, timestamp + Delays.noteStrumSamples());
  }

  inline function noteOn(b, t, d) {
    local bottomString = b == null ? g_rh.bottomString : b;
    local topString = t == null ? g_rh.topString : t;
    local direction = d == null ? g_rh.direction : d;

    setup(bottomString, topString, direction);
    local velocity = MIDI.value;
    g_pressedKeys.setValue(MIDI.number, velocity);
    g_controlEventId = Message.getEventId();
    _addNoise(g_lh.position, Message.getVelocity(), Message.getTimestamp());
    if (MIDI.channel == STRUM_CHANNEL) { return; }

    Humanizer.setStrum(velocity, bottomString-topString);
    local items = _getNotes(bottomString, topString, direction);
    local string;
    local index;
    local note;
    local vel;
    for (item in items) {
      index = item[0];
      string = item[1];
      note = item[2];
      Message.store(string.pending);
      vel = Humanizer.humanizeVelocity(index, velocity);
      if (index) {
        GuitarString.setArticulation(string, Articulations.CHORD, 1);
      }
      GuitarString.pick(string, note, vel);
      Message.delayEvent(Humanizer.humanizeDelay(index));
    }
  }

  inline function noteOff(number) {
    g_pressedKeys.setValue(number, -1);
    if (!g_pressedKeys.isEmpty()) { return; }

    g_pressedKeys.clear();
    if (!g_lh.isSilent && !g_lh.pressedStrings.isEmpty()) { return; }

    for (string in g_strings) {
      if (string == null) { continue; }
      GuitarString.stop(string, 0, MIDI.timestamp);
    }
  }
}
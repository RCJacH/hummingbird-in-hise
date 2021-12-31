namespace Strum {
  const var DOWNSTROKE = 0;
  const var UPSTROKE = 1;

  inline function setup(bottom, top, direction) {
    g_rh.direction = direction;
    local b = bottom + (g_rh.direction ? g_rh.addString : -g_rh.missString);
    local t = top + (g_rh.direction ? -g_rh.missString : g_rh.addString);
    g_rh.bottomString = Math.range(b, Math.max(t, 1), 6);
    g_rh.topString = Math.range(top, 1, Math.min(6, b));
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
    if (direction) { strings.reverse(); }
    return strings;
  }

  inline function _getFrettedNote(item, lastFret) {
    local string = item[1];
    local fret = string.fret == -1 ? lastFret : string.fret;
    item.push(string.openNote + fret);
    return fret;
  }

  inline function _getNotes(bottom, top, direction) {
    local lastFret = g_lh.position;
    local strings = _getStrings(bottom, top, direction);
    local isEmpty = !g_lh.pressedStrings.length;
    for (item in strings) {lastFret = _getFrettedNote(item, lastFret);}
    return strings;
  }

  inline function noteOn(b, t, d) {
    local bottomString = b == null ? g_rh.bottomString : b;
    local topString = t == null ? g_rh.topString : t;
    local direction = d == null ? g_rh.direction : d;

    setup(bottomString, topString, direction);
    local velocity = MIDI.value;
    g_strumKeys.insert(MIDI.number);
    g_controlEventId = Message.getEventId();
    if (g_lh.isMuted) {
      Internal.setAllReleaseTime(10 + (127 - velocity) * 40);
      Internal.stopAllStrings();
    }
    ExtraNoise.strum(
      g_lh.position,
      Message.getVelocity(),
      Message.getTimestamp() + Delays.noteStrumSamples()
    );
    if (MIDI.channel == STRUM_CHANNEL) { return; }

    Humanizer.setStrum(velocity, bottomString-topString);
    local items = _getNotes(bottomString, topString, direction);
    local string;
    local index;
    local note;
    local vel;
    local isStrummed = false;
    for (item in items) {
      index = item[0];
      string = item[1];
      note = item[2];
      Message.store(string.pending);
      vel = Humanizer.humanizeVelocity(index, velocity);
      string.isStrummed = isStrummed;
      GuitarString.pick(string, note, vel);
      Message.delayEvent(Humanizer.humanizeDelay(index));
      if (g_rh.speed < 0.8 && string.fret != -1) { continue; }
      isStrummed = true;
    }
  }

  inline function noteOff(number) {
    g_strumKeys.remove(number);
    if (!g_strumKeys.isEmpty()) { return; }

    if (!LeftHand.isOffString()) { return; }

    if (LeftHand.isSilent()) {
      GuitarString.forAllStrings(
        function (string) {
          GuitarString.stop(string, 0, MIDI.timestamp);
        }
      );
      return;
    }
    GuitarString.forAllStrings(
      function (string) {
        GuitarString.clearFret(string, string.fret);
      }
    );
  }
}

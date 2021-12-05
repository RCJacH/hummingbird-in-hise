namespace RightHand {
  reg pressedKeys = [];

  inline function setAddString(value) {
    g_rh.addString = Math.ceil(value / 100);
  }

  inline function setMissString(value) {
    g_rh.missString = Math.ceil(value / 100);
  }

  inline function setSpeed(float) {
    g_rh.speed = 1.5 - float;
  }

  inline function setAcceleration(float) {
    g_rh.accelleration = 1.5 + float;
  }

  inline function setCrescendo(float) {
    g_rh.crescendo = 0.5 + float;
  }

  inline function setHumanize(float) {
    g_rh.humanize = float;
  }

  inline function setStrum(direction, bottom, top) {
    local rh = g_rh;
    rh.direction = direction === null ? rh.direction : direction;
    local b = bottom + (rh.direction ? rh.addString : -rh.missString);
    local t = top + (rh.direction ? -rh.missString : rh.addString);
    rh.bottomString = Math.range(b, Math.max(t, 1), 6);
    rh.topString = Math.range(top, 1, Math.min(6, b));
  }

  inline function _getStrumStrings() {
    local range = g_rh.bottomString - g_rh.topString;
    local strings = [];
    local index = 0;
    local i = 0;
    for (i; i <= range; i++) {
      index = g_rh.direction ? range - i : i;
      strings.push([index, g_strings[6 - index]]);
    }
    return strings;
  }

  inline function _getBarMuteNote(item, fret) {
    local string = item[1];
    local note = string.openNote + fret;
    string.isMuted = true;
    item.push(note);
  }

  inline function _getFrettedNote(item, lastFret) {
    local string = item[1];
    local fret = string.fret;
    local note = 0;
    if (fret == -1) { fret = lastFret; }
    note = string.openNote + fret;
    string.isMuted = !note;
    item.push(note);
    return fret;
  }

  inline function _getStrumNotes() {
    local fret = g_lh.position;
    local lastFret = fret;
    local strings = _getStrumStrings();
    local isEmpty = g_lh.pressedStrings.length == 0;
    for (item in strings) {
      if (isEmpty) {
        _getBarMuteNote(item, fret);
      } else {
        lastFret = _getFrettedNote(item, lastFret);
      }
    }
    if (!isEmpty && strings[0][1].isMuted && strings[0][2] == g_lh.position) {
      strings[0][2] = strings[1][2];
    }
    return strings;
  }

  inline function _addStrumNoise(note, velocity) {
    Synth.addNoteOn(15, note, velocity, Message.getTimestamp());
  }

  inline function strum(number, velocity) {
    pressedKeys.push(number);
    g_controlEventId = Message.getEventId();
    Humanizer.setStrum(velocity);
    local items = _getStrumNotes();
    local delay = 0;
    local vel = 0;
    local note = 0;
    local string = null;
    local index = 0;
    for (item in items) {
      index = item[0];
      string = item[1];
      note = item[2];
      string.triggerEventId = Message.getEventId();
      Message.store(string.pending);
      vel = Humanizer.humanizeVelocity(index, velocity);
      string.trigger(note, vel, delay);
      delay += Humanizer.humanizeDelay(index);
    }
    _addStrumNoise(note, velocity);
  }

  inline function strumNoteOff(number) {
    pressedKeys.remove(number);
    if (pressedKeys.length) { return; }

    for (string in g_strings) {
      if (string == null) { continue; }
      string.releaseStrum();
    }
  }
}

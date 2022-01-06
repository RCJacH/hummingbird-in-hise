namespace Strum {
  const var DOWNSTROKE = 0;
  const var UPSTROKE = 1;

  reg baseVel = 0;
  reg baseDelay = 0;
  reg curRnd = 0;

  inline function setBaseDelay() {
    baseDelay = Math.pow(Delays.inSamples(32), g_rh.speed);
  }

  inline function setBaseVel(velocity, range) {
    baseVel = (velocity * g_rh.crescendo - velocity) / range;
  }

  inline function setCurrentRnd() {
    curRnd = Math.random() * g_rh.humanize;
  }

  inline function humanizeDelay(index) {
    return (baseDelay *
      Math.pow(
        g_rh.accelleration + (curRnd * (1.5 - g_rh.speed)), index
      )
    );
  }

  inline function humanizeVelocity(index, velocity) {
    local rand = (curRnd - g_rh.humanize * 0.5) * (g_rh.speed - 0.5);
    return Math.range(
      Math.round(velocity + (baseVel + velocity * rand) * index), 1, 127
    );
  }

  inline function _getStringCases(input, nullcase, maxcase, limitcase, direction) {
    local resultString;
    switch (input) {
      case null:
        resultString = nullcase;
        break;
      case -1:
        resultString = g_rh.addString ? maxcase : limitcase;
        break;
      default:
        if (g_rh.addString || g_rh.missString) {
          resultString = input + (direction ? g_rh.addString : -g_rh.missString);
        } else {
          resultString = input;
        }
    }
    return resultString
  }

  inline function _getStringRange(b, t, d) {
    local bottomString = _getStringCases(
      b, g_rh.bottomString, 6, LeftHand.lowestPressedString(), d
    );
    local topString = _getStringCases(
      t, g_rh.topString, 1, LeftHand.highestPressedString(), !d
    );
    bottomString = Math.range(bottomString, Math.max(topString, 1), 6);
    topString = Math.range(topString, 1, Math.min(6, bottomString));
    return [bottomString, topString]
  }

  inline function _getDirection(d) {
    local direction = d === null ? g_rh.strumDirection : d;
    if (!(direction + 1)) { direction = 0; }
    return direction
  }

  inline function setup(b, t, direction, velocity) {
    g_rh.direction = direction;
    g_rh.bottomString = Math.max(t, b);
    g_rh.topString = Math.min(t, b);
    setBaseVel(velocity, g_rh.bottomString - g_rh.topString);
  }

  inline function _getStrings(bottom, top, direction) {
    local range = bottom - top;
    local strings = [];
    local index;
    local stringIndex;
    for (i=range+1; i--;) {
      index = direction ? range - i : i;
      stringIndex = top + index;
      strings.push([index, g_stringsChannel[stringIndex]]);
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
    for (item in strings) {lastFret = _getFrettedNote(item, lastFret);}
    return strings;
  }

  inline function noteOn(b, t, d) {
    local stringRange = _getStringRange(b, t, d);
    local bottomString = stringRange[0];
    local topString = stringRange[1];
    local direction = _getDirection(d);
    RightHand.setStrumDirection(direction);
    local velocity = MIDI.value;
    setup(bottomString, topString, direction, velocity);
    g_strumKeys.insert(MIDI.number);
    g_controlEventId = Message.getEventId();
    if (g_lh.isMuted) {
      GuitarString.stopAllStrings(velocity, MIDI.timstamp);
      ExtraNoise.strum(
        g_lh.position,
        Message.getVelocity(),
        Message.getTimestamp()
      );
    } else {
      ExtraNoise.strum(
        g_lh.position,
        Message.getVelocity(),
        Message.getTimestamp() + humanizeDelay(1)
      );
    }
    if (MIDI.channel == STRUM_CHANNEL) { return; }

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
      setCurrentRnd();
      vel = humanizeVelocity(index, velocity);
      string.isStrummed = isStrummed;
      GuitarString.pick(string, note, vel);
      Message.delayEvent(humanizeDelay(index));
      if (g_rh.speed < 0.8 && string.fret != -1) { continue; }
      isStrummed = true;
    }
  }

  inline function noteOff(number) {
    g_strumKeys.remove(number);
    if (!g_strumKeys.isEmpty()) { return; }

    RightHand.resetStrumDirection();
    if (!LeftHand.isOffString()) { return; }

    if (LeftHand.isSilent()) {
      GuitarString.stopAllStrings(0, MIDI.timestamp);
      g_lh.pressedStringsFlag = 0;
      return;
    }
    GuitarString.clearAllStrings();
    ExtraNoise.release();
  }

  inline function stop(velocity) {
    if (velocity) {
      g_strumKeys.insert(MIDI.number);
    } else {
      g_strumKeys.remove(MIDI.number);
    }
    GuitarString.stopAllStrings(MIDI.value, MIDI.timestamp);
    RightHand.setStopDirection();
    ExtraNoise.stop(MIDI.value, MIDI.timestamp);
  }
}

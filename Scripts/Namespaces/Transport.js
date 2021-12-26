namespace Transport {
  reg lastMeasureStart = 0;
  const var transport = Engine.createTransportHandler();
  const var playPosition = Engine.createTimerObject();

  inline function getCurrentPosition() {
    local ms = playPosition.getMilliSecondsSinceCounterReset();
    return Engine.getQuarterBeatsForMilliSeconds(ms - lastMeasureStart)
  }

  inline function getCurrentTime() {
    return playPosition.getMilliSecondsSinceCounterReset()
  }

  inline function onBeatChange(beatIndex, isNewBar) {
    if (isNewBar) {
      lastMeasureStart = playPosition.getMilliSecondsSinceCounterReset();
    }
  }

  inline function onSignatureChange(n, d) {
  }

  inline function onTempoChange(tempo) {
    RightHand.setDivision();
  }

  inline function onTransportChange(state) {
    if (state) {
      playPosition.reset();
      playPosition.startTimer();
    } else {
      playPosition.stopTimer();
      Engine.allNotesOff();
    }
    GuitarString.forAllStrings(
      function (string) { GuitarString.clearFret(string, -1); }
    );
  }

  transport.setOnBeatChange(true, onBeatChange);
  transport.setOnSignatureChange(true, onSignatureChange);
  transport.setOnTempoChange(true, onTempoChange);
  transport.setOnTransportChange(true, onTransportChange);
}
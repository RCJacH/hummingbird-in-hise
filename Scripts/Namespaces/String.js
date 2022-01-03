include("Namespaces/Articulations.js");
include("Namespaces/Delays.js");
include("Namespaces/EventChaser.js");
include("Namespaces/MIDI.js");
include("Namespaces/Noises.js");
include("Namespaces/NoteTrigger.js");

namespace String {
  const var name = Synth.getIdList('Container')[0];
  const var string = g_stringsChannel[parseInt(name.substring(6, 7))];

  inline function isOtherString(channel) {
    return channel != string.index;
  }

  inline function notCurrentEvent() {
    return (
      (g_controlEventId != -1) &&
      (string.triggerEventId != g_controlEventId)
    );
  }

  inline function playNoise(flags, func) {
    for (i=0; i<Noises.TOTALARTICULATIONS; i++) {
      if (flags&(1<<i)) {
        Noises.trigger(string, i+1, func);
      }
    }
  }

  inline function playNote(articulation) {
    if (g_lh.isMuted && articulation != Articulations.MUTED) {
      playNote(Articulations.MUTED);
      return;
    }

    local preAttack = NoteTrigger.triggerPreAttack;
    local attack = NoteTrigger.triggerAttack;
    switch (articulation) {
      case Articulations.SUSTAIN:
      case Articulations.VIBRATO:
        if (string.fret == -1) { return playNote(Articulations.MUTED); }
        if (string.isStrummed) { return playNote(Articulations.CHORD); }

        playNoise(Noises.PICKFLAG, preAttack);
        playNoise(Noises.BUZZFLAG, attack);
        string.pending.setGain(0);
        MIDI.timestamp += Delays.pickNoteSamples();
        NoteTrigger.triggerBody(articulation);
        break;
      case Articulations.PALMMUTED:
        if (!string.isStrummed) {
          playNoise(Noises.PICKFLAG, preAttack);
          playNoise(Noises.BUZZFLAG, attack);
          string.pending.setGain(0);
          MIDI.timestamp += Delays.pickNoteSamples();
        }
        NoteTrigger.triggerBody(articulation);
        break;
      case Articulations.MUTED:
        playNoise(Noises.BUZZFLAG, attack);
        if (string.isStrummed) { return; }

        playNoise(Noises.PICKFLAG, preAttack);
        break;
      case Articulations.CHORD:
        playNoise(Noises.BUZZFLAG, attack);
        string.pending.setGain(0);
        NoteTrigger.triggerBody(articulation);
        string.isStrummed = false;
        break;
      case Articulation.HARMONIC:
        playNoise(Noises.PICKFLAG, preAttack);
        string.pending.setGain(0);
        MIDI.timestamp += Delays.pickNoteSamples();
        NoteTrigger.triggerBody(articulation);
        break;
      case Articulations.TAP:
        string.pending.setGain(0);
        NoteTrigger.triggerBody(articulation);
        break;
      default:
        Message.ignoreEvent(true);
    }
  }

  inline function playRelease() {
    MIDI.number = string.lastFret + string.openNote;
    string.pending.setGain(g_settings.volume.release);
    playNoise(Noises.RELEASEFLAG, NoteTrigger.triggerRelease);
  }

  inline function playPosShift() {
    if (!g_lh.position || !string.lastFret) { return; }

    local flag;
    local rangePct = (g_lh.position - string.lastFret) / 20;

    switch (Math.sign(rangePct)) {
      case 0:
        return;
      case 1:
        flag = Noises.FRETNOISEUP;
        break;
      case -1:
        flag = Noises.FRETNOISEDOWN;
        break;
    }
    MIDI.value = Math.abs(rangePct) * 127;
    MIDI.timestamp += Delays.inSamples(80 - 60 * (MIDI.value / 127));
    playNoise(1<<(flag - 1), NoteTrigger.triggerRelease);
  }

  inline function triggerNoteOn() {
    Message.ignoreEvent(true);

    if (isOtherString(Message.getChannel())) { return; }

    MIDI.parseNoteOn();
    Message.store(string.pending);

    switch (MIDI.number) {
      case 0:
        EventChaser.clearPendingNoteOff(string.attackEventIds);
        playRelease();
        break;
      case 1:
        playPosShift();
        break;
      default:
        playNote(Math.ceil(string.articulation / 2));
        break;
    }
  }

  inline function triggerNoteOff() {
    if (isOtherString(Message.getChannel())) { return; }

    MIDI.parseNoteOff();
    switch (MIDI.number) {
      case 0:
        EventChaser.clearPendingNoteOff(string.attackEventIds);
        EventChaser.clearPendingNoteOff(string.releaseEventIds);
        break;
    }
  }

  inline function triggerController() {
    Message.ignoreEvent(true);
    if (String.isOtherString(Message.getChannel())) { return; }

    MIDI.parseController();
  }
}
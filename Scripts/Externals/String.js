include('Namespaces/String.js');
include('Namespaces/Velocity.js');
include('Namespaces/RR.js');

const var name = Synth.getIdList('Container')[0];

String.string = g_strings[parseInt(name.substring(6, 7))];

function onNoteOn() {
  if (!String.parseNoteOn()) { return; }
  if (String.notCurrentNote()) { return; }

  String.triggerNoteOn();
}

function onNoteOff() {
  if (!String.parseNoteOff()) { return; }

  String.triggerNoteOff();
}

function onController() {
  Message.ignoreEvent(true);
  if (String.isOtherString(Message.getChannel())) { return; }

  String.triggerController();

}

function onTimer() {

}

function onControl(number, value) {

}

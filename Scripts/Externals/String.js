include('Namespaces/String.js');

function onNoteOn() {
  String.triggerNoteOn();
}

function onNoteOff() {
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

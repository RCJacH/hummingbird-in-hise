include("Namespaces/StrumNoise.js");

const var name = Synth.getIdList('Container')[0];

function onNoteOn() {
    if (Message.getChannel() != 15) { Message.ignoreEvent(true); return; }

    StrumNoise.triggerNoteOn();
}
function onNoteOff() {
    if (Message.getChannel() != 15) { Message.ignoreEvent(true); return; }

    StrumNoise.triggerNoteOff();
}
function onController() {
    if (Message.getChannel() != 15) { Message.ignoreEvent(true); return; }
}
function onTimer() {

}
function onControl(number, value) {
  
}

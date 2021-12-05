include("Namespaces/CCs.js");
include("Namespaces/Keys.js");
include("Namespaces/MIDI.js");
include("Namespaces/LeftHand.js");
include("Namespaces/RightHand.js");
include("Namespaces/NoteTrigger.js");


function onNoteOn() {
    if (Message.getChannel() != 15) { Message.ignoreEvent(true); return; }

    switch (g_rh.bottomString - g_rh.topString) {
        case 0:
        case 1:
            Message.ignoreEvent(true);
            break;
        case 2:
        case 3:
            Message.setChannel(2 + (g_rh.bottomString < 4));
            break;
        case 4:
        case 5:
        case 6:
            Message.setChannel(1);
            break;
    }
    Message.setNoteNumber(52 + g_lh.position);
}
function onNoteOff() {
    if (Message.getChannel() != 15) { Message.ignoreEvent(true); return; }
}
function onController() {
    if (Message.getChannel() != 15) { Message.ignoreEvent(true); return; }
}
function onTimer() {

}
function onControl(number, value) {
  
}

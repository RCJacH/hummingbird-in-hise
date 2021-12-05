include("Namespaces/CCs.js");
include("Namespaces/Keys.js");
include("Namespaces/MIDI.js");
include("Namespaces/LeftHand.js");
include("Namespaces/RightHand.js");

const var name = Synth.getIdList('Container')[0];
const var artIndex = ['Full', 'Lower', 'Upper'].indexOf(name) + 1;

const var muters = [];
for (muter in Synth.getIdList('MidiMuter')) {
    muter = Synth.getMidiProcessor(muter);
    muter.setAttribute(1, 1);
    muters.push(muter);
}

function setDirectionMuters(direction) {
    muters[direction].setAttribute(0, 0);
    muters[!direction].setAttribute(0, 1);
  }

function onNoteOn() {
    if (Message.getChannel() != artIndex) {
        Message.ignoreEvent(true);
        return;
    }
    setDirectionMuters(g_rh.direction);
}
function onNoteOff() {
}
function onController() {
}
function onTimer() {

}
function onControl(number, value) {
  
}

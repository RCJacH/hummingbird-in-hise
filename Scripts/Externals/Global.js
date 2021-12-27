Engine.setHostBpm(-1);

include("Settings/settings.js");
include("Settings/keys.js");
include("Settings/cc.js");
include("Settings/rr.js");
include("Settings/velocity.js");
include('Settings/Noises.js');
include("Namespaces/GlobalModulations.js");
global g_mod = GlobalModulations.init();
global g_pressedKeys = Engine.createMidiList();
global g_strumKeys = Engine.createUnorderedStack();
global g_strumTimer = Engine.createTimerObject();
global g_message = Engine.createMessageHolder();
global g_controlEventId = -1;

include("Namespaces/Articulations.js");
include("Namespaces/MIDI.js");
include("Namespaces/Delays.js");
include("Namespaces/EventChaser.js");

include("Objects/GuitarStrings.js");
include("Namespaces/GuitarString.js");
include("Objects/LH.js");
include("Objects/RH.js");
include("Namespaces/LeftHand.js");
include("Namespaces/RightHand.js");
include("Namespaces/Internal.js");

include("Namespaces/Humanizer.js");
include("Namespaces/Strum.js");
include("Namespaces/Transport.js");
include("Namespaces/Global/ChordParser.js");
include("Namespaces/Global/EventParser.js");

Content.makeFrontInterface(700, 400);

function onNoteOn() {
  EventParser.parseNoteOn();
}
function onNoteOff() {
  EventParser.parseNoteOff();
}
function onController() {
  EventParser.parseController();
}
function onTimer() {

}
function onControl(number, value) {
  
}

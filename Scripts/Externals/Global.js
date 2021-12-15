include("Namespaces/Global/ChordParser.js");
include("Namespaces/Global/EventParser.js");
include("Namespaces/Global/StringParser.js");
include("Namespaces/GlobalModulations.js");
include("Namespaces/Delays.js");
include("Namespaces/EventChaser.js");
include("Namespaces/Humanizer.js");
include("Namespaces/LeftHand.js");
include("Namespaces/MIDI.js");
include("Namespaces/RightHand.js");
include("Namespaces/Strum.js");
include("Namespaces/GuitarString.js");
global g_strings = [
  null,
  GuitarString.create(1),
  GuitarString.create(2),
  GuitarString.create(3),
  GuitarString.create(4),
  GuitarString.create(5),
  GuitarString.create(6)
];
include("Objects/LH.js");
include('Objects/Noises.js');
include("Objects/RH.js");


global g_lh = LH();
global g_rh = RH();

global g_pressedKeys = Engine.createMidiList();
global g_strumTimer = Engine.createTimerObject();
global g_controlEventId = -1;

global g_settings = Engine.loadFromJSON('settings.json');
global g_keys = Engine.loadFromJSON('keys.json');
global g_cc = Engine.loadFromJSON('cc.json');
global g_rr = Engine.loadFromJSON('rr.json');
global g_velocity = Engine.loadFromJSON('velocity.json');
global g_mod = GlobalModulations.init();

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

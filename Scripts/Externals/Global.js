include("Externals/Global.Global.js");
include("Externals/Global.Controller.js");
include("Externals/Global.Note.js");

include("Namespaces/CCs.js");
include("Namespaces/Humanizer.js");
include("Namespaces/Keys.js");
include("Namespaces/MIDI.js");
include("Namespaces/LeftHand.js");
include("Namespaces/RightHand.js");

global g_settings = Engine.loadFromJSON('settings.json');
global g_keys = Engine.loadFromJSON('keys.json');
global g_cc = Engine.loadFromJSON('cc.json');
global g_rr = Engine.loadFromJSON('rr.json');
global g_velocity = Engine.loadFromJSON('velocity.json');

const STRUM_CHANNEL = 15;
const CONTROL_CHANNEL = 16;
var lowest_note = 40;
var highest_note = 84;

function onNoteOn() {
  if (Message.getChannel() == CONTROL_CHANNEL) {
      triggerNoteOn();
  }
}
function onNoteOff() {
  if (Message.getChannel() == CONTROL_CHANNEL) {
    triggerNoteOff();
  }
}
function onController() {
  if (Message.getChannel() == CONTROL_CHANNEL) {
    triggerController();
  }
}
function onTimer() {

}
function onControl(number, value) {
  
}

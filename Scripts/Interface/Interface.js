Content.makeFrontInterface(800, 150);
include("Interface/GuitarFretboard.js");
// Synth.deferCallbacks(true);
Synth.startTimer(0.5);


function onNoteOn() {
  GuitarFretboard.repaint();
}

function onNoteOff() {
  GuitarFretboard.repaint();
}

function onController() {

}

function onTimer() {
  GuitarFretboard.repaint();
}

function onControl(number, value) {

}

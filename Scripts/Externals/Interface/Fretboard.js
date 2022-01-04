include("Interface/GuitarFretboard.js");
Synth.startTimer(0.5);

function onNoteOn() {
  GuitarFretboard.update(g_panel_fretboard);
}

function onNoteOff() {
  GuitarFretboard.update(g_panel_fretboard);
}

function onController() {

}

function onTimer() {
  GuitarFretboard.update(g_panel_fretboard);
}

function onControl(number, value) {

}

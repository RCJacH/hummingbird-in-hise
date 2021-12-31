Content.makeFrontInterface(600, 150);
Synth.deferCallbacks(true);
include("Interface/GuitarStringText.js");

inline function createStringPanel(index) {
  local name = "String" + index + "Display";
  local widget = Content.addPanel("String" + index + "Display", 0, 20 * (index - 1));
  Content.setPropertiesFromJSON(name, {
    width: 600,
    height: 20,
    borderSize: 0,
    popupOnRightClick: false,
    holdIsRightClick: false,
    textColour: Colours.withAlpha(Colours.white, 1),
  });
  widget.data.values = GuitarStringText.frets;
  widget.setValue(0);
  widget.setPaintRoutine(function(g) {
    g.fillAll(Colours.withAlpha(Colours.black, 1));
    g.setColour(Colours.withAlpha(Colours.white, 1));
    g.setFont("FrozenCrystal", 18);
    g.drawAlignedText(GuitarStringText.frets[this.getValue()], this.getLocalBounds(0), "left");
  });

  return widget
}
const var StringPanels = [];

for (i = 1; i < 7 ; i++) {
  StringPanels[i] = createStringPanel(i);
}

function onNoteOn() {
  switch(Message.getChannel()) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      StringPanels[Message.getChannel()].setValue(g_strings[Message.getChannel()].fret + 1);
      StringPanels[Message.getChannel()].repaint();
      break;
    default:
      break;
  }
}

function onNoteOff() {
  switch(Message.getChannel()) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      StringPanels[Message.getChannel()].setValue(g_strings[Message.getChannel()].fret + 1);
      StringPanels[Message.getChannel()].repaint();
      break;
    default:
      break;
  }
}

function onController() {

}

function onTimer() {

}

function onControl(number, value) {

}

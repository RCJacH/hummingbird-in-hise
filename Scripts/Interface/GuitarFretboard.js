namespace GuitarFretboard {
  const var StringPanels = [];
  const var PickPanels = [];
  const var frets = [
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " 0   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   1   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   2   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   3   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   4   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   5   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   6   -   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   7   -   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   8   -   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   9   -   -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   10  -   -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   11  -   -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   12  -   -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   13  -   -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   14  -   -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   15  -   -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   16  -   -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   17  -   -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   18  -   -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   19  -  ",
    " -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   20 ",
  ];
  const var pick = ["", "^", "v"];

  inline function createStringPanel(index) {
    local widgetName = "String" + index + "Display";
    local widget = Content.addPanel(widgetName, 0, 20 * (index - 1));
    Content.setPropertiesFromJSON(widgetName, {
      width: 600,
      height: 20,
      borderSize: 0,
      popupOnRightClick: false,
      holdIsRightClick: false,
      textColour: Colours.withAlpha(Colours.white, 1),
    });
    widget.data.values = frets;
    widget.setValue(0);
    widget.setPaintRoutine(function(g) {
      g.fillAll(Colours.withAlpha(Colours.black, 1));
      g.setColour(Colours.withAlpha(Colours.white, 1));
      g.setFont("FrozenCrystal", 18);
      g.drawAlignedText(frets[this.getValue()], this.getLocalBounds(0), "left");
    });

    return widget
  }

  inline function createPickPanel(index) {
    local widgetName = "Pick" + index + "Display";
    local widget = Content.addPanel(widgetName, 560, 20 * (index - 1));
    Content.setPropertiesFromJSON(widgetName, {
      width: 40,
      height: 20,
      borderSize: 0,
      popupOnRightClick: false,
      holdIsRightClick: false,
      textColour: Colours.withAlpha(Colours.white, 1),
    });
    widget.data.values = frets;
    widget.setValue(0);
    widget.setPaintRoutine(function(g) {
      g.fillAll(Colours.withAlpha(Colours.black, 1));
      g.setColour(Colours.withAlpha(Colours.white, 1));
      g.setFont("FrozenCrystal", 18);
      g.drawAlignedText(pick[this.getValue()], this.getLocalBounds(0), "left");
    });

    return widget
  }

  inline function setFret(index, fret) {
    local panel = StringPanels[index];
    panel.setValue(fret + 1);
    panel.repaint();
  }

  inline function setPick(index, value) {
    local panel = PickPanels[index];
    panel.setValue(value);
    panel.repaint();
  }

  inline function repaint() {
    for (string in g_strings) {
      setFret(string.index, string.fret);
      // if (string.index <= g_rh.bottomString && string.index >= g_rh.topString) {
      //   setPick(string.index, g_strumKeys.isEmpty() ? 0 : (1 + g_rh.direction == -1 ? g_rh.autoDirection : g_rh.direction));
      // } else {
      //   setPick(string.index, 0);
      // }
    }
  }

  inline function setStrum(top, bottom) {
    for (i=bottom-top; i--;) { setPick(i+top, 0); }
  }

  for (i=7; i--;) { StringPanels[i] = createStringPanel(i); }
  for (i=7; i--;) { PickPanels[i] = createPickPanel(i); }
}

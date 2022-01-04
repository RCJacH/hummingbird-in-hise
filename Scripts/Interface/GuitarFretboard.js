namespace GuitarFretboard {
  const var fretMarkers = "                o     o     o        8        o     o     o       ";
  const var positions = [
    "                                                               ",
    " p                                                             ",
    "    p                                                          ",
    "       p                                                       ",
    "          p                                                    ",
    "             p                                                 ",
    "                p                                              ",
    "                   p                                           ",
    "                      p                                        ",
    "                         p                                     ",
    "                            p                                  ",
    "                               p                               ",
    "                                  p                            ",
    "                                     p                         ",
    "                                        p                      ",
    "                                           p                   ",
    "                                              p                ",
    "                                                 p             ",
    "                                                    p          ",
    "                                                       p       ",
    "                                                          p    ",
    "                                                             p ",
  ];

  const var frets = [
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " 0  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  1  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  2  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  3  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  4  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  5  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  6  -  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  7  -  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  8  -  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  9  -  -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  10 -  -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  11 -  -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  12 -  -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  13 -  -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  14 -  -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  -  15 -  -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  16 -  -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  17 -  -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  18 -  - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  19 - ",
    " |  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  20",
  ];
  const var pick = ["", "^", "v"];

  inline function createFretMarkerPanel() {
    local widgetName = "FretMarkerDisplay";
    local widget = Content.addPanel(widgetName, 0, 0);
    Content.setPropertiesFromJSON(widgetName, {
      width: 800,
      height: 20,
      borderSize: 0,
      popupOnRightClick: false,
      holdIsRightClick: false,
    });
    widget.data.values = positions;
    widget.setPaintRoutine(function(g) {
      g.fillAll(Colours.withAlpha("0x252122", 1));
      g.setColour(Colours.withAlpha(Colours.white, 0.5));
      g.setFont("Lucida Console", 18);
      g.drawAlignedText(fretMarkers, this.getLocalBounds(0), "left");
      g.setColour(Colours.withAlpha(Colours.white, .8));
      g.drawAlignedText(positions[this.getValue()], this.getLocalBounds(0), "left");
    });

    return widget
  }

  inline function createStringPanel(index) {
    local widgetName = "String" + index + "Display";
    local widget = Content.addPanel(widgetName, 0, 20 * index);
    Content.setPropertiesFromJSON(widgetName, {
      width: 800,
      height: 20,
      borderSize: 0,
      popupOnRightClick: false,
      holdIsRightClick: false,
      textColour: Colours.withAlpha(Colours.white, 1),
    });
    widget.data.values = frets;
    widget.setValue(0);
    widget.setPaintRoutine(function(g) {
      g.fillAll(Colours.withAlpha("0x252122", 1));
      g.setColour(Colours.withAlpha(Colours.white, 1));
      g.setFont("Lucida Console", 18);
      g.drawAlignedText(frets[this.getValue()], this.getLocalBounds(0), "left");
    });

    return widget
  }

  inline function createPickPanel(index) {
    local widgetName = "Pick" + index + "Display";
    local widget = Content.addPanel(widgetName, 700, 20 * index);
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
      g.setFont("Lucida Console", 18);
      g.drawAlignedText(pick[this.getValue()], this.getLocalBounds(0), "left");
    });

    return widget
  }

  inline function setFret(panel, fret) {
    panel.setValue(fret + 1);
    panel.repaint();
  }

  inline function setPick(panel, value) {
    panel.setValue(value);
    panel.repaint();
  }

  inline function update(fretboard) {
    for (string in g_strings) {
      setFret(fretboard.strings[string.index], string.fret);
      // if (string.index <= g_rh.bottomString && string.index >= g_rh.topString) {
      //   setPick(fretboard.picks[string.index], g_strumKeys.isEmpty() ? 0 : (1 + g_rh.direction == -1 ? g_rh.autoDirection : g_rh.direction));
      // } else {
      //   setPick(fretboard.picks[string.index], 0);
      // }
    }
    fretboard.fretmarkers.setValue(g_lh.position + 1);
    fretboard.fretmarkers.repaint();
  }

  inline function setStrum(top, bottom) {
    for (i=bottom-top; i--;) { setPick(i+top, 0); }
  }

  inline function createFretboard() {
    local obj = {
      fretmarkers: createFretMarkerPanel(),
      strings: [],
      picks: [],
    };
    for (i=6; i--;) { obj.strings[i+1] = createStringPanel(i+1); }
    for (i=6; i--;) { obj.picks[i+1] = createPickPanel(i+1); }

    return obj
  }

}

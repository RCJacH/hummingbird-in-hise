namespace ChordParser {
  inline function analyzeNotes() {
    
  }

  inline function analyzeChords() {

  }

  inline function analyze() {
    if (g_settings["chordMode"]) {
      analyzeChords();
    } else {
      analyzeNotes();
    }
  }
}

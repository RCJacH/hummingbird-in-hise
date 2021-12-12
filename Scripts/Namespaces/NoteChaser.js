namespace NoteChaser {
    const var midinotes = [];
    midinotes.reserve(128);
    reg minMIDI = 0;
    reg maxMIDI = 1;
    // midinotes.reserve(128);

    inline function isEmpty() {
        return !midinotes.length
    }

    inline function set(note, value) {
        midinotes[note] = value;
    }

    inline function get(note) {
        return midinotes[note]
    }

    inline function clear() {
        for (i = minMIDI; i < maxMIDI; i++) {
            local v = midinotes[i];
            if (v) {
                Synth.noteOffByEventId(midinotes[i]);
            }
        }
        midinotes.clear();
    }

    inline function noteOff(note) {
        // Console.print(midinotes.getValue(note));
        // Synth.noteOffByEventId(midinotes.getValue(note));
        midinotes[note] = undefined;
    }
}

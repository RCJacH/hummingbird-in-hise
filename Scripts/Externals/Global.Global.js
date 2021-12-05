include("Objects/LH.js");
include("Objects/Delays.js");
include('Objects/Noises.js');
include("Objects/RH.js");
include("Objects/GuitarString.js");

global g_delays = Delays();

global g_string1 = GuitarString(1);
global g_string2 = GuitarString(2);
global g_string3 = GuitarString(3);
global g_string4 = GuitarString(4);
global g_string5 = GuitarString(5);
global g_string6 = GuitarString(6);
global g_strings = [null, g_string1, g_string2, g_string3, g_string4, g_string5, g_string6];

global g_lh = LH();
global g_rh = RH();

global g_strumTimer = Engine.createTimerObject();
global g_keyswitchThreshold = 64;
global g_controlEventId = -1;

include('Namespaces/Articulations.js');
include('Namespaces/Noises.js');
include('Namespaces/Velocity.js');
include('Namespaces/RR.js');

const var name = Synth.getIdList('Container')[0];
const var artIndex = Articulations.fromName(name);
const var rrGroups = RR.count(artIndex);

const var muters = [];
for (muter in Synth.getIdList('MidiMuter')) {
  muter = Synth.getMidiProcessor(muter);
  muter.setAttribute(1, 1);
  muters.push(muter);
}

const var samplers = [];
for (sampler in Synth.getIdList('Sampler')) {
  sampler = Synth.getSampler(sampler);
  sampler.enableRoundRobin(rrGroups == 0);
  samplers.push(sampler);
}

function setDirectionMuters(direction) {
  muters[direction].setAttribute(0, 0);
  muters[!direction].setAttribute(0, 1);
}

function setNoise(articulation) {
  Message.setGain(Noises.getVolume(articulation, Message.getVelocity()));
  Message.delayEvent(g_delays.inSamples(Noises.getDelay(articulation)));
}

function treatArticulation() {
  // Console.print(Message.getChannel() + ":" + Message.getNoteNumber() + ":" + Message.getVelocity());
  switch (artIndex) {
    case Articulations.sustain:
    case Articulations.palmMuted:
      setDirectionMuters(g_rh.direction);
      Message.delayEvent(g_delays.pickNoteSamples());
      break;
    case Articulations.pickNoise:
      Message.setStartOffset(g_delays.preAttackSamples());
      setDirectionMuters(g_rh.direction);
      break;
    case Articulations.pickBuzz:
      setNoise('pickBuzz');
      setDirectionMuters(g_rh.direction);
      break;
    case Articulations.fretSlideNoise:
      setNoise('fretSlideNoise');
      setDirectionMuters(0);
      break;
    case Articulations.pickStop:
      setNoise('pickStop');
      break;
  }
}
function onNoteOn() {
  if (Message.getChannel() != artIndex) {
    Message.ignoreEvent(true);
    return;
  }

  if (rrGroups) {
    samplers[g_rh.direction].setActiveGroup(RR.fromVelocity(Message.getVelocity(), artIndex));
    // Message.setGain(Velocity.toDecibel(Message.getVelocity(), articulation == Articulations.palmMuted));
  }
  treatArticulation();
}
function onNoteOff() {

}
function onController() {

}
function onTimer() {
  
}
function onControl(number, value) {
  
}

const var _sustain = [
    124, 119, 114, 109, 104, 99, 94, 89, 82, 75, 68, 59, 49, 34, 19, 0
  ];

const var _muted = [117, 107, 95, 81, 66, 48, 28, 0];
const var _other = [0];

function RR(type) {
  var obj = {};
  obj.splitPoints = type == 1 ? _sustain : type == 2 ? _muted : _other;

  obj.getRR = function(velocity) {
    for (vel in this.splitPoints) {
      if (velocity > vel) {
        return this.splitPoints.indexOf(vel);
      }
    }
  };
  return obj
};

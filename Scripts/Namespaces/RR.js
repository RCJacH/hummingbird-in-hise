namespace RR {
  const var current = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  inline function get(index) {
    return current[index]
  }

  inline function set(index, value) {
    current[index] = value;
  }

  inline function total(index) {
    return g_rr[Articulations.fromIndex(index)]
  }

  inline function next(index, totalRR) {
    current[index] = (current[index] + 1) % totalRR;
  }
}

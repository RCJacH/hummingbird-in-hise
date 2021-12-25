namespace Velocity {
  inline function total(index) {
    return g_velocity[Articulations.fromIndex(index)].length
  }

  inline function getLayer(index, velocity) {
    local splitPoints = g_velocity[Articulations.fromIndex(index)];
    for (vel in splitPoints) {
      if (velocity > vel) {
        return splitPoints.indexOf(vel);
      }
    }
  }
}

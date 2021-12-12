namespace Velocity {
  inline function getLayer(index, velocity) {
    local splitPoints = g_velocity[Articulations.fromIndex(index)];
    for (vel in splitPoints) {
      if (velocity > vel) {
        return splitPoints.indexOf(vel) + 1;
      }
    }
  }
}

namespace RR {
  inline function count(articulation) {
    return g_velocity[articulation].length || 1
  }

  inline function getIndex(velocity, articulation) {
    Console.print(articulation);
    local splitPoints = g_velocity[articulation];
    Console.print(splitPoints);
    for (vel in splitPoints) {
      if (velocity > vel) {
        return splitPoints.indexOf(vel) + 1;
      }
    }
  }
}

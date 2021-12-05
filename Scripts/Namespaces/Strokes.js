namespace Strokes {
  const var downstroke = 0;
  const var upstroke = 1;
  const var omni = -1;

  inline function fromString(s) {
    return s == "D" ? downstroke : s == "U" ? upstroke : omni;
  }
}

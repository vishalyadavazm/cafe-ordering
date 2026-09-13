// Deterministic pseudo-QR grid for demo/mock screens (payment QR, table QR
// cards). Not a real scannable code — swap for a real QR renderer when the
// backend QR endpoint (step 5) is wired up.
export function FakeQR({ seed }: { seed: number }) {
  const N = 11;
  const cells: { x: number; y: number; on: boolean }[] = [];
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const corner = (x < 3 && y < 3) || (x > N - 4 && y < 3) || (x < 3 && y > N - 4);
      const on = corner ? (x === 0 || x === N - 1 || y === 0 || y === N - 1 || (x >= 1 && x <= 1) ? false : true) : rnd() > 0.52;
      cells.push({ x, y, on: corner ? true : on });
    }
  }
  return (
    <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
      <rect width={N} height={N} fill="#fff" />
      {cells.filter((c) => c.on).map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#241C15" />
      ))}
    </svg>
  );
}

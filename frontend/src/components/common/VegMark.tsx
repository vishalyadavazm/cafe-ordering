export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      className="veg-mark"
      style={{ border: `1.5px solid ${veg ? "var(--veg)" : "var(--nonveg)"}` }}
      title={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <i style={{ background: veg ? "var(--veg)" : "var(--nonveg)" }} />
    </span>
  );
}

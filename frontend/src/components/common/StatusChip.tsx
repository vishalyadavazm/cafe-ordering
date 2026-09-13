import type { OrderStatus } from "@/lib/mockData";

const MAP: Record<string, [string, string]> = {
  new: ["c-blue", "New"],
  accepted: ["c-blue", "Accepted"],
  preparing: ["c-amber", "Preparing"],
  ready: ["c-green", "Ready"],
  served: ["c-grey", "Served"],
  cancelled: ["c-red", "Cancelled"],
};

export function StatusChip({ s }: { s: OrderStatus | string }) {
  const [cls, label] = MAP[s] || ["c-grey", s];
  return <span className={"chip " + cls}>{label}</span>;
}

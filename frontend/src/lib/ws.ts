// Thin WebSocket helper (step 10). Reconnects and dispatches order events.
const WS_BASE = import.meta.env.VITE_WS_BASE ?? "/ws";

export function connectWs(path: string, onMessage: (data: unknown) => void): WebSocket {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${proto}://${location.host}${WS_BASE}${path}`);
  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch { onMessage(e.data); }
  };
  return ws;
  // TODO: auto-reconnect with backoff
}

import { http, HttpResponse } from "msw";

// Mock the API so the frontend can be built before the backend is ready.
// Keep these shapes matching docs/API_CONTRACT.md.
export const handlers = [
  http.get("/api/v1/health", () => HttpResponse.json({ status: "ok", db: "mocked" })),
  // TODO: mock /public/:qrToken, orders, etc. as you build each screen.
];

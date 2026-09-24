const API_ORIGIN = "https://api.mangadex.org";
const ALLOWED_ORIGIN = "https://harryerdtz.github.io";
const ALLOWED_PREFIXES = ["/manga", "/at-home"];

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Vary": "Origin"
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders(origin) });
    }

    const incoming = new URL(request.url);
    if (!ALLOWED_PREFIXES.some((prefix) => incoming.pathname.startsWith(prefix))) {
      return new Response("Not found", { status: 404, headers: corsHeaders(origin) });
    }

    const target = API_ORIGIN + incoming.pathname + incoming.search;
    const response = await fetch(target, {
      headers: {
        Accept: "application/json",
        "User-Agent": "MangaLounge/1.0 (https://harryerdtz.github.io/Mangalounge/)"
      }
    });
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders(origin)).forEach(([key, value]) => headers.set(key, value));
    headers.delete("set-cookie");
    return new Response(response.body, { status: response.status, headers });
  }
};

const API_ORIGIN = "https://api.mangadex.org";
const ALLOWED_ORIGIN = "https://harryerdtz.github.io";
const ALLOWED_PREFIXES = ["/manga", "/at-home", "/user"];
const USER_AGENT = "MangaLounge/1.0 (https://harryerdtz.github.io/Mangalounge/)";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    "Vary": "Origin"
  };
}

// Der generische Proxy (API-Katalog) wird von beliebigen Origins aufgerufen
// und liefert öffentliche Inhalte ohne Anmeldedaten aus. Deshalb steht hier "*"
// statt der festen Seite.
function proxyHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Range",
    "Vary": "Origin"
  };
}

// Interne Adressen sperren, damit der Worker nicht als Sprungbrett ins eigene
// Netz dient. Nach außen bleibt er offen, weil fremde Manga-Seiten beliebige
// Hostnamen haben.
function isBlockedHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  if (!host) return true;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (host === "0.0.0.0" || host === "[::1]" || host === "::1") return true;
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[01])\./.test(host)) return true;
  if (/^169\.254\./.test(host)) return true;
  return false;
}

async function proxiedGet(targetUrl, headers) {
  const response = await fetch(targetUrl, { redirect: "follow", headers });
  const out = new Headers(response.headers);
  Object.entries(proxyHeaders()).forEach(([key, value]) => out.set(key, value));
  out.delete("set-cookie");
  out.delete("content-security-policy");
  out.delete("content-security-policy-report-only");
  out.delete("x-frame-options");
  return new Response(response.body, { status: response.status, headers: out });
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    const incoming = new URL(request.url);

    if (request.method === "OPTIONS") {
      // Der generische Weg (Pfad "/") bekommt die offenen Kopfzeilen.
      const headers = (incoming.pathname === "/" || incoming.searchParams.has("url")) ? proxyHeaders() : corsHeaders(origin);
      return new Response(null, { status: 204, headers });
    }
    // Auth-Token-Proxy: Password-Grant laeuft ueber den Worker, damit CORS
    // auf GitHub Pages nicht blockt (localhost war bisher zufaellig erlaubt).
    if (incoming.pathname === "/auth/token" && request.method === "POST") {
      const body = await request.text();
      const resp = await fetch("https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token", {
        method: "POST",
        headers: { "Content-Type": request.headers.get("Content-Type") || "application/x-www-form-urlencoded", "Accept": "application/json", "User-Agent": USER_AGENT },
        body
      });
      const out = new Headers(resp.headers);
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => out.set(k, v));
      out.delete("set-cookie");
      return new Response(resp.body, { status: resp.status, headers: out });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders(origin) });
    }

    // Bilder von MangaDex: Host ist fest erlaubt.
    if (incoming.pathname === "/image") {
      const imageUrl = incoming.searchParams.get("url");
      if (!imageUrl) return new Response("Missing image URL", { status: 400, headers: corsHeaders(origin) });
      const image = new URL(imageUrl);
      const allowedImageHost = image.hostname.endsWith(".mangadex.network") || image.hostname === "uploads.mangadex.org";
      if (image.protocol !== "https:" || !allowedImageHost) {
        return new Response("Image host not allowed", { status: 403, headers: corsHeaders(origin) });
      }
      const response = await fetch(image.href, { headers: { "User-Agent": USER_AGENT } });
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders(origin)).forEach(([key, value]) => headers.set(key, value));
      headers.delete("set-cookie");
      return new Response(response.body, { status: response.status, headers });
    }

    // Generischer Proxy für den API-Katalog: MANGADEX_PROXY_URL + "?url=" + Ziel.
    const target = incoming.searchParams.get("url");
    if (target) {
      let parsed;
      try { parsed = new URL(target); } catch (e) { parsed = null; }
      if (!parsed || parsed.protocol !== "https:" || isBlockedHost(parsed.hostname)) {
        return new Response("Target not allowed", { status: 403, headers: proxyHeaders() });
      }
      const headers = {
        "User-Agent": USER_AGENT,
        "Accept": request.headers.get("Accept") || "*/*",
        // Ohne Referer liefern viele Seiten ihre Bilder nicht aus.
        "Referer": parsed.origin + "/"
      };
      const range = request.headers.get("Range");
      if (range) headers["Range"] = range;
      return proxiedGet(parsed.href, headers);
    }

    // MangaDex-API (Such- und Kapitel-Antworten) unverändert.
    if (!ALLOWED_PREFIXES.some((prefix) => incoming.pathname.startsWith(prefix))) {
      return new Response("Not found", { status: 404, headers: corsHeaders(origin) });
    }
    const apiTarget = API_ORIGIN + incoming.pathname + incoming.search;
    const apiHeaders = { Accept: "application/json", "User-Agent": USER_AGENT };
    const auth = request.headers.get("Authorization");
    if (auth) apiHeaders["Authorization"] = auth;
    const response = await fetch(apiTarget, { headers: apiHeaders });
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders(origin)).forEach(([key, value]) => headers.set(key, value));
    headers.delete("set-cookie");
    return new Response(response.body, { status: response.status, headers });
  }
};

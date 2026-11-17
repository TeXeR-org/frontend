// Liveness for the platform's health check (railway.toml's healthcheckPath): 200 whenever the server answers. It reads nothing and calls nothing, so a slow API never holds back a deploy of the site.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ name: "TeXeR", status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}

"use client";

import { projectsAPI } from "@/lib/api";

/** The preview's width in pixels: sharp on a grid card at twice the density, and a few dozen kilobytes. */
const WIDTH = 480;
/** At most one preview per project in this long, however often it compiles. */
const EVERY_MS = 30_000;
const lastSaved = new Map<string, number>();

/** The first page of a PDF as a small image (a data URL): what the projects grid shows. The page is drawn on white, as it prints. */
export async function firstPageImage(data: Uint8Array): Promise<string | null> {
  const { pdfjs } = await import("react-pdf");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({ data });
  const pdf = await task.promise;
  try {
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: WIDTH / base.width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const webp = canvas.toDataURL("image/webp", 0.82);
    // A browser without WebP encoding answers with a PNG; a JPEG keeps it small.
    return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.8);
  } finally {
    void task.destroy();
  }
}

/** Keeps a picture of the project's first page after a successful compile, for the projects grid. Quietly does nothing when it cannot (no edit access, a page pdf.js cannot draw). Returns when it was saved, or null. */
export async function saveProjectThumbnail(uid: string, pdf: Uint8Array, { force = false } = {}): Promise<string | null> {
  const now = Date.now();
  if (!force && now - (lastSaved.get(uid) ?? 0) < EVERY_MS) return null;
  lastSaved.set(uid, now);
  try {
    const image = await firstPageImage(pdf);
    if (!image) return null;
    const { thumbnailAt } = await projectsAPI.uploadThumbnail(uid, image);
    return thumbnailAt;
  } catch {
    return null;
  }
}

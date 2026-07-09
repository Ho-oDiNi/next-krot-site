import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";
import { resolvePublicImagePath } from "@/shared/lib/file-storage";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
};

interface UploadRouteContext {
    params:
        | {
              path: string[];
          }
        | Promise<{
              path: string[];
          }>;
}

export async function GET(_request: Request, context: UploadRouteContext) {
    const params = await context.params;
    const publicUrl = `/upload/${params.path.join("/")}`;
    const filePath = resolvePublicImagePath(publicUrl);

    if (!filePath) {
        return new NextResponse("Not found", { status: 404 });
    }

    try {
        const buffer = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not found", { status: 404 });
    }
}

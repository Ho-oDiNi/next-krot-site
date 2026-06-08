import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PUBLIC_IMAGES_DIR = path.join(
    process.cwd(),
    "storage",
    "public-images",
);

const resolvePublicImagesDir = (): string => {
    const configuredDir = process.env.PUBLIC_IMAGES_DIR?.trim();

    if (!configuredDir) {
        return DEFAULT_PUBLIC_IMAGES_DIR;
    }

    return path.isAbsolute(configuredDir)
        ? configuredDir
        : path.resolve(process.cwd(), configuredDir);
};

const getContentType = (filePath: string): string => {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".webp":
            return "image/webp";
        case ".gif":
            return "image/gif";
        case ".svg":
            return "image/svg+xml";
        default:
            return "application/octet-stream";
    }
};

type RouteContext = {
    params: Promise<{
        path: string[];
    }>;
};

export async function GET(
    _request: Request,
    context: RouteContext,
): Promise<Response> {
    const { path: segments } = await context.params;

    if (!segments?.length) {
        return new Response("Not found", { status: 404 });
    }

    const baseDir = resolvePublicImagesDir();
    const relativePath = segments.join("/");
    const filePath = path.resolve(baseDir, relativePath);

    const normalizedBaseDir = baseDir.endsWith(path.sep)
        ? baseDir
        : `${baseDir}${path.sep}`;

    if (!filePath.startsWith(normalizedBaseDir)) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const file = await fs.readFile(filePath);

        return new Response(file, {
            status: 200,
            headers: {
                "Content-Type": getContentType(filePath),
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return new Response("Not found", { status: 404 });
        }

        throw error;
    }
}

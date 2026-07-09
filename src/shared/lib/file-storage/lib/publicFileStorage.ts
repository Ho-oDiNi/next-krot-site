import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

const PUBLIC_IMAGES_PATH = "/upload";

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

const getPublicImagesPath = (): string =>
    PUBLIC_IMAGES_PATH.endsWith("/")
        ? PUBLIC_IMAGES_PATH.slice(0, -1)
        : PUBLIC_IMAGES_PATH;

const ensurePublicImagesDir = async (): Promise<void> => {
    await fs.mkdir(resolvePublicImagesDir(), { recursive: true });
};

const sanitizeFileBase = (fileName: string): string => {
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const sanitized = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return sanitized || "image";
};

export const resolvePublicImagePath = (publicUrl: string): string | null => {
    const publicPath = getPublicImagesPath();
    const normalizedPublicUrl = publicUrl.startsWith("/")
        ? publicUrl
        : `/${publicUrl}`;

    if (!normalizedPublicUrl.startsWith(`${publicPath}/`)) {
        return null;
    }

    const relativePath = normalizedPublicUrl
        .slice(publicPath.length + 1)
        .trim();

    if (!relativePath) {
        return null;
    }

    const baseDir = resolvePublicImagesDir();
    const absolutePath = path.resolve(baseDir, relativePath);
    const normalizedBaseDir = baseDir.endsWith(path.sep)
        ? baseDir
        : `${baseDir}${path.sep}`;

    if (!absolutePath.startsWith(normalizedBaseDir)) {
        return null;
    }

    return absolutePath;
};

export const savePublicImage = async (file: File): Promise<string> => {
    await ensurePublicImagesDir();

    const extension = path.extname(file.name).toLowerCase() || ".bin";
    const baseName = sanitizeFileBase(file.name);
    const fileName = `${baseName}-${Date.now()}-${crypto.randomUUID()}${extension}`;
    const filePath = path.join(resolvePublicImagesDir(), fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, buffer);

    return `${getPublicImagesPath()}/${fileName}`;
};

export const removePublicFile = async (
    publicUrl?: string | null,
): Promise<void> => {
    if (!publicUrl) {
        return;
    }

    const resolvedPath = resolvePublicImagePath(publicUrl);

    if (!resolvedPath) {
        return;
    }

    try {
        await fs.unlink(resolvedPath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
        }
    }
};

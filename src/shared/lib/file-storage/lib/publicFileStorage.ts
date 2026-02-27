import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

const CATEGORY_IMAGES_PUBLIC_PATH = "/images";
const DEFAULT_CATEGORY_IMAGES_DIR = path.join(
    process.cwd(),
    "public",
    "images",
);

const resolveCategoryImagesDir = (): string => {
    const configuredDir = process.env.CATEGORY_IMAGES_DIR?.trim();

    if (!configuredDir) {
        return DEFAULT_CATEGORY_IMAGES_DIR;
    }

    return path.isAbsolute(configuredDir)
        ? configuredDir
        : path.resolve(process.cwd(), configuredDir);
};

const getCategoryImagesPublicPath = (): string =>
    CATEGORY_IMAGES_PUBLIC_PATH.endsWith("/")
        ? CATEGORY_IMAGES_PUBLIC_PATH.slice(0, -1)
        : CATEGORY_IMAGES_PUBLIC_PATH;

const ensureCategoryImagesDir = async (): Promise<void> => {
    await fs.mkdir(resolveCategoryImagesDir(), { recursive: true });
};

const sanitizeFileBase = (fileName: string): string => {
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const sanitized = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return sanitized || "category";
};

export const resolveCategoryImagePath = (publicUrl: string): string | null => {
    const publicPath = getCategoryImagesPublicPath();
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

    const baseDir = resolveCategoryImagesDir();
    const absolutePath = path.resolve(baseDir, relativePath);
    const normalizedBaseDir = baseDir.endsWith(path.sep)
        ? baseDir
        : `${baseDir}${path.sep}`;

    if (!absolutePath.startsWith(normalizedBaseDir)) {
        return null;
    }

    return absolutePath;
};

export const saveCategoryImage = async (file: File): Promise<string> => {
    await ensureCategoryImagesDir();

    const extension = path.extname(file.name) || ".bin";
    const baseName = sanitizeFileBase(file.name);
    const fileName = `${baseName}-${Date.now()}-${crypto.randomUUID()}${extension}`;
    const filePath = path.join(resolveCategoryImagesDir(), fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, buffer);

    return `${getCategoryImagesPublicPath()}/${fileName}`;
};

export const removePublicFile = async (
    publicUrl?: string | null,
): Promise<void> => {
    if (!publicUrl) {
        return;
    }

    const resolvedPath = resolveCategoryImagePath(publicUrl);

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

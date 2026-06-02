import { NextRequest, NextResponse } from "next/server";

import {
    PUBLIC_IMAGE_MAX_SIZE_BYTES,
    PUBLIC_IMAGE_MAX_SIZE_LABEL,
} from "@/shared/lib/file-storage/config";
import { savePublicImage } from "@/shared/lib/file-storage";

export const runtime = "nodejs";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    message: "Файл не передан",
                },
                {
                    status: 400,
                },
            );
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return NextResponse.json(
                {
                    message:
                        "Можно загружать только изображения JPG, PNG, WEBP или GIF",
                },
                {
                    status: 400,
                },
            );
        }

        if (file.size > PUBLIC_IMAGE_MAX_SIZE_BYTES) {
            return NextResponse.json(
                {
                    message: `Размер изображения не должен превышать ${PUBLIC_IMAGE_MAX_SIZE_LABEL}`,
                },
                {
                    status: 400,
                },
            );
        }

        const url = await savePublicImage(file);

        return NextResponse.json({
            url,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Не удалось загрузить изображение",
            },
            {
                status: 500,
            },
        );
    }
}

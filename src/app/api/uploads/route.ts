import { savePublicImage } from "@/shared/lib/file-storage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { message: "Файл не передан" },
                { status: 400 },
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "Можно загружать только изображения" },
                { status: 400 },
            );
        }

        const url = await savePublicImage(file);

        return NextResponse.json({ url });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Не удалось загрузить изображение" },
            { status: 500 },
        );
    }
}

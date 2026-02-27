import { NextResponse } from "next/server";
import { getCategories } from "@/entities/category";

export const revalidate = 0;

export async function GET() {
    try {
        const categories = await getCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Не удалось загрузить категории услуг", error);
        return NextResponse.json(
            { message: "Не удалось загрузить категории" },
            { status: 500 },
        );
    }
}

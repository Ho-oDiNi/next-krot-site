import { getAuthors } from "@/entities/author/api";
import { NextResponse } from "next/server";

export const GET = async () => {
    const authors = await getAuthors();

    return NextResponse.json(authors);
};

import { getTags } from "@/entities/tag/api";
import { NextResponse } from "next/server";

export const GET = async () => {
    const tags = await getTags();

    return NextResponse.json(tags);
};

import { getMockTags } from "@/widgets/article-grid/config";
import { NextResponse } from "next/server";

export const GET = async () => {
    const tags = await getMockTags();

    return NextResponse.json(tags);
};

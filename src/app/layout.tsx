// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "./globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";

import { Header } from "@/widgets/layout-header";
import { FontMontserrat } from "@/shared/lib/fonts";
import { YandexMetrika } from "@/core/analytics";
import { cn } from "@/shared/lib/cn";
import { TagMap } from "@/shared/ui/TagMap/ui/TagMap";
import { SocialLinks } from "@/shared/ui/SocialLinks";

export const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: {
            default: `Кроссхаб Российских Онлайн Технологий — КРОТ`,
            template: `%s `,
        },
        description: `-`,
    };
};

const RootLayout = async ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    return (
        <html lang="ru">
            <body
                className={cn(
                    FontMontserrat.className,
                    "bg-gray-200 antialiased",
                )}
            >
                <YandexMetrika />

                <Header />

                <div className="mx-auto mt-19 flex w-full max-w-360 justify-between gap-8 px-4 md:mt-26">
                    <aside className="hidden w-58 shrink-0 lg:block">
                        <div className="sticky top-44 space-y-10">
                            <TagMap />
                            <SocialLinks />
                        </div>
                    </aside>

                    <main className="min-w-0 flex-1 lg:max-w-3xl">
                        {children}
                    </main>

                    <aside className="hidden w-58 shrink-0 lg:block" />
                </div>
            </body>
        </html>
    );
};

export default RootLayout;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "./globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";

import { Footer } from "@/widgets/layout-footer";
import { Header } from "@/widgets/layout-header";
import { FontMontserrat } from "@/shared/lib/fonts";
import { YandexMetrika } from "@/core/analytics";
import { cn } from "@/shared/lib/cn";

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
                <div className="flex-between mt-19 md:mt-26">
                    <aside></aside>
                    <main className="px-2 text-neutral-900 md:max-w-3xl">
                        {children}
                    </main>
                    <aside></aside>
                </div>
            </body>
        </html>
    );
};

export default RootLayout;

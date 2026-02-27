import "./globals.css";
import { Metadata } from "next";
import React from "react";

import { Footer } from "@/widgets/layout-footer";
import { Header } from "@/widgets/layout-header";
import FontRoboto from "@/shared/lib/font-roboto";
import { YandexMetrika } from "@/core/analytics";

import { getDomainCity } from "@/core/domains";

export const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: {
            default: `Кроссхаб Российских Онлайн-Технологий — КРОТ`,
            template: `%s `,
        },
        description: `Профессиональные услуги промышленных альпинистов. Ремонт межпанельных швов, герметизация, монтаж и демонтаж на высоте. Гарантия качества.`,
    };
};

const RootLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const domainCity = await getDomainCity();
    return (
        <html lang="ru">
            <body className={`${FontRoboto.className} antialiased`}>
                <YandexMetrika />

                <Header cityName={domainCity.name} />
                <main className="text-neutral-900">{children}</main>

                <Footer />
            </body>
        </html>
    );
};

export default RootLayout;

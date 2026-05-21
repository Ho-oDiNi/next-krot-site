import {
    Roboto_Condensed as RobotoCondensed,
    Montserrat,
} from "next/font/google";

export const FontRoboto = RobotoCondensed({
    variable: "--font-roboto",
    subsets: ["cyrillic"],
});

export const FontMontserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["cyrillic"],
});

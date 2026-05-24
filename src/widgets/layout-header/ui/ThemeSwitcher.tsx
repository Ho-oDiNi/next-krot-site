"use client";

import { useEffect } from "react";

import MoonIcon from "@icons/moon-black.svg";
import SunIcon from "@icons/sun-white.svg";

const THEME_STORAGE_KEY = "theme";

type Theme = "light" | "dark";

const getPreferredTheme = (): Theme => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const ThemeSwitcher = () => {
    useEffect(() => {
        applyTheme(getPreferredTheme());
    }, []);

    const handleToggleTheme = () => {
        const isDark = document.documentElement.classList.contains("dark");
        const nextTheme: Theme = isDark ? "light" : "dark";

        applyTheme(nextTheme);
    };

    return (
        <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Сменить тему оформления"
            className="rounded-full p-2 text-gray-900 transition dark:text-white"
        >
            <MoonIcon className="size-6 dark:hidden" />
            <SunIcon className="hidden size-6 dark:block" />
        </button>
    );
};

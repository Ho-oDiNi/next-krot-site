export type ClassNameValue = string | boolean | null | undefined;

export const cn = (...classes: ClassNameValue[]): string => {
    return classes.filter(Boolean).join(" ");
};

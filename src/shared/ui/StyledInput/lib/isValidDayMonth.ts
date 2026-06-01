export const isValidDayMonth = (value: string) => {
    const match = /^(\d{2})\.(\d{2})$/.exec(value);
    if (!match) return false;

    const day = Number(match[1]);
    const month = Number(match[2]);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const year = new Date().getFullYear();
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
};

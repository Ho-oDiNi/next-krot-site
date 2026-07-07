const MOSCOW_TIME_ZONE = "Europe/Moscow";
const MOSCOW_UTC_OFFSET_HOURS = 3;

const padDatePart = (value: number) => String(value).padStart(2, "0");

export const formatDateToMoscowDateTimeInput = (date: Date | null) => {
    if (!date) {
        return "";
    }

    const moscowDateParts = new Intl.DateTimeFormat("ru-RU", {
        timeZone: MOSCOW_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(date);

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
        moscowDateParts.find((part) => part.type === type)?.value ?? "";

    return `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart("hour")}:${getPart("minute")}`;
};

export const getCurrentMoscowDateTimeInput = () => {
    const now = new Date();
    const moscowTimestamp =
        now.getTime() + MOSCOW_UTC_OFFSET_HOURS * 60 * 60 * 1000;
    const moscowDate = new Date(moscowTimestamp);

    return `${moscowDate.getUTCFullYear()}-${padDatePart(
        moscowDate.getUTCMonth() + 1,
    )}-${padDatePart(moscowDate.getUTCDate())}T${padDatePart(
        moscowDate.getUTCHours(),
    )}:${padDatePart(moscowDate.getUTCMinutes())}`;
};

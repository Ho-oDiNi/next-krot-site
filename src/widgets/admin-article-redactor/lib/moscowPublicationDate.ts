const MOSCOW_TIME_ZONE = "Europe/Moscow";
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

export const getPublicationDateInputValue = (dateTimeValue: string) => {
    const [, datePart] = dateTimeValue.match(/^(\d{4}-\d{2}-\d{2})T/) ?? [];

    if (!datePart) {
        return "";
    }

    const [, month, day] = datePart.split("-");

    return `${day}.${month}`;
};

export const getPublicationTimeInputValue = (dateTimeValue: string) => {
    const [, timePart] = dateTimeValue.match(/T(\d{2}:\d{2})$/) ?? [];

    return timePart ?? "";
};

export const combineMoscowPublicationDateTime = ({
    currentDateTimeValue,
    dateValue,
    timeValue,
}: {
    currentDateTimeValue: string;
    dateValue: string;
    timeValue: string;
}) => {
    if (!dateValue) {
        return "";
    }

    const [day, month] = dateValue.split(".");

    if (!day || !month || day.length !== 2 || month.length !== 2) {
        return currentDateTimeValue;
    }

    const currentYear = new Date().getFullYear();
    const [savedDatePart = ""] = currentDateTimeValue.split("T");
    const [savedYear] = savedDatePart.split("-");
    const year = savedYear || String(currentYear);
    const normalizedTime = timeValue.length === 5 ? timeValue : "00:00";

    return `${year}-${month}-${day}T${normalizedTime}`;
};

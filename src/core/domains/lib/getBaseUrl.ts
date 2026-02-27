import { DEFAULT_CITY } from "../config";
import { getDomainCity } from "./getDomainCity";

export const getBaseUrl = async () => {
    const domainCity = await getDomainCity();
    return domainCity === DEFAULT_CITY
        ? "https://alpforce.ru"
        : `https://${domainCity.slug}.alpforce.ru`;
};

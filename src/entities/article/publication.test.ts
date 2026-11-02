import { getArticleDisplayDate, isArticleAvailableForPublication } from "./lib";
import { resolvePublicationDateForSave } from "./publication";

const slot = new Date("2026-10-22T09:30:42.123Z");

test("a scheduled article becomes available without losing its exact publication slot", () => {
    expect(
        isArticleAvailableForPublication(
            true,
            slot,
            new Date(slot.getTime() - 1),
        ),
    ).toBe(false);
    expect(isArticleAvailableForPublication(true, slot, slot)).toBe(true);
    expect(
        isArticleAvailableForPublication(true, slot, new Date("2026-11-01")),
    ).toBe(true);
    expect(
        isArticleAvailableForPublication(false, slot, new Date("2026-11-01")),
    ).toBe(false);
    expect(
        resolvePublicationDateForSave({
            isPublished: true,
            requestedPublishedAt: null,
            existingPublishedAt: slot,
            wasAlreadyPublished: true,
        }),
    ).toBe(slot);
});

test("editing through a minute-precision input preserves seconds and milliseconds", () => {
    expect(
        resolvePublicationDateForSave({
            isPublished: true,
            requestedPublishedAt: new Date("2026-10-22T09:30:00Z"),
            existingPublishedAt: slot,
            wasAlreadyPublished: true,
        }),
    ).toBe(slot);
});

test("first immediate publication records now and a future schedule keeps its slot", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-01"));
    try {
        expect(
            resolvePublicationDateForSave({
                isPublished: true,
                requestedPublishedAt: null,
            }),
        ).toEqual(new Date());
        expect(
            resolvePublicationDateForSave({
                isPublished: true,
                requestedPublishedAt: slot,
            }),
        ).toBe(slot);
    } finally {
        jest.useRealTimers();
    }
});

test("display dates accept JSON strings and ignore subsequent edits", () => {
    expect(
        getArticleDisplayDate({
            publishedAt: slot.toISOString(),
            createdAt: "2026-09-01",
            updatedAt: "2026-11-01",
        }),
    ).toEqual(slot);
});

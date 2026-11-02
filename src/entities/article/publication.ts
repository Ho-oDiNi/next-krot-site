/**
 * Вычисляет итоговую дату публикации `publishedAt`:
 * - при первой публикации (`isPublished: true` и `publishedAt` пустой) фиксирует текущее время `new Date()`,
 * - при редактировании уже опубликованной статьи сохраняет прежнюю дату `existingPublishedAt` (если явно не задана новая),
 * - для черновиков запрещает указывать отложенную дату в прошлом.
 */
export const resolvePublicationDateForSave = ({
    isPublished,
    requestedPublishedAt,
    existingPublishedAt = null,
    wasAlreadyPublished = false,
}: {
    isPublished: boolean;
    requestedPublishedAt: Date | null;
    existingPublishedAt?: Date | null;
    wasAlreadyPublished?: boolean;
}): Date | null => {
    if (!isPublished) {
        return requestedPublishedAt ?? existingPublishedAt ?? null;
    }

    if (!requestedPublishedAt) {
        return existingPublishedAt ?? new Date();
    }

    const isSameAsExistingDate =
        existingPublishedAt !== null &&
        Math.floor(requestedPublishedAt.getTime() / 60_000) ===
            Math.floor(existingPublishedAt.getTime() / 60_000);

    // The editor only sends minutes; keep the original seconds and milliseconds.
    if (isSameAsExistingDate) {
        return existingPublishedAt;
    }

    if (
        !wasAlreadyPublished &&
        !isSameAsExistingDate &&
        requestedPublishedAt.getTime() < Date.now() - 60_000
    ) {
        throw new Error(
            "Отложенная публикация не может быть раньше текущего времени",
        );
    }

    return requestedPublishedAt;
};

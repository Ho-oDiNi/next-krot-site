export const isArticleAvailableForPublication = (
    isPublished: boolean,
    publishedAt: Date | string | null,
    now = new Date(),
) => {
    if (!isPublished) {
        return false;
    }

    if (!publishedAt) {
        return true;
    }

    return new Date(publishedAt).getTime() <= now.getTime();
};

export const getPublishedArticleWhere = () => ({
    isPublished: true,
    OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
});

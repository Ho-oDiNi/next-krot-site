"use client";

import {
    ChangeEvent,
    FormEvent,
    useCallback,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";

import type { Author } from "@/entities/author";
import type { Tag } from "@/entities/tag";
import {
    PUBLIC_IMAGE_MAX_SIZE_BYTES,
    PUBLIC_IMAGE_MAX_SIZE_LABEL,
} from "@/shared/lib/file-storage/config";
import QuillEditor from "@/shared/lib/react-quill";
import StatusMessage from "@/shared/ui/StatusMessage";
import {
    DateInput,
    StyledInput,
    StyledTextarea,
    TimeInput,
} from "@/shared/ui/StyledInput";
import { updateArticle } from "@/widgets/admin-article-redactor/api/updateArticle";
import {
    combineMoscowPublicationDateTime,
    getCurrentMoscowDateTimeInput,
    getPublicationDateInputValue,
    getPublicationTimeInputValue,
} from "@/widgets/admin-article-redactor/lib/moscowPublicationDate";
import type {
    ArticleRedactorFormData,
    UpdateArticleResult,
} from "@/widgets/admin-article-redactor/model";

import ArrowDownIcon from "@icons/arrow-down.svg";

interface AdminArticleRedactorProps {
    article: ArticleRedactorFormData;
    authors: Author[];
    availableTags: Tag[];
}

const SLUG_MAX_LENGTH = 60;
const META_DESCRIPTION_MAX_LENGTH = 160;

const transliterationMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
};

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const transliterate = (value: string) =>
    value
        .toLowerCase()
        .split("")
        .map((char) => transliterationMap[char] ?? char)
        .join("");

const trimSlugByLength = (slug: string) => {
    if (slug.length <= SLUG_MAX_LENGTH) {
        return slug;
    }

    const truncatedSlug = slug.slice(0, SLUG_MAX_LENGTH).replace(/-+$/g, "");
    const lastSeparatorIndex = truncatedSlug.lastIndexOf("-");

    return lastSeparatorIndex > 0
        ? truncatedSlug.slice(0, lastSeparatorIndex)
        : truncatedSlug;
};

const createSlugFromTitle = (title: string) => {
    const slug = transliterate(title)
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, "");

    return trimSlugByLength(slug);
};

const getFirstParagraphText = (html: string) => {
    if (typeof DOMParser !== "undefined") {
        const document = new DOMParser().parseFromString(html, "text/html");
        const paragraphs = Array.from(document.body.querySelectorAll("p"));
        const firstParagraph = paragraphs
            .map((paragraph) => normalizeText(paragraph.textContent ?? ""))
            .find(Boolean);

        return firstParagraph ?? normalizeText(document.body.textContent ?? "");
    }

    const firstParagraphMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
    const text = firstParagraphMatch?.[1] ?? html;

    return normalizeText(text.replace(/<[^>]*>/g, " "));
};

const createMetaDescription = (mainText: string) => {
    const firstParagraph = getFirstParagraphText(mainText);

    if (firstParagraph.length <= META_DESCRIPTION_MAX_LENGTH) {
        return firstParagraph;
    }

    const limitedDescription = firstParagraph.slice(
        0,
        META_DESCRIPTION_MAX_LENGTH,
    );

    const sentenceEndMatches = Array.from(
        limitedDescription.matchAll(/[.!?…]+(?=[\s"'»”’\)\]]|$)/g),
    );

    const lastSentenceEndMatch = sentenceEndMatches.at(-1);

    if (lastSentenceEndMatch?.index !== undefined) {
        let endIndex =
            lastSentenceEndMatch.index + lastSentenceEndMatch[0].length;

        while (
            endIndex < firstParagraph.length &&
            endIndex < META_DESCRIPTION_MAX_LENGTH &&
            /["'»”’\)\]]/.test(firstParagraph[endIndex])
        ) {
            endIndex += 1;
        }

        return firstParagraph.slice(0, endIndex).trim();
    }

    const lastSpaceIndex = limitedDescription.lastIndexOf(" ");

    return (
        lastSpaceIndex > 0
            ? limitedDescription.slice(0, lastSpaceIndex)
            : limitedDescription
    ).trim();
};

const fillEmptyMetaFields = (data: ArticleRedactorFormData) => ({
    ...data,
    slug: data.slug.trim() || createSlugFromTitle(data.title),
    metaTitle: data.metaTitle.trim() || data.title.trim(),
    metaDescription:
        data.metaDescription.trim() || createMetaDescription(data.mainText),
});

export const AdminArticleRedactor = ({
    article,
    authors,
    availableTags,
}: AdminArticleRedactorProps) => {
    const router = useRouter();

    const [formData, setFormData] = useState<ArticleRedactorFormData>(article);
    const [status, setStatus] = useState<UpdateArticleResult | null>(null);
    const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
    const [isMetaOpen, setIsMetaOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const updateField = useCallback(
        <K extends keyof ArticleRedactorFormData>(
            field: K,
            value: ArticleRedactorFormData[K],
        ) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        [],
    );

    const updatePublicationDateTime = useCallback(
        ({
            dateValue,
            timeValue,
        }: {
            dateValue?: string;
            timeValue?: string;
        }) => {
            setFormData((prev) => ({
                ...prev,
                publishedAtMoscow: combineMoscowPublicationDateTime({
                    currentDateTimeValue: prev.publishedAtMoscow,
                    dateValue:
                        dateValue ??
                        getPublicationDateInputValue(prev.publishedAtMoscow),
                    timeValue:
                        timeValue ??
                        getPublicationTimeInputValue(prev.publishedAtMoscow),
                }),
            }));
        },
        [],
    );

    const handleMainTextChange = useCallback(
        (value: string) => {
            updateField("mainText", value);
        },
        [updateField],
    );

    const handlePreviewImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            setPreviewImageFile(null);
            return;
        }

        if (file.size > PUBLIC_IMAGE_MAX_SIZE_BYTES) {
            setStatus({
                success: false,
                message: `Размер изображения не должен превышать ${PUBLIC_IMAGE_MAX_SIZE_LABEL}`,
            });
            setPreviewImageFile(null);
            event.target.value = "";
            return;
        }

        setStatus(null);
        setPreviewImageFile(file);
    };

    const saveArticle = (isPublished: boolean) => {
        setStatus(null);

        const articleToSave = fillEmptyMetaFields({
            ...formData,
            publishedAtMoscow:
                isPublished && !formData.publishedAtMoscow
                    ? getCurrentMoscowDateTimeInput()
                    : formData.publishedAtMoscow,
        });
        setFormData(articleToSave);

        startTransition(() => {
            void (async () => {
                try {
                    const result = await updateArticle({
                        originalSlug: articleToSave.originalSlug,
                        slug: articleToSave.slug,
                        title: articleToSave.title,
                        metaTitle: articleToSave.metaTitle,
                        metaDescription: articleToSave.metaDescription,
                        previewImg: articleToSave.previewImg || null,
                        previewImageFile,
                        mainText: articleToSave.mainText,
                        isPublished,
                        publishedAtMoscow: articleToSave.publishedAtMoscow,
                        authorId: articleToSave.authorId,
                        tagIds: articleToSave.tagIds,
                    });

                    setStatus(result);

                    if (result.success && result.slug) {
                        setPreviewImageFile(null);

                        setFormData((prev) => ({
                            ...prev,
                            ...articleToSave,
                            isPublished,
                            publishedAtMoscow: articleToSave.publishedAtMoscow,
                            originalSlug: result.slug ?? prev.originalSlug,
                            slug: result.slug ?? articleToSave.slug,
                        }));

                        router.replace(
                            `/admin/redactor/article/${result.slug}`,
                        );
                        router.refresh();
                    }
                } catch (error) {
                    setStatus({
                        success: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "Ошибка сохранения статьи",
                    });
                }
            })();
        });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        saveArticle(formData.isPublished);
    };

    const handlePublicationToggle = () => {
        saveArticle(!formData.isPublished);
    };

    const handleTagToggle = (tagId: number) => {
        setFormData((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((selectedTagId) => selectedTagId !== tagId)
                : [...prev.tagIds, tagId],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 rounded-3xl bg-white p-6 dark:bg-gray-900">
                <div className="grid gap-4 rounded-2xl bg-gray-50 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
                        <button
                            type="button"
                            onClick={() => setIsMetaOpen((prev) => !prev)}
                            aria-expanded={isMetaOpen}
                            aria-controls="article-meta-fields"
                            className="flex w-full items-center justify-between gap-4 text-left"
                        >
                            <div>
                                <span className="block text-sm font-semibold text-black dark:text-white">
                                    Meta
                                </span>

                                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                    Slug, Meta Title и Meta Description
                                </span>
                            </div>

                            <ArrowDownIcon
                                className={`h-5 w-5 shrink-0 text-gray-500 transition-transform dark:text-gray-300 ${
                                    isMetaOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isMetaOpen && (
                            <div
                                id="article-meta-fields"
                                className="mt-4 grid gap-4"
                            >
                                <StyledInput
                                    id="article-slug"
                                    label="Slug"
                                    type="text"
                                    value={formData.slug}
                                    onChange={(event) =>
                                        updateField("slug", event.target.value)
                                    }
                                />

                                <StyledTextarea
                                    id="article-meta-title"
                                    label="Meta Title"
                                    value={formData.metaTitle}
                                    onChange={(event) =>
                                        updateField(
                                            "metaTitle",
                                            event.target.value,
                                        )
                                    }
                                    rows={2}
                                />

                                <StyledTextarea
                                    id="article-meta-description"
                                    label="Meta Description"
                                    value={formData.metaDescription}
                                    onChange={(event) =>
                                        updateField(
                                            "metaDescription",
                                            event.target.value,
                                        )
                                    }
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>
                    <label className="space-y-2">
                        <span className="block text-gray-400">Автор</span>

                        <div className="relative">
                            <select
                                value={formData.authorId}
                                onChange={(event) =>
                                    updateField(
                                        "authorId",
                                        Number(event.target.value),
                                    )
                                }
                                className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 font-medium text-black transition outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                required
                            >
                                <option value="" disabled>
                                    Выберите автора
                                </option>

                                {authors.map((availableAuthor) => (
                                    <option
                                        key={availableAuthor.id}
                                        value={availableAuthor.id}
                                    >
                                        {availableAuthor.name}
                                    </option>
                                ))}
                            </select>

                            <ArrowDownIcon className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-300" />
                        </div>
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <DateInput
                            id="article-publication-date"
                            label="Дата публикации (МСК)"
                            value={getPublicationDateInputValue(
                                formData.publishedAtMoscow,
                            )}
                            onChange={(dateValue) =>
                                updatePublicationDateTime({ dateValue })
                            }
                        />

                        <TimeInput
                            id="article-publication-time"
                            label="Время публикации (МСК)"
                            value={getPublicationTimeInputValue(
                                formData.publishedAtMoscow,
                            )}
                            onChange={(timeValue) =>
                                updatePublicationDateTime({ timeValue })
                            }
                        />
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Если указать будущее время и нажать «Опубликовать»,
                        статья появится на сайте только после наступления этого
                        времени по Москве.
                    </p>

                    <div className="space-y-2">
                        <span className="block text-gray-400">Темы</span>

                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => {
                                const isSelected = formData.tagIds.includes(
                                    tag.id,
                                );

                                return (
                                    <label
                                        key={tag.id}
                                        className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                            isSelected
                                                ? "border-slate-950 bg-slate-800 text-white dark:border-white dark:bg-white dark:text-black"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                handleTagToggle(tag.id)
                                            }
                                            className="sr-only"
                                        />

                                        {tag.name}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <label className="space-y-2 text-sm font-medium text-black dark:text-white">
                    <span className="block text-gray-400">
                        Изображение превью
                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePreviewImageChange}
                        className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-black transition outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />

                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {previewImageFile
                            ? previewImageFile.name
                            : formData.previewImg}
                    </span>
                </label>

                <StyledTextarea
                    id="article-title"
                    label="Название"
                    value={formData.title}
                    onChange={(event) =>
                        updateField("title", event.target.value)
                    }
                    required
                    rows={2}
                />

                <div className="space-y-2 text-sm font-medium text-black dark:text-white">
                    <span className="block">Основной текст</span>

                    <QuillEditor
                        value={formData.mainText}
                        onChange={handleMainTextChange}
                        className="rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                </div>
            </div>

            <StatusMessage
                message={status?.message}
                success={status?.success}
            />

            <div className="flex-between flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handlePublicationToggle}
                    disabled={isPending}
                    className="rounded-full border border-gray-300 bg-slate-100 px-8 py-4 text-sm font-semibold text-black transition hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                    {formData.isPublished ? "В черновик" : "Опубликовать"}
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                >
                    {isPending ? "Сохранение..." : "Сохранить статью"}
                </button>
            </div>
        </form>
    );
};

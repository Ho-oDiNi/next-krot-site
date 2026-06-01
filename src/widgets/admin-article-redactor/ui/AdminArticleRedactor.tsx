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
import { StyledInput, StyledTextarea } from "@/shared/ui/StyledInput";
import { updateArticle } from "@/widgets/admin-article-redactor/api/updateArticle";
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

export const AdminArticleRedactor = ({
    article,
    authors,
    availableTags,
}: AdminArticleRedactorProps) => {
    const router = useRouter();

    const [formData, setFormData] = useState<ArticleRedactorFormData>(article);
    const [status, setStatus] = useState<UpdateArticleResult | null>(null);
    const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
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

        startTransition(() => {
            void (async () => {
                try {
                    const result = await updateArticle({
                        originalSlug: formData.originalSlug,
                        slug: formData.slug,
                        title: formData.title,
                        previewImg: formData.previewImg || null,
                        previewImageFile,
                        mainText: formData.mainText,
                        isPublished,
                        authorId: formData.authorId,
                        tagIds: formData.tagIds,
                    });

                    setStatus(result);

                    if (result.success && result.slug) {
                        setPreviewImageFile(null);

                        setFormData((prev) => ({
                            ...prev,
                            isPublished,
                            originalSlug: result.slug ?? prev.originalSlug,
                            slug: result.slug ?? prev.slug,
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

                <StyledInput
                    id="article-slug"
                    label="Slug"
                    type="text"
                    value={formData.slug}
                    onChange={(event) =>
                        updateField("slug", event.target.value)
                    }
                    required
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

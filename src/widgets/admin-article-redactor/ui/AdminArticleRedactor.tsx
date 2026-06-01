"use client";

import {
    ChangeEvent,
    FormEvent,
    useMemo,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";

import type { Author } from "@/entities/author";
import type { Tag } from "@/entities/tag";
import QuillEditor from "@/shared/lib/react-quill";
import {
    PUBLIC_IMAGE_MAX_SIZE_BYTES,
    PUBLIC_IMAGE_MAX_SIZE_LABEL,
} from "@/shared/lib/file-storage/config";
import StatusMessage from "@/shared/ui/StatusMessage";
import { StyledInput, StyledTextarea } from "@/shared/ui/StyledInput";
import { updateArticle } from "@/widgets/admin-article-redactor/api/updateArticle";
import type {
    ArticleRedactorFormData,
    UpdateArticleResult,
} from "@/widgets/admin-article-redactor/model";

interface AdminArticleRedactorProps {
    article: ArticleRedactorFormData;
    author: Author;
    tags: Tag[];
}

export const AdminArticleRedactor = ({
    article,
    author,
    tags,
}: AdminArticleRedactorProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<ArticleRedactorFormData>(article);
    const [status, setStatus] = useState<UpdateArticleResult | null>(null);
    const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
    const [isPending, startTransition] = useTransition();

    const tagList = useMemo(
        () => tags.map((tag) => `#${tag.name}`).join(" / "),
        [tags],
    );

    const calculatedReadingTime = useMemo(() => {
        const readingTime = Math.ceil(formData.mainText.length / 1400);

        return Math.max(readingTime, 1);
    }, [formData.mainText]);

    const updateField = <K extends keyof ArticleRedactorFormData>(
        field: K,
        value: ArticleRedactorFormData[K],
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                        isPublished: formData.isPublished,
                    });

                    setStatus(result);

                    if (result.success && result.slug) {
                        setPreviewImageFile(null);
                        setFormData((prev) => ({
                            ...prev,
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <StatusMessage
                message={status?.message}
                success={status?.success}
            />

            <div className="grid gap-6 rounded-3xl bg-white p-6 dark:bg-gray-900">
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-black dark:text-white">
                        <span>Изображение превью</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePreviewImageChange}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black transition outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {previewImageFile
                                ? previewImageFile.name
                                : formData.previewImg
                                  ? `Текущее изображение: ${formData.previewImg}`
                                  : "Необязательное поле"}
                        </span>
                    </label>

                    <div className="space-y-2 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                        <span className="block text-gray-400">
                            Время чтения
                        </span>
                        <span className="font-medium text-black dark:text-white">
                            {calculatedReadingTime} мин.
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                            Рассчитывается при сохранении: символы основного
                            текста / 1400.
                        </span>
                    </div>
                </div>

                <div className="grid gap-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 md:grid-cols-3 dark:bg-gray-950 dark:text-gray-300">
                    <div>
                        <span className="block text-gray-400">Автор</span>
                        <span className="font-medium text-black dark:text-white">
                            {author.name}
                        </span>
                    </div>
                    <div>
                        <span className="block text-gray-400">Темы</span>
                        <span className="font-medium text-black dark:text-white">
                            {tagList || "Без тем"}
                        </span>
                    </div>
                    <label className="flex items-center gap-3 font-medium text-black dark:text-white">
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(event) =>
                                updateField("isPublished", event.target.checked)
                            }
                            className="size-5"
                        />
                        Опубликована
                    </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-black dark:text-white">
                    <span>Основной текст</span>
                    <QuillEditor
                        value={formData.mainText}
                        onChange={(value) => updateField("mainText", value)}
                        className="rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                </label>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                >
                    {isPending ? "Сохранение..." : "Сохранить статью"}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="rounded-full border border-gray-300 px-8 py-4 text-sm font-semibold text-black transition hover:border-gray-500 dark:border-gray-700 dark:text-white"
                >
                    Вернуться в админку
                </button>
            </div>
        </form>
    );
};

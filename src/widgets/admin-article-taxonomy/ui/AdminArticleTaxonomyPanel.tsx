"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Author } from "@/entities/author";
import type { Tag } from "@/entities/tag";
import StatusMessage from "@/shared/ui/StatusMessage";
import { StyledInput, StyledTextarea } from "@/shared/ui/StyledInput";
import {
    createArticleAuthor,
    createArticleTag,
    deleteArticleAuthor,
    deleteArticleTag,
    updateArticleAuthor,
    updateArticleTag,
} from "@/widgets/admin-article-taxonomy/api/manageArticleTaxonomy";
import type {
    ArticleTaxonomyEntity,
    ArticleTaxonomyFormData,
    ArticleTaxonomyResult,
} from "@/widgets/admin-article-taxonomy/model";

const EMPTY_FORM: ArticleTaxonomyFormData = {
    name: "",
    slug: "",
    description: "",
    avatarImg: "",
};

const getEntityTitle = (entity: ArticleTaxonomyEntity) =>
    entity === "author" ? "автора" : "тему";

const createSlug = (name: string) =>
    name
        .trim()
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "");

export const AdminArticleTaxonomyPanel = () => {
    const router = useRouter();
    const [activeEntity, setActiveEntity] =
        useState<ArticleTaxonomyEntity>("author");
    const [authors, setAuthors] = useState<Author[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [formData, setFormData] =
        useState<ArticleTaxonomyFormData>(EMPTY_FORM);
    const [status, setStatus] = useState<ArticleTaxonomyResult | null>(null);
    const [isPending, startTransition] = useTransition();

    const activeItems = useMemo(
        () => (activeEntity === "author" ? authors : tags),
        [activeEntity, authors, tags],
    );

    const loadTaxonomy = async () => {
        const [authorsResponse, tagsResponse] = await Promise.all([
            fetch("/api/authors"),
            fetch("/api/tags"),
        ]);

        if (!authorsResponse.ok || !tagsResponse.ok) {
            throw new Error("Не удалось загрузить авторов и темы");
        }

        const [loadedAuthors, loadedTags] = (await Promise.all([
            authorsResponse.json(),
            tagsResponse.json(),
        ])) as [Author[], Tag[]];

        setAuthors(loadedAuthors);
        setTags(loadedTags);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadTaxonomy().catch((error) => {
            setStatus({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Не удалось загрузить справочники статей",
            });
        });
    }, []);

    const resetForm = () => {
        setFormData(EMPTY_FORM);
    };

    const updateFormField = <K extends keyof ArticleTaxonomyFormData>(
        field: K,
        value: ArticleTaxonomyFormData[K],
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            slug:
                field === "name" && !prev.id && !prev.slug
                    ? createSlug(String(value))
                    : prev.slug,
        }));
    };

    const handleEntityChange = (entity: ArticleTaxonomyEntity) => {
        setActiveEntity(entity);
        setStatus(null);
        resetForm();
    };

    const handleEdit = (item: Author | Tag) => {
        setStatus(null);
        setFormData({
            id: item.id,
            name: item.name,
            slug: item.slug,
            description: "description" in item ? item.description : "",
            avatarImg: "avatarImg" in item ? (item.avatarImg ?? "") : "",
        });
    };

    const applySuccessfulResult = (result: ArticleTaxonomyResult) => {
        if (result.author) {
            const savedAuthor = result.author;

            setAuthors((prev) => {
                const nextAuthors = formData.id
                    ? prev.map((author) =>
                          author.id === savedAuthor.id ? savedAuthor : author,
                      )
                    : [...prev, savedAuthor];

                return nextAuthors.sort((leftAuthor, rightAuthor) =>
                    leftAuthor.name.localeCompare(rightAuthor.name, "ru"),
                );
            });
        }

        if (result.tag) {
            const savedTag = result.tag;

            setTags((prev) => {
                const nextTags = formData.id
                    ? prev.map((tag) =>
                          tag.id === savedTag.id ? savedTag : tag,
                      )
                    : [...prev, savedTag];

                return nextTags.sort((leftTag, rightTag) =>
                    leftTag.name.localeCompare(rightTag.name, "ru"),
                );
            });
        }

        resetForm();
        router.refresh();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);

        startTransition(() => {
            void (async () => {
                const action = formData.id
                    ? activeEntity === "author"
                        ? updateArticleAuthor
                        : updateArticleTag
                    : activeEntity === "author"
                      ? createArticleAuthor
                      : createArticleTag;
                const result = await action(formData);

                setStatus(result);

                if (result.success) {
                    applySuccessfulResult(result);
                }
            })();
        });
    };

    const handleDelete = (id: number) => {
        setStatus(null);

        startTransition(() => {
            void (async () => {
                const result =
                    activeEntity === "author"
                        ? await deleteArticleAuthor(id)
                        : await deleteArticleTag(id);

                setStatus(result);

                if (result.success) {
                    if (activeEntity === "author") {
                        setAuthors((prev) =>
                            prev.filter((author) => author.id !== id),
                        );
                    } else {
                        setTags((prev) => prev.filter((tag) => tag.id !== id));
                    }

                    if (formData.id === id) {
                        resetForm();
                    }

                    router.refresh();
                }
            })();
        });
    };

    return (
        <div className="space-y-5 p-6 pt-14 text-black dark:text-white">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase dark:text-slate-400">
                    Справочники статей
                </p>
                <h2 className="text-2xl font-bold">Авторы и темы</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-200 p-1 dark:bg-slate-800">
                <button
                    type="button"
                    onClick={() => handleEntityChange("author")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeEntity === "author"
                            ? "bg-white text-slate-950 shadow dark:bg-slate-950 dark:text-white"
                            : "text-slate-500 hover:text-slate-950 dark:hover:text-white"
                    }`}
                >
                    Авторы
                </button>
                <button
                    type="button"
                    onClick={() => handleEntityChange("tag")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeEntity === "tag"
                            ? "bg-white text-slate-950 shadow dark:bg-slate-950 dark:text-white"
                            : "text-slate-500 hover:text-slate-950 dark:hover:text-white"
                    }`}
                >
                    Темы
                </button>
            </div>

            <StatusMessage
                message={status?.message}
                success={status?.success}
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-3 rounded-2xl bg-white p-4 dark:bg-slate-900"
            >
                <h3 className="font-semibold">
                    {formData.id ? "Редактировать" : "Добавить"}{" "}
                    {getEntityTitle(activeEntity)}
                </h3>

                <StyledInput
                    id="article-taxonomy-name"
                    label="Название"
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                        updateFormField("name", event.target.value)
                    }
                    required
                />
                <StyledInput
                    id="article-taxonomy-slug"
                    label="Slug"
                    type="text"
                    value={formData.slug}
                    onChange={(event) =>
                        updateFormField("slug", event.target.value)
                    }
                    required
                />

                {activeEntity === "author" ? (
                    <>
                        <StyledTextarea
                            id="article-taxonomy-description"
                            label="Описание автора"
                            value={formData.description ?? ""}
                            onChange={(event) =>
                                updateFormField(
                                    "description",
                                    event.target.value,
                                )
                            }
                            rows={3}
                            required
                        />
                        <StyledInput
                            id="article-taxonomy-avatar"
                            label="URL аватара"
                            type="text"
                            value={formData.avatarImg ?? ""}
                            onChange={(event) =>
                                updateFormField("avatarImg", event.target.value)
                            }
                        />
                    </>
                ) : null}

                <div className="flex flex-wrap gap-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                    >
                        {isPending ? "Сохранение..." : "Сохранить"}
                    </button>
                    {formData.id ? (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-200"
                        >
                            Отменить
                        </button>
                    ) : null}
                </div>
            </form>

            <div className="space-y-2">
                <h3 className="font-semibold">Список</h3>
                <div className="space-y-2">
                    {activeItems.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl bg-white p-3 text-sm shadow-sm dark:bg-slate-900"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-950 dark:text-white">
                                        {item.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        /{item.slug}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(item)}
                                        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-200"
                                    >
                                        Изм.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isPending}
                                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!activeItems.length ? (
                        <p className="rounded-2xl bg-white p-4 text-sm text-slate-500 dark:bg-slate-900">
                            Пока нет записей.
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

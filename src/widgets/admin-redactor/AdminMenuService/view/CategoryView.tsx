"use client";

import { useMemo, useState } from "react";

import StatusMessage from "@/shared/ui/StatusMessage";
import BackButton from "../ui/BackButton";
import {
    CategoryViewComponentProps,
    CategoryUpdatePayload,
} from "@/widgets/admin-redactor/model/adminRedactor.types";
import Image from "next/image";
import {
    CATEGORY_IMAGE_MAX_SIZE_BYTES,
    CATEGORY_IMAGE_MAX_SIZE_LABEL,
} from "@/shared/lib/file-storage/config";

type CategoryFormState = {
    name: string;
    slug: string;
    position: string;
};

const emptyFormState: CategoryFormState = {
    name: "",
    slug: "",
    position: "",
};

const CategoryView = ({
    formData,
    onChange,
    onBack,
    categories,
    isLoading,
    error,
    onRefresh,
    onCreateCategory,
    onEditCategory,
    onDeleteCategory,
}: CategoryViewComponentProps) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formState, setFormState] =
        useState<CategoryFormState>(emptyFormState);
    const [status, setStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);

    const [pendingAction, setPendingAction] = useState<{
        categoryId: number;
        type: "edit" | "delete";
    } | null>(null);

    const handleSelect = (categoryId: number, categorySlug: string) => {
        onChange("categoryId", categoryId);
        onChange("categorySlug", categorySlug);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormState(emptyFormState);
    };

    const isCategoryPending = (
        categoryId: number,
        type?: "edit" | "delete",
    ) => {
        if (!pendingAction) {
            return false;
        }

        if (pendingAction.categoryId !== categoryId) {
            return false;
        }

        if (!type) {
            return true;
        }

        return pendingAction.type === type;
    };

    const handleEditStart = (categoryId: number) => {
        if (editingId === categoryId) {
            resetForm();
            return;
        }

        const category = categories.find((item) => item.id === categoryId);

        if (!category) {
            return;
        }

        setEditingId(category.id);
        setFormState({
            name: category.name,
            slug: category.slug,
            position:
                typeof category.position === "number"
                    ? String(category.position)
                    : "",
        });
        setImageFile(null);
    };

    const handleInputChange = (
        field: keyof CategoryFormState,
        value: string,
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const formatServicesLabel = useMemo(() => {
        return (serviceCount: number) => {
            if (serviceCount === 1) {
                return "услуга";
            }

            if (serviceCount >= 2 && serviceCount <= 4) {
                return "услуги";
            }

            return "услуг";
        };
    }, []);

    const handleEditSubmit = async (categoryId: number) => {
        if (isCategoryPending(categoryId, "edit")) {
            return;
        }

        const trimmedName = formState.name.trim();
        const trimmedSlug = formState.slug.trim();

        if (!trimmedName || !trimmedSlug) {
            setStatus({
                success: false,
                message: "Название и slug не могут быть пустыми",
            });
            return;
        }

        const positionInput = formState.position.trim();
        let positionValue: number | undefined;

        if (positionInput) {
            const parsed = Number(positionInput);

            if (!Number.isFinite(parsed)) {
                setStatus({
                    success: false,
                    message: "Позиция должна быть числом",
                });
                return;
            }

            positionValue = parsed;
        }

        const payload: CategoryUpdatePayload = {
            id: categoryId,
            name: trimmedName,
            slug: trimmedSlug,
            position: positionValue,
            imageFile,
        };

        setPendingAction({ categoryId, type: "edit" });

        try {
            const result = await onEditCategory(payload);
            setStatus(result);

            if (result.success) {
                resetForm();
            }
        } finally {
            setPendingAction(null);
        }
    };

    const handleImageChange = (file: File | null) => {
        if (!file) {
            setImageFile(null);
            return;
        }

        if (file.size > CATEGORY_IMAGE_MAX_SIZE_BYTES) {
            setStatus({
                success: false,
                message: `Размер изображения не должен превышать ${CATEGORY_IMAGE_MAX_SIZE_LABEL}`,
            });
            setImageFile(null);
            return;
        }

        setStatus(null);
        setImageFile(file);
    };

    const handleDelete = async (categoryId: number) => {
        if (isCategoryPending(categoryId, "delete")) {
            return;
        }

        const category = categories.find((item) => item.id === categoryId);

        if (!category) {
            return;
        }

        const confirmDelete = window.confirm(
            category.serviceSlugs.length
                ? `Удалить категорию "${category.name}"? Также будут удалены ${category.serviceSlugs.length} ${formatServicesLabel(
                      category.serviceSlugs.length,
                  )}.`
                : `Удалить категорию "${category.name}"?`,
        );

        if (!confirmDelete) {
            return;
        }

        setPendingAction({ categoryId, type: "delete" });

        try {
            const result = await onDeleteCategory(categoryId);
            setStatus(result);

            if (result.success) {
                resetForm();
            }
        } finally {
            setPendingAction(null);
        }
    };

    return (
        <div className="space-y-4">
            <BackButton onBack={onBack} />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Категория услуги</h2>
                    <p className="text-sm text-gray-600">
                        Выберите категорию, к которой относится услуга. Здесь же
                        можно отредактировать или удалить категорию.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCreateCategory}
                    className="inline-flex h-10 items-center justify-center rounded bg-blue-600 px-4 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                    + Новая категория
                </button>
            </div>

            <StatusMessage
                message={status?.message}
                success={status?.success}
                className="text-sm"
            />

            {error ? (
                <div className="flex items-center justify-between gap-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="text-xs font-semibold tracking-wide text-red-700 uppercase underline"
                    >
                        Повторить
                    </button>
                </div>
            ) : null}

            {isLoading ? (
                <div className="rounded border border-dashed border-gray-200 p-4 text-sm text-gray-600">
                    Загрузка категорий...
                </div>
            ) : null}

            {!isLoading && !error ? (
                categories.length > 0 ? (
                    <div className="space-y-3">
                        {categories.map((category) => {
                            const isSelected =
                                formData.categoryId === category.id;
                            const isEditing = editingId === category.id;

                            return (
                                <div
                                    key={category.id}
                                    className={`rounded border p-4 shadow-sm transition ${
                                        isSelected
                                            ? "border-blue-400"
                                            : "border-gray-200 hover:border-blue-400"
                                    }`}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <label className="flex flex-1 cursor-pointer items-start gap-3">
                                                <input
                                                    type="radio"
                                                    name="service-category"
                                                    value={category.id}
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        handleSelect(
                                                            category.id,
                                                            category.slug,
                                                        )
                                                    }
                                                    className="mt-1 h-4 w-4 accent-blue-600"
                                                />
                                                <div className="space-y-1">
                                                    <p className="font-medium text-gray-900">
                                                        {category.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        slug: {category.slug}
                                                    </p>
                                                    {category.imageUrl ? (
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                src={
                                                                    category.imageUrl
                                                                }
                                                                width={12}
                                                                height={12}
                                                                alt={`Изображение категории ${category.name}`}
                                                                className="h-12 w-12 rounded object-cover"
                                                            />
                                                            <span className="text-xs text-gray-500">
                                                                Изображение
                                                                загружено
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </label>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditStart(
                                                            category.id,
                                                        )
                                                    }
                                                    className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                                    disabled={isCategoryPending(
                                                        category.id,
                                                    )}
                                                >
                                                    {isEditing
                                                        ? "Отмена"
                                                        : "Редактировать"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.id,
                                                        )
                                                    }
                                                    className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                                    disabled={isCategoryPending(
                                                        category.id,
                                                    )}
                                                >
                                                    {isCategoryPending(
                                                        category.id,
                                                        "delete",
                                                    )
                                                        ? "Удаление..."
                                                        : "Удалить"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>
                                                {category.serviceSlugs.length}{" "}
                                                {formatServicesLabel(
                                                    category.serviceSlugs
                                                        .length,
                                                )}
                                            </span>
                                            {typeof category.position ===
                                            "number" ? (
                                                <span>
                                                    Позиция: {category.position}
                                                </span>
                                            ) : null}
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-3 border-t pt-3">
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    <label className="space-y-2">
                                                        <span className="text-xs font-medium text-gray-700">
                                                            Название
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={
                                                                formState.name
                                                            }
                                                            onChange={(event) =>
                                                                handleInputChange(
                                                                    "name",
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </label>
                                                    <label className="space-y-2">
                                                        <span className="text-xs font-medium text-gray-700">
                                                            Slug
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={
                                                                formState.slug
                                                            }
                                                            onChange={(event) =>
                                                                handleInputChange(
                                                                    "slug",
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </label>
                                                </div>

                                                <label className="space-y-2">
                                                    <span className="text-xs font-medium text-gray-700">
                                                        Позиция
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={
                                                            formState.position
                                                        }
                                                        onChange={(event) =>
                                                            handleInputChange(
                                                                "position",
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                                                        min={0}
                                                        step={1}
                                                    />
                                                </label>

                                                <label className="space-y-2">
                                                    <span className="text-xs font-medium text-gray-700">
                                                        Изображение категории
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(event) =>
                                                            handleImageChange(
                                                                event.target
                                                                    .files?.[0] ??
                                                                    null,
                                                            )
                                                        }
                                                        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                                                    />
                                                    {imageFile ? (
                                                        <span className="text-xs text-gray-500">
                                                            {imageFile.name}
                                                        </span>
                                                    ) : category.imageUrl ? (
                                                        <span className="text-xs text-gray-500">
                                                            Загружено
                                                            изображение. При
                                                            выборе нового файла
                                                            текущее будет
                                                            заменено.
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">
                                                            Изображение не
                                                            выбрано.
                                                        </span>
                                                    )}
                                                </label>

                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={resetForm}
                                                        className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                                        disabled={isCategoryPending(
                                                            category.id,
                                                            "edit",
                                                        )}
                                                    >
                                                        Отмена
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditSubmit(
                                                                category.id,
                                                            )
                                                        }
                                                        className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow hover:bg-blue-700 disabled:bg-blue-400"
                                                        disabled={isCategoryPending(
                                                            category.id,
                                                            "edit",
                                                        )}
                                                    >
                                                        {isCategoryPending(
                                                            category.id,
                                                            "edit",
                                                        )
                                                            ? "Сохранение..."
                                                            : "Сохранить"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                        Категории не найдены. Создайте новую категорию, чтобы
                        связать её с услугой.
                    </div>
                )
            ) : null}
        </div>
    );
};

export default CategoryView;

"use client";

import { useState } from "react";

import StatusMessage from "@/shared/ui/StatusMessage";
import BackButton from "../ui/BackButton";
import {
    CategoryCreateViewComponentProps,
    CategoryCreateResult,
} from "@/widgets/admin-redactor/model/adminRedactor.types";
import {
    CATEGORY_IMAGE_MAX_SIZE_BYTES,
    CATEGORY_IMAGE_MAX_SIZE_LABEL,
} from "@/shared/lib/file-storage/config";

type CategoryFormState = {
    name: string;
    slug: string;
    description: string;
    position: string;
};

const initialState: CategoryFormState = {
    name: "",
    slug: "",
    description: "",
    position: "",
};

const CategoryCreateView = ({
    onBack,
    onSubmit,
}: CategoryCreateViewComponentProps) => {
    const [formState, setFormState] = useState<CategoryFormState>(initialState);
    const [status, setStatus] = useState<CategoryCreateResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

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

    const handleChange = (field: keyof CategoryFormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setStatus(null);

        const trimmedName = formState.name.trim();
        const trimmedSlug = formState.slug.trim();
        const trimmedDescription = formState.description?.trim();

        if (!trimmedName || !trimmedSlug) {
            setStatus({
                success: false,
                message: "Название и slug не могут быть пустыми",
            });
            return;
        }

        let positionValue: number | undefined;
        const positionInput = formState.position.trim();

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

        setIsSubmitting(true);

        try {
            const result = await onSubmit({
                name: trimmedName,
                slug: trimmedSlug,
                description: trimmedDescription || undefined,
                position: positionValue,
                imageFile,
            });

            setStatus(result);

            if (result.success) {
                setFormState(initialState);
                setImageFile(null);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <BackButton onBack={onBack} />

            <div>
                <h2 className="text-xl font-semibold">Новая категория</h2>
                <p className="text-sm text-gray-600">
                    Заполните данные, чтобы добавить новую категорию услуг.
                </p>
            </div>

            <StatusMessage
                message={status?.message}
                success={status?.success}
                className="text-sm"
            />

            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                        Название категории
                    </span>
                    <input
                        type="text"
                        value={formState.name}
                        onChange={(event) =>
                            handleChange("name", event.target.value)
                        }
                        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Например, Клининговые услуги"
                        required
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                        Slug категории
                    </span>
                    <input
                        type="text"
                        value={formState.slug}
                        onChange={(event) =>
                            handleChange("slug", event.target.value)
                        }
                        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="naprimer-klining"
                        required
                    />
                </label>
            </div>

            <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700">
                    Описание
                </span>
                <textarea
                    value={formState.description ?? ""}
                    onChange={(event) =>
                        handleChange("description", event.target.value)
                    }
                    className="min-h-24 w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Краткое описание категории (необязательно)"
                />
            </label>

            <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700">
                    Позиция (необязательно)
                </span>
                <input
                    type="number"
                    value={formState.position ?? ""}
                    onChange={(event) =>
                        handleChange("position", event.target.value)
                    }
                    className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Например, 10"
                    min={0}
                    step={1}
                />
                <span className="text-xs text-gray-500">
                    Используется для сортировки категорий. Если не указано,
                    будет применено значение по умолчанию.
                </span>
            </label>

            <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700">
                    Изображение категории
                </span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                        handleImageChange(event.target.files?.[0] ?? null)
                    }
                    className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                {imageFile ? (
                    <span className="text-xs text-gray-500">
                        {imageFile.name}
                    </span>
                ) : (
                    <span className="text-xs text-gray-500">
                        Необязательное поле
                    </span>
                )}
            </label>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    Отмена
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? "Создание..." : "Создать категорию"}
                </button>
            </div>
        </div>
    );
};

export default CategoryCreateView;

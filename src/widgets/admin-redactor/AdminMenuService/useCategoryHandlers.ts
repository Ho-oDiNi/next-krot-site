import { Dispatch, SetStateAction, useCallback } from "react";
import { createServiceCategory } from "@/widgets/admin-redactor/api/createServiceCategory";
import { deleteServiceCategory } from "@/widgets/admin-redactor/api/deleteServiceCategory";
import { updateServiceCategory } from "@/widgets/admin-redactor/api/updateServiceCategory";
import { fetchServiceCategories } from "@/widgets/admin-redactor/admin.utils";
import {
    ViewMode,
    CategoryCreatePayload,
    CategoryCreateResult,
    CategoryUpdatePayload,
    CategoryUpdateResult,
    CategoryDeleteResult,
} from "@/widgets/admin-redactor/model/adminRedactor.types";
import { Category } from "@/entities/category";
import { Service } from "@/entities/service";

// Error

interface UseCategoryHandlersParams {
    setIsCategoriesLoading: Dispatch<SetStateAction<boolean>>;
    setCategoriesError: Dispatch<SetStateAction<string | null>>;
    setCategories: Dispatch<SetStateAction<Category[]>>;
    setFormData: Dispatch<SetStateAction<Service>>;
    setCurrentView: Dispatch<SetStateAction<ViewMode>>;
}

export const useCategoryHandlers = ({
    setIsCategoriesLoading,
    setCategoriesError,
    setCategories,
    setFormData,
    setCurrentView,
}: UseCategoryHandlersParams) => {
    const loadCategories = useCallback(async () => {
        setIsCategoriesLoading(true);
        setCategoriesError(null);

        try {
            const data = await fetchServiceCategories();
            setCategories(data);
        } catch (error) {
            setCategoriesError(
                error instanceof Error
                    ? error.message
                    : "Не удалось загрузить категории",
            );
        } finally {
            setIsCategoriesLoading(false);
        }
    }, [setIsCategoriesLoading, setCategoriesError, setCategories]);

    const sortCategories = useCallback((items: Category[]): Category[] => {
        return [...items].sort((left, right) => {
            const leftPosition =
                typeof left.position === "number" ? left.position : 0;
            const rightPosition =
                typeof right.position === "number" ? right.position : 0;

            if (leftPosition !== rightPosition) {
                return leftPosition - rightPosition;
            }

            return left.id - right.id;
        });
    }, []);

    const handleCreateCategory = useCallback(
        async (
            payload: CategoryCreatePayload,
        ): Promise<CategoryCreateResult> => {
            try {
                const result = await createServiceCategory(payload);

                if (result.success && result.category) {
                    const category = result.category;

                    setCategories((prev) => {
                        const existingIndex = prev.findIndex(
                            (existingCategory) =>
                                existingCategory.id === category.id,
                        );

                        if (existingIndex >= 0) {
                            const next = [...prev];
                            next[existingIndex] = category;
                            return sortCategories(next);
                        }

                        return sortCategories([...prev, category]);
                    });

                    setCategoriesError(null);

                    setFormData((prev) => ({
                        ...prev,
                        categoryId: category.id,
                        categorySlug: category.slug,
                    }));

                    setCurrentView("category");
                }

                return result;
            } catch (error) {
                return {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Не удалось создать категорию",
                };
            }
        },
        [
            setCategories,
            setCategoriesError,
            setFormData,
            setCurrentView,
            sortCategories,
        ],
    );

    const handleUpdateCategory = useCallback(
        async (
            payload: CategoryUpdatePayload,
        ): Promise<CategoryUpdateResult> => {
            try {
                const result = await updateServiceCategory(payload);

                if (result.success && result.category) {
                    const category = result.category;

                    setCategories((prev) => {
                        const next = prev.map((existing) =>
                            existing.id === category.id ? category : existing,
                        );

                        return sortCategories(next);
                    });

                    setCategoriesError(null);

                    setFormData((prev) => {
                        if (prev.categoryId !== category.id) {
                            return prev;
                        }

                        return {
                            ...prev,
                            categorySlug: category.slug,
                        };
                    });
                }

                return result;
            } catch (error) {
                return {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Не удалось обновить категорию",
                } satisfies CategoryUpdateResult;
            }
        },
        [setCategories, setCategoriesError, setFormData, sortCategories],
    );

    const handleDeleteCategory = useCallback(
        async (categoryId: number): Promise<CategoryDeleteResult> => {
            try {
                const result = await deleteServiceCategory(categoryId);

                if (result.success && result.categoryId) {
                    setCategories((prev) =>
                        prev.filter(
                            (category) => category.id !== result.categoryId,
                        ),
                    );

                    setCategoriesError(null);

                    setFormData((prev) => {
                        if (prev.categoryId !== result.categoryId) {
                            return prev;
                        }

                        return {
                            ...prev,
                            categoryId: undefined,
                            categorySlug: undefined,
                        };
                    });
                }

                return result;
            } catch (error) {
                return {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Не удалось удалить категорию",
                } satisfies CategoryDeleteResult;
            }
        },
        [setCategories, setCategoriesError, setFormData],
    );

    return {
        loadCategories,
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,
    };
};

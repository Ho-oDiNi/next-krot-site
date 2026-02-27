import { Category } from "@/entities/category";
import { Service } from "@/entities/service";

export type ViewMode = "menu" | "meta" | "content" | "delete";

export type DeleteActionState = {
    success: boolean;
    message: string;
} | null;

export interface ViewRendererProps {
    currentView: ViewMode;
    formData: Service;
    onViewChange: (view: ViewMode) => void;
    onChange: (field: keyof Service, value: Service[keyof Service]) => void;
    isPending: boolean;
    deleteProps?: DeleteViewProps;
}

export interface BaseViewProps {
    formData: Service;
    onChange: (field: keyof Service, value: Service[keyof Service]) => void;
    onBack: () => void;
}

export interface DeleteViewProps {
    serviceTitle: string;
    onCancel: () => void;
    deleteState: DeleteActionState;
    serviceSlug: string;
}

export interface CategoryViewComponentProps extends BaseViewProps {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    onRefresh: () => void;
    onCreateCategory: () => void;
    onEditCategory: (
        payload: CategoryUpdatePayload,
    ) => Promise<CategoryUpdateResult>;
    onDeleteCategory: (categoryId: number) => Promise<CategoryDeleteResult>;
}

export interface CategoryCreatePayload {
    name: string;
    slug: string;
    description?: string;
    position?: number;
    imageFile?: File | null;
}

export interface CategoryCreateResult {
    success: boolean;
    message: string;
    category?: Category;
}

export interface CategoryUpdatePayload extends CategoryCreatePayload {
    id: number;
}

export interface CategoryUpdateResult {
    success: boolean;
    message: string;
    category?: Category;
}

export interface CategoryDeleteResult {
    success: boolean;
    message: string;
    categoryId?: number;
}

export interface CategoryCreateViewComponentProps {
    onBack: () => void;
    onSubmit: (payload: CategoryCreatePayload) => Promise<CategoryCreateResult>;
}

export interface AdminRedactorFormProps {
    mode: "edit" | "create" | "delete";
    onClose: () => void;
}

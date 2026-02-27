import { Category } from "@/entities/category";
import { Service } from "@/entities/service";

export type ViewMode =
    | "menu"
    | "meta"
    | "content"
    | "whatIncluded"
    | "faq"
    | "category"
    | "categoryCreate"
    | "delete";

export type DeleteActionState = {
    success: boolean;
    message: string;
} | null;

export interface ViewRendererProps {
    currentView: ViewMode;
    formData: Service;
    onViewChange: (view: ViewMode) => void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (field: keyof Service, value: any) => void;
    onArrayChange: (
        field: "whatIncluded" | "materials",
        index: number,
        value: string,
    ) => void;
    onFaqChange: (index: number, type: 0 | 1, value: string) => void;
    onAddArrayItem: (field: "whatIncluded" | "materials") => void;
    onRemoveArrayItem: (
        field: "whatIncluded" | "materials",
        index: number,
    ) => void;
    onAddFaqItem: () => void;
    onRemoveFaqItem: (index: number) => void;
    isPending: boolean;
    deleteProps?: DeleteViewProps;
    categoryViewProps?: Omit<CategoryViewComponentProps, "onBack">;
    categoryCreateViewProps?: Omit<CategoryCreateViewComponentProps, "onBack">;
}

export interface BaseViewProps {
    formData: Service;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (field: keyof Service, value: any) => void;
    onBack: () => void;
}

export interface ArrayViewProps extends BaseViewProps {
    onArrayChange: (
        field: "whatIncluded" | "materials",
        index: number,
        value: string,
    ) => void;
    onAddArrayItem: (field: "whatIncluded" | "materials") => void;
    onRemoveArrayItem: (
        field: "whatIncluded" | "materials",
        index: number,
    ) => void;
}

export interface FaqViewProps extends BaseViewProps {
    onFaqChange: (index: number, type: 0 | 1, value: string) => void;
    onAddFaqItem: () => void;
    onRemoveFaqItem: (index: number) => void;
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

import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import { addNewService } from "@/widgets/admin-redactor/api/addNewService";
import { insertIntoService } from "@/widgets/admin-redactor/api/insertIntoService";
import { Service } from "@/entities/service";
import { AdminRedactorFormProps } from "@/widgets/admin-redactor/model/adminRedactor.types";

type SubmitStatus = {
    success: boolean;
    message: string;
};

type UseAdminRedactorFormHandlersParams = {
    mode: AdminRedactorFormProps["mode"];
    formData: Service;
    setFormData: Dispatch<SetStateAction<Service>>;
    setIsSubmitting: Dispatch<SetStateAction<boolean>>;
    setSubmitStatus: Dispatch<SetStateAction<SubmitStatus | null>>;
};

export const useAdminRedactorFormHandlers = ({
    mode,
    formData,
    setFormData,
    setIsSubmitting,
    setSubmitStatus,
}: UseAdminRedactorFormHandlersParams) => {
    const handleChange = useCallback(
        <K extends keyof Service>(field: K, value: Service[K]) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        [setFormData],
    );

    const handleArrayChange = useCallback(
        (field: "whatIncluded" | "materials", index: number, value: string) => {
            setFormData((prev) => {
                const updated = [...prev[field]] as string[];
                updated[index] = value;

                return {
                    ...prev,
                    [field]: updated,
                };
            });
        },
        [setFormData],
    );

    const handleFaqChange = useCallback(
        (index: number, type: 0 | 1, value: string) => {
            setFormData((prev) => {
                const updatedFaq = [...prev.faqItems];
                const currentItem = updatedFaq[index] ?? ["", ""];
                updatedFaq[index] = [
                    type === 0 ? value : currentItem[0],
                    type === 1 ? value : currentItem[1],
                ];

                return {
                    ...prev,
                    faqItems: updatedFaq,
                };
            });
        },
        [setFormData],
    );

    const addArrayItem = useCallback(
        (field: "whatIncluded" | "materials") => {
            setFormData((prev) => ({
                ...prev,
                [field]: [...prev[field], ""],
            }));
        },
        [setFormData],
    );

    const removeArrayItem = useCallback(
        (field: "whatIncluded" | "materials", index: number) => {
            setFormData((prev) => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index),
            }));
        },
        [setFormData],
    );

    const addFaqItem = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            faqItems: [...prev.faqItems, ["", ""]],
        }));
    }, [setFormData]);

    const removeFaqItem = useCallback(
        (index: number) => {
            setFormData((prev) => ({
                ...prev,
                faqItems: prev.faqItems.filter((_, i) => i !== index),
            }));
        },
        [setFormData],
    );

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const action =
                mode === "create" ? addNewService : insertIntoService;
            const result = await action(formData);

            setSubmitStatus(result);
        } catch (error) {
            setSubmitStatus({
                success: false,
                message:
                    error instanceof Error ? error.message : "Произошла ошибка",
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, mode, setIsSubmitting, setSubmitStatus]);

    return {
        handleChange,
        handleArrayChange,
        handleFaqChange,
        addArrayItem,
        removeArrayItem,
        addFaqItem,
        removeFaqItem,
        handleSubmit,
    } as const;
};

export type UseAdminRedactorFormHandlersReturn = ReturnType<
    typeof useAdminRedactorFormHandlers
>;

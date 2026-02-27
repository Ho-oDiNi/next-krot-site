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
        handleSubmit,
    } as const;
};

export type UseAdminRedactorFormHandlersReturn = ReturnType<
    typeof useAdminRedactorFormHandlers
>;

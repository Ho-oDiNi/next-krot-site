"use client";

import Form from "next/form";
import { deleteService } from "@/widgets/admin-redactor/api/deleteService";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import ViewRenderer from "./ViewRenderer";
import StatusMessage from "@/shared/ui/StatusMessage";
import {
    createEmptyService,
    fetchServiceBySlug,
    getServiceTitle,
} from "@/widgets/admin-redactor/admin.utils";
import { useAdminRedactorFormHandlers } from "./useFormHandlers";
import {
    AdminRedactorFormProps,
    ViewMode,
    DeleteActionState,
} from "@/widgets/admin-redactor/model/adminRedactor.types";
import { Service } from "@/entities/service";

const AdminRedactorForm = ({ mode, onClose }: AdminRedactorFormProps) => {
    const params = useParams();
    const serviceSlug = params.service as string | undefined;

    const [formData, setFormData] = useState<Service>(createEmptyService());
    const [currentView, setCurrentView] = useState<ViewMode>(() =>
        mode === "delete" ? "delete" : "menu",
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [isServiceLoading, setIsServiceLoading] = useState(false);
    const [deleteState, deleteAction] = useActionState<
        DeleteActionState,
        FormData
    >(deleteService, null);

    useEffect(() => {
        let isActive = true;

        const resetState = () => {
            if (!isActive) return;
            setCurrentView(mode === "delete" ? "delete" : "menu");
            setSubmitStatus(null);
            setIsSubmitting(false);
        };

        const loadService = async () => {
            resetState();

            if (mode !== "edit" && mode !== "delete") {
                setFormData(createEmptyService());
                setIsServiceLoading(false);
                return;
            }

            if (!serviceSlug) {
                setFormData(createEmptyService());
                setIsServiceLoading(false);
                return;
            }

            setIsServiceLoading(true);
            const serviceData = await fetchServiceBySlug(serviceSlug);

            if (isActive) {
                setFormData(serviceData ?? createEmptyService());
                setIsServiceLoading(false);
            }
        };

        loadService();

        return () => {
            isActive = false;
        };
    }, [mode, serviceSlug]);

    const { handleChange, handleSubmit } = useAdminRedactorFormHandlers({
        mode,
        formData,
        setFormData,
        setIsSubmitting,
        setSubmitStatus,
    });

    const serviceTitle = getServiceTitle(formData, serviceSlug);

    return (
        <div className="space-y-6 p-8">
            {mode !== "delete" && (
                <StatusMessage
                    message={submitStatus?.message}
                    success={submitStatus?.success}
                />
            )}

            <Form action={mode === "delete" ? deleteAction : handleSubmit}>
                <ViewRenderer
                    currentView={currentView}
                    formData={formData}
                    onViewChange={setCurrentView}
                    onChange={(field, value) =>
                        handleChange(field as keyof Service, value)
                    }
                    isPending={isSubmitting || isServiceLoading}
                    deleteProps={
                        mode === "delete"
                            ? {
                                  serviceTitle,
                                  onCancel: onClose,
                                  deleteState,
                                  serviceSlug: serviceSlug ?? "",
                              }
                            : undefined
                    }
                />
            </Form>
        </div>
    );
};

export default AdminRedactorForm;

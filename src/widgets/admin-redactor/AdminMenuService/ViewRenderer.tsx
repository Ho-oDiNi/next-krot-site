import ContentView from "./view/ContentView";
import CategoryCreateView from "./view/CategoryCreateView";
import CategoryView from "./view/CategoryView";
import DeleteView from "./view/DeleteView";
import FaqView from "./view/FaqView";
import MenuView from "./view/MenuView";
import MetaView from "./view/MetaView";
import WhatIncludedView from "./view/WhatIncludedView";
import { ViewRendererProps } from "@/widgets/admin-redactor/model/adminRedactor.types";

const ViewRenderer = ({
    currentView,
    formData,
    onViewChange,
    onChange,
    onArrayChange,
    onFaqChange,
    onAddArrayItem,
    onRemoveArrayItem,
    onAddFaqItem,
    onRemoveFaqItem,
    isPending,
    deleteProps,
    categoryViewProps,
    categoryCreateViewProps,
}: ViewRendererProps) => {
    const handleBack = () => onViewChange("menu");

    const renderView = () => {
        switch (currentView) {
            case "category":
                return categoryViewProps ? (
                    <CategoryView {...categoryViewProps} onBack={handleBack} />
                ) : null;

            case "categoryCreate":
                return categoryCreateViewProps ? (
                    <CategoryCreateView
                        {...categoryCreateViewProps}
                        onBack={() => onViewChange("category")}
                    />
                ) : null;

            case "meta":
                return (
                    <MetaView
                        formData={formData}
                        onChange={onChange}
                        onBack={handleBack}
                    />
                );

            case "content":
                return (
                    <ContentView
                        formData={formData}
                        onChange={onChange}
                        onBack={handleBack}
                    />
                );

            case "whatIncluded":
                return (
                    <WhatIncludedView
                        formData={formData}
                        onChange={onChange}
                        onBack={handleBack}
                        onArrayChange={onArrayChange}
                        onAddArrayItem={onAddArrayItem}
                        onRemoveArrayItem={onRemoveArrayItem}
                    />
                );

            case "faq":
                return (
                    <FaqView
                        formData={formData}
                        onChange={onChange}
                        onBack={handleBack}
                        onFaqChange={onFaqChange}
                        onAddFaqItem={onAddFaqItem}
                        onRemoveFaqItem={onRemoveFaqItem}
                    />
                );

            case "delete":
                return deleteProps ? (
                    <DeleteView
                        serviceTitle={deleteProps.serviceTitle}
                        onCancel={deleteProps.onCancel}
                        deleteState={deleteProps.deleteState}
                        serviceSlug={deleteProps.serviceSlug}
                    />
                ) : null;

            default:
                return (
                    <MenuView
                        onViewChange={onViewChange}
                        isPending={isPending}
                    />
                );
        }
    };

    return renderView();
};

export default ViewRenderer;

import ContentView from "./view/ContentView";
import DeleteView from "./view/DeleteView";
import MenuView from "./view/MenuView";
import MetaView from "./view/MetaView";
import { ViewRendererProps } from "@/widgets/admin-redactor/model/adminRedactor.types";

const ViewRenderer = ({
    currentView,
    formData,
    onViewChange,
    onChange,
    isPending,
    deleteProps,
}: ViewRendererProps) => {
    const handleBack = () => onViewChange("menu");

    const renderView = () => {
        switch (currentView) {
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

// components/NavigationButton.tsx
interface NavigationButtonProps {
    title: string;
    onClick: () => void;
    icon?: string;
}

const NavigationButton = ({ title, onClick, icon }: NavigationButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center justify-center rounded-lg border p-5 text-center transition-colors hover:bg-gray-200 hover:shadow-sm"
        >
            {icon && <span className="mb-2 text-2xl">{icon}</span>}
            <span className="text-lg font-medium">{title}</span>
        </button>
    );
};

export default NavigationButton;

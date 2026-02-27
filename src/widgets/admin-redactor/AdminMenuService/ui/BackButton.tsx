interface BackButtonProps {
    onBack: () => void;
}

const BackButton = ({ onBack }: BackButtonProps) => (
    <button
        type="button"
        onClick={onBack}
        className="text-main mb-4 flex items-center text-blue-600 hover:text-blue-800"
    >
        ← Назад
    </button>
);

export default BackButton;

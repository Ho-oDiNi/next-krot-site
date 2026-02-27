import { ViewMode } from "@/widgets/admin-redactor/model/adminRedactor.types";
import NavigationButton from "../ui/NavigationButton";

interface MenuViewProps {
    onViewChange: (view: ViewMode) => void;
    isPending: boolean;
}

const MenuView = ({ onViewChange, isPending }: MenuViewProps) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">Редактор статьи</h2>
        <p className="text-main text-gray-600">
            Выберите раздел для редактирования:
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* <NavigationButton
                title="Категория"
                onClick={() => onViewChange("category")}
                icon="📂"
            /> */}

            <NavigationButton
                title="Мета-данные"
                onClick={() => onViewChange("meta")}
                icon="⚙️"
            />

            <NavigationButton
                title="Основной контент"
                onClick={() => onViewChange("content")}
                icon="📝"
            />
        </div>

        <div className="pt-3">
            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                {isPending ? "Сохранение..." : "Сохранить изменения"}
            </button>
        </div>
    </div>
);

export default MenuView;

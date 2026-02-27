import { dialogContentOrderForm } from "@/shared/lib/dialog-and-popup/dialogNode.data";
import OpenDialogButton from "@/shared/lib/dialog-and-popup/DialogNode/OpenDialogButton";

const LeadCard = () => {
    return (
        <article className="flex-center flex flex-col gap-8 rounded-3xl bg-slate-200 p-8">
            <hgroup className="text-center md:max-w-2xl">
                <h3 className="text-h3 mb-4">Не знаете что выбрать?</h3>
                <p className="text-content">Получите бесплатную консультацию</p>
            </hgroup>

            <OpenDialogButton
                variant="primary"
                size="lg"
                dialogContent={dialogContentOrderForm}
            >
                Заказать констультацию
            </OpenDialogButton>
        </article>
    );
};

export default LeadCard;

import locationIcon from "@icons/location-blue-dark.svg";
import phoneIcon from "@icons/phone-blue-dark.svg";
import Image from "next/image";

import { CityPopupButton } from "@/shared/ui/CityPopup";
import OpenDialogButton from "@/shared/lib/dialog-and-popup/DialogNode/OpenDialogButton";
import { dialogContentOrderForm } from "@/shared/lib/dialog-and-popup/dialogNode.data";
import { SubdomainProps } from "../model";
import { GradientHide } from "@/shared/ui/GradientHide";

const HeaderTop = ({ cityName }: SubdomainProps) => {
    return (
        <div className="fixed top-0 z-99 w-full bg-slate-200 px-(--space-inside-x) shadow-sm">
            <div className="flex-between container mx-auto py-3">
                <CityPopupButton>
                    <Image src={locationIcon} alt="Выбор города" />
                    <span>{cityName}</span>
                </CityPopupButton>
                <div className="flex-center gap-8">
                    <a
                        href="tel:+79831383413"
                        className="flex-center text-main gap-4 hover:opacity-70"
                    >
                        <Image src={phoneIcon} alt="Телефон" />
                        <GradientHide variant="gray">
                            <span className="xs:block hidden">
                                + 7 (983) 138 - 34 - 13
                            </span>
                        </GradientHide>
                    </a>
                    <OpenDialogButton
                        variant="primary"
                        size="md"
                        className="hidden md:block"
                        dialogContent={dialogContentOrderForm}
                    >
                        Заказать консультацию
                    </OpenDialogButton>
                </div>
            </div>
        </div>
    );
};

export default HeaderTop;

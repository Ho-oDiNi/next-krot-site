import Image from "next/image";
import vkIcon from "@icons/vk-white.svg";
import tgIcon from "@icons/tg-white.svg";

export const SocialLinks = () => {
    return (
        <div className="space-y-3">
            <p className="text-sm">Крот в соцсетях</p>
            <div className="flex gap-2">
                <a href="">
                    <Image src={vkIcon} alt="Мы в ВКонтакте" />
                </a>
                <a href="">
                    <Image src={tgIcon} alt="Мы в Telegram" />
                </a>
            </div>
        </div>
    );
};

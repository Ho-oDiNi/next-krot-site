import VkIcon from "@icons/vk-small.svg";
import TgIcon from "@icons/tg-small.svg";

import { cn } from "@/shared/lib/cn";

type SocialLinksProps = { variant?: "burger" | "default" };

export const SocialLinks = ({ variant = "default" }: SocialLinksProps) => {
    return (
        <div
            className={cn(
                variant === "burger" ? "flex-center gap-2" : "space-y-3",
            )}
        >
            <p className="text-sm dark:text-white">Крот в соцсетях</p>
            <div className="flex gap-2">
                <a href="">
                    <VkIcon
                        className={cn(
                            variant === "burger"
                                ? "text-slate-300"
                                : "text-white",
                        )}
                        alt="Мы в ВКонтакте"
                    />
                </a>
                <a href="">
                    <TgIcon
                        className={cn(
                            variant === "burger"
                                ? "text-slate-300"
                                : "text-white",
                        )}
                        alt="Мы в Telegram"
                    />
                </a>
            </div>
        </div>
    );
};

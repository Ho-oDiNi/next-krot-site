import logoPrimaryIcon from "@images/Logo.png";
import logoOnDarkIcon from "@images/Logo.png";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";

import { cn } from "@/shared/lib/cn";

type LogoVariant = "primary" | "onDark";

interface LogoProps {
    variant?: LogoVariant;
    className?: string;
    imageClassName?: string;
    textWrapperClassName?: string;
    hideTextOnMobile?: boolean;
}

const logoByVariant: Record<LogoVariant, StaticImageData> = {
    primary: logoPrimaryIcon,
    onDark: logoOnDarkIcon,
};

const textColorByVariant: Record<LogoVariant, string> = {
    primary: "",
    onDark: "text-white",
};

const Logo = ({
    variant = "primary",
    className,
    imageClassName,
    textWrapperClassName,
    hideTextOnMobile = false,
}: LogoProps) => {
    return (
        <Link href="/" className={className}>
            <Image
                src={logoByVariant[variant]}
                alt="ALPFORCE"
                className={imageClassName}
                priority
            />
            <div
                className={cn(
                    hideTextOnMobile && "hidden md:block",
                    textColorByVariant[variant],
                    textWrapperClassName,
                )}
            >
                <strong className="text-h3">КРОТ</strong>
                <p className="text-sm text-nowrap">
                    Кроссхаб Российских Онлайн-Технологий
                </p>
            </div>
        </Link>
    );
};

export default Logo;

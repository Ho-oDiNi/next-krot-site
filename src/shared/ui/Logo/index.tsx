import LogoIcon from "@icons/logo-black.svg";

import Link from "next/link";

export const Logo = ({
    className,
    onClick,
}: {
    className?: string;
    onClick?: () => void;
}) => {
    return (
        <Link href="/" className={className} onClick={onClick}>
            <LogoIcon alt="" className="text-slate-800 dark:text-white" />
        </Link>
    );
};

import LogoIcon from "@icons/logo-black.svg";

import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/" className={className}>
            <LogoIcon alt="" className="text-slate-800 dark:text-white" />
        </Link>
    );
};

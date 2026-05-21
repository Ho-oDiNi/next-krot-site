import logoLightIcon from "@icons/logo-black.svg";
import Image from "next/image";

import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/" className={className}>
            <Image src={logoLightIcon} alt="" priority />
        </Link>
    );
};

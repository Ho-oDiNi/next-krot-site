import { ContactItemProps } from "@/widgets/layout-footer/model";
import Image from "next/image";
import Link from "next/link";

const ContactItem = ({
    icon,
    alt,
    href,
    children,
    prefetch = true,
    target,
    rel,
}: ContactItemProps) => {
    return (
        <div className="flex items-center gap-2">
            <Image className="h-6 w-auto" src={icon} alt={alt} />
            <Link
                href={href}
                className="text-main hover:opacity-70"
                prefetch={prefetch}
                target={target}
                rel={rel}
            >
                {children}
            </Link>
        </div>
    );
};

export default ContactItem;

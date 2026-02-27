import { FooterBlockProps } from "@/widgets/layout-footer/model";
import Link from "next/link";

const FooterBlock = ({ title, href, children }: FooterBlockProps) => {
    return (
        <div className="flex flex-col gap-8">
            <Link className="text-h3 hover:opacity-70" href={href}>
                {title}
            </Link>
            {children}
        </div>
    );
};

export default FooterBlock;

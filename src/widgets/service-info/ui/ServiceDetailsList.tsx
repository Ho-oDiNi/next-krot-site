interface ServiceDetailsListProps {
    title: string;
    items: string[];
    isSecond?: boolean;
}

export default function ServiceDetailsList({
    title,
    items,
}: ServiceDetailsListProps) {
    return (
        <section className="flex flex-col">
            <h3 className="text-h2">{title}</h3>
            <ul>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="relative mb-1 pl-4 before:absolute before:left-0 before:content-['•']"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    );
}

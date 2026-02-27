interface ServiceHeaderProps {
    title: string;
    description?: string;
}

export default function ServiceHeader({
    title,
    description,
}: ServiceHeaderProps) {
    return (
        <hgroup className="text-start md:max-w-2xl">
            <h2 className="text-h2">{title}</h2>
            <p className="xs:text-lg text-lg font-bold text-blue-900 lg:text-xl">
                {description}
            </p>
        </hgroup>
    );
}

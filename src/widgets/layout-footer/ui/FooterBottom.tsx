import { getDomainCity } from "@/core/domains";

const FooterBottom = async () => {
    const domainCity = await getDomainCity();
    return (
        <div className="bg-slate-800 px-(--space-inside-x) py-6">
            <div className="container mx-auto">
                <p className="text-center text-sm text-white/50">
                    Делать сложные технологические, социальные и экономические
                    процессы простыми и понятными для широкой аудитории,
                    объединяя экспертность, аналитику и современные ИТ-решения.
                </p>
            </div>
        </div>
    );
};

export default FooterBottom;

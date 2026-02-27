import Logo from "@/shared/ui/Logo";

const FooterMiddle = () => {
    return (
        <div className="bg-blue-900 px-(--space-inside-x) py-6">
            <div className="container mx-auto grid grid-cols-1 items-center gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                <Logo
                    variant="onDark"
                    className="flex gap-5"
                    imageClassName="h-full w-auto"
                    textWrapperClassName="flex flex-col justify-center"
                />
                <p className="flex max-w-xs flex-col text-sm opacity-50 sm:col-2 lg:col-4">
                    <span>ИП Маркосян Сурен Тигранович</span>
                    <span>ИНН 540129786750</span>
                    <span>ОГРНИП 320547600099167</span>
                </p>
            </div>
        </div>
    );
};

export default FooterMiddle;

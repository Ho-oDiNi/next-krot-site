import Image from "next/image";
import notFoundImage from "@images/404.gif";

import { ArticleGrid } from "@/widgets/article-grid";

export default function Custom404() {
    return (
        <div className="flex-center flex-col-reverse gap-6 md:flex-row">
            <div className="flex flex-col gap-8 md:gap-12">
                <h1 className="text-center text-3xl font-bold md:text-4xl dark:text-white">
                    Такой страницы нет, или что-то пошло не так. Крот уже
                    разбирается
                </h1>

                <div className="relative mx-auto w-full max-w-220">
                    <Image
                        src="/icons/404.svg"
                        alt="Ошибка 404"
                        width={844}
                        height={300}
                        className="h-auto w-full"
                    />
                    {/* TODO: сделать темную тему */}
                    <Image
                        src={notFoundImage}
                        alt=""
                        className="absolute-center h-auto w-[22%] max-w-40 min-w-14"
                    />
                </div>

                <p className="text-center text-3xl font-bold md:text-4xl dark:text-white">
                    Но может будет полезно:
                </p>

                <ArticleGrid />
            </div>
        </div>
    );
}

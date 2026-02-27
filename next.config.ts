import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    async redirects() {
        return [
            {
                source: "/services/remont-mezhpanelnykh-shvov",
                destination:
                    "/services/mezhpanelnyye-shvy/remont-mezhpanelnykh-shvov",
                permanent: false,
            },
            {
                source: "/services/germetizatsiya-mezhpanelnykh-shvov",
                destination:
                    "/services/mezhpanelnyye-shvy/germetizatsiya-mezhpanelnykh-shvov",
                permanent: false,
            },
            {
                source: "/services/pervichnaya-zadelka-shvov",
                destination:
                    "/services/mezhpanelnyye-shvy/pervichnaya-zadelka-shvov",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "BlindDate Admin - 管理后台",
    description: "BlindDate 相亲平台管理后台",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh">
            <body>{children}</body>
        </html>
    );
}

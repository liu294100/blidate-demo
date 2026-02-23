import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "BlindDate - 缘来如此",
    description: "全球化智能相亲平台 | Global Smart Matchmaking Platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

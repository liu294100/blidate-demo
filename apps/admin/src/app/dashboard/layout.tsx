"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
    { path: "/dashboard", label: "控制台", icon: "📊" },
    { path: "/dashboard/users", label: "用户管理", icon: "👥" },
    { path: "/dashboard/moderation", label: "内容审核", icon: "🔍" },
    { path: "/dashboard/orders", label: "订单管理", icon: "💰" },
    { path: "/dashboard/matchmaker", label: "红娘服务", icon: "💝" },
    { path: "/dashboard/settings", label: "系统设置", icon: "⚙️" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        document.cookie = "admin-token=; path=/; max-age=0";
        router.push("/");
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
                <div className="p-5 border-b border-gray-100">
                    <h1 className="text-lg font-bold text-primary-600">
                        🛡️ BlindDate
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`sidebar-link ${pathname === item.path ? "active" : ""
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                        <span>🚪</span>
                        <span>退出登录</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}

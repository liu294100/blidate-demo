"use client";

import { useEffect, useState } from "react";

interface Stats {
    totalUsers: number;
    activeUsers: number;
    totalMatches: number;
    pendingModeration: number;
    pendingMatchmaker: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then((r) => r.json())
            .then((d) => d.success && setStats(d.data))
            .catch(console.error);
    }, []);

    const cards = [
        { label: "总用户数", value: stats?.totalUsers ?? "—", icon: "👥", color: "text-blue-600 bg-blue-50" },
        { label: "活跃用户", value: stats?.activeUsers ?? "—", icon: "✅", color: "text-emerald-600 bg-emerald-50" },
        { label: "匹配总数", value: stats?.totalMatches ?? "—", icon: "💕", color: "text-pink-600 bg-pink-50" },
        { label: "待审核", value: stats?.pendingModeration ?? "—", icon: "🔍", color: "text-amber-600 bg-amber-50" },
        { label: "红娘申请", value: stats?.pendingMatchmaker ?? "—", icon: "💝", color: "text-purple-600 bg-purple-50" },
        { label: "总收入 (¥)", value: stats?.totalRevenue?.toFixed(1) ?? "—", icon: "💰", color: "text-green-600 bg-green-50" },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">控制台</h2>
                <p className="text-gray-500 text-sm mt-1">数据概览</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div key={card.label} className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-3xl font-bold mt-1">{card.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

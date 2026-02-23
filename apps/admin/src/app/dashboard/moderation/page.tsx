"use client";

import { useEffect, useState } from "react";

interface ModerationItem {
    id: string;
    name: string;
    gender: string;
    bio: string | null;
    moderationStatus: string;
    userId: string;
}

export default function ModerationPage() {
    const [items, setItems] = useState<ModerationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/moderation");
            const data = await res.json();
            if (data.success) setItems(data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async (profileId: string, status: string) => {
        try {
            await fetch(`/api/admin/moderation/${profileId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ moderationStatus: status }),
            });
            setItems((prev) => prev.filter((i) => i.id !== profileId));
        } catch (err) { console.error(err); }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">内容审核</h2>
                <p className="text-gray-500 text-sm mt-1">{items.length} 条待审核</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-gray-400 py-8">加载中...</div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-gray-500">暂无待审核内容</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">{item.name}</span>
                                    <span className="text-xs text-gray-400">{item.gender === "MALE" ? "男" : "女"}</span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.bio || "无自我介绍"}</p>
                            </div>
                            <div className="flex gap-2 ml-4 flex-shrink-0">
                                <button onClick={() => handleAction(item.id, "APPROVED")} className="admin-btn-success">通过</button>
                                <button onClick={() => handleAction(item.id, "REJECTED")} className="admin-btn-danger">拒绝</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

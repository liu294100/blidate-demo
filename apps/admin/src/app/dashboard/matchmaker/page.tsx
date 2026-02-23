"use client";

import { useEffect, useState } from "react";

interface MatchmakerReq {
    id: string;
    status: string;
    notes: string | null;
    createdAt: string;
    userName: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDING: { label: "待处理", color: "bg-amber-100 text-amber-700" },
    IN_PROGRESS: { label: "处理中", color: "bg-blue-100 text-blue-700" },
    COMPLETED: { label: "已完成", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "已取消", color: "bg-gray-100 text-gray-600" },
};

export default function MatchmakerPage() {
    const [requests, setRequests] = useState<MatchmakerReq[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/matchmaker");
            const data = await res.json();
            if (data.success) setRequests(data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/admin/matchmaker/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status } : r))
            );
        } catch (err) { console.error(err); }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">红娘服务请求</h2>
                <p className="text-gray-500 text-sm mt-1">共 {requests.length} 条请求</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">加载中...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <div className="text-4xl mb-2">💝</div>
                        <p className="text-gray-500">暂无红娘请求</p>
                    </div>
                ) : (
                    requests.map((req) => {
                        const statusInfo = STATUS_MAP[req.status] || STATUS_MAP.PENDING;
                        return (
                            <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="font-semibold">{req.userName}</span>
                                        <span className="text-xs text-gray-400 ml-2">
                                            {new Date(req.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                                {req.notes && (
                                    <p className="text-sm text-gray-500 mb-3 bg-gray-50 p-3 rounded-lg">{req.notes}</p>
                                )}
                                <div className="flex gap-2">
                                    {req.status === "PENDING" && (
                                        <button onClick={() => updateStatus(req.id, "IN_PROGRESS")} className="admin-btn-primary">开始处理</button>
                                    )}
                                    {req.status === "IN_PROGRESS" && (
                                        <button onClick={() => updateStatus(req.id, "COMPLETED")} className="admin-btn-success">标记完成</button>
                                    )}
                                    {req.status !== "COMPLETED" && req.status !== "CANCELLED" && (
                                        <button onClick={() => updateStatus(req.id, "CANCELLED")} className="admin-btn-danger">取消</button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

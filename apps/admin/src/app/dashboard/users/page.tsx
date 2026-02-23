"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserRow {
    id: string;
    email: string | null;
    phone: string | null;
    role: string;
    status: string;
    createdAt: string;
    profile?: {
        name: string;
        gender: string;
        city: string | null;
        isVerified: boolean;
    };
}

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (data.success) setUsers(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
        try {
            await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = users.filter(
        (u) =>
            (u.email?.toLowerCase().includes(search.toLowerCase()) ||
                u.profile?.name?.toLowerCase().includes(search.toLowerCase())) ??
            true
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">用户管理</h2>
                    <p className="text-gray-500 text-sm mt-1">共 {users.length} 位用户</p>
                </div>
                <input
                    type="text"
                    placeholder="搜索用户..."
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none w-60"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">加载中...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>用户</th>
                                <th>邮箱</th>
                                <th>性别</th>
                                <th>城市</th>
                                <th>认证</th>
                                <th>状态</th>
                                <th>注册时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => (
                                <tr key={user.id}>
                                    <td className="font-medium">{user.profile?.name || "—"}</td>
                                    <td className="text-gray-500">{user.email || user.phone || "—"}</td>
                                    <td>{user.profile?.gender === "MALE" ? "男" : user.profile?.gender === "FEMALE" ? "女" : "—"}</td>
                                    <td>{user.profile?.city || "—"}</td>
                                    <td>
                                        {user.profile?.isVerified ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">已认证</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">未认证</span>
                                        )}
                                    </td>
                                    <td>
                                        {user.status === "ACTIVE" ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">正常</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">已封禁</span>
                                        )}
                                    </td>
                                    <td className="text-gray-500 text-xs">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="space-x-2">
                                        <button
                                            onClick={() => router.push(`/dashboard/users/${user.id}`)}
                                            className="admin-btn-secondary"
                                        >
                                            查看
                                        </button>
                                        {user.role !== "ADMIN" && (
                                            <button
                                                onClick={() => toggleBan(user.id, user.status)}
                                                className={user.status === "BANNED" ? "admin-btn-success" : "admin-btn-danger"}
                                            >
                                                {user.status === "BANNED" ? "解封" : "封禁"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

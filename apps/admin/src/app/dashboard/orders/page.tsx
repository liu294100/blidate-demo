"use client";

import { useEffect, useState } from "react";

interface OrderItem {
    id: string;
    amount: number;
    paymentType: string;
    status: string;
    createdAt: string;
    userName: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            if (data.success) setOrders(data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">订单管理</h2>
                <p className="text-gray-500 text-sm mt-1">共 {orders.length} 条记录</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">加载中...</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">暂无订单</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>用户</th>
                                <th>类型</th>
                                <th>金额</th>
                                <th>状态</th>
                                <th>时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="font-medium">{order.userName}</td>
                                    <td>{order.paymentType === "PAYMENT" ? "💳 支付解锁" : "💝 红娘服务"}</td>
                                    <td className="text-emerald-600 font-semibold">¥{order.amount.toFixed(1)}</td>
                                    <td>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${order.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                                                order.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                                    "bg-red-100 text-red-700"
                                            }`}>
                                            {order.status === "COMPLETED" ? "已完成" : order.status === "PENDING" ? "待处理" : "失败"}
                                        </span>
                                    </td>
                                    <td className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

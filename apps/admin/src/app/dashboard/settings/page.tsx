"use client";

import { useEffect, useState } from "react";

interface ConfigItem {
    id: string;
    key: string;
    value: string;
    description: string | null;
}

export default function SettingsPage() {
    const [configs, setConfigs] = useState<ConfigItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editValues, setEditValues] = useState<Record<string, string>>({});

    useEffect(() => { fetchConfigs(); }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            if (data.success) {
                setConfigs(data.data || []);
                const values: Record<string, string> = {};
                (data.data || []).forEach((c: ConfigItem) => { values[c.key] = c.value; });
                setEditValues(values);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ configs: editValues }),
            });
            await fetchConfigs();
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">系统设置</h2>
                    <p className="text-gray-500 text-sm mt-1">基础数据配置</p>
                </div>
                <button onClick={handleSave} className="admin-btn-primary !px-4 !py-2" disabled={saving}>
                    {saving ? "保存中..." : "💾 保存配置"}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">加载中...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>配置项</th>
                                <th>说明</th>
                                <th>值</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map((config) => (
                                <tr key={config.id}>
                                    <td className="font-mono text-sm font-medium">{config.key}</td>
                                    <td className="text-gray-500">{config.description || "—"}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none w-40"
                                            value={editValues[config.key] || ""}
                                            onChange={(e) =>
                                                setEditValues((prev) => ({ ...prev, [config.key]: e.target.value }))
                                            }
                                        />
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

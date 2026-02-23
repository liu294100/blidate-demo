"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserDetail {
    id: string;
    email: string | null;
    phone: string | null;
    role: string;
    status: string;
    createdAt: string;
    profile: {
        name: string;
        gender: string;
        birthDate: string;
        city: string | null;
        education: string | null;
        occupation: string | null;
        income: string | null;
        bio: string | null;
        height: number | null;
        weight: number | null;
        avatarUrl: string | null;
        photos: string[];
        isVerified: boolean;
        moderationStatus: string;
        contact: string | null;
    } | null;
    matchPreference: {
        minAge: number;
        maxAge: number;
        genderPref: string | null;
        minHeight: number | null;
        educationPref: string | null;
        cityPref: string | null;
        description: string | null;
    } | null;
    _count: {
        likesGiven: number;
        likesReceived: number;
        matchesAsUser2: number;
        messagesSent: number;
    };
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState<{
        // Profile
        contact: string;
        name: string;
        gender: string;
        birthDate: string;
        height: string;
        weight: string;
        city: string;
        education: string;
        occupation: string;
        income: string;
        bio: string;
        
        // Match Preference
        prefMinAge: string;
        prefMaxAge: string;
        prefGender: string;
        prefMinHeight: string;
        prefEducation: string;
        prefDesc: string;
    }>({ 
        contact: "", 
        name: "",
        gender: "",
        birthDate: "",
        height: "",
        weight: "",
        city: "",
        education: "",
        occupation: "",
        income: "",
        bio: "",
        
        prefMinAge: "",
        prefMaxAge: "",
        prefGender: "",
        prefMinHeight: "",
        prefEducation: "",
        prefDesc: "" 
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/admin/users/${params.id}`);
            const data = await res.json();
            if (data.success) {
                // Parse photos JSON string if necessary
                if (data.data.profile && typeof data.data.profile.photos === 'string') {
                     try {
                        data.data.profile.photos = JSON.parse(data.data.profile.photos);
                     } catch(e) {
                        data.data.profile.photos = [];
                     }
                }
                setUser(data.data);
                setEditForm({
                    // Profile
                    contact: data.data.profile?.contact || "",
                    name: data.data.profile?.name || "",
                    gender: data.data.profile?.gender || "",
                    birthDate: data.data.profile?.birthDate ? new Date(data.data.profile.birthDate).toISOString().split('T')[0] : "",
                    height: data.data.profile?.height?.toString() || "",
                    weight: data.data.profile?.weight?.toString() || "",
                    city: data.data.profile?.city || "",
                    education: data.data.profile?.education || "",
                    occupation: data.data.profile?.occupation || "",
                    income: data.data.profile?.income || "",
                    bio: data.data.profile?.bio || "",
                    
                    // Match Preference
                    prefMinAge: data.data.matchPreference?.minAge?.toString() || "",
                    prefMaxAge: data.data.matchPreference?.maxAge?.toString() || "",
                    prefGender: data.data.matchPreference?.genderPref || "",
                    prefMinHeight: data.data.matchPreference?.minHeight?.toString() || "",
                    prefEducation: data.data.matchPreference?.educationPref || "",
                    prefDesc: data.data.matchPreference?.description || ""
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/admin/users/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profile: {
                        contact: editForm.contact,
                        name: editForm.name,
                        gender: editForm.gender,
                        birthDate: editForm.birthDate ? new Date(editForm.birthDate).toISOString() : null,
                        height: editForm.height ? Number(editForm.height) : null,
                        weight: editForm.weight ? Number(editForm.weight) : null,
                        city: editForm.city,
                        education: editForm.education || null,
                        occupation: editForm.occupation,
                        income: editForm.income,
                        bio: editForm.bio,
                    },
                    matchPreference: {
                        description: editForm.prefDesc,
                        minAge: editForm.prefMinAge ? Number(editForm.prefMinAge) : 18,
                        maxAge: editForm.prefMaxAge ? Number(editForm.prefMaxAge) : 60,
                        genderPref: editForm.prefGender || null,
                        minHeight: editForm.prefMinHeight ? Number(editForm.prefMinHeight) : null,
                        educationPref: editForm.prefEducation || null,
                    }
                }),
            });
            const data = await res.json();
            if (data.success) {
                setEditing(false);
                fetchUser();
            } else {
                alert("保存失败: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("保存失败");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">加载中...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">用户不存在</div>;

    const { profile, matchPreference, _count } = user;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-900 flex items-center text-sm"
                >
                    ← 返回列表
                </button>
                <div className="space-x-2">
                     <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                     >
                        编辑资料
                     </button>
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}>
                        {user.status === 'ACTIVE' ? '正常' : '已封禁'}
                     </span>
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                     }`}>
                        {user.role}
                     </span>
                </div>
            </div>

            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                         {profile?.avatarUrl ? (
                            <Image
                                src={profile.avatarUrl}
                                alt={profile.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                                {profile?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {profile?.name || "未命名用户"}
                            {profile?.isVerified && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    已认证
                                </span>
                            )}
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="text-gray-400 block mb-1">ID</span>
                                <span className="font-mono text-xs">{user.id}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block mb-1">邮箱</span>
                                {user.email || "—"}
                            </div>
                             <div>
                                <span className="text-gray-400 block mb-1">手机</span>
                                {user.phone || "—"}
                            </div>
                            <div>
                                <span className="text-gray-400 block mb-1">注册时间</span>
                                {new Date(user.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">个人资料</h3>
                    {profile ? (
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                            <div>
                                <dt className="text-gray-500 mb-1">性别</dt>
                                <dd className="font-medium">{profile.gender === 'MALE' ? '男' : '女'}</dd>
                            </div>
                             <div>
                                <dt className="text-gray-500 mb-1">生日</dt>
                                <dd className="font-medium">{new Date(profile.birthDate).toLocaleDateString()} ({new Date().getFullYear() - new Date(profile.birthDate).getFullYear()}岁)</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 mb-1">身高/体重</dt>
                                <dd className="font-medium">{profile.height || '—'}cm / {profile.weight || '—'}kg</dd>
                            </div>
                             <div>
                                <dt className="text-gray-500 mb-1">城市</dt>
                                <dd className="font-medium">{profile.city || '—'}</dd>
                            </div>
                             <div>
                                <dt className="text-gray-500 mb-1">学历</dt>
                                <dd className="font-medium">{profile.education || '—'}</dd>
                            </div>
                             <div>
                                <dt className="text-gray-500 mb-1">职业</dt>
                                <dd className="font-medium">{profile.occupation || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 mb-1">收入</dt>
                                <dd className="font-medium">{profile.income || '—'}</dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-gray-500 mb-1">联系方式 (仅运营可见)</dt>
                                <dd className="font-medium text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                    {profile.contact || "暂无"}
                                </dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-gray-500 mb-1">个人简介</dt>
                                <dd className="font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
                                    {profile.bio || "暂无简介"}
                                </dd>
                            </div>
                        </dl>
                    ) : (
                         <div className="text-gray-400 text-center py-8">暂无资料</div>
                    )}
                </div>

                {/* Match Preferences & Stats */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">择偶要求</h3>
                         {matchPreference ? (
                             <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-gray-500 mb-1">年龄范围</dt>
                                    <dd className="font-medium">{matchPreference.minAge} - {matchPreference.maxAge} 岁</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 mb-1">性别偏好</dt>
                                    <dd className="font-medium">{matchPreference.genderPref === 'MALE' ? '男' : matchPreference.genderPref === 'FEMALE' ? '女' : '不限'}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 mb-1">最低身高</dt>
                                    <dd className="font-medium">{matchPreference.minHeight ? `${matchPreference.minHeight}cm+` : '不限'}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 mb-1">学历要求</dt>
                                    <dd className="font-medium">{matchPreference.educationPref || '不限'}</dd>
                                </div>
                                <div className="col-span-2">
                                    <dt className="text-gray-500 mb-1">择偶要求描述</dt>
                                    <dd className="font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        {matchPreference.description || "暂无描述"}
                                    </dd>
                                </div>
                             </dl>
                         ) : (
                            <div className="text-gray-400 text-center py-4">暂无偏好设置</div>
                         )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">互动数据</h3>
                         <dl className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <dt className="text-gray-500 text-xs mb-1">发出喜欢</dt>
                                <dd className="text-xl font-bold text-gray-900">{_count.likesGiven}</dd>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <dt className="text-gray-500 text-xs mb-1">收到喜欢</dt>
                                <dd className="text-xl font-bold text-gray-900">{_count.likesReceived}</dd>
                            </div>
                             <div className="bg-gray-50 p-3 rounded-lg">
                                <dt className="text-gray-500 text-xs mb-1">匹配成功</dt>
                                <dd className="text-xl font-bold text-gray-900">{_count.matchesAsUser2}</dd>
                            </div>
                             <div className="bg-gray-50 p-3 rounded-lg">
                                <dt className="text-gray-500 text-xs mb-1">发送消息</dt>
                                <dd className="text-xl font-bold text-gray-900">{_count.messagesSent}</dd>
                            </div>
                         </dl>
                    </div>
                </div>
            </div>

            {/* Photos Gallery */}
            {profile?.photos && Array.isArray(profile.photos) && profile.photos.length > 0 && (
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">相册 ({profile.photos.length})</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {profile.photos.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                                <Image
                                    src={url}
                                    alt={`Photo ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-6 pb-2 border-b">编辑用户资料</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">基本信息</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.gender}
                                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                        >
                                            <option value="MALE">男</option>
                                            <option value="FEMALE">女</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">生日</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.birthDate}
                                            onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.height}
                                            onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.weight}
                                            onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.city}
                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">学历</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.education}
                                        onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                                    >
                                        <option value="">请选择</option>
                                        <option value="HIGH_SCHOOL">高中</option>
                                        <option value="ASSOCIATE">大专</option>
                                        <option value="BACHELOR">本科</option>
                                        <option value="MASTER">硕士</option>
                                        <option value="DOCTORATE">博士</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">职业</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.occupation}
                                            onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">收入</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.income}
                                            onChange={(e) => setEditForm({ ...editForm, income: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        联系方式 (仅运营可见)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-yellow-50"
                                        value={editForm.contact}
                                        onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                                        placeholder="微信号/手机号"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
                                    <textarea
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Match Preferences */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">择偶要求</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">最小年龄</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.prefMinAge}
                                            onChange={(e) => setEditForm({ ...editForm, prefMinAge: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">最大年龄</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={editForm.prefMaxAge}
                                            onChange={(e) => setEditForm({ ...editForm, prefMaxAge: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">性别偏好</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.prefGender}
                                        onChange={(e) => setEditForm({ ...editForm, prefGender: e.target.value })}
                                    >
                                        <option value="">不限</option>
                                        <option value="MALE">男</option>
                                        <option value="FEMALE">女</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">最低身高 (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.prefMinHeight}
                                        onChange={(e) => setEditForm({ ...editForm, prefMinHeight: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">学历要求</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.prefEducation}
                                        onChange={(e) => setEditForm({ ...editForm, prefEducation: e.target.value })}
                                    >
                                        <option value="">不限</option>
                                        <option value="HIGH_SCHOOL">高中及以上</option>
                                        <option value="ASSOCIATE">大专及以上</option>
                                        <option value="BACHELOR">本科及以上</option>
                                        <option value="MASTER">硕士及以上</option>
                                        <option value="DOCTORATE">博士</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        择偶要求描述
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                        value={editForm.prefDesc}
                                        onChange={(e) => setEditForm({ ...editForm, prefDesc: e.target.value })}
                                        placeholder="详细描述择偶要求..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                            <button
                                onClick={() => setEditing(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

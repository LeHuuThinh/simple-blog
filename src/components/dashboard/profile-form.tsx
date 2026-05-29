"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  userId: string;
  email: string;
  initialProfile: Profile | null;
}

export default function ProfileForm({
  userId,
  email,
  initialProfile,
}: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name || "",
  );
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccessMessage("Cập nhật hồ sơ thành công!");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Có lỗi xảy ra khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700 space-y-6"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded">
          {successMessage}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          disabled
          className="w-full bg-slate-700/50 border border-slate-600 rounded p-2 text-slate-400 cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Tên hiển thị
        </label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-[#e6f0fc] focus:outline-none focus:border-blue-500"
          placeholder="Nhập tên hiển thị của bạn"
        />
      </div>

      <div>
        <label
          htmlFor="avatarUrl"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          URL Ảnh đại diện (Tuỳ chọn)
        </label>
        <input
          type="url"
          id="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-[#e6f0fc] focus:outline-none focus:border-blue-500"
          placeholder="https://example.com/avatar.jpg"
        />
        {avatarUrl && (
          <div className="mt-4">
            <p className="text-sm text-slate-400 mb-2">Xem trước:</p>
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border border-slate-600"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/64?text=Lỗi+ảnh";
              }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}

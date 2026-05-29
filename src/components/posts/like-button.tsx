"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface LikeButtonProps {
  postId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
}

export function LikeButton({
  postId,
  initialLikesCount,
  initialIsLiked,
}: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount || 0);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const supabase = createClient();

  const handleToggleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Bạn cần đăng nhập để thả tim!");
      setIsLoading(false);
      return;
    }

    try {
      if (isLiked) {
        // Optimistic UI updates
        setLikesCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);

        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) {
          // Khôi phục lại nếu có lỗi
          setLikesCount((prev) => prev + 1);
          setIsLiked(true);
          console.error("Error unliking:", error);
        }
      } else {
        // Optimistic UI updates
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);

        const { error } = await supabase
          .from("likes")
          .insert({ post_id: postId, user_id: user.id });

        if (error) {
          // Khôi phục lại nếu có lỗi
          setLikesCount((prev) => Math.max(0, prev - 1));
          setIsLiked(false);
          console.error("Error liking:", error);
        }
      }
    } catch (error) {
      console.error("Like toggle failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 mt-4 rounded-full border transition-colors ${
        isLiked
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span className="font-medium">{likesCount}</span>
    </button>
  );
}

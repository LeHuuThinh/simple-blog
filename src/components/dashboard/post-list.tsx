import Link from "next/link";
import { Post } from "@/types/database";
import { DeletePostButton } from "./delete-post-button";
interface PostListProps {
  posts: Post[];
}
export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-[#e6f0fc]">
                  {post.title}
                </h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                </span>
              </div>
              {post.excerpt && (
                <p className="text-slate-300 text-sm mb2">{post.excerpt}</p>
              )}
              <p className="text-slate-400 text-xs">
                Tạo ngày:{" "}
                {new Date(post.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/posts/${post.slug}`}
                className="text-slate-300 hover:text-[#e6f0fc] px-3 py-1
text-sm"
              >
                Xem
              </Link>
              <Link
                href={`/dashboard/edit/${post.id}`}
                className="text-blue-400 hover:text-blue-300 px-3 py-1
text-sm"
              >
                Sửa
              </Link>
              <DeletePostButton postId={post.id} postTitle={post.title} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

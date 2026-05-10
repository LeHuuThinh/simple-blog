import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PostList } from "@/components/dashboard/post-list";
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  // Lấy tất cả bài viết của user (kể cả draft)
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching posts:", error);
  }
  return (
    <div className="min-h-screen bg-slate-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#e6f0fc]">
            Bài viết của tôi
          </h1>
          <Link
            href="/dashboard/new"
            className="bg-[#e6f0fc] text-slate-900 px-4 py-2 rounded-md
hover:bg-[#d0e3f8] font-medium"
          >
            + Viết bài mới
          </Link>
        </div>
        {posts && posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-[#e6f0fc] mb-4">Bạn chưa có bài viết nào.</p>
            <Link
              href="/dashboard/new"
              className="text-blue-400 hover:text-blue-300"
            >
              Viết bài đầu tiên →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

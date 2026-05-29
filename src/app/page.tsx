import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const categoryFilter = params?.category as string | undefined;
  const limit = 5;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  // Khởi tạo truy vấn
  let query = supabase
    .from("posts")
    .select(
      `
 *,
 profiles (
 display_name,
 avatar_url
 )
 `,
      { count: "exact" },
    )
    .eq("status", "published");

  // Nếu có bộ lọc category, thêm điều kiện eq
  if (categoryFilter) {
    query = query.eq("category", categoryFilter);
  }

  // Lấy bài viết đã publish, kèm thông tin author
  const {
    data: posts,
    count,
    error,
  } = await query.order("published_at", { ascending: false }).range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 0;

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#e6f0fc] mb-8">
          Bài viết mới nhất
        </h1>

        {/* Thanh phân loại bằng Category */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categoryFilter
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            Tất cả
          </Link>
          {[
            "Lập trình",
            "Đời sống",
            "Thương mại điện tử",
            "Học máy",
            "Dự án",
            "Khác",
          ].map((cat) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700"
              >
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-semibold text-[#e6f0fc] hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-slate-700 text-slate-200 text-xs font-semibold rounded-full">
                    {post.category || "Khác"}
                  </span>
                </div>

                {post.excerpt && (
                  <p className="text-slate-300 mt-2">{post.excerpt}</p>
                )}

                <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                  <span>
                    Bởi{" "}
                    <Link
                      href={`/authors/${post.author_id}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {post.profiles?.display_name || "Ẩn danh"}
                    </Link>
                  </span>
                  <span>•</span>
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("vi-VN")
                      : "Chưa xuất bản"}
                  </span>
                </div>

                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-block mt-4 text-blue-400 hover:text-blue-300"
                >
                  Đọc tiếp →
                </Link>
              </article>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                {page > 1 && (
                  <Link
                    href={`/?page=${page - 1}`}
                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded hover:bg-slate-800"
                  >
                    ← Trang trước
                  </Link>
                )}
                <span className="px-4 py-2 text-slate-300">
                  Trang {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/?page=${page + 1}`}
                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded hover:bg-slate-800"
                  >
                    Trang sau →
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-slate-300">Chưa có bài viết nào.</p>
          </div>
        )}
      </main>
    </div>
  );
}

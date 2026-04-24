import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = 5;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  // Lấy bài viết đã publish, kèm thông tin author
  const {
    data: posts,
    count,
    error,
  } = await supabase
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
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 0;

  if (error) {
    console.error("Error fetching posts:", error);
  }
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bài viết mới nhất</h1>
      {posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white p-6 rounded-lg shadow border bordergray-200"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue600 transition-colors">
                  {post.title}
                </h2>
              </Link>

              {post.excerpt && (
                <p className="text-gray-600 mt-2">{post.excerpt}</p>
              )}

              <div className="flex items-center gap-4 mt-4 text-sm textgray-500">
                <span>Bởi {post.profiles?.display_name || "Ẩn danh"}</span>
                <span>•</span>
                <span>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("vi-VN")
                    : "Chưa xuất bản"}
                </span>
              </div>

              <Link
                href={`/posts/${post.slug}`}
                className="inline-block mt-4 text-blue-600 hover:textblue-500"
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
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  ← Trang trước
                </Link>
              )}
              <span className="px-4 py-2 text-gray-600">
                Trang {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/?page=${page + 1}`}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Trang sau →
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chưa có bài viết nào.</p>
        </div>
      )}
    </main>
  );
}

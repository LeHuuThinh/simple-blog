import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", id)
    .single();

  return {
    title: `Hồ sơ của ${profile?.display_name || "Tác giả ẩn danh"}`,
    description: `Danh sách các bài viết của ${profile?.display_name || "Tác giả ẩn danh"}`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", id)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <section className="bg-slate-800 p-8 rounded-lg shadow border border-slate-700 mb-8 flex items-center gap-6">
          <div className="shrink-0">
            <img
              src={
                profile.avatar_url ||
                "https://via.placeholder.com/128?text=Ẩn+danh"
              }
              alt={profile.display_name || "Avatar"}
              className="w-24 h-24 rounded-full object-cover border-2 border-slate-600"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#e6f0fc]">
              {profile.display_name || "Ẩn danh"}
            </h1>
            <p className="text-slate-400 mt-2">
              Tham gia:{" "}
              {new Date(profile.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </section>

        {/* Posts List */}
        <section>
          <h2 className="text-2xl font-semibold text-[#e6f0fc] mb-6">
            Bài viết đã xuất bản ({posts?.length || 0})
          </h2>
          {posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700"
                >
                  <Link href={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-semibold text-[#e6f0fc] hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  {post.excerpt && (
                    <p className="text-slate-300 mt-2">{post.excerpt}</p>
                  )}
                  <div className="text-sm text-slate-400 mt-4">
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Chưa xuất bản"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
              <p className="text-slate-300">
                Tác giả này chưa có bài viết nào.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

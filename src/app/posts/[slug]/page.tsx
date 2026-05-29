import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CommentForm } from "@/components/posts/comment-form";
import { CommentList } from "@/components/posts/comment-list";
import { LikeButton } from "@/components/posts/like-button";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return {
    title: post?.title || "Bài viết",
    description: post?.excerpt || "",
  };
}
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  // Lấy bài viết
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
 *,
 profiles (
 display_name,
 avatar_url
 )
 `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error || !post) {
    notFound();
  }
  // Lấy comments
  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
 *,
 profiles (
 display_name,
 avatar_url
 )
 `,
    )
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  // Đếm tổng số lượt like của bài viết
  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id);

  // Kiểm tra user đã đăng nhập chưa
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Kiểm tra xem User hiện tại đã like bài viết chưa
  let initialIsLiked = false;
  if (user) {
    const { data: likeData } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", user.id)
      .single();

    if (likeData) {
      initialIsLiked = true;
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-gray-500">
            <span>
              Bởi{" "}
              <Link
                href={`/authors/${post.author_id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {post.profiles?.display_name || "Ẩn danh"}
              </Link>
            </span>
            <span>•</span>
            <time>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </time>
          </div>
        </header>
        <div className="prose prose-lg max-w-none mb-12">
          {post.content?.split("\n").map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Nút Like Bài viết */}
        <div className="mb-12 flex justify-center sm:justify-start">
          <LikeButton
            postId={post.id}
            initialLikesCount={likesCount || 0}
            initialIsLiked={initialIsLiked}
          />
        </div>
      </article>
      {/* Comments Section */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">
          Bình luận ({comments?.length || 0})
        </h2>
        {user ? (
          <div className="mb-8">
            <CommentForm postId={post.id} />
          </div>
        ) : (
          <p className="text-gray-500 mb-8">
            <a href="/login" className="text-blue-600 hover:text-blue500">
              Đăng nhập
            </a>{" "}
            để bình luận.
          </p>
        )}
        <CommentList comments={comments || []} />
      </section>
    </main>
  );
}

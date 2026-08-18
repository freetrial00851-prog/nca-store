import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MOCK_BLOG_POSTS } from "@/lib/data/mock-account";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <div className="mt-6 mb-10">
        <h1 className="font-serif text-4xl font-bold">The NCA Maker Blog</h1>
        <p className="text-muted-foreground mt-2">
          Tips, tutorials, and inspiration for crochet makers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span className="font-semibold text-nca-green uppercase tracking-wide">{post.category}</span>
                <span>·</span>
                <span>{post.read_time}</span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-nca-green transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.published_at)} · {post.author}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { getBlogPost, MOCK_BLOG_POSTS } from "@/lib/data/mock-account";
import { formatDate } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} | NCA Blog`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = MOCK_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
        className="mb-6"
      />

      <article className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-nca-green uppercase tracking-wide">{post.category}</span>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.read_time}</span>
        </div>

        <h1 className="font-serif text-4xl font-bold mb-6">{post.title}</h1>

        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <Image src={post.image} alt={post.title} fill sizes="800px" className="object-cover" priority />
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
          {post.content.split("\n\n").map((paragraph, i) => {
            const boldMatch = paragraph.match(/^\*\*(.+?)\*\*(.*)$/);
            if (boldMatch) {
              return (
                <p key={i}>
                  <strong className="text-foreground">{boldMatch[1]}</strong>
                  {boldMatch[2]}
                </p>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Written by {post.author}</p>
          <Link href="/shop">
            <Button className="bg-nca-green hover:bg-nca-green-dark">Shop Patterns</Button>
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-3xl mx-auto mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">More from the Blog</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
              >
                <p className="text-xs text-nca-green font-semibold uppercase mb-1">{r.category}</p>
                <h3 className="font-medium group-hover:text-nca-green transition-colors line-clamp-2">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

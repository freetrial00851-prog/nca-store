import { Breadcrumbs } from "@/components/layout/breadcrumbs";

interface InfoPageProps {
  title: string;
  children: React.ReactNode;
}

export function InfoPage({ title, children }: InfoPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <h1 className="font-serif text-3xl font-bold mt-4 mb-6">{title}</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center gap-1 text-sm text-muted-foreground py-4 ${className ?? ""}`}>
      <Link href="/" className="hover:text-nca-green transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-nca-green transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-nca-charcoal">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

import {
  Download,
  Users,
  Shield,
  Headphones,
  Sparkles,
} from "lucide-react";

const highlights = [
  { icon: Download, text: "Instant Download" },
  { icon: Users, text: "70,000+ Happy Makers" },
  { icon: Sparkles, text: "Premium Crochet Patterns" },
  { icon: Shield, text: "Secure Checkout" },
  { icon: Headphones, text: "24/7 Customer Support" },
];

export function TopBar() {
  return (
    <div className="bg-nca-cream border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 py-2 overflow-x-auto">
          {highlights.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-nca-gray whitespace-nowrap">
              <Icon className="h-3.5 w-3.5 text-nca-green" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

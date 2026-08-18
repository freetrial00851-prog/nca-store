import { InfoPage } from "@/components/content/info-page";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & Refunds">
      <p>
        All NCA patterns are digital downloads delivered instantly after purchase.
      </p>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Refund policy</h2>
        <p>Due to the nature of digital products, all sales are final once the download is available.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Having trouble?</h2>
        <p>
          If you cannot access a file or received the wrong pattern, contact{" "}
          <Link href="/contact" className="text-nca-green hover:underline">support</Link> and we&apos;ll resolve it promptly.
        </p>
      </section>
    </InfoPage>
  );
}

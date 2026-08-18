import { InfoPage } from "@/components/content/info-page";

export default function FaqPage() {
  return (
    <InfoPage title="FAQ">
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">How do I download my patterns?</h2>
        <p>After checkout, go to My Account → Downloads. Your PDF patterns are available instantly.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Can I sell items made from these patterns?</h2>
        <p>Yes — finished handmade items may be sold. You may not redistribute or resell the PDF files themselves.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">What skill levels do you offer?</h2>
        <p>We carry patterns from Beginner through Advanced. Each listing shows the recommended skill level.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Do you offer refunds?</h2>
        <p>Because patterns are digital downloads, all sales are final. Contact us if you have trouble accessing a file.</p>
      </section>
    </InfoPage>
  );
}

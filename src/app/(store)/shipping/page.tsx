import { InfoPage } from "@/components/content/info-page";

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping Info">
      <p>
        NCA sells <strong className="text-foreground">digital crochet patterns only</strong> — there is no physical shipping.
      </p>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Instant delivery</h2>
        <p>After payment, your PDF patterns are available immediately in My Account → Downloads.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Download limits</h2>
        <p>You can re-download purchased patterns anytime from your account. We recommend saving a copy to your device.</p>
      </section>
    </InfoPage>
  );
}

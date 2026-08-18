import { InfoPage } from "@/components/content/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <p>Last updated: January 2024</p>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Information we collect</h2>
        <p>We collect account details (name, email), order history, and download activity when you create an account or make a purchase.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">How we use your data</h2>
        <p>Your information is used to process orders, deliver digital downloads, send order confirmations, and improve our store experience.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Payment processing</h2>
        <p>Payments are handled securely by Stripe. We do not store full credit card numbers on our servers.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Contact</h2>
        <p>Questions about privacy? Email support@nca.com.</p>
      </section>
    </InfoPage>
  );
}

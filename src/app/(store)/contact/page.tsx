import { InfoPage } from "@/components/content/info-page";
import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <InfoPage title="Contact Us">
      <p>
        Have a question about a pattern, your order, or your account? Send us a message and we&apos;ll
        get back within 24 hours on business days.
      </p>
      <ContactForm />
      <div className="rounded-xl border border-border bg-nca-sage/30 p-5 text-sm space-y-1">
        <p><strong className="text-foreground">Email:</strong> support@nca.com</p>
        <p><strong className="text-foreground">Hours:</strong> Monday–Friday, 9am–5pm EST</p>
      </div>
    </InfoPage>
  );
}

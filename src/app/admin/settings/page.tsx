import { getSiteSettings } from "@/app/actions/site-settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

const SETTINGS_KEYS = [
  "store_name",
  "store_tagline",
  "contact_email",
  "instagram_url",
  "facebook_url",
  "pinterest_url",
];

export default async function AdminSettingsPage() {
  const values = await getSiteSettings(SETTINGS_KEYS);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Store info and social links shown around the site.</p>
      <SiteSettingsForm values={values} />
    </div>
  );
}

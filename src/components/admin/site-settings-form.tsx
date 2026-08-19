"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { updateSiteSettings, type FormActionState } from "@/app/actions/admin";

const initialState: FormActionState = {};

export function SiteSettingsForm({ values }: { values: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-6 max-w-lg">
          <div>
            <h2 className="font-semibold mb-3">Store Info</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Store Name</label>
                <Input name="store_name" defaultValue={values.store_name} placeholder="NotionCreativeArt" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tagline</label>
                <Input name="store_tagline" defaultValue={values.store_tagline} placeholder="Premium Crochet Patterns" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contact Email</label>
                <Input name="contact_email" type="email" defaultValue={values.contact_email} placeholder="hello@example.com" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Social Links</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Instagram URL</label>
                <Input name="instagram_url" defaultValue={values.instagram_url} placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Facebook URL</label>
                <Input name="facebook_url" defaultValue={values.facebook_url} placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Pinterest URL</label>
                <Input name="pinterest_url" defaultValue={values.pinterest_url} placeholder="https://pinterest.com/..." />
              </div>
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Settings saved.
            </p>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

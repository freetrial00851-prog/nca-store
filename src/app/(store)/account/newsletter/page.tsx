"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updateNewsletter } from "@/app/actions/profile";
import { toast } from "sonner";

export default function NewsletterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Newsletter" }]} className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1 max-w-lg">
          <h1 className="font-serif text-3xl font-bold mb-6">Newsletter Preferences</h1>
          <Card>
            <CardContent className="p-6">
              <form
                action={async (fd) => {
                  try {
                    await updateNewsletter(fd);
                    toast.success("Preferences saved");
                  } catch {
                    toast.error("Failed to save");
                  }
                }}
                className="space-y-6"
              >
                <label className="flex items-center justify-between">
                  <Label>Subscribe to Newsletter</Label>
                  <input type="checkbox" name="subscribed" defaultChecked className="h-5 w-5" />
                </label>

                <div>
                  <Label className="mb-3 block">Email Frequency</Label>
                  <div className="space-y-2">
                    {["weekly", "biweekly", "monthly"].map((freq) => (
                      <label key={freq} className="flex items-center gap-2">
                        <input type="radio" name="frequency" value={freq} defaultChecked={freq === "weekly"} />
                        <span className="text-sm capitalize">{freq === "biweekly" ? "Bi-weekly" : freq}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

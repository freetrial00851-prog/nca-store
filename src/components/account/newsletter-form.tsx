"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updateNewsletter } from "@/app/actions/profile";
import type { Profile } from "@/types/database";
import { toast } from "sonner";

export function NewsletterForm({ profile }: { profile: Profile | null }) {
  return (
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
            <input
              type="checkbox"
              name="subscribed"
              defaultChecked={profile?.newsletter_subscribed ?? false}
              className="h-5 w-5"
            />
          </label>

          <div>
            <Label className="mb-3 block">Email Frequency</Label>
            <div className="space-y-2">
              {["weekly", "biweekly", "monthly"].map((freq) => (
                <label key={freq} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    defaultChecked={(profile?.newsletter_frequency ?? "weekly") === freq}
                  />
                  <span className="text-sm capitalize">
                    {freq === "biweekly" ? "Bi-weekly" : freq}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit">Save Preferences</Button>
        </form>
      </CardContent>
    </Card>
  );
}

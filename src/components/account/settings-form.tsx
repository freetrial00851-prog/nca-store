"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updateProfile, updatePassword, updateNotifications } from "@/app/actions/profile";
import { isClientDemoMode } from "@/lib/checkout-client";
import type { Profile } from "@/types/database";
import { toast } from "sonner";

interface SettingsFormProps {
  profile: Profile | null;
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const isDemo = isClientDemoMode();

  const tabs = [
    { id: "profile", label: "Profile Information" },
    { id: "password", label: "Password" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy & Data" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <nav className="md:w-48 shrink-0 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-nca-sage text-nca-green" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1">
        {activeTab === "profile" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-medium mb-4">Profile Information</h2>
              <form
                action={async (fd) => {
                  try {
                    await updateProfile(fd);
                    toast.success("Profile updated");
                  } catch {
                    toast.error("Failed to update profile");
                  }
                }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? "Sarah Johnson"} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={profile?.email ?? "sarah@email.com"} disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={profile?.phone ?? "+1 (555) 123-4567"} />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={profile?.date_of_birth ?? "1992-05-10"} />
                  </div>
                  <div>
                    <Label htmlFor="country">Country / Region</Label>
                    <Input id="country" name="country" defaultValue={profile?.country ?? "United States"} />
                  </div>
                  <div>
                    <Label htmlFor="language">Preferred Language</Label>
                    <Input id="language" name="language" defaultValue={profile?.language ?? "English"} />
                  </div>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-medium mb-4">Change Password</h2>
              <form
                action={async (fd) => {
                  try {
                    await updatePassword(fd);
                    toast.success("Password updated");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Failed to update password");
                  }
                }}
                className="space-y-4 max-w-md"
              >
                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <PasswordInput id="new_password" name="new_password" required />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <PasswordInput id="confirm_password" name="confirm_password" required />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-medium mb-4">Notification Preferences</h2>
              <form
                action={async (fd) => {
                  try {
                    await updateNotifications(fd);
                    toast.success("Preferences saved");
                  } catch {
                    toast.error("Failed to save preferences");
                  }
                }}
                className="space-y-4"
              >
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="email_updates" defaultChecked={profile?.email_updates ?? true} />
                  <span className="text-sm">Email Updates</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="marketing_emails" defaultChecked={profile?.marketing_emails ?? false} />
                  <span className="text-sm">Marketing Emails</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="order_updates" defaultChecked={profile?.order_updates ?? true} />
                  <span className="text-sm">Order & Purchase Updates</span>
                </label>
                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "privacy" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-medium mb-4">Privacy & Data</h2>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    isDemo
                      ? "Demo mode: data export will be available when Supabase is connected."
                      : "Data export request received. We'll email you within 48 hours."
                  )
                }
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 text-left"
              >
                <div>
                  <p className="text-sm font-medium">Download My Data</p>
                  <p className="text-xs text-muted-foreground">Request a copy of your personal data</p>
                </div>
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    isDemo
                      ? "Demo mode: account deletion will be available when Supabase is connected."
                      : "Please contact support to delete your account."
                  )
                }
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 text-left text-red-600"
              >
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                </div>
                <span>→</span>
              </button>
              <Link
                href="/privacy"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 text-left"
              >
                <div>
                  <p className="text-sm font-medium">Privacy Policy</p>
                  <p className="text-xs text-muted-foreground">Read our privacy policy</p>
                </div>
                <span>→</span>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use server";

import { isDemoMode } from "@/lib/demo-mode";

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name?.trim() || !email?.includes("@") || !message?.trim()) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (isDemoMode()) {
    return {
      success: true,
      message: `Thanks ${name.split(" ")[0]}! We'll reply to ${email} about "${subject || "your inquiry"}" within 24 hours.`,
    };
  }

  // Live: send to email service or store in Supabase
  return { success: true, message: "Message sent! We'll get back to you soon." };
}

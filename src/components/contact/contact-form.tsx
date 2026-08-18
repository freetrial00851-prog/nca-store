"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/app/actions/contact";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await submitContact(formData);
      if (result.success) {
        toast.success(result.message);
        e.currentTarget.reset();
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-border p-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <Input name="name" required placeholder="Sarah Johnson" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <Input name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Subject</label>
        <Input name="subject" placeholder="Question about a pattern" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-input px-3 py-2 text-sm"
          placeholder="How can we help?"
        />
      </div>
      <Button type="submit" disabled={loading} className="bg-nca-green hover:bg-nca-green-dark">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

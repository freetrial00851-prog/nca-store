"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/app/actions/profile";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await subscribeNewsletter(email);
      if (result.success) {
        toast.success(result.message);
        setEmail("");
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <Input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-nca-cream/50"
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-nca-green hover:bg-nca-green-dark uppercase text-xs tracking-wider px-6 shrink-0"
      >
        {loading ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { MOCK_ADDRESSES, type MockAddress } from "@/lib/data/mock-account";
import { toast } from "sonner";

export function AddressesManager() {
  const [addresses, setAddresses] = useState<MockAddress[]>(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "shipping" | "billing">("all");

  const filtered = addresses.filter((a) => filter === "all" || a.type === filter);

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newAddress: MockAddress = {
      id: String(Date.now()),
      type: (fd.get("type") as "shipping" | "billing") || "shipping",
      full_name: fd.get("full_name") as string,
      address_line1: fd.get("address_line1") as string,
      address_line2: (fd.get("address_line2") as string) || null,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      postal_code: fd.get("postal_code") as string,
      country: fd.get("country") as string,
      phone: fd.get("phone") as string,
      is_default: fd.get("is_default") === "on",
    };
    setAddresses((prev) => [...prev, newAddress]);
    setShowForm(false);
    toast.success("Address added");
    e.currentTarget.reset();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">Addresses</h1>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "shipping", "billing"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? "bg-nca-green hover:bg-nca-green-dark" : ""}
          >
            {f === "all" ? "All" : `${f.charAt(0).toUpperCase()}${f.slice(1)}`}
          </Button>
        ))}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
              <Input name="full_name" required placeholder="Full name" />
              <select name="type" className="h-10 rounded-lg border border-input px-3 text-sm">
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </select>
              <Input name="address_line1" required placeholder="Address line 1" className="md:col-span-2" />
              <Input name="address_line2" placeholder="Address line 2 (optional)" className="md:col-span-2" />
              <Input name="city" required placeholder="City" />
              <Input name="state" placeholder="State" />
              <Input name="postal_code" required placeholder="Postal code" />
              <Input name="country" required placeholder="Country" defaultValue="United States" />
              <Input name="phone" placeholder="Phone" />
              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" name="is_default" /> Set as default
              </label>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Save Address</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((addr) => (
          <Card key={addr.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">{addr.type}</span>
                {addr.is_default && <Badge variant="success">Default</Badge>}
              </div>
              <p className="font-medium">{addr.full_name}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {addr.address_line1}
                {addr.address_line2 && `, ${addr.address_line2}`}
                <br />
                {addr.city}, {addr.state} {addr.postal_code}
                <br />
                {addr.country}
                <br />
                {addr.phone}
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(addr.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

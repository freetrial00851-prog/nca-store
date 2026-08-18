"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createCoupon } from "@/app/actions/admin";
import { MOCK_COUPONS } from "@/lib/data/mock-data";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AdminCouponsPanel() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Coupons</h1>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-medium mb-4">New Coupon</h2>
            <form
              action={async (fd) => {
                try {
                  await createCoupon(fd);
                  toast.success("Coupon created");
                  setShowForm(false);
                } catch {
                  toast.error("Failed to create coupon");
                }
              }}
              className="grid md:grid-cols-2 gap-4"
            >
              <div>
                <label className="text-sm font-medium mb-1 block">Code</label>
                <Input name="code" required placeholder="SUMMER20" className="uppercase" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Discount Type</label>
                <select name="discount_type" className="w-full h-10 rounded-lg border border-input px-3 text-sm">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Value</label>
                <Input name="value" type="number" step="0.01" required placeholder="10" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Max Uses (optional)</label>
                <Input name="max_uses" type="number" placeholder="100" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Expires At (optional)</label>
                <Input name="expires_at" type="date" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit">Save Coupon</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COUPONS.map((c) => (
                <tr key={c.code} className="border-b last:border-0">
                  <td className="p-4 font-mono font-bold">{c.code}</td>
                  <td className="p-4">
                    {c.discount_type === "percentage" ? `${c.value}%` : formatPrice(c.value)}
                  </td>
                  <td className="p-4">{c.min_order_amount > 0 ? formatPrice(c.min_order_amount) : "—"}</td>
                  <td className="p-4">
                    <Badge variant={c.is_active ? "success" : "outline"}>
                      {c.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

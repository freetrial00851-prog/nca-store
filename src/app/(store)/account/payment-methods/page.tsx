import Link from "next/link";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, CreditCard } from "lucide-react";

const mockCards = [
  { id: "1", brand: "Mastercard", last4: "4242", expiry: "12/26", is_default: true },
  { id: "2", brand: "Visa", last4: "8888", expiry: "08/27", is_default: false },
];

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: "My Account", href: "/account" },
        { label: "Payment Methods" },
      ]} className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-3xl font-bold">Payment Methods</h1>
            <Button><Plus className="h-4 w-4 mr-2" />Add New Card</Button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Payment methods are managed securely through Stripe at checkout. Saved cards will appear here once Stripe is connected.
          </p>

          <div className="space-y-4 max-w-lg">
            {mockCards.map((card) => (
              <Card key={card.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-nca-sage flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-nca-green" />
                    </div>
                    <div>
                      <p className="font-medium">{card.brand} •••• {card.last4}</p>
                      <p className="text-sm text-muted-foreground">Expires {card.expiry}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

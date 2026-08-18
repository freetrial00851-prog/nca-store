import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <LogOut className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">Log Out</h1>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to sign out?
        </p>
        <form action={logout} className="space-y-3">
          <Button type="submit" className="w-full">
            Log Out
          </Button>
          <Link href="/account">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}

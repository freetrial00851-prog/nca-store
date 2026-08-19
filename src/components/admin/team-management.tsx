"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { grantAdminByEmail, revokeAdmin, type FormActionState, type AdminTeamMember } from "@/app/actions/admin";

const initialState: FormActionState = {};

export function GrantAdminForm() {
  const [state, formAction, pending] = useActionState(grantAdminByEmail, initialState);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-1">Grant Admin Access</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The person must already have a customer account (they can sign up normally first).
        </p>
        <form action={formAction} className="flex flex-col sm:flex-row gap-3">
          <Input name="email" type="email" required placeholder="teammate@example.com" className="flex-1" />
          <Button type="submit" disabled={pending}>
            {pending ? "Adding..." : "Grant Access"}
          </Button>
        </form>
        {state.error && <p className="text-sm text-red-600 mt-2">{state.error}</p>}
        {state.success && <p className="text-sm text-green-700 mt-2">Admin access granted.</p>}
      </CardContent>
    </Card>
  );
}

export function RevokeAdminButton({ userId, disabled }: { userId: string; disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: FormActionState) => revokeAdmin(userId),
    initialState
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Remove admin access for this person?")) e.preventDefault();
      }}
    >
      <Button type="submit" variant="outline" size="sm" disabled={pending || disabled} className="text-red-600 hover:text-red-700">
        {pending ? "Removing..." : "Revoke"}
      </Button>
      {state.error && <p className="text-xs text-red-600 mt-1">{state.error}</p>}
    </form>
  );
}

export function AdminTeamList({ members, currentUserId }: { members: AdminTeamMember[]; currentUserId: string }) {
  if (members.length === 0) {
    return <p className="text-muted-foreground">No admins found.</p>;
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.userId} className="border-b border-border last:border-0">
              <td className="p-4 font-medium">
                {member.name ?? "—"} {member.userId === currentUserId && <span className="text-xs text-muted-foreground">(you)</span>}
              </td>
              <td className="p-4 text-muted-foreground">{member.email}</td>
              <td className="p-4">
                <RevokeAdminButton userId={member.userId} disabled={member.userId === currentUserId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { getAdminTeam } from "@/app/actions/admin";
import { requireUser } from "@/lib/auth-helpers";
import { GrantAdminForm, AdminTeamList } from "@/components/admin/team-management";

export default async function AdminTeamPage() {
  const [members, currentUser] = await Promise.all([getAdminTeam(), requireUser()]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Team</h1>
      <p className="text-muted-foreground mb-8">Manage who has admin access to this dashboard.</p>

      <div className="space-y-6">
        <GrantAdminForm />
        <AdminTeamList members={members} currentUserId={currentUser.id} />
      </div>
    </div>
  );
}

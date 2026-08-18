import { AdminCouponsPanel } from "@/components/admin/coupons-panel";
import { getAdminCoupons } from "@/app/actions/admin";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();
  return <AdminCouponsPanel coupons={coupons} />;
}

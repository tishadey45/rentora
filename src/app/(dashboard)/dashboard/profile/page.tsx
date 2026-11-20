import { ProfilePage } from "@/components/dashboard/profile-page"
import {
  getDashboardContext,
  toDashboardUser,
} from "@/lib/dashboard-session"

export default async function DashboardProfilePage() {
  const { session, role } = await getDashboardContext()
  const user = toDashboardUser(session, role)

  return <ProfilePage profile={user} role={role} />
}
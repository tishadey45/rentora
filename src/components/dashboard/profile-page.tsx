import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { ProfileEditor } from "@/components/dashboard/profile-editor"
import { formatRole } from "@/lib/format"
import type { DashboardRole, DashboardUser } from "@/types/dashboard"

type ProfilePageProps = {
  profile: DashboardUser
  role: DashboardRole
}

function ProfilePage({ profile, role }: ProfilePageProps) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="My Profile"
        description={`Manage the profile details for your ${formatRole(role).toLowerCase()} account.`}
      />
      <ProfileEditor profile={profile} />
    </div>
  )
}

export { ProfilePage }
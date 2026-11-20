"use client"

import { useState } from "react"
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react"

import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Muted } from "@/components/ui/typography"
import { formatDate, getInitials } from "@/lib/format"
import type { DashboardUser } from "@/types/dashboard"

type ProfileEditorProps = {
  profile: DashboardUser
}

function ProfileEditor({ profile }: ProfileEditorProps) {
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone ?? "")
  const [address, setAddress] = useState(profile.address ?? "")
  const [imageUrl, setImageUrl] = useState(profile.imageUrl ?? "")
  const initials = getInitials(name) || getInitials(profile.name)

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card className="h-fit p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative size-20 overflow-hidden rounded-2xl border border-border bg-emerald-soft text-emerald-strong">
            {imageUrl ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${imageUrl}")` }}
              />
            ) : (
              <span className="grid h-full place-items-center font-heading text-2xl font-semibold">
                {initials}
              </span>
            )}
          </div>
          <h2 className="mt-4 font-heading text-xl font-semibold">{name}</h2>
          <div className="mt-2">
            <StatusBadge status={profile.role} />
          </div>
          {profile.joinedAt ? (
            <Muted className="mt-1 text-xs">
              Member since {formatDate(profile.joinedAt)}
            </Muted>
          ) : null}
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
          <div className="flex items-start gap-2.5">
            <Mail
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-emerald-strong"
            />
            <span className="min-w-0 wrap-break-word">{profile.email}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-emerald-strong"
            />
            <span>{phone || "Phone number not provided"}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-emerald-strong"
            />
            <span>{address || "Address not provided"}</span>
          </div>
          {profile.joinedAt ? (
            <div className="flex items-start gap-2.5">
              <CalendarDays
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-emerald-strong"
              />
              <span>Joined {formatDate(profile.joinedAt)}</span>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="p-6">
        <div>
          <h2 className="font-heading text-lg font-semibold">Edit profile</h2>
          <Muted className="mt-1">
            Changes update the preview immediately. Nothing is saved in this
            static dashboard.
          </Muted>
        </div>

        <form
          noValidate
          onSubmit={(event) => event.preventDefault()}
          className="mt-6 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">Phone Number</Label>
            <Input
              id="profile-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Add a phone number"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-address">Address</Label>
            <Textarea
              id="profile-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Add your address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Image URL</Label>
            <Input
              id="profile-image"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="h-11"
            />
            <Muted className="text-xs">
              Direct image URL only. Upload integration is not enabled.
            </Muted>
          </div>

          <Button type="submit" variant="brand" size="lg">
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  )
}

export { ProfileEditor }
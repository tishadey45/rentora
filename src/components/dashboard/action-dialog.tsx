"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ActionDialogProps = {
  triggerLabel: string
  triggerVariant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  title: string
  description?: string
  confirmLabel: string
  confirmVariant?: "default" | "outline" | "destructive"
  destructive?: boolean
  children?: ReactNode
}

function ActionDialog({
  triggerLabel,
  triggerVariant = "outline",
  title,
  description,
  confirmLabel,
  confirmVariant,
  destructive = false,
  children,
}: ActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant={triggerVariant} size="sm" />}
      >
        {triggerLabel}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {children}

        <DialogFooter showCloseButton>
          <DialogClose
            render={
              <Button
                variant={
                  confirmVariant ?? (destructive ? "destructive" : "default")
                }
              />
            }
          >
            {confirmLabel}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ActionDialog }
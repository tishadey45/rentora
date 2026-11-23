"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, PackageOpen, RefreshCw, Search, X } from "lucide-react"
import toast from "react-hot-toast"

import { EquipmentCard } from "@/components/equipment/equipment-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  EQUIPMENT_CATEGORIES,
  type Equipment,
  type EquipmentAvailability,
  type RentalType,
} from "@/types/equipment"
import {
  getEquipmentList,
  type EquipmentSort,
} from "@/lib/equipment/get-equipment-list"

const RENTAL_TYPES: RentalType[] = ["Daily", "Weekly", "Monthly"]

const AVAILABILITY_OPTIONS: { value: EquipmentAvailability; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "unavailable", label: "Unavailable" },
]

const SORT_OPTIONS: { value: EquipmentSort; label: string }[] = [
  { value: "newest", label: "Recently Added" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

type CatalogState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: Equipment[] }

function EquipmentCatalog() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search = searchParams.get("search") ?? ""
  const category = searchParams.get("category") ?? ""
  const rentalType = searchParams.get("rentalType") ?? ""
  const availability = searchParams.get("availability") ?? ""
  const minPrice = searchParams.get("minPrice") ?? ""
  const maxPrice = searchParams.get("maxPrice") ?? ""
  const sort = (searchParams.get("sort") as EquipmentSort | null) ?? "newest"

  const [searchInput, setSearchInput] = useState(search)
  const [minInput, setMinInput] = useState(minPrice)
  const [maxInput, setMaxInput] = useState(maxPrice)

  const [state, setState] = useState<CatalogState>({ status: "loading" })
  const [reloadKey, setReloadKey] = useState(0)

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      const queryString = params.toString()
      router.replace(
        queryString ? `${pathname}?${queryString}` : pathname,
        { scroll: false }
      )
    },
    [searchParams, router, pathname]
  )

  // Debounce the search box.
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim()
      if (next === search) return
      updateParams({ search: next || undefined })
    }, 350)

    return () => clearTimeout(timer)
  }, [searchInput, search, updateParams])

  // Debounce the price range inputs.
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextMin = minInput.trim()
      const nextMax = maxInput.trim()
      const updates: Record<string, string | undefined> = {}
      if (nextMin !== minPrice) updates.minPrice = nextMin || undefined
      if (nextMax !== maxPrice) updates.maxPrice = nextMax || undefined
      if (Object.keys(updates).length > 0) updateParams(updates)
    }, 400)

    return () => clearTimeout(timer)
  }, [minInput, maxInput, minPrice, maxPrice, updateParams])

  // Server-side fetch whenever the query changes.
  useEffect(() => {
    let active = true

    async function load() {
      const result = await getEquipmentList({
        search,
        category,
        rentalType,
        minPrice,
        maxPrice,
        availability,
        sort,
      })
      if (!active) return

      if (result.error) {
        setState({ status: "error", message: result.error })
        toast.error(result.error)
        return
      }

      setState({ status: "success", items: result.data ?? [] })
    }

    load()

    return () => {
      active = false
    }
  }, [
    search,
    category,
    rentalType,
    minPrice,
    maxPrice,
    availability,
    sort,
    reloadKey,
  ])

  const setParam = useCallback(
    (key: string, value: string) => {
      updateParams({ [key]: value === "all" ? undefined : value })
    },
    [updateParams]
  )

  const handleRetry = useCallback(() => {
    setState({ status: "loading" })
    setReloadKey((key) => key + 1)
  }, [])

  const hasFilters = Boolean(
    search || category || rentalType || availability || minPrice || maxPrice
  )

  const handleReset = useCallback(() => {
    setSearchInput("")
    setMinInput("")
    setMaxInput("")
    router.replace(pathname, { scroll: false })
  }, [router, pathname])

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 p-4">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or location"
            aria-label="Search equipment by name or location"
            className="pl-9"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <FilterField label="Category">
            <Select
              value={category || "all"}
              onValueChange={(value) => setParam("category", value as string)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {EQUIPMENT_CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Rental Type">
            <Select
              value={rentalType || "all"}
              onValueChange={(value) => setParam("rentalType", value as string)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by rental type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {RENTAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Availability">
            <Select
              value={availability || "all"}
              onValueChange={(value) =>
                setParam("availability", value as string)
              }
            >
              <SelectTrigger
                className="w-full"
                aria-label="Filter by availability"
              >
                <SelectValue placeholder="Any availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any availability</SelectItem>
                {AVAILABILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Sort by">
            <Select
              value={sort}
              onValueChange={(value) => setParam("sort", value as string)}
            >
              <SelectTrigger className="w-full" aria-label="Sort equipment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Price range">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                value={minInput}
                onChange={(event) => setMinInput(event.target.value)}
                placeholder="Min"
                aria-label="Minimum price"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                value={maxInput}
                onChange={(event) => setMaxInput(event.target.value)}
                placeholder="Max"
                aria-label="Maximum price"
              />
            </div>
          </FilterField>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {state.status === "success"
              ? `${state.items.length} ${
                  state.items.length === 1 ? "result" : "results"
                }`
              : state.status === "loading"
                ? "Loading equipment…"
                : "—"}
          </p>
          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1.5"
            >
              <X aria-hidden="true" />
              Clear filters
            </Button>
          ) : null}
        </div>
      </Card>

      {state.status === "loading" ? (
        <EquipmentGridSkeleton />
      ) : state.status === "error" ? (
        <ResultState
          icon={<AlertTriangle aria-hidden="true" className="size-6" />}
          title="Couldn't load equipment"
          description={state.message}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={handleRetry}
              className="flex items-center gap-1.5"
            >
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          }
        />
      ) : state.items.length === 0 ? (
        <ResultState
          icon={<PackageOpen aria-hidden="true" className="size-6" />}
          title="No equipment found"
          description={
            hasFilters
              ? "No listings match your search or filters. Try adjusting them."
              : "Approved listings will appear here soon."
          }
          action={
            hasFilters ? (
              <Button type="button" variant="outline" onClick={handleReset}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state.items.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function ResultState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-12 text-center shadow-card">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <p className="font-heading text-lg font-semibold">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}

function EquipmentGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} className="gap-0 overflow-hidden p-0">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export { EquipmentCatalog, EquipmentGridSkeleton }
import { Suspense } from "react";

import { EquipmentCategories } from "@/components/equipment/equipment-categories";
import { FeaturedEquipmentSection } from "@/components/home/featured-equipment-section";
import { FeaturedEquipmentSkeleton } from "@/components/home/featured-equipment-skeleton";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Suspense fallback={<FeaturedEquipmentSkeleton />}>
        <FeaturedEquipmentSection />
      </Suspense>
      <EquipmentCategories />
    </main>
  );
}

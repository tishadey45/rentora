import { Suspense } from "react";

import { EquipmentCategories } from "@/components/equipment/equipment-categories";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { FeaturedEquipmentSection } from "@/components/home/featured-equipment-section";
import { FeaturedEquipmentSkeleton } from "@/components/home/featured-equipment-skeleton";
import { Hero } from "@/components/home/hero";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Suspense fallback={<FeaturedEquipmentSkeleton />}>
        <FeaturedEquipmentSection />
      </Suspense>
      <EquipmentCategories />
      <WhyChooseUs />
      <CustomerReviews />
    </main>
  );
}

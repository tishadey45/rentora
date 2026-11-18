export type ReviewRating = 1 | 2 | 3 | 4 | 5

export type CustomerReview = {
  id: string
  name: string
  rating: ReviewRating
  comment: string
}

export const sampleCustomerReviews: CustomerReview[] = [
  {
    id: "review-avery-coleman",
    name: "Avery Coleman",
    rating: 5,
    comment:
      "Rentora made it easy to compare equipment and rental terms for a weekend landscaping project. The listing details were clear and the process felt straightforward.",
  },
  {
    id: "review-jordan-patel",
    name: "Jordan Patel",
    rating: 4,
    comment:
      "I found a camera setup that fit my budget without spending hours searching. The daily and weekly pricing made it simple to plan the shoot.",
  },
  {
    id: "review-riley-morgan",
    name: "Riley Morgan",
    rating: 5,
    comment:
      "The marketplace is clean and easy to browse. I could see the equipment category, location, and rental period before deciding what fit my project.",
  },
  {
    id: "review-cameron-brooks",
    name: "Cameron Brooks",
    rating: 4,
    comment:
      "A useful way to explore equipment for a multi-week job. Clear prices and flexible rental periods helped me compare my options.",
  },
]
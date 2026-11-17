import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eyebrow, H1, Paragraph } from "@/components/ui/typography"

export default function Home() {
  return (
    <main className="flex flex-1 items-center py-20">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <Eyebrow>Rentora design system</Eyebrow>
          <H1>Equipment rental, simplified.</H1>
          <Paragraph>
            Global tokens, typography, and component styles are in place. Home
            page sections are intentionally not built yet.
          </Paragraph>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button>Book equipment</Button>
            <Button variant="brand">Become an owner</Button>
            <Button variant="outline">Browse all</Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="pending">Pending</Badge>
            <Badge variant="approved">Approved</Badge>
            <Badge variant="rejected">Rejected</Badge>
          </div>
        </div>
      </Container>
    </main>
  )
}
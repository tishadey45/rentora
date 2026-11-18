import { Section } from "@/components/layout/section"
import { Eyebrow, H1, Lead } from "@/components/ui/typography"

type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
}

function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <Section className="border-b border-border">
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <H1 className="mt-4">{title}</H1>
        <Lead className="mt-5">{description}</Lead>
      </div>
    </Section>
  )
}

export { PageHeader }
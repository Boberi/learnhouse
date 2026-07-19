import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/ui/Section'
import { InviteForm } from '@/components/ui/InviteForm'
import { invite } from '@/lib/content'

export function Invite() {
  return (
    <Section id="invite" className="bg-[var(--bg)]" narrow>
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium leading-tight tracking-tight text-[var(--text)] md:text-5xl">
          {invite.headline}
        </h2>
        <p className="mt-6 font-[family-name:var(--font-body)] text-base font-light text-[var(--text-muted)] md:text-lg">
          {invite.subtext}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <InviteForm />
      </Reveal>
    </Section>
  )
}

import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/ui/Section'
import { OutlineButton } from '@/components/ui/OutlineButton'
import { investment, site } from '@/lib/content'

export function Investment() {
  return (
    <Section className="bg-[var(--bg-elevated)]" narrow>
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
          Участие
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          {investment.headline}
        </h2>
        <p className="mt-6 font-[family-name:var(--font-body)] text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
          {investment.detail}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-14 border-t border-[var(--line)] pt-12">
          <p className="font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-[var(--text)] md:text-7xl">
            {investment.price}
          </p>
          <p className="mt-4 text-sm tracking-[0.12em] text-[var(--text-muted)]">
            {investment.note}
          </p>
          <div className="mt-10">
            <OutlineButton href="#invite">{site.cta}</OutlineButton>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

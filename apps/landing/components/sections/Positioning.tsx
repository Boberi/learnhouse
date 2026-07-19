import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/ui/Section'
import { positioning } from '@/lib/content'

export function Positioning() {
  return (
    <Section className="bg-[var(--bg)]">
      <Reveal>
        <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-medium leading-tight tracking-tight text-[var(--text)] md:text-5xl">
          {positioning.headline}
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-0">
        <Reveal delay={0.08}>
          <div className="md:pr-12 lg:pr-16">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
              {positioning.ordinary.label}
            </p>
            <ul className="mt-8 space-y-5">
              {positioning.ordinary.points.map((point) => (
                <li
                  key={point}
                  className="border-t border-[var(--line)] pt-5 font-[family-name:var(--font-body)] text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="border-[var(--line)] md:border-l md:pl-12 lg:pl-16">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {positioning.premium.label}
            </p>
            <ul className="mt-8 space-y-5">
              {positioning.premium.points.map((point) => (
                <li
                  key={point}
                  className="border-t border-[var(--line)] pt-5 font-[family-name:var(--font-body)] text-base font-light leading-relaxed text-[var(--text)] md:text-lg"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

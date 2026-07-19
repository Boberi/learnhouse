import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/ui/Section'
import { results } from '@/lib/content'

export function Results() {
  return (
    <Section className="bg-[var(--bg)]">
      <Reveal>
        <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          {results.headline}
        </h2>
      </Reveal>

      <ul className="mt-16 grid gap-0 border-t border-[var(--line)] md:mt-24 md:grid-cols-2">
        {results.items.map((item, i) => (
          <Reveal key={item} delay={i * 0.06}>
            <li className="flex items-baseline gap-6 border-b border-[var(--line)] py-8 md:px-2 md:py-10">
              <span className="font-[family-name:var(--font-body)] text-xs tracking-[0.16em] text-[var(--text-dim)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--text)] md:text-3xl">
                {item}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

import Image from 'next/image'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/ui/Section'
import { expert, images } from '@/lib/content'

export function Expert() {
  return (
    <Section className="bg-[var(--bg)]">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative aspect-[3/4] overflow-hidden lg:col-span-6">
          <Image
            src={images.expert}
            alt={expert.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/50 to-transparent" />
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
              Эксперт программы
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
              {expert.name}
            </h2>
            <p className="mt-3 text-sm tracking-wide text-[var(--text-muted)]">
              {expert.role}
            </p>
            <p className="mt-8 max-w-lg font-[family-name:var(--font-body)] text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
              {expert.bio}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="mt-12 grid gap-8 border-t border-[var(--line)] pt-10 sm:grid-cols-2">
              {expert.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--text)] md:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

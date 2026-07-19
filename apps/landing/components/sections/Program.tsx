'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/ui/Section'
import { program } from '@/lib/content'

export function Program() {
  const reduce = useReducedMotion()

  return (
    <Section className="bg-[var(--bg-elevated)]">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
          Программа
        </p>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          Пять модулей закрытой подготовки
        </h2>
      </Reveal>

      <ul className="mt-16 md:mt-24">
        {program.map((item, i) => (
          <motion.li
            key={item.num}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.7,
              delay: reduce ? 0 : i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group border-t border-[var(--line)] py-8 transition-colors duration-500 last:border-b hover:border-[var(--line-strong)] md:py-10"
          >
            <div className="grid gap-4 md:grid-cols-[5rem_1fr_1.2fr] md:items-baseline md:gap-10">
              <span className="font-[family-name:var(--font-body)] text-sm tracking-[0.18em] text-[var(--text-dim)] transition-colors duration-500 group-hover:text-[var(--text-muted)]">
                {item.num}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--text)] md:text-3xl">
                {item.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-sm font-light leading-relaxed text-[var(--text-muted)] md:text-base">
                {item.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}

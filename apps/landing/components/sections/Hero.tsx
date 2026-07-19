'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { OutlineButton } from '@/components/ui/OutlineButton'
import { site, images } from '@/lib/content'

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt="Интерьер элитной московской квартиры"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center ${reduce ? '' : 'hero-kenburns'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/55 to-[var(--bg)]/25" />
        <div className="absolute inset-0 bg-[var(--bg)]/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-28 md:px-10 md:pb-24">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-body)] text-xs font-medium uppercase tracking-[0.28em] text-[var(--text-muted)]"
        >
          {site.brand}
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.08] tracking-tight text-[var(--text)] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {site.title}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl font-[family-name:var(--font-body)] text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg"
        >
          {site.subtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <OutlineButton href="#invite">{site.cta}</OutlineButton>
        </motion.div>
      </div>
    </section>
  )
}

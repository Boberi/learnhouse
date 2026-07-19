import Image from 'next/image'
import { Reveal } from '@/components/Reveal'
import { community, images } from '@/lib/content'

export function Community() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden md:min-h-[80vh]">
      <div className="absolute inset-0">
        <Image
          src={images.community}
          alt="Архитектура премиального пространства"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-6 py-24 md:min-h-[80vh] md:px-10 md:py-32">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
            {community.headline}
          </p>
          <h2 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-medium leading-tight tracking-tight text-[var(--text)] md:text-5xl">
            {community.text}
          </h2>
        </Reveal>
      </div>
    </section>
  )
}

import { CursorTrail } from '@/components/CursorTrail'
import { Hero } from '@/components/sections/Hero'
import { Positioning } from '@/components/sections/Positioning'
import { Program } from '@/components/sections/Program'
import { Expert } from '@/components/sections/Expert'
import { Community } from '@/components/sections/Community'
import { Results } from '@/components/sections/Results'
import { Investment } from '@/components/sections/Investment'
import { Invite } from '@/components/sections/Invite'

export default function HomePage() {
  return (
    <>
      <CursorTrail />
      <main className="relative bg-[var(--bg)] text-[var(--text)]">
        <Hero />
        <Positioning />
        <Program />
        <Expert />
        <Community />
        <Results />
        <Investment />
        <Invite />
        <footer className="border-t border-[var(--line)] px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="font-[family-name:var(--font-display)] text-lg text-[var(--text-muted)]">
              Академия элитных продаж
            </p>
            <p className="text-xs tracking-[0.12em] text-[var(--text-dim)]">
              Закрытая программа · Москва
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}

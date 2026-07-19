import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  id?: string
  className?: string
  narrow?: boolean
}

export function Section({ children, id, className = '', narrow }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative px-6 py-24 md:px-10 md:py-32 lg:py-40 ${className}`}
    >
      <div className={`mx-auto w-full ${narrow ? 'max-w-3xl' : 'max-w-6xl'}`}>
        {children}
      </div>
    </section>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type OutlineButtonProps = {
  children: ReactNode
  href?: string
  className?: string
} & ComponentPropsWithoutRef<'button'>

export function OutlineButton({
  children,
  href,
  className = '',
  ...props
}: OutlineButtonProps) {
  const styles = `inline-flex items-center justify-center border border-[var(--line-strong)] bg-[var(--bg)]/40 px-7 py-3.5 text-sm font-medium tracking-[0.04em] text-[var(--text)] transition duration-500 hover:border-[var(--text)] hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)] ${className}`

  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={styles} {...props}>
      {children}
    </button>
  )
}

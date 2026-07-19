'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function InviteForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      experience: String(data.get('experience') ?? '').trim(),
    }

    try {
      const res = await fetch('/landing/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as { detail?: string }

      if (!res.ok) {
        setStatus('error')
        setError(json.detail ?? 'Не удалось отправить заявку')
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setError('Ошибка сети. Попробуйте ещё раз.')
    }
  }

  const fieldClass =
    'w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 font-[family-name:var(--font-body)] text-base font-light text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none transition duration-300 focus:border-[var(--text-muted)]'

  return (
    <form onSubmit={onSubmit} className="mt-12 space-y-8 md:mt-16">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
          Имя
        </span>
        <input
          name="name"
          required
          autoComplete="name"
          className={`mt-2 ${fieldClass}`}
          placeholder="Как к вам обращаться"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
          Телефон
        </span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className={`mt-2 ${fieldClass}`}
          placeholder="+7"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
          Опыт работы
        </span>
        <textarea
          name="experience"
          required
          rows={3}
          className={`mt-2 resize-none ${fieldClass}`}
          placeholder="Кратко о вашем опыте в недвижимости"
        />
      </label>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center border border-[var(--line-strong)] bg-[var(--bg)]/40 px-7 py-3.5 text-sm font-medium tracking-[0.04em] text-[var(--text)] transition duration-500 hover:border-[var(--text)] hover:bg-[var(--accent)] disabled:cursor-wait disabled:opacity-60"
      >
        {status === 'loading' ? 'Отправка…' : 'Получить приглашение'}
      </button>

      {status === 'success' && (
        <p className="text-sm font-light text-[var(--text-muted)]">
          Заявка принята. Мы свяжемся с вами лично.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm font-light text-red-300/80">{error}</p>
      )}
    </form>
  )
}

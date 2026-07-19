'use client'

import { useEffect, useRef } from 'react'

type Point = { x: number; y: number; life: number }

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const points = useRef<Point[]>([])
  const raf = useRef(0)

  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqFine = window.matchMedia('(pointer: fine)')
    if (mqReduce.matches || !mqFine.matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      points.current.push({ x: e.clientX, y: e.clientY, life: 1 })
      if (points.current.length > 40) points.current.shift()
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      points.current = points.current
        .map((p) => ({ ...p, life: p.life - 0.025 }))
        .filter((p) => p.life > 0)

      for (let i = 0; i < points.current.length; i++) {
        const p = points.current[i]
        const r = 1.2 + p.life * 2.2
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(242, 240, 235, ${0.08 + p.life * 0.18})`
        ctx.fill()
      }
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] hidden md:block"
    />
  )
}

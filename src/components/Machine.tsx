import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const GREEN = '#2f8f52'
const RED = '#c9343c'
const rad = (deg: number) => (deg * Math.PI) / 180

type Kind = 'scissor' | 'boom' | 'spider'

// Each draw function poses the machine for k in 0…1 (stowed → raised)
const draw: Record<Kind, (svg: SVGSVGElement, k: number) => void> = {
  scissor(svg, k) {
    const height = 26 + 84 * k
    const step = height / 4
    let d = ''
    for (let i = 0; i < 4; i++) {
      const y0 = 158 - i * step
      d += `M72 ${y0}L148 ${y0 - step}M148 ${y0}L72 ${y0 - step}`
    }
    svg.querySelector('.arms')!.setAttribute('d', d)
    svg.querySelector('.basket')!.setAttribute('transform', `translate(0 ${158 - height})`)
  },
  boom(svg, k) {
    const a = rad(22 + 38 * k)
    const x = 70 + Math.cos(a) * 112
    const y = 150 - Math.sin(a) * 112
    svg.querySelector('.arms')!.setAttribute('d', `M70 150L${x} ${y}`)
    svg.querySelector('.basket')!.setAttribute('transform', `translate(${x - 60} ${y - 2})`)
  },
  spider(svg, k) {
    const a = rad(112 - 14 * k)
    const jx = 110 + Math.cos(a) * 62
    const jy = 142 - Math.sin(a) * 62
    const b = rad(8 + 34 * k)
    const x = jx + Math.cos(b) * 78
    const y = jy - Math.sin(b) * 78
    svg.querySelector('.arms')!.setAttribute('d', `M110 142L${jx} ${jy}L${x} ${y}`)
    svg.querySelector('.basket')!.setAttribute('transform', `translate(${x - 60} ${y - 2})`)
  },
}

export default function Machine({ kind }: { kind: Kind }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current!
    const pose = { k: 0 }
    draw[kind](svg, 0)
    const tween = gsap.to(pose, {
      k: 1,
      duration: 3.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      paused: true,
      onUpdate: () => draw[kind](svg, pose.k),
    })
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? tween.play() : tween.pause()))
    io.observe(svg)
    return () => {
      io.disconnect()
      tween.kill()
    }
  }, [kind])

  return (
    <svg ref={ref} className="machine" viewBox="0 0 220 190" aria-hidden="true">
      <ellipse cx="110" cy="180" rx="84" ry="6" fill="#0e1726" opacity=".08" />
      {kind === 'scissor' && (
        <>
          <rect x="62" y="158" width="96" height="14" rx="3" fill={RED} />
          <circle cx="78" cy="174" r="7" fill="#1b2433" />
          <circle cx="142" cy="174" r="7" fill="#1b2433" />
        </>
      )}
      {kind === 'boom' && (
        <>
          <rect x="40" y="156" width="92" height="14" rx="3" fill={RED} />
          <rect x="56" y="142" width="34" height="16" rx="3" fill={GREEN} />
          <circle cx="56" cy="173" r="8" fill="#1b2433" />
          <circle cx="118" cy="173" r="8" fill="#1b2433" />
        </>
      )}
      {kind === 'spider' && (
        <>
          <path d="M110 150L66 178M110 150L154 178M110 150L88 178M110 150L132 178" stroke="#1b2433" strokeWidth="4" strokeLinecap="round" />
          <rect x="92" y="140" width="36" height="18" rx="4" fill={RED} />
        </>
      )}
      <path className="arms" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <g className="basket">
        <rect x="60" y={kind === 'scissor' ? -6 : -4} width={kind === 'scissor' ? 100 : 26} height="6" rx="2" fill="#1b2433" />
        <path
          d={kind === 'scissor' ? 'M62-6V-24H158V-6M62-15H158' : 'M61-4V-22H85V-4M61-13H85'}
          fill="none"
          stroke="#1b2433"
          strokeWidth="2.5"
        />
        <rect x={kind === 'scissor' ? 104 : 68} y="-24" width="9" height="16" rx="3" fill="#f5a30f" />
        <circle cx={kind === 'scissor' ? 108.5 : 72.5} cy="-29" r="4.5" fill="#ffd21f" />
      </g>
    </svg>
  )
}

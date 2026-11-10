import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Check } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scene, STAGE_COUNT } from '../scene/Scene'
import { systems } from '../data'

const HERO_STAGES = STAGE_COUNT - systems.length

/** Pinned 3D flight: two hero beats, then one stop per access system. */
export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [stage, setStage] = useState(0)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    const section = sectionRef.current!
    let scene: Scene
    try {
      scene = new Scene(canvasRef.current!, labelsRef.current!)
    } catch {
      setWebgl(false)
      return
    }
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const f = self.progress * (STAGE_COUNT - 1)
        scene.setStage(f)
        setStage(Math.round(f))
      },
    })
    triggerRef.current = trigger
    const visible = new IntersectionObserver(([entry]) => (entry.isIntersecting ? scene.start() : scene.stop()))
    visible.observe(section)
    const onResize = () => scene.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      visible.disconnect()
      trigger.kill()
      scene.dispose()
    }
  }, [])

  const goTo = (index: number) => {
    const t = triggerRef.current
    if (!t) return
    const top = t.start + ((t.end - t.start) * (index + HERO_STAGES)) / (STAGE_COUNT - 1)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const active = stage - HERO_STAGES
  const system = systems[Math.max(0, active)]

  return (
    <section id="top" className="journey" ref={sectionRef} style={{ height: `${100 + (STAGE_COUNT - 1) * 90}vh` }}>
      <div id="systems-start" className="journey-anchor" style={{ top: `${HERO_STAGES * 90}vh` }} />
      <div className={`journey-sticky ${webgl ? '' : 'no-webgl'}`}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="journey-shade" data-mode={active >= 0 ? 'systems' : 'hero'} />
        <div className="callouts" ref={labelsRef} aria-hidden="true" />

        <div className={`hero-line ${stage === 0 ? 'is-on' : ''}`}>
          <p className="eyebrow">Façade access · Façade cleaning · Work at height</p>
          <h1>
            The higher the glass,
            <br />
            the harder the <em>reach.</em>
          </h1>
        </div>
        <div className={`hero-line ${stage === 1 ? 'is-on' : ''}`} aria-hidden={stage !== 1}>
          <p className="hero-big">We reach it.</p>
          <p className="hero-sub">Façade access &amp; cleaning, at any height.</p>
          <span className="hero-rule" />
        </div>
        <div className={`scroll-cue ${stage === 0 ? 'is-on' : ''}`}>
          <span>Scroll to ascend</span>
          <ArrowDown size={16} />
        </div>

        <div className={`system-panel ${active >= 0 ? 'is-on' : ''}`} aria-live="polite">
          <p className="eyebrow">
            Access systems · {String(Math.max(0, active) + 1).padStart(2, '0')} / {String(systems.length).padStart(2, '0')}
          </p>
          <div className="system-body" key={system.name}>
            <h2>{system.name}</h2>
            <div className="tags">
              {system.tags.map((tag, i) => (
                <span key={tag} className={i % 2 ? 'tag red' : 'tag'}>{tag}</span>
              ))}
            </div>
            <ul className="system-points">
              {system.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p className="mini-label">Key features</p>
            <ul className="system-features">
              {system.features.map((feature, i) => (
                <li key={feature}>
                  <span className={i % 2 ? 'tick red' : 'tick'}><Check size={11} strokeWidth={3.2} /></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="system-steps">
            {systems.map((s, i) => (
              <button key={s.name} type="button" aria-label={`Show ${s.name}`} className={i <= active ? (i % 2 ? 'is-done red' : 'is-done') : ''} onClick={() => goTo(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

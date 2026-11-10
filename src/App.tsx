import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Apple from './components/Apple'
import Journey from './components/Journey'
import AppleStory from './components/AppleStory'
import { Care, Certifications, Contact, Footer, Manufacturing, Platforms, Projects, Services, Stats } from './components/Sections'

gsap.registerPlugin(ScrollTrigger)

const NAV = [
  ['Systems', '#systems-start'],
  ['Story', '#story'],
  ['Services', '#services'],
  ['Manufacturing', '#manufacturing'],
  ['Projects', '#projects'],
]

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const done = window.setTimeout(() => setLoaded(true), 1900)
    return () => window.clearTimeout(done)
  }, [])

  // Smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  // Section choreography: cards fly in from depth, stages drift like a camera pan
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.fly-group').forEach((group) => {
          const dir = group.dataset.dir === 'right' ? 1 : -1
          gsap.from(group.querySelectorAll('.fly'), {
            autoAlpha: 0,
            rotateY: 42 * dir,
            rotateX: 10,
            x: 120 * dir,
            z: -320,
            transformPerspective: 1300,
            duration: 1.15,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: { trigger: group, start: 'top 72%' },
          })
        })
        gsap.utils.toArray<HTMLElement>('.rise').forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 44, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
        })
        gsap.from('.ribbon path', {
          strokeDashoffset: 1,
          duration: 2,
          ease: 'power2.inOut',
          stagger: 0.15,
          scrollTrigger: { trigger: '.contact', start: 'top 70%' },
        })
      })
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.stage').forEach((stage) => {
          const dir = stage.dataset.dir === 'right' ? -1 : 1
          gsap.fromTo(
            stage,
            { rotateY: 5 * dir, rotateX: 3, transformPerspective: 1800 },
            { rotateY: -4 * dir, rotateX: -2, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const n = { v: 0 }
        gsap.to(n, {
          v: end,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => (el.textContent = Math.round(n.v).toLocaleString('en-IN')),
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-bar]').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: Number(el.dataset.bar), duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.fromTo('.ring-arc', { strokeDashoffset: 100 }, { strokeDashoffset: 17, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: '.ring', start: 'top 85%' } })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <div className={`loader ${loaded ? 'is-done' : ''}`} aria-hidden="true">
        <Apple className="loader-apple" />
        <p className="wordmark"><span>Apple</span>tree</p>
        <p className="loader-line">Façade Access · Façade Cleaning · Work at Height</p>
      </div>

      <header className="header">
        <a className="logo-pill" href="#top" aria-label="Appletree home"><img src="./images/appletree-logo.png" alt="Appletree" /></a>
        <nav className={`nav ${menu ? 'is-open' : ''}`} aria-label="Primary">
          {NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
          <a className="nav-cta" href="#contact" onClick={() => setMenu(false)}>Start a project <ArrowUpRight size={15} /></a>
        </nav>
        <button className="menu-button" type="button" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main>
        <Journey />
        <Stats />
        <AppleStory />
        <Services />
        <Manufacturing />
        <Platforms />
        <Care />
        <Certifications />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

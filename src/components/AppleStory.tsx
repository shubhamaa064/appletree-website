import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Apple from './Apple'

const PHOTOS = ['./images/sattva-tower.jpg', './images/dlf-downtown.jpg', './images/manohar-airport.jpg', './images/dlf-cyber-park.jpg']
const STEPS = ['We design.', 'We build.', 'We install.', 'We maintain.']
// Quadrant centres in the mark's 200 × 220 viewBox
const CENTRES = [[62, 68], [148, 82], [56, 150], [140, 162]]
const ZOOM = 2.9

/** Scroll-scrubbed brand story: the mark opens quadrant by quadrant. */
export default function AppleStory() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mark = root.current!.querySelector<HTMLElement>('.story-mark')!
      const photos = gsap.utils.toArray<SVGImageElement>('.apple-photo')
      const caps = gsap.utils.toArray<HTMLElement>('.story-cap')
      gsap.set(photos, { opacity: 0 })
      gsap.set('.story-spark', { scale: 0 })
      gsap.set('.story-flag i', { scaleX: 0 })
      gsap.set(caps.slice(1), { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 0.6 },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      })
      const swap = (from: number, to: number, at: number) => {
        tl.to(caps[from], { autoAlpha: 0, y: -24, duration: 0.3 }, at)
        tl.fromTo(caps[to], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, at + 0.3)
      }
      swap(0, 1, 0.6)
      CENTRES.forEach(([cx, cy], i) => {
        const at = 1.6 + i
        tl.to(mark, {
          scale: ZOOM,
          x: () => -((cx - 100) / 200) * mark.offsetWidth * ZOOM,
          y: () => -((cy - 110) / 220) * mark.offsetHeight * ZOOM,
        }, at)
        tl.to(photos[i], { opacity: 1 }, at + 0.1)
        swap(i + 1, i + 2, at)
      })
      tl.to(mark, { scale: 1, x: 0, y: 0, duration: 0.8 }, 5.7)
      swap(5, 6, 5.8)
      tl.to(photos, { opacity: 0, stagger: 0.08 }, 6.5)
      tl.fromTo('.story-spark', { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, stagger: 0.1, ease: 'back.out(2)' }, 6.7)
      tl.to(mark, { scale: 0.62, y: () => -window.innerHeight * 0.14 }, 7.6)
      tl.to('.story-spark', { scale: 0, duration: 0.3 }, 7.6)
      swap(6, 7, 7.6)
      tl.fromTo('.story-flag i', { scaleX: 0 }, { scaleX: 1, stagger: 0.12, duration: 0.5 }, 7.9)
      tl.to({}, { duration: 0.5 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="story" className="story" ref={root} aria-label="How Appletree works">
      <div className="story-sticky">
        <div className="story-mark">
          <Apple photos={PHOTOS} />
          {[0, 1, 2].map((i) => (
            <svg key={i} className={`story-spark s${i}`} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="#fff" />
            </svg>
          ))}
        </div>
        <div className="story-caps">
          <p className="story-cap">Some glass is hard to reach.</p>
          <p className="story-cap">We make the machines that <em>reach it.</em></p>
          {STEPS.map((step) => <p className="story-cap pill" key={step}>{step}</p>)}
          <p className="story-cap">We clean.</p>
          <div className="story-cap story-end">
            <span className="story-flag"><i /><i /><i /></span>
            <strong>Designed and built in India.</strong>
            <small>One connected team — from first drawing to everyday operation.</small>
          </div>
        </div>
      </div>
    </section>
  )
}

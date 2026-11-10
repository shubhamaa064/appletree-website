import { ArrowUpRight, Brush, Cable, Check, Construction, Forklift, Globe, Mail, MapPin, Phone, Plane, Sparkles, Wrench } from 'lucide-react'
import Apple from './Apple'
import Machine from './Machine'
import { certifications, contact, fcoms, madeInHouse, partners, plants, projects, services, stats } from '../data'

const icons = { sparkles: Sparkles, rope: Cable, bmu: Construction, lift: Forklift, wrench: Wrench, broom: Brush }
const maxArea = Math.max(...plants.map((p) => p.area))

export function Stats() {
  return (
    <section className="stats light" aria-label="Appletree in numbers">
      {stats.map((s) => (
        <div className="stat rise" key={s.label}>
          <strong><span data-count={s.value}>0</span>{s.suffix}</strong>
          <span>{s.label}</span>
        </div>
      ))}
    </section>
  )
}

export function Services() {
  return (
    <section id="services" className="band light">
      <div className="stage fly-group">
        <header className="band-head fly">
          <p className="eyebrow">Our services</p>
          <h2>Every façade service. <em>One partner.</em></h2>
        </header>
        <div className="card-grid three">
          {services.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <article className={`card fly ${i % 2 ? 'red' : ''}`} key={s.title}>
                <span className="card-icon"><Icon size={26} strokeWidth={1.6} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Manufacturing() {
  return (
    <section id="manufacturing" className="band dark">
      <div className="stage split fly-group" data-dir="right">
        <div className="panel fly">
          <p className="eyebrow">Manufacturing</p>
          <h2>Made in-house.</h2>
          <p className="lead">Façade access equipment, built by Appletree.</p>
          <ul className="checks">
            {madeInHouse.map((item) => (
              <li key={item}><span className="tick"><Check size={13} strokeWidth={3} /></span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="plants">
          <p className="panel slim fly mini-label">Our plants</p>
          {plants.map((p) => (
            <div className={`panel plant fly ${p.upcoming ? 'green' : ''}`} key={p.name}>
              <div className="plant-row">
                <h3>{p.name}{p.upcoming && <span className="tag solid">Upcoming</span>}</h3>
                <strong><span data-count={p.area}>0</span> m²</strong>
              </div>
              <div className="bar"><i data-bar={p.area / maxArea} /></div>
              <small>{p.note}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Platforms() {
  return (
    <section id="platforms" className="band light">
      <div className="stage fly-group">
        <header className="band-head fly">
          <p className="eyebrow">Aerial work platforms</p>
          <h2>The right machine. <em className="red">With the right crew.</em></h2>
          <p className="lead"><span className="tag">Official Sinoboom partner</span> Equipment + trained manpower as one solution · deployed at Delhi Airport T2 &amp; T3</p>
        </header>
        <div className="machines">
          <figure className="fly"><Machine kind="scissor" /><figcaption><strong>Scissor lifts</strong>Straight-up reach, wide deck</figcaption></figure>
          <figure className="fly"><Machine kind="boom" /><figcaption><strong>Boom lifts</strong>Up-and-over reach</figcaption></figure>
          <figure className="fly"><Machine kind="spider" /><figcaption><strong>Spider crawlers</strong>Compact tracks &amp; outriggers</figcaption></figure>
        </div>
      </div>
    </section>
  )
}

export function Care() {
  return (
    <section id="care" className="band dark">
      <div className="stage fly-group" data-dir="right">
        <header className="band-head fly">
          <p className="eyebrow">Service · Safety · Transparency</p>
          <h2>Always on call. <em>Always on record.</em></h2>
        </header>
        <div className="card-grid three">
          <article className="panel fly">
            <div className="ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" />
                <circle className="ring-arc" cx="60" cy="60" r="52" pathLength="100" />
              </svg>
              <strong>4<small>hrs</small></strong>
            </div>
            <h3>Emergency breakdown response</h3>
            <p>Our maintenance team responds to breakdowns within 4 hours.</p>
          </article>
          <article className="panel fly">
            <div className="records" aria-hidden="true">
              <p className="mini-label">Zapium · Equipment</p>
              {['BMU-01', 'CRD-12', 'HST-07', 'GRU-02'].map((unit, i) => (
                <div className="record" key={unit}><i /><span>{unit}</span><b>{i === 1 ? 'Inspection due' : 'Up to date'}</b></div>
              ))}
            </div>
            <h3>Every machine on Zapium</h3>
            <p>Each façade access equipment is tracked, with its full service record one click away.</p>
          </article>
          <article className="panel fly green">
            <span className="tag solid">In-house software</span>
            <h3 className="xl">FCOMS</h3>
            <p className="accent">Façade Cleaning &amp; Operations Management System</p>
            <ul className="checks small">
              {fcoms.map((item, i) => (
                <li key={item}><span className={i % 2 ? 'tick red' : 'tick'}><Check size={11} strokeWidth={3} /></span>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

export function Certifications() {
  return (
    <section id="certifications" className="band light">
      <div className="stage fly-group">
        <header className="band-head fly">
          <p className="eyebrow">Certifications</p>
          <h2>Certified to <em>global standards.</em></h2>
        </header>
        <div className="card-grid four">
          {certifications.map((c, i) => (
            <article className={`card cert fly ${i % 2 ? '' : 'red'}`} key={c.name}>
              <span className="seal">{c.code !== 'CE' && <small>ISO</small>}{c.code}</span>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
        <p className="footnote fly">CE marking covers our façade access systems and scaffoldless elevator installation.</p>
      </div>
    </section>
  )
}

export function Projects() {
  return (
    <section id="projects" className="band dark">
      <div className="stage fly-group" data-dir="right">
        <header className="band-head fly">
          <p className="eyebrow">Trusted by</p>
          <h2>Landmark sites. <em className="dim">Leading partners.</em></h2>
        </header>
        <article className="panel featured fly">
          <span className="card-icon"><Plane size={26} strokeWidth={1.6} /></span>
          <div>
            <p className="mini-label">Featured project</p>
            <h3>Delhi IGI Airport · Terminals 2 &amp; 3</h3>
            <p>Façade cleaning &amp; façade access equipment maintenance · ~64-member on-site team</p>
          </div>
          <span className="tag red">2026 – 2030</span>
        </article>
        <div className="project-grid">
          {projects.map((p) => (
            <article className="project fly" key={p.name}>
              <div className="project-photo"><img src={p.image} alt={p.name} loading="lazy" /></div>
              <div className="project-info">
                <p className="mini-label">{p.location}</p>
                <h3>{p.name}</h3>
                <p className="accent">{p.system}</p>
                <p>{p.text}</p>
                <ul>{p.facts.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
        <p className="mini-label fly">Business partners</p>
        <div className="partners">
          {partners.map((name) => <span className="panel fly" key={name}>{name}</span>)}
        </div>
        <blockquote className="quote fly">
          <p>“You have ensured that the safety culture is implemented and that DLF safety standards are followed at every point of time.”</p>
          <footer><strong>CBRE South Asia Pvt. Ltd.</strong> · DLF Cybercity Chennai</footer>
        </blockquote>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="band light contact">
      <svg className="ribbon" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 70C260 10 420 150 720 96S1200 20 1460 90" pathLength="1" stroke="#f39a2e" />
        <path d="M-20 108C260 48 420 188 720 134S1200 58 1460 128" pathLength="1" stroke="#e9edf0" />
        <path d="M-20 146C260 86 420 226 720 172S1200 96 1460 166" pathLength="1" stroke="#1d8a3a" />
      </svg>
      <div className="contact-inner">
        <Apple className="contact-apple rise" />
        <p className="wordmark rise"><span>Apple</span>tree</p>
        <span className="story-flag rise"><i /><i /><i /></span>
        <h2 className="rise">Let’s reach <em>higher.</em></h2>
        <p className="lead rise">Designed and built in India. Tell us about your building and we’ll shape the access around it.</p>
        <a className="button rise" href={`mailto:${contact.email}?subject=Fa%C3%A7ade%20access%20enquiry`}>
          Start a project <ArrowUpRight size={18} />
        </a>
        <div className="chips rise">
          <a href={contact.phoneHref}><Phone size={16} />{contact.phone}</a>
          <a href={`mailto:${contact.email}`}><Mail size={16} />{contact.email}</a>
          <a href={`https://${contact.web}`} target="_blank" rel="noreferrer"><Globe size={16} />{contact.web}</a>
        </div>
        <p className="address rise"><MapPin size={15} />{contact.address}</p>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <a className="logo-pill" href="#top"><img src="./images/appletree-logo.png" alt="Appletree" /></a>
      <p>Façade Access · Façade Cleaning · Work at Height</p>
      <p className="dim">ISO 9001 · 14001 · 45001 · 41001 · 50001 · 46001 · 14064-1 | CE marked</p>
      <p className="dim">© {new Date().getFullYear()} Appletree Building Maintenance Pvt. Ltd.</p>
    </footer>
  )
}

import { useId } from 'react'

const RED = '#c9343c'
const GREEN = '#2f8f52'
const BODY = 'M100 58C80 40 30 38 22 92c-8 58 33 122 60 120 10-1 14-6 20-6 8 0 12 6 24 5 30-3 64-61 54-119-8-52-58-52-80-34Z'
const V = 'C106 90 98 150 84 222'
const H = 'C70 86 130 104 195 128'

// Quadrants in reading order: top-left, top-right, bottom-left, bottom-right
const QUADS = [
  { v: 'l', h: 't', fill: RED, box: [10, 30, 106, 76] },
  { v: 'r', h: 't', fill: GREEN, box: [98, 34, 96, 98] },
  { v: 'l', h: 'b', fill: GREEN, box: [8, 80, 98, 140] },
  { v: 'r', h: 'b', fill: RED, box: [84, 96, 108, 124] },
] as const

/** The Appletree mark, drawn so each quadrant can move or reveal a photo. */
export default function Apple({ photos, className }: { photos?: string[]; className?: string }) {
  const id = useId().replace(/[^a-z0-9]/gi, '')
  return (
    <svg className={className} viewBox="0 0 200 220" role="img" aria-label="Appletree">
      <defs>
        <clipPath id={`${id}a`}><path d={BODY} /></clipPath>
        <clipPath id={`${id}l`}><path d={`M-10-10H112V30${V}H-10Z`} /></clipPath>
        <clipPath id={`${id}r`}><path d={`M210-10H112V30${V}H210Z`} /></clipPath>
        <clipPath id={`${id}t`}><path d={`M-10-10V82H10${H}H210V-10Z`} /></clipPath>
        <clipPath id={`${id}b`}><path d={`M-10 230V82H10${H}H210V230Z`} /></clipPath>
      </defs>
      <path className="apple-leaf" d="M104 46c-5-16 0-32 9-42 3 15 0 31-3 43Z" fill={GREEN} />
      <path className="apple-leaf" d="M114 45c8-17 23-29 37-31-4 15-19 28-32 34Z" fill={RED} />
      {QUADS.map((q, i) => (
        <g className="apple-quad" data-quad={i} key={i} clipPath={`url(#${id}a)`}>
          <g clipPath={`url(#${id}${q.v})`}>
            <g clipPath={`url(#${id}${q.h})`}>
              <rect width="200" height="220" fill={q.fill} />
              {photos?.[i] && (
                <image className="apple-photo" href={photos[i]} x={q.box[0]} y={q.box[1]} width={q.box[2]} height={q.box[3]} preserveAspectRatio="xMidYMid slice" />
              )}
            </g>
          </g>
        </g>
      ))}
      <g clipPath={`url(#${id}a)`} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round">
        <path d={`M112 30${V}`} />
        <path d={`M10 82${H}`} />
      </g>
    </svg>
  )
}

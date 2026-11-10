export type AccessSystem = {
  name: string
  tags: string[]
  points: string[]
  features: string[]
}

// Order matches the rigs built in scene/Scene.ts
export const systems: AccessSystem[] = [
  {
    name: 'Temporary suspended platform',
    tags: ['Built in-house', 'EN 1808 design'],
    points: ['Roof beams with counterweights', 'Electric hoists on twin wire ropes'],
    features: ['Overload limiter', 'Fall-arrest on safety rope', 'Manual emergency descent', 'Upper limit switches'],
  },
  {
    name: 'Monorail with traversing trolleys',
    tags: ['Built in-house', 'ETT & GTT'],
    points: ['Electric (ETT) or geared (GTT) trolleys', 'Cradle travels the façade on the track'],
    features: ['Powered or geared travel', 'Track end stops', 'Cradle overload limiter', 'No roof BMU space needed'],
  },
  {
    name: 'Vertical gantry platform',
    tags: ['First of its kind in India', 'MOPA Goa ATC tower'],
    points: ['Runs on top & bottom ring tracks around the glass cab', 'Motor & gear driven, wireless remote from ground'],
    features: ['Top & bottom ring tracks', 'Motorised gear drive', 'Wireless ground control', '360° around the ATC cab'],
  },
  {
    name: 'Building maintenance unit (BMU)',
    tags: ['Operation', 'Maintenance', 'Load testing'],
    points: ['Roof-mounted, slewing & luffing jib', 'Inspection, servicing & breakdown support'],
    features: ['Wind speed monitoring', 'Limits on every motion', 'Overload protection', 'Roof track & carriage'],
  },
  {
    name: 'Telescopic BMU',
    tags: ['Operation', 'Maintenance'],
    points: ['Multi-stage telescopic jib', 'Reaches set-back & podium façades'],
    features: ['Slew, luff & telescope', 'Reaches set-back façades', 'Wind speed monitoring', 'Can integrate a GRU'],
  },
  {
    name: 'Glass replacement unit (GRU)',
    tags: ['Built in-house', 'BMU-integrated or separate'],
    points: ['Lifts and places façade glass panels', 'Integrated in a BMU or as its own unit'],
    features: ['Vacuum glass lifter', 'Fine-control hoisting', 'Controlled placement', 'Works from the roof'],
  },
  {
    name: 'Chair hoist',
    tags: ['Built in-house'],
    points: ['Powered single-person suspended seat', 'For spot cleaning & sealant work'],
    features: ['Powered ascent & descent', 'Independent safety line', 'Rope-grab fall arrest', 'Full-body harness'],
  },
  {
    name: 'Scaffoldless elevator installation',
    tags: ['CE marked', 'LVD + GPSD'],
    points: ['Work platform suspended in the lift shaft', 'No shaft scaffolding needed'],
    features: ['CE marked: LVD + GPSD', 'Overhead protection', 'Hoist-suspended deck', 'Rails fixed as it rises'],
  },
]

export const stats = [
  { value: 400, suffix: '+', label: 'Projects delivered' },
  { value: 100, suffix: '+', label: 'Machines manufactured' },
  { value: 1, suffix: 'M', label: 'Sq ft cleaned every month' },
  { value: 15, suffix: '', label: 'Locations across India' },
]

export const services = [
  { icon: 'sparkles', title: 'Façade cleaning', text: 'Glass & cladding façades, from low-rise to high-rise.' },
  { icon: 'rope', title: 'Rope access', text: 'Rescue-trained technicians with rope-access kits.' },
  { icon: 'bmu', title: 'BMU & gondola', text: 'Operations, cradle rental & hook load testing.' },
  { icon: 'lift', title: 'MEWP & spider lifts', text: 'Sinoboom scissor, boom & spider lifts with operators.' },
  { icon: 'wrench', title: 'Access maintenance', text: 'Hoists, cradles & monorails inspected and serviced.' },
  { icon: 'broom', title: 'Housekeeping', text: 'Trained housekeeping teams for buildings & campuses.' },
] as const

export const plants = [
  { name: 'Binola', area: 3000, note: 'Manufacturing plant · built-up area', upcoming: false },
  { name: 'Bawal', area: 2000, note: 'Manufacturing plant · built-up area', upcoming: false },
  { name: 'Ujina, Nuh', area: 10000, note: '300,000 m² land · 10,000 m² built-up in phase 1', upcoming: true },
]

export const madeInHouse = [
  'Temporary suspended platforms',
  'Chair hoists',
  'GRUs (glass replacement units)',
  'ETT & GTT traversing trolleys',
]

export const fcoms = [
  'Daily sq ft cleaned',
  'Attendance & punctuality',
  'Medical, competency & police verification records',
  'Monthly consumables planning',
  'Third-party inspection of site safety equipment',
]

export const certifications = [
  { code: '9001', name: 'ISO 9001:2015', text: 'Quality management' },
  { code: '14001', name: 'ISO 14001:2015', text: 'Environmental management' },
  { code: '45001', name: 'ISO 45001:2018', text: 'Occupational health & safety' },
  { code: '41001', name: 'ISO 41001:2018', text: 'Facility management' },
  { code: '50001', name: 'ISO 50001:2018', text: 'Energy management' },
  { code: '46001', name: 'ISO 46001:2019', text: 'Water efficiency management' },
  { code: '14064-1', name: 'ISO 14064-1:2018', text: 'Greenhouse gas emissions accounting' },
  { code: 'CE', name: 'CE marked', text: 'LVD + GPSD · designed to EN 1808' },
]

export const projects = [
  {
    name: 'DLF Cyber Park',
    location: 'Gurugram, Haryana',
    image: './images/dlf-cyber-park.jpg',
    system: '2 roof-mounted twin-track BMUs',
    facts: ['50 m height', '6 m outreach', 'Aug 2021'],
    text: 'Two 7-metre BMUs travel on nearly 2 km of twin track around the periphery for complete façade coverage.',
  },
  {
    name: 'Manohar International Airport',
    location: 'North Goa',
    image: './images/manohar-airport.jpg',
    system: 'Inclined gantry + monorail system',
    facts: ['55 m ATC tower', '25 m gantry', 'Nov 2022'],
    text: 'A custom inclined gantry circles the conical ATC cab while monorail trolleys reach the terminal’s complex surfaces.',
  },
  {
    name: 'DLF Downtown',
    location: 'Gurugram, Haryana',
    image: './images/dlf-downtown.jpg',
    system: 'Track-mounted BMU + glass handling',
    facts: ['50 m height', '500 kg GRU', '2022'],
    text: 'Long-outreach BMU with an integrated glass replacement unit, monorail access and a safety-line system.',
  },
]

export const partners = ['DLF', 'M3M', 'CBRE', 'JLL', 'Cushman & Wakefield']

export const contact = {
  phone: '+91 88004 94976',
  phoneHref: 'tel:+918800494976',
  email: 'mail@appletree.co.in',
  web: 'www.appletree.co.in',
  address: 'LG-04, behind DLF Star Mall, Block A, Sector 30, Gurugram, Haryana 122002',
}

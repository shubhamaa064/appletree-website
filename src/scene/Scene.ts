import * as THREE from 'three'

// World units are metres. The tower stands at the origin; every access system
// is a "rig" that is shown only while its stage is on screen.
const HW = 8 // tower half-width
const ROOF = 70
const RED = 0xc9343c
const GREEN = 0x2f9e5b
const STEEL = 0xc3cad3
const DARK = 0x222a38
const HIVIS = 0xf5b301

const ATC = new THREE.Vector3(95, 0, -40)
const SHAFT = new THREE.Vector3(-80, 0, 30)

type Label = { anchor: THREE.Object3D; el: HTMLDivElement }
type Rig = { group: THREE.Group; stages: number[]; labels: Label[]; update?: (t: number) => void }
type Key = { p: [number, number, number]; t: [number, number, number]; ox: number }

// Stage 0–1 are the hero; stage 2–9 are the eight access systems.
const KEYS: Key[] = [
  { p: [-20, 4, 54], t: [4, 40, 0], ox: -0.17 },
  { p: [17, 97, 31], t: [0, 64, 5], ox: -0.17 },
  { p: [-17, 66, 33], t: [0, 62, 7], ox: 0.2 },
  { p: [36, 68, 17], t: [8, 62, 0], ox: 0.2 },
  { p: [ATC.x + 25, 47, ATC.z + 30], t: [ATC.x, 42, ATC.z], ox: 0.2 },
  { p: [15, 81, 28], t: [0, 66, 5], ox: 0.2 },
  { p: [-60, 50, -88], t: [0, 37, -12], ox: 0.2 },
  { p: [-25, 58, 13], t: [-8, 55, 1], ox: 0.2 },
  { p: [13, 31, 25], t: [0, 28.5, 8], ox: 0.2 },
  { p: [SHAFT.x + 12, 21, SHAFT.z + 17], t: [SHAFT.x, 18, SHAFT.z], ox: 0.2 },
]
export const STAGE_COUNT = KEYS.length

const materials = new Map<number, THREE.MeshStandardMaterial>()
function mat(color: number) {
  let m = materials.get(color)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.25 })
    materials.set(color, m)
  }
  return m
}

function box(parent: THREE.Object3D, w: number, h: number, d: number, color: number | THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof color === 'number' ? mat(color) : color)
  mesh.position.set(x, y, z)
  parent.add(mesh)
  return mesh
}

function cyl(parent: THREE.Object3D, rTop: number, rBottom: number, h: number, color: number | THREE.Material, x = 0, y = 0, z = 0, seg = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg), typeof color === 'number' ? mat(color) : color)
  mesh.position.set(x, y, z)
  parent.add(mesh)
  return mesh
}

function anchor(parent: THREE.Object3D, x: number, y: number, z: number) {
  const o = new THREE.Object3D()
  o.position.set(x, y, z)
  parent.add(o)
  return o
}

// A vertical wire rope between two heights
function rope(parent: THREE.Object3D, x: number, z: number) {
  const mesh = cyl(parent, 0.03, 0.03, 1, 0xdfe5ec, x, 0, z, 6)
  return (top: number, bottom: number) => {
    mesh.scale.y = Math.max(0.01, top - bottom)
    mesh.position.y = (top + bottom) / 2
  }
}

function worker(parent: THREE.Object3D, x = 0, y = 0, z = 0) {
  const g = new THREE.Group()
  box(g, 0.34, 0.62, 0.24, DARK, 0, 0.31)
  box(g, 0.44, 0.6, 0.28, HIVIS, 0, 0.92)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), mat(0xe8b98f))
  head.position.y = 1.38
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xffd21f))
  helmet.position.y = 1.42
  g.add(head, helmet)
  g.position.set(x, y, z)
  parent.add(g)
  return g
}

function cradle(parent: THREE.Object3D, len = 5) {
  const g = new THREE.Group()
  box(g, len, 0.12, 0.9, STEEL, 0, 0.06)
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) box(g, 0.07, 1.1, 0.07, STEEL, (sx * len) / 2, 0.6, sz * 0.42)
    box(g, 0.3, 0.5, 0.3, GREEN, sx * (len / 2 - 0.2), 1.0, 0)
  }
  for (const sz of [-1, 1]) {
    box(g, len, 0.08, 0.08, RED, 0, 1.12, sz * 0.42)
    box(g, len, 0.05, 0.05, STEEL, 0, 0.62, sz * 0.42)
  }
  worker(g, -len * 0.18, 0.12, 0)
  worker(g, len * 0.2, 0.12, 0)
  parent.add(g)
  return g
}

function glassTextures() {
  const cols = 8
  const rows = 28
  const w = 512
  const h = 1792
  const make = () => {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    return c
  }
  const color = make()
  const glow = make()
  const cc = color.getContext('2d')!
  const gc = glow.getContext('2d')!
  gc.fillStyle = '#000'
  gc.fillRect(0, 0, w, h)
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const pw = w / cols
  const ph = h / rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = rand()
      const light = 26 + rand() * 10 + (r / rows) * 5
      cc.fillStyle = `hsl(${212 + rand() * 8} 50% ${light}%)`
      if (k > 0.95) cc.fillStyle = '#cfc39c'
      else if (k > 0.91) cc.fillStyle = '#6f859d'
      cc.fillRect(c * pw, r * ph, pw, ph)
      gc.fillStyle = `hsl(214 60% ${7 + rand() * 5}%)`
      gc.fillRect(c * pw + 3, r * ph + 3, pw - 6, ph - 6)
      if (k > 0.91) {
        gc.fillStyle = k > 0.95 ? '#6b5f3c' : '#2a3644'
        gc.fillRect(c * pw + 5, r * ph + 5, pw - 10, ph - 10)
      }
    }
  }
  cc.strokeStyle = '#0b1830'
  cc.lineWidth = 5
  for (let c = 0; c <= cols; c++) {
    cc.beginPath()
    cc.moveTo(c * pw, 0)
    cc.lineTo(c * pw, h)
    cc.stroke()
  }
  for (let r = 0; r <= rows; r++) {
    cc.beginPath()
    cc.moveTo(0, r * ph)
    cc.lineTo(w, r * ph)
    cc.stroke()
  }
  const map = new THREE.CanvasTexture(color)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8
  const emissiveMap = new THREE.CanvasTexture(glow)
  emissiveMap.colorSpace = THREE.SRGBColorSpace
  return { map, emissiveMap }
}

function createSky() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(700, 32, 20),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec3 top = vec3(0.008, 0.022, 0.07);
          vec3 mid = vec3(0.045, 0.1, 0.24);
          vec3 col = mix(mid, top, smoothstep(0.0, 0.55, d.y));
          float dusk = pow(max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(0.42, 0.0, -0.9))), 0.0), 2.0);
          float band = exp(-max(d.y, 0.0) * 4.5);
          col += vec3(0.95, 0.3, 0.12) * dusk * band * 0.9;
          col += vec3(0.5, 0.16, 0.3) * dusk * exp(-max(d.y, 0.0) * 3.5) * 0.3;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
}

// Instanced skyline; windows are drawn procedurally from world position.
function createCity() {
  const spots: THREE.Matrix4[] = []
  let seed = 41
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const m = new THREE.Matrix4()
  for (let x = -280; x <= 280; x += 15) {
    for (let z = -280; z <= 280; z += 15) {
      const px = x + (rand() - 0.5) * 6
      const pz = z + (rand() - 0.5) * 6
      const r = Math.hypot(px, pz)
      const keep = rand() > 0.22
      if (r < 56 || Math.hypot(px - ATC.x, pz - ATC.z) < 46 || Math.hypot(px - SHAFT.x, pz - SHAFT.z) < 32 || !keep) continue
      const h = 8 + rand() * 14 + (r > 110 ? rand() * 16 : 0) + (r > 150 ? rand() * 30 : 0)
      const w = 7 + rand() * 5
      const d = 7 + rand() * 5
      m.compose(new THREE.Vector3(px, h / 2, pz), new THREE.Quaternion(), new THREE.Vector3(w, h, d))
      spots.push(m.clone())
    }
  }
  const material = new THREE.ShaderMaterial({
    uniforms: { fogColor: { value: new THREE.Color(0x07111f) } },
    vertexShader: `
      varying vec3 vWorld;
      varying vec3 vNormal;
      void main() {
        vec4 p = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          p = instanceMatrix * p;
        #endif
        vec4 w = modelMatrix * p;
        vWorld = w.xyz;
        vNormal = normal;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: `
      uniform vec3 fogColor;
      varying vec3 vWorld;
      varying vec3 vNormal;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec3 col = vec3(0.035, 0.06, 0.11);
        if (abs(vNormal.y) < 0.5) {
          float u = abs(vNormal.x) > 0.5 ? vWorld.z : vWorld.x;
          vec2 g = vec2(u / 1.7, vWorld.y / 2.3);
          vec2 cell = floor(g);
          vec2 f = fract(g);
          float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.28, f.y) * step(f.y, 0.78);
          float lit = step(0.68, hash(cell + floor(vWorld.xz / 15.0) * 3.1));
          vec3 warm = mix(vec3(1.0, 0.82, 0.42), vec3(0.75, 0.85, 1.0), step(0.9, hash(cell * 1.7)));
          col = mix(col * (0.8 + 0.4 * abs(vNormal.x)), warm, win * lit * 0.85);
        }
        float dist = length(vWorld - cameraPosition);
        col = mix(col, fogColor, smoothstep(90.0, 420.0, dist));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, spots.length)
  spots.forEach((s, i) => mesh.setMatrixAt(i, s))
  mesh.frustumCulled = false
  return mesh
}

// Roof machine with its jib pointing along +z from the group origin.
function bmuMachine(parent: THREE.Object3D, jibLength: number, telescopic: boolean) {
  const g = new THREE.Group()
  for (const z of [-0.9, 0.9]) box(g, 12, 0.15, 0.15, STEEL, 0, 0.08, z)
  box(g, 3, 0.7, 2.4, 0x8b94a1, 0, 0.55, 0)
  cyl(g, 0.8, 0.9, 1.2, 0x9aa3b0, 0, 1.5, 0)
  box(g, 3.2, 1.5, 2.6, 0xd9dee5, 0, 2.85, -1.6)
  box(g, 3.3, 0.22, 2.7, RED, 0, 3.7, -1.6)
  if (telescopic) {
    const each = jibLength / 2.6
    box(g, 0.62, 0.62, each, 0xe8ecf1, 0, 3, each / 2)
    box(g, 0.46, 0.46, each, STEEL, 0, 3, each * 1.3)
    box(g, 0.32, 0.32, each, 0xe8ecf1, 0, 3, jibLength - each / 2)
  } else {
    box(g, 0.5, 0.5, jibLength, 0xe8ecf1, 0, 3, jibLength / 2)
  }
  box(g, 5, 0.16, 0.16, STEEL, 0, 3, jibLength)
  parent.add(g)
  return g
}

export class Scene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(46, 1, 0.5, 1500)
  private rigs: Rig[] = []
  private stage = 0
  private pos = new THREE.Vector3(...KEYS[0].p)
  private look = new THREE.Vector3(...KEYS[0].t)
  private offset = KEYS[0].ox
  private goalPos = this.pos.clone()
  private goalLook = this.look.clone()
  private goalOffset = this.offset
  private pointer = new THREE.Vector2()
  private clock = new THREE.Clock()
  private raf = 0
  private running = false
  private width = 1
  private height = 1
  private labelLayer: HTMLElement
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, labelLayer: HTMLElement) {
    this.canvas = canvas
    this.labelLayer = labelLayer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15
    this.scene.fog = new THREE.Fog(0x07111f, 120, 520)

    const sky = createSky()
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const envScene = new THREE.Scene()
    envScene.add(sky)
    this.scene.environment = pmrem.fromScene(envScene).texture
    pmrem.dispose()
    this.scene.add(sky)

    this.scene.add(new THREE.HemisphereLight(0x9dbcff, 0x0a1020, 1.5))
    const dusk = new THREE.DirectionalLight(0xffb58a, 1.8)
    dusk.position.set(40, 30, -90)
    const fill = new THREE.DirectionalLight(0xa9c8ff, 1.15)
    fill.position.set(50, 80, 90)
    this.scene.add(dusk, fill)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshBasicMaterial({ color: 0x050b16 }))
    ground.rotation.x = -Math.PI / 2
    const grid = new THREE.GridHelper(600, 120, 0x1c3355, 0x12233d)
    grid.position.y = 0.05
    this.scene.add(ground, grid, createCity())

    this.buildTower()
    this.buildRigs()
    window.addEventListener('pointermove', this.onPointer, { passive: true })
    this.resize()
  }

  private glass!: THREE.MeshStandardMaterial

  private buildTower() {
    const { map, emissiveMap } = glassTextures()
    this.glass = new THREE.MeshStandardMaterial({
      map,
      emissiveMap,
      emissive: 0xffffff,
      emissiveIntensity: 1.1,
      metalness: 0.6,
      roughness: 0.3,
      envMapIntensity: 1.8,
    })
    const roof = mat(0x161d2b)
    const tower = new THREE.Mesh(new THREE.BoxGeometry(HW * 2, ROOF, HW * 2), [this.glass, this.glass, roof, roof, this.glass, this.glass])
    tower.position.y = ROOF / 2
    this.scene.add(tower)
    for (const s of [-1, 1]) {
      box(this.scene, HW * 2 + 0.3, 0.5, 0.3, 0x39445a, 0, ROOF + 0.25, s * HW)
      box(this.scene, 0.3, 0.5, HW * 2 + 0.3, 0x39445a, s * HW, ROOF + 0.25, 0)
    }
    // Set-back podium behind the tower, served by the telescopic BMU
    const podiumGlass = this.glass.clone()
    podiumGlass.map = map.clone()
    podiumGlass.map.repeat.set(1.6, 0.2)
    podiumGlass.map.wrapS = THREE.RepeatWrapping
    podiumGlass.map.needsUpdate = true
    podiumGlass.emissiveMap = null
    podiumGlass.emissive = new THREE.Color(0x000000)
    const podium = new THREE.Mesh(new THREE.BoxGeometry(26, 12, 14), [podiumGlass, podiumGlass, roof, roof, podiumGlass, podiumGlass])
    podium.position.set(0, 6, -(HW + 7))
    this.scene.add(podium)
  }

  private addRig(stages: number[], build: (g: THREE.Group, label: (a: THREE.Object3D, text: string) => void) => Rig['update']) {
    const group = new THREE.Group()
    const labels: Label[] = []
    const update = build(group, (a, text) => {
      const el = document.createElement('div')
      el.className = `callout ${labels.length % 2 ? 'is-right' : 'is-left'}`
      el.innerHTML = `<i></i><span>${text}</span>`
      this.labelLayer.appendChild(el)
      labels.push({ anchor: a, el })
    })
    group.visible = false
    this.scene.add(group)
    this.rigs.push({ group, stages, labels, update })
  }

  private buildRigs() {
    const edge = HW + 1.1

    // Roof BMU — also the hero machine
    this.addRig([0, 1, 5], (g, label) => {
      const machine = bmuMachine(g, 6.5, false)
      machine.position.set(0, ROOF, edge - 6.5)
      const c = cradle(g)
      c.position.z = edge
      const ropes = [rope(g, -2.3, edge), rope(g, 2.3, edge)]
      label(anchor(machine, 0, 1.6, 0), 'Slewing turret')
      label(anchor(machine, 0, 3.2, 4.5), 'Luffing jib')
      label(anchor(machine, -5, 0.1, 0), 'Roof track & carriage')
      label(anchor(c, 2.3, 1, 0), 'Cradle with hoists')
      return (t) => {
        c.position.y = 61 + Math.sin(t * 0.45) * 2.6
        ropes.forEach((r) => r(ROOF + 3, c.position.y + 1))
      }
    })

    // 01 Temporary suspended platform
    this.addRig([2], (g, label) => {
      for (const x of [-2.3, 2.3]) {
        box(g, 0.22, 0.22, 5.6, STEEL, x, ROOF + 1.15, edge - 2.8)
        box(g, 0.14, 1.1, 0.14, STEEL, x, ROOF + 0.55, HW - 0.5)
        box(g, 0.14, 1.1, 0.14, STEEL, x, ROOF + 0.55, edge - 5.2)
        box(g, 0.75, 0.65, 0.65, RED, x, ROOF + 0.45, edge - 5.6)
      }
      const c = cradle(g)
      c.position.z = edge
      const ropes = [rope(g, -2.3, edge), rope(g, 2.3, edge)]
      label(anchor(g, -2.3, ROOF + 0.6, edge - 5.6), 'Counterweights')
      label(anchor(g, 2.3, ROOF + 1.2, edge - 1.5), 'Suspension beam')
      label(anchor(c, -2.3, 1, 0), 'Electric hoist')
      label(anchor(c, 0.6, 0.1, 0.4), 'Platform')
      return (t) => {
        c.position.y = 60.5 + Math.sin(t * 0.4) * 2.2
        ropes.forEach((r) => r(ROOF + 1.15, c.position.y + 1))
      }
    })

    // 02 Monorail with traversing trolleys
    this.addRig([3], (g, label) => {
      const x = HW + 1
      box(g, 0.26, 0.3, HW * 2 + 0.6, STEEL, x, ROOF - 0.5, 0)
      for (let z = -7.5; z <= 7.5; z += 3) box(g, 1, 0.12, 0.12, STEEL, HW + 0.5, ROOF - 0.38, z)
      const mover = new THREE.Group()
      g.add(mover)
      for (const z of [-2.3, 2.3]) box(mover, 0.42, 0.42, 0.55, GREEN, x, ROOF - 0.85, z)
      const c = cradle(mover)
      c.rotation.y = Math.PI / 2
      c.position.set(x, 60, 0)
      const ropes = [rope(mover, x, -2.3), rope(mover, x, 2.3)]
      ropes.forEach((r) => r(ROOF - 1, 61))
      label(anchor(g, x, ROOF - 0.4, 7.5), 'Monorail track')
      label(anchor(mover, x, ROOF - 0.85, -2.3), 'ETT / GTT traversing trolley')
      label(anchor(c, 0, 0.6, 0.45), 'Cradle')
      return (t) => {
        mover.position.z = Math.sin(t * 0.3) * 4
      }
    })

    // 03 Vertical gantry platform on an ATC tower
    this.addRig([4], (g, label) => {
      g.position.copy(ATC)
      cyl(g, 3.2, 4.2, 38, 0x7d8796, 0, 19, 0, 32)
      const cab = cyl(g, 9, 5.5, 11, this.glass.clone(), 0, 43.5, 0, 40)
      const cabMat = cab.material as THREE.MeshStandardMaterial
      cabMat.map = cabMat.map!.clone()
      cabMat.map.repeat.set(4, 0.07)
      cabMat.map.wrapS = THREE.RepeatWrapping
      cabMat.map.needsUpdate = true
      cabMat.emissiveMap = null
      cabMat.emissive = new THREE.Color(0x0a1a30)
      cyl(g, 9.7, 9.7, 1.1, 0x1b2333, 0, 49.6, 0, 40)
      cyl(g, 6.4, 6.4, 0.9, 0x5a6475, 0, 37.6, 0, 40)
      const ring = (r: number, y: number) => {
        const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.12, 8, 64), mat(0xf1f4f7))
        t.rotation.x = Math.PI / 2
        t.position.y = y
        g.add(t)
      }
      ring(9.45, 48.8)
      ring(6.2, 38.3)
      const pivot = new THREE.Group()
      g.add(pivot)
      const length = Math.hypot(3.25, 10.5)
      const lean = Math.atan2(3.25, 10.5)
      const frame = new THREE.Group()
      frame.position.set(6.3, 38.3, 0)
      frame.rotation.z = -lean
      pivot.add(frame)
      for (const z of [-0.6, 0.6]) box(frame, 0.16, length, 0.16, RED, 0.2, length / 2, z)
      for (let y = 0.6; y < length; y += 1.1) box(frame, 0.08, 0.08, 1.2, STEEL, 0.2, y, 0)
      box(frame, 0.6, 0.6, 1.5, GREEN, 0.1, 0.2, 0)
      box(frame, 0.6, 0.6, 1.5, GREEN, 0.1, length - 0.2, 0)
      const deck = new THREE.Group()
      deck.position.set(0.5, length * 0.55, 0)
      deck.rotation.z = lean
      frame.add(deck)
      box(deck, 1.3, 0.1, 1.5, STEEL, 0.5, 0, 0)
      box(deck, 0.06, 1, 1.5, RED, 1.15, 0.5, 0)
      worker(deck, 0.5, 0.05, 0)
      label(anchor(g, -9.45, 48.8, 0), 'Top ring track')
      label(anchor(g, 0, 38.3, 6.2), 'Bottom ring track')
      label(anchor(deck, 0.6, 0.6, 0), 'Vertical gantry')
      return (t) => {
        pivot.rotation.y = 0.9 + Math.sin(t * 0.25) * 0.7
      }
    })

    // 05 Telescopic BMU reaching the set-back podium
    this.addRig([6], (g, label) => {
      const reach = HW + 14 + 1.1
      const machine = bmuMachine(g, reach - 3, true)
      machine.rotation.y = Math.PI
      machine.position.set(0, ROOF, -3)
      const c = cradle(g)
      c.position.z = -reach
      const ropes = [rope(g, -2.3, -reach), rope(g, 2.3, -reach)]
      label(anchor(machine, 0, 1.6, 0), 'Slewing turret')
      label(anchor(machine, 0, 3.3, 12), '3-stage telescopic jib')
      label(anchor(g, -10, 12, -(HW + 12)), 'Set-back podium')
      return (t) => {
        c.position.y = 6 + Math.sin(t * 0.4) * 2
        ropes.forEach((r) => r(ROOF + 3, c.position.y + 1))
      }
    })

    // 06 Glass replacement unit
    this.addRig([7], (g, label) => {
      const machine = bmuMachine(g, 6.5, false)
      machine.rotation.y = -Math.PI / 2
      machine.position.set(-(edge - 6.5), ROOF, 1)
      box(g, 0.06, 2.5, 2, new THREE.MeshBasicMaterial({ color: 0x03060c }), -(HW + 0.02), 53.75, 1)
      const panel = new THREE.Group()
      panel.position.set(-edge, 0, 1)
      g.add(panel)
      box(panel, 0.08, 2.4, 1.9, new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0.4 }), 0.45)
      box(panel, 0.2, 0.9, 0.9, RED, 0.3)
      box(panel, 0.5, 0.12, 0.12, STEEL, 0, 0.3)
      const line = rope(g, -edge, 1)
      label(anchor(g, -HW, 53.75, 2), 'Opening for replacement')
      label(anchor(panel, 0.2, 0.3, -0.4), 'Vacuum lifter')
      label(anchor(panel, 0.45, -1, 0.6), 'Glass panel')
      return (t) => {
        const k = 0.5 + 0.5 * Math.cos(t * 0.5)
        panel.position.y = 53.75 + k * 6
        panel.position.x = -edge + (1 - Math.min(1, k * 6)) * 0.55
        line(ROOF + 3, panel.position.y + 0.3)
      }
    })

    // 07 Chair hoist
    this.addRig([8], (g, label) => {
      box(g, 0.2, 1.7, 0.2, STEEL, 0, ROOF + 0.85, HW - 0.6)
      box(g, 0.2, 0.2, 2.2, STEEL, 0, ROOF + 1.7, HW + 0.3)
      const chair = new THREE.Group()
      chair.position.z = HW + 0.95
      g.add(chair)
      box(chair, 0.62, 0.08, 0.5, DARK, 0, 0, 0)
      box(chair, 0.62, 0.6, 0.07, DARK, 0, 0.3, -0.25)
      box(chair, 0.42, 0.5, 0.32, GREEN, 0, 1.75, 0)
      const person = worker(chair, 0, -0.55, 0.05)
      person.rotation.y = Math.PI
      const ropes = [rope(g, -0.12, HW + 0.95), rope(g, 0.14, HW + 1.05)]
      label(anchor(chair, 0, 1.75, 0), 'Powered chair hoist')
      label(anchor(chair, 0.14, 3.6, 0.1), 'Safety line + rope grab')
      label(anchor(chair, 0, 0, 0.2), 'Seat + full-body harness')
      return (t) => {
        chair.position.y = 27.5 + Math.sin(t * 0.4) * 2.2
        ropes[0](ROOF + 1.7, chair.position.y + 2)
        ropes[1](ROOF + 1.7, chair.position.y + 0.8)
      }
    })

    // 08 Scaffoldless elevator installation
    this.addRig([9], (g, label) => {
      g.position.copy(SHAFT)
      const wall = new THREE.MeshStandardMaterial({ color: 0x1a2740, roughness: 0.9, transparent: true, opacity: 0.9 })
      box(g, 5, 40, 0.2, wall, 0, 20, -2.5)
      box(g, 0.2, 40, 5, wall, -2.5, 20, 0)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 40, 5)), new THREE.LineBasicMaterial({ color: 0x5f7396 }))
      edges.position.y = 20
      g.add(edges)
      for (const x of [-2, 2]) box(g, 0.14, 40, 0.14, STEEL, x, 20, -1.2)
      const deck = new THREE.Group()
      g.add(deck)
      box(deck, 3.5, 0.15, 3, RED, 0, 0, 0.2)
      for (const x of [-1.7, 1.7]) for (const z of [-1.2, 1.6]) box(deck, 0.1, 2.5, 0.1, RED, x, 1.25, z)
      for (const z of [-1.2, 1.6]) box(deck, 3.5, 0.1, 0.1, RED, 0, 1.1, z)
      box(deck, 3.7, 0.1, 3.2, GREEN, 0, 2.55, 0.2)
      worker(deck, -0.7, 0.08, 0.3)
      worker(deck, 0.7, 0.08, 0.5)
      const line = rope(g, 0, 0.2)
      label(anchor(deck, 1.2, 2.6, 1.4), 'Overhead protection')
      label(anchor(deck, -1.4, 0.1, 1.5), 'Work platform')
      label(anchor(g, 2, 26, -1.2), 'Guide rails')
      return (t) => {
        deck.position.y = 16 + Math.sin(t * 0.35) * 2.5
        line(40, deck.position.y + 2.6)
      }
    })
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
  }

  /** f runs from 0 to STAGE_COUNT - 1; the camera rests at every whole number. */
  setStage(f: number) {
    this.stage = f
    const i = Math.min(KEYS.length - 2, Math.floor(f))
    const u = THREE.MathUtils.clamp((f - i - 0.22) / 0.56, 0, 1)
    const e = u * u * (3 - 2 * u)
    const a = KEYS[i]
    const b = KEYS[i + 1]
    const pa = new THREE.Vector3(...a.p)
    const pb = new THREE.Vector3(...b.p)
    this.goalPos.lerpVectors(pa, pb, e)
    // Arc over the skyline on long moves
    this.goalPos.y += Math.sin(Math.PI * e) * Math.min(26, pa.distanceTo(pb) * 0.2)
    this.goalLook.lerpVectors(new THREE.Vector3(...a.t), new THREE.Vector3(...b.t), e)
    this.goalOffset = THREE.MathUtils.lerp(a.ox, b.ox, e)
  }

  resize() {
    const rect = this.canvas.parentElement!.getBoundingClientRect()
    this.width = Math.max(1, rect.width)
    this.height = Math.max(1, rect.height)
    this.renderer.setSize(this.width, this.height, false)
    this.camera.aspect = this.width / this.height
    this.camera.fov = this.camera.aspect < 0.8 ? 66 : 46
    this.camera.updateProjectionMatrix()
    if (!this.running) this.render(0)
  }

  start() {
    if (this.running) return
    this.running = true
    this.clock.getDelta()
    const loop = () => {
      this.render(Math.min(0.05, this.clock.getDelta()))
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  private projected = new THREE.Vector3()

  private render(dt: number) {
    const t = this.clock.elapsedTime
    const k = dt === 0 ? 1 : 1 - Math.exp(-dt * 5)
    this.pos.lerp(this.goalPos, k)
    this.look.lerp(this.goalLook, k)
    this.offset += (this.goalOffset - this.offset) * k

    this.camera.position.copy(this.pos)
    this.camera.position.x += Math.sin(t * 0.25) * 0.5 + this.pointer.x * 0.8
    this.camera.position.y += Math.cos(t * 0.2) * 0.3 - this.pointer.y * 0.5
    this.camera.lookAt(this.look)

    const portrait = this.camera.aspect < 0.8
    const inSystems = THREE.MathUtils.clamp(this.stage - 1, 0, 1)
    const ox = portrait ? 0 : this.offset * this.width
    const oy = portrait ? inSystems * 0.2 * this.height : 0
    this.camera.setViewOffset(this.width, this.height, ox, oy, this.width, this.height)

    for (const rig of this.rigs) {
      const nearness = Math.min(...rig.stages.map((s) => Math.abs(this.stage - s)))
      rig.group.visible = nearness < 0.5
      if (rig.group.visible) rig.update?.(t)
      const show = nearness < 0.2 && this.stage > 1.5
      for (const l of rig.labels) {
        if (show) {
          l.anchor.getWorldPosition(this.projected).project(this.camera)
          const x = (this.projected.x * 0.5 + 0.5) * this.width
          const y = (-this.projected.y * 0.5 + 0.5) * this.height
          l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
        }
        l.el.classList.toggle('is-visible', show)
      }
    }
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.stop()
    window.removeEventListener('pointermove', this.onPointer)
    this.rigs.forEach((r) => r.labels.forEach((l) => l.el.remove()))
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      mesh.geometry?.dispose()
      const m = mesh.material
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m?.dispose()
    })
    this.renderer.dispose()
  }
}

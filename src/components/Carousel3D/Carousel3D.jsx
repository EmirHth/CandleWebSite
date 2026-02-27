import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import './Carousel3D.css'

const SLIDES = [
  { id: 0, image: '/images/yava-vitrin.png',  name: 'Yava',         sub: 'Vanilya Esintisi' },
  { id: 1, image: '/images/gece-mumu.jpg',    name: 'Gece Mumu',    sub: 'Karanlığın Işığı' },
  { id: 2, image: '/images/dogal-mum.jpg',    name: 'Botanik Özü',  sub: 'Doğanın Özü' },
  { id: 3, image: '/images/deniz-mumu.jpg',   name: 'Deniz Serisi', sub: 'Okyanusun Nefesi' },
  { id: 4, image: '/images/kis-mumu.jpg',     name: 'Kış Serisi',   sub: 'Soğuk Geceler' },
]

/* Per-offset position config: index = d + 2 (d from -2 to 2) */
const CARD_CFG = [
  /* d = -2 */ { tx: -530, ry:  52, scale: 0.60, tz: -160, opacity: 0.40 },
  /* d = -1 */ { tx: -290, ry:  28, scale: 0.78, tz:  -60, opacity: 0.75 },
  /* d =  0 */ { tx:    0, ry:   0, scale: 1.00, tz:    0, opacity: 1.00 },
  /* d = +1 */ { tx:  290, ry: -28, scale: 0.78, tz:  -60, opacity: 0.75 },
  /* d = +2 */ { tx:  530, ry: -52, scale: 0.60, tz: -160, opacity: 0.40 },
]

export default function Carousel3D() {
  const [active, setActive] = useState(2)
  const centerRef = useRef(null)
  const xSetter   = useRef(null)
  const ySetter   = useRef(null)
  const autoRef   = useRef(null)

  /* Init GSAP quickSetters after active changes (centerRef updates) */
  useEffect(() => {
    if (!centerRef.current) return
    xSetter.current = gsap.quickSetter(centerRef.current, '--x', 'px')
    ySetter.current = gsap.quickSetter(centerRef.current, '--y', 'px')
    xSetter.current(150)
    ySetter.current(200)
  }, [active])

  /* Auto-advance every 5 s; restarted on manual interaction */
  const restartAuto = useCallback(() => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(
      () => setActive(p => (p + 1) % SLIDES.length),
      5000
    )
  }, [])

  useEffect(() => {
    restartAuto()
    return () => clearInterval(autoRef.current)
  }, [restartAuto])

  const goto = useCallback((idx) => {
    setActive(idx)
    restartAuto()
  }, [restartAuto])

  const prev = () => goto((active - 1 + SLIDES.length) % SLIDES.length)
  const next = () => goto((active + 1) % SLIDES.length)

  /* Chroma light follows mouse on center card */
  const onMouseMove = useCallback((e) => {
    const rect = centerRef.current?.getBoundingClientRect()
    if (!rect) return
    xSetter.current?.(e.clientX - rect.left)
    ySetter.current?.(e.clientY - rect.top)
  }, [])

  const onMouseLeave = useCallback(() => {
    xSetter.current?.(150)
    ySetter.current?.(200)
  }, [])

  return (
    <section className="c3d" aria-label="Ürün koleksiyonu">

      {/* ── Section header ── */}
      <div className="c3d__header">
        <span className="c3d__eyebrow">Laydora Koleksiyonu</span>
        <h2 className="c3d__title">Her Mum Bir <em>Hikaye</em></h2>
      </div>

      {/* ── 3-D stage ── */}
      <div className="c3d__stage">
        {SLIDES.map((slide, index) => {
          /* Compute signed offset [-2, +2] with wrap-around */
          let d = index - active
          if (d >  2) d -= SLIDES.length
          if (d < -2) d += SLIDES.length

          const absD = Math.abs(d)
          if (absD > 2) return null

          const cfg      = CARD_CFG[d + 2]
          const isCenter = d === 0

          const transform =
            `translate(-50%,-50%) ` +
            `translateX(${cfg.tx}px) ` +
            `rotateY(${cfg.ry}deg) ` +
            `translateZ(${cfg.tz}px) ` +
            `scale(${cfg.scale})`

          return (
            <div
              key={slide.id}
              ref={isCenter ? centerRef : null}
              className={`c3d__card${isCenter ? ' c3d__card--active' : ''}`}
              style={{ transform, opacity: cfg.opacity, zIndex: 10 - absD }}
              onMouseMove={isCenter ? onMouseMove : undefined}
              onMouseLeave={isCenter ? onMouseLeave : undefined}
              onClick={isCenter ? undefined : () => goto(index)}
              role={isCenter ? undefined : 'button'}
              aria-label={isCenter ? undefined : slide.name}
            >
              <img
                src={slide.image}
                alt={slide.name}
                className="c3d__img"
                draggable="false"
                loading="lazy"
              />

              {/* Spotlight beam from above – center card only */}
              {isCenter && <div className="c3d__spotlight" aria-hidden="true" />}

              {/* Chroma mouse-tracking glow – center card only */}
              {isCenter && <div className="c3d__chroma" aria-hidden="true" />}

              {/* Card label (visible only on active) */}
              <div className="c3d__label" aria-hidden="true">
                <p className="c3d__name">{slide.name}</p>
                <p className="c3d__sub">{slide.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Navigation controls ── */}
      <div className="c3d__controls">
        <button className="c3d__btn" onClick={prev} aria-label="Önceki ürün">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="c3d__dots" role="tablist" aria-label="Slaytlar">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`c3d__dot${i === active ? ' c3d__dot--on' : ''}`}
              onClick={() => goto(i)}
              role="tab"
              aria-selected={i === active}
              aria-label={s.name}
            />
          ))}
        </div>

        <button className="c3d__btn" onClick={next} aria-label="Sonraki ürün">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

    </section>
  )
}

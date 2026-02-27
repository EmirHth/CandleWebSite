import { useEffect, useRef } from 'react'
import './Hero.css'

export default function Hero() {
  const heroRef    = useRef(null)
  const contentRef = useRef(null)

  /* ── Trigger heroReveal animation on mount ── */
  useEffect(() => {
    /* Small rAF delay ensures the initial CSS (opacity:0) is painted before
       we add the class, so the transition actually plays */
    const raf = requestAnimationFrame(() => {
      heroRef.current?.classList.add('hero--revealed')
      /* Stagger: content appears slightly after the image settles */
      setTimeout(() => {
        contentRef.current?.classList.add('hero__content--revealed')
      }, 300)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="hero" ref={heroRef} aria-label="Öne çıkan koleksiyon">

      {/* ── Background image ── */}
      <div className="hero__media">
        <img
          src="/images/PRE.png"
          alt="PRE Candle Laydora – lüks mum"
          className="hero__image"
          fetchpriority="high"
          decoding="async"
        />
        {/* Gradient overlay – left-heavy to frame the candle on the right */}
        <div className="hero__overlay" aria-hidden="true" />
      </div>

      {/* ── Content block ── */}
      <div className="hero__content" ref={contentRef}>
        <span className="hero__eyebrow">Yeni Koleksiyon · 2025</span>

        <h1 className="hero__title">
          Her Anı<br />
          <em>Işıkla</em> Doldur
        </h1>

        <p className="hero__subtitle">
          El yapımı premium mumlarımızla sıcaklık, zarafet ve unutulmaz<br className="hero__br" />
          kokuları evinize taşıyın.
        </p>

        <div className="hero__cta-group">
          <a href="#" className="hero__cta hero__cta--primary">
            <span>KOLEKSİYONU KEŞFET</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="hero__cta-arrow" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#" className="hero__cta hero__cta--secondary">
            HEDİYE AL
          </a>
        </div>

        {/* Trust badges */}
        <ul className="hero__badges" aria-label="Özellikler">
          <li className="hero__badge">
            <span className="hero__badge-icon" aria-hidden="true">✦</span>
            El Yapımı
          </li>
          <li className="hero__badge">
            <span className="hero__badge-icon" aria-hidden="true">✦</span>
            Soy Mum
          </li>
          <li className="hero__badge">
            <span className="hero__badge-icon" aria-hidden="true">✦</span>
            Katkısız
          </li>
        </ul>
      </div>

      {/* ── Scroll cue ── */}
      <div className="hero__scroll-cue" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-label">Keşfet</span>
      </div>

    </section>
  )
}

import './FeaturedProduct.css'

export default function FeaturedProduct() {
  return (
    <section className="featured" aria-label="Vitrin ürünü">

      {/* ── Split layout: text left · image right ── */}
      <div className="featured__inner">

        {/* Left: editorial text */}
        <div className="featured__text">
          <span className="featured__badge">Vitrin Ürünü</span>

          <p className="featured__label">Lansmana Özel</p>

          <h2 className="featured__title">
            <em>YAVA</em>
          </h2>

          <p className="featured__tagline">Vanilya Esintisi · Luxury Candle</p>

          <p className="featured__description">
            Yumuşak ve sıcak vanilya notalarıyla bulunduğunuz ortama huzur
            ve zarafet katar. Laydora'nın lansmana özel, sınırlı sayıda
            üretilmiş koleksiyonundan eşsiz bir deneyim.
          </p>

          <ul className="featured__details" aria-label="Ürün özellikleri">
            <li><span>✦</span> El Yapımı</li>
            <li><span>✦</span> Doğal Soy Mum</li>
            <li><span>✦</span> Premium Vanilya Kokusu</li>
            <li><span>✦</span> Sınırlı Üretim</li>
          </ul>

          <a href="#" className="featured__cta">
            <span>Koleksiyonu Keşfet</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right: product image */}
        <div className="featured__media">
          <div className="featured__img-wrap">
            <img
              src="/images/yava-vitrin.png"
              alt="Laydora Yava – Vanilya Esintisi Luxury Candle"
              className="featured__img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

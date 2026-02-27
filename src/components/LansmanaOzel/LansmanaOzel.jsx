import './LansmanaOzel.css'

/* Two separate product rows, stacked vertically */
function ProductRow({ image, alt, badge, title, titleEm, tagline, description, details, flipped, extraClass }) {
  return (
    <div className={`lansm__row${flipped ? ' lansm__row--flipped' : ''}${extraClass ? ' ' + extraClass : ''}`}>

      {/* Image side */}
      <div className="lansm__media">
        <div className="lansm__img-wrap">
          <img
            src={image}
            alt={alt}
            className="lansm__img"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Text side */}
      <div className="lansm__text">
        <span className="lansm__badge">{badge}</span>
        <p className="lansm__label">Lansmana Özel · Sınırlı Sayıda</p>
        <h2 className="lansm__title">
          <em>{titleEm}</em>
        </h2>
        <p className="lansm__tagline">{tagline}</p>
        <p className="lansm__description">{description}</p>
        <ul className="lansm__details">
          {details.map((d, i) => (
            <li key={i}><span>✦</span> {d}</li>
          ))}
        </ul>
        <a href="#" className="lansm__cta">
          <span>Hemen Satın Al</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

    </div>
  )
}

export default function LansmanaOzel() {
  return (
    <section className="lansm" aria-label="Lansmana Özel">

      <div className="lansm__header">
        <span className="lansm__eyebrow">Lansmana Özel</span>
        <h2 className="lansm__section-title">Sınırlı <em>Koleksiyon</em></h2>
      </div>

      {/* Product 1 — Hibisküs */}
      <ProductRow
        image="/images/hibiskus.png"
        alt="Hibisküs Mum – Laydora"
        badge="No. 01"
        titleEm="Hibisküs"
        tagline="Çiçeksi Esans · Bahar Ritüeli"
        description="Taze hibisküs notalarıyla hazırlanmış bu özel mum, baharın canlılığını evinize taşır. Doğal soy balmumu ile üretilmiş, sınırlı sayıda."
        details={['El Yapımı', 'Doğal Soy Mum', 'Hibisküs Esansı', 'Sınırlı Üretim']}
        flipped={false}
      />

      {/* Spacer between rows */}
      <div className="lansm__spacer" aria-hidden="true" />

      {/* Product 2 — Adsız Tasarım 8 */}
      <ProductRow
        extraClass="lansm-row-2"
        image="/images/adsiz-8.png"
        alt="Laydora Lansmana Özel Tasarım No.8"
        badge="No. 02"
        titleEm="No. 8"
        tagline="Premium Tasarım · Koleksiyoner Serisi"
        description="Laydora'nın imzalı tasarım serisinden eşsiz bir parça. Her detayı özenle işlenmiş, sanatsal formuyla sadece lansmana özel üretilmiştir."
        details={['Koleksiyoner Serisi', 'Premium Kalıp', 'El İşçiliği', 'Numaralı Üretim']}
        flipped={true}
      />

    </section>
  )
}

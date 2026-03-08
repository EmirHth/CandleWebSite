import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './KargoPage.css'

const SHIPPING_ROWS = [
  { label: '500 TL ve üzeri sipariş', price: 'Ücretsiz', time: '1–3 iş günü' },
  { label: '500 TL altı sipariş',     price: '49,90 TL', time: '1–3 iş günü' },
  { label: 'Ekspres kargo',           price: '89,90 TL', time: '1 iş günü' },
]

const STEPS = [
  { num: '01', title: 'Sipariş Onayı', desc: 'Siparişiniz alındığında e-posta ile bilgilendirme yapılır. Hazırlık süreci başlar.' },
  { num: '02', title: 'Özel Paketleme', desc: 'Mumlarınız kırılmaya karşı koruyucu ambalaj ve hediye kutusuyla özenle paketlenir.' },
  { num: '03', title: 'Kargoya Teslim', desc: 'Paketiniz 1–3 iş günü içinde kargo firmasına teslim edilir. Takip numarası e-posta ile iletilir.' },
  { num: '04', title: 'Teslimat', desc: 'Kargo firması paketinizi belirlenen adrese ulaştırır. Teslimat günü SMS ile bildirim alırsınız.' },
]

const RETURN_ITEMS = [
  { title: 'İade Süresi', value: '14 gün' },
  { title: 'Ürün Durumu', value: 'Açılmamış, orijinal ambalajında' },
  { title: 'İade Kargo', value: 'Laydora karşılar' },
  { title: 'İşlem Süresi', value: '3–5 iş günü içinde iade' },
]

export default function KargoPage() {
  return (
    <div className="kargo-page">

      {/* ── Hero ── */}
      <motion.section
        className="kargo-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="kargo-hero__eyebrow">Kargo & İade</span>
        <h1 className="kargo-hero__title">
          Güvenli <em>Teslimat</em>
        </h1>
        <p className="kargo-hero__sub">
          Her sipariş özenle paketlenir, güvenle kapınıza ulaştırılır.
        </p>
      </motion.section>

      <div className="kargo-content">

        {/* ── Kargo ücretleri ── */}
        <motion.section
          className="kargo-section"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85 }}
        >
          <span className="kargo-eyebrow">Kargo Ücretleri</span>
          <h2 className="kargo-section-title">Gönderim <em>Seçenekleri</em></h2>

          <div className="kargo-table">
            <div className="kargo-table__head">
              <span>Sipariş Tipi</span>
              <span>Ücret</span>
              <span>Tahmini Süre</span>
            </div>
            {SHIPPING_ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                className="kargo-table__row"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span className="kargo-table__label">{row.label}</span>
                <span className="kargo-table__price">{row.price}</span>
                <span className="kargo-table__time">{row.time}</span>
              </motion.div>
            ))}
          </div>

          <p className="kargo-note">
            Kargo süreleri iş günü bazında hesaplanır. Hafta sonu ve resmi tatil günleri hesaba katılmaz.
            Yoğun sezonlarda (yılbaşı, Sevgililer Günü vb.) süreler uzayabilir.
          </p>
        </motion.section>

        {/* ── Süreç ── */}
        <motion.section
          className="kargo-section"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85 }}
        >
          <span className="kargo-eyebrow">Sipariş Süreci</span>
          <h2 className="kargo-section-title">Sipariş Nasıl <em>İşleniyor?</em></h2>

          <div className="kargo-steps">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="kargo-step"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                <span className="kargo-step__num">{step.num}</span>
                <div>
                  <h3 className="kargo-step__title">{step.title}</h3>
                  <p className="kargo-step__desc">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── İade ── */}
        <motion.section
          className="kargo-section"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85 }}
        >
          <span className="kargo-eyebrow">İade Politikası</span>
          <h2 className="kargo-section-title">Kolay <em>İade</em></h2>

          <div className="kargo-return-grid">
            {RETURN_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                className="kargo-return-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span className="kargo-return-card__label">{item.title}</span>
                <span className="kargo-return-card__value">{item.value}</span>
              </motion.div>
            ))}
          </div>

          <div className="kargo-return-details">
            <h3 className="kargo-return-details__title">İade Koşulları</h3>
            <ul className="kargo-return-details__list">
              <li>Ürün teslim tarihinden itibaren 14 gün içinde iade talebi açılmalıdır.</li>
              <li>Ürün açılmamış, kullanılmamış ve orijinal ambalajında olmalıdır.</li>
              <li>İade kargo masrafı Laydora tarafından karşılanır.</li>
              <li>Onaylanan iadeler 3–5 iş günü içinde işleme alınır.</li>
              <li>Kişiselleştirilmiş ürünler iade kapsamı dışındadır.</li>
              <li>İade sürecini başlatmak için destek@laydora.com adresine yazabilirsiniz.</li>
            </ul>
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <div className="kargo-cta">
          <p className="kargo-cta__text">Başka sorularınız mı var?</p>
          <Link to="/sss" className="kargo-cta__link">
            <span>SSS Sayfasını İncele</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}

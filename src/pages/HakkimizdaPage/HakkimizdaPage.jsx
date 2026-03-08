import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './HakkimizdaPage.css'

const VALUES = [
  {
    icon: '✦',
    title: 'El İşçiliği',
    desc: 'Her mum, ustalıkla eğitilmiş ellerin titiz çalışmasıyla üretilir. Seri üretim değil; sabır, özen ve zanaat.',
  },
  {
    icon: '◈',
    title: 'Doğal Hammadde',
    desc: '%100 soy balmumu, kurşunsuz pamuk fitil ve katkısız parfüm yağları. Doğadan alınan, doğaya saygılı.',
  },
  {
    icon: '◇',
    title: 'Sınırlı Üretim',
    desc: 'Her koleksiyon sınırlı sayıda üretilir. Bu, her parçanın kendine özgü ve özel kalmasını sağlar.',
  },
  {
    icon: '◉',
    title: 'Duyusal Deneyim',
    desc: 'Mumlarımız sadece ışık değil; koku, sıcaklık ve estetik bir atmosfer sunar. Bir ritüel, bir kaçış.',
  },
]

const CONTACT_ITEMS = [
  {
    label: 'Adres',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    value: 'Abdi İpekçi Cad. No:12, Nişantaşı',
    value2: '34367 Şişli / İstanbul',
  },
  {
    label: 'Telefon',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.51 5.51l.97-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
      </svg>
    ),
    value: '+90 212 555 34 34',
    href: 'tel:+902125553434',
  },
  {
    label: 'E-posta',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    value: 'destek@laydora.com',
    href: 'mailto:destek@laydora.com',
  },
  {
    label: 'Çalışma Saatleri',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    value: 'Pzt – Cmt: 10:00 – 19:00',
    value2: 'Pazar: Kapalı',
  },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/laydora',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com/laydora',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.140-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.135-1.867 3.135-4.561 0-2.385-1.715-4.052-4.163-4.052-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.774.741 2.276a.3.3 0 0 1 .069.285c-.076.312-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@laydora',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
  },
]

export default function HakkimizdaPage() {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero">
        <motion.div
          className="about-hero__inner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-hero__eyebrow">Hakkımızda</span>
          <h1 className="about-hero__title">
            Işığın <em>Sanatı</em>
          </h1>
          <p className="about-hero__subtitle">
            Laydora, her mumun bir hikâye anlattığına inanan bir el yapımı mum markasıdır.
          </p>
        </motion.div>
      </section>

      {/* ── Hikâye ── */}
      <section className="about-story">
        <div className="about-story__inner">
          <motion.div
            className="about-story__text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="about-section-eyebrow">Hikâyemiz</span>
            <h2 className="about-section-title">
              Bir Alevden <em>Doğan</em> Marka
            </h2>
            <p className="about-story__body">
              Laydora, 2023 yılında küçük bir atölyede başladı. Kurucumuzun koku ve ışığa olan
              tutkusu, sıradan bir hobiden premium bir zanaata dönüştü. İlk mumdan bugüne kadar
              değişmeyen tek şey: her ürüne kattığımız özen ve sevgi.
            </p>
            <p className="about-story__body">
              İsmimiz "ışık" anlamına gelen Latince kökenli bir kelimeden ilham alır. Her mum,
              bulunduğu mekâna yalnızca fiziksel bir ışık değil; sıcaklık, huzur ve koku yoluyla
              duygusal bir atmosfer katar. Biz buna "duyusal mimari" diyoruz.
            </p>
            <p className="about-story__body">
              Tüm ürünlerimiz el yapımıdır, seri üretim yoktur. Kullandığımız her hammadde
              titizlikle seçilir; doğal soy balmumu, kurşunsuz pamuk fitil ve sentetik katkısız
              parfüm yağları bu standartların temelini oluşturur.
            </p>
          </motion.div>

          <motion.div
            className="about-story__visual"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/PRE.png"
              alt="Laydora el yapımı mum atölyesi"
              className="about-story__img"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Değerler ── */}
      <section className="about-values">
        <div className="about-values__inner">
          <motion.div
            className="about-values__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
          >
            <span className="about-section-eyebrow">Değerlerimiz</span>
            <h2 className="about-section-title">
              Bizi <em>Biz</em> Yapan
            </h2>
          </motion.div>

          <div className="about-values__grid">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                className="about-value-card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <span className="about-value-card__icon">{v.icon}</span>
                <h3 className="about-value-card__title">{v.title}</h3>
                <p className="about-value-card__desc">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Motto ── */}
      <motion.section
        className="about-motto"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
      >
        <span className="about-motto__line" aria-hidden="true" />
        <blockquote className="about-motto__quote">
          "Bir mum yakmak karanlığa küçük ama güçlü bir itiraz etmektir."
        </blockquote>
        <cite className="about-motto__cite">— Laydora Atölyesi</cite>
        <span className="about-motto__line" aria-hidden="true" />
      </motion.section>

      {/* ── İletişim + Harita ── */}
      <section className="about-contact">
        <div className="about-contact__inner">

          {/* Sol: bilgiler */}
          <motion.div
            className="about-contact__info"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="about-section-eyebrow">Bize Ulaşın</span>
            <h2 className="about-section-title" style={{ marginBottom: 36 }}>
              İletişim <em>&amp; Konum</em>
            </h2>

            <ul className="about-contact__list">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className="about-contact__item">
                  <span className="about-contact__item-icon">{item.icon}</span>
                  <div className="about-contact__item-body">
                    <span className="about-contact__item-label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="about-contact__item-value about-contact__item-value--link">
                        {item.value}
                      </a>
                    ) : (
                      <span className="about-contact__item-value">{item.value}</span>
                    )}
                    {item.value2 && (
                      <span className="about-contact__item-value about-contact__item-value--muted">{item.value2}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Sosyal medya */}
            <div className="about-social">
              <span className="about-social__label">Bizi Takip Edin</span>
              <div className="about-social__links">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="about-social__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sağ: harita */}
          <motion.div
            className="about-contact__map-wrap"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <iframe
              className="about-contact__map"
              title="Laydora Atölyesi Konumu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.121!2d28.9942!3d41.0502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a0b4e5c3f9%3A0x3f2c8c8e4e2e9e9e!2sNi%C5%9Fanta%C5%9F%C4%B1%2C%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1699999999999"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <motion.div
          className="about-cta__inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="about-cta__title">Koleksiyonu <em>Keşfet</em></h2>
          <p className="about-cta__sub">
            El yapımı mumlarımızı inceleyin, size özel bir deneyim seçin.
          </p>
          <Link to="/urunler" className="about-cta__btn">
            <span>Tüm Ürünleri Gör</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </section>

    </div>
  )
}

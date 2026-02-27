import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import products from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './HediyePage.css'

/* ─── Data ─── */
const OCCASIONS = [
  { id: 'tumu',     label: 'Tümü' },
  { id: 'dogum',    label: 'Doğum Günü' },
  { id: 'anneler',  label: 'Anneler Günü' },
  { id: 'sevgililer', label: 'Sevgililer Günü' },
  { id: 'yilbasi',  label: 'Yılbaşı' },
  { id: 'evlilik',  label: 'Evlilik & Nişan' },
]

const PRICE_RANGES = [
  { id: 'all',    label: 'Tüm Bütçeler', min: 0,   max: Infinity },
  { id: 'u250',   label: '250 TL Altı',  min: 0,   max: 250 },
  { id: 'u350',   label: '250–350 TL',   min: 250, max: 350 },
  { id: 'above',  label: '350 TL Üzeri', min: 350, max: Infinity },
]

const GIFT_SETS = [
  {
    id: 'set-gece',
    name: 'Gece Ritueli Seti',
    desc: 'Karanlığın büyüsünü evinize taşıyan 3 özel mum koleksiyonu. Misk, amber ve sandal ağacının derinlikleriyle hazırlanmış.',
    price: 749,
    badge: 'En Çok Tercih Edilen',
    image: '/images/gece-koleksiyon.jpg',
    includes: ['Gece Mumu', 'Gece Koleksiyonu', 'Laydora No.8'],
    occasions: ['dogum', 'yilbasi', 'evlilik'],
  },
  {
    id: 'set-yaz',
    name: 'Yaz Bahçesi Seti',
    desc: 'Çiçek ve meyve notalarının harmanlandığı ferah bir koleksiyon. Bahar ve yazın hafifliğini içinize taşır.',
    price: 538,
    badge: null,
    image: '/images/hibiskus.png',
    includes: ['Hibiskus Mumu', 'Sarı & Turuncu', 'Deniz Mumu'],
    occasions: ['dogum', 'anneler', 'sevgililer'],
  },
  {
    id: 'set-kucuk',
    name: 'Küçük Şıklık Seti',
    desc: 'Sevdiklerinize sürpriz yapın. Kompakt boyut, büyük etki — iki ayrı mum ve özel hediye ambalajı.',
    price: 429,
    badge: 'Sürpriz Hediye',
    image: '/images/dogal-mum.jpg',
    includes: ['Doğal Mum', 'Karlı Manzara'],
    occasions: ['dogum', 'sevgililer', 'yilbasi'],
  },
  {
    id: 'set-kış',
    name: 'Kış Sarmalama Seti',
    desc: 'Soğuk kış gecelerinde içinizi ısıtacak baharatlı ve sıcak aromalar. Özel Noel koleksiyonu.',
    price: 558,
    badge: 'Sezonluk',
    image: '/images/kis-aksami.jpg',
    includes: ['Kış Mumu', 'Kış Akşamı', 'Karlı Manzara'],
    occasions: ['yilbasi', 'dogum'],
  },
  {
    id: 'set-romantic',
    name: 'Romantik Akşam Seti',
    desc: 'İki kişilik özel bir akşam için tasarlanan bu set, masaj mumu ve çiçeksi aromalar içerir.',
    price: 618,
    badge: null,
    image: '/images/yava-vitrin.png',
    includes: ['Yava Mumu', 'Kış Akşamı', 'Hibiskus Mumu'],
    occasions: ['sevgililer', 'evlilik', 'dogum'],
  },
  {
    id: 'set-premium',
    name: 'Premium Lüks Koleksiyonu',
    desc: 'Laydoranın en seçkin mumlarından oluşan üst segment hediye kutusu. Altın folyo ambalaj, el yazısıyla kart.',
    price: 989,
    badge: 'En Lüks',
    image: '/images/gece-mumu.jpg',
    includes: ['Gece Mumu', 'Yava Mumu', 'Laydora No.8', 'Gece Koleksiyonu'],
    occasions: ['evlilik', 'yilbasi', 'dogum'],
  },
]

/* Products with occasion tags */
const TAGGED_PRODUCTS = products.map((p, i) => ({
  ...p,
  occasions: [OCCASIONS[1 + (i % 5)].id],
}))

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

/* ── Gift Set Card ── */
function GiftSetCard({ set, onAddAll }) {
  const navigate = useNavigate()
  return (
    <motion.article className="hediye-set-card" variants={cardVariants}>
      <div className="hediye-set-card__img-wrap">
        <img src={set.image} alt={set.name} className="hediye-set-card__img" />
        {set.badge && <span className="hediye-set-card__badge">{set.badge}</span>}
      </div>
      <div className="hediye-set-card__body">
        <h3 className="hediye-set-card__name">{set.name}</h3>
        <p className="hediye-set-card__desc">{set.desc}</p>
        <ul className="hediye-set-card__includes">
          {set.includes.map((item) => (
            <li key={item}>
              <span className="hediye-set-card__dot" />
              {item}
            </li>
          ))}
        </ul>
        <div className="hediye-set-card__footer">
          <p className="hediye-set-card__price">{set.price} TL</p>
          <button className="hediye-set-card__btn" onClick={() => onAddAll(set)}>
            Sepete Ekle
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/* ── Single Product Mini Card ── */
function MiniProductCard({ product, onAuthCart }) {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <motion.div className="hediye-mini-card" variants={cardVariants} onClick={() => navigate(`/urun/${product.slug}`)}>
      <div className="hediye-mini-card__img-wrap">
        <img src={product.image} alt={product.name} className="hediye-mini-card__img" />
        {product.badge && <span className="hediye-mini-card__badge">{product.badge}</span>}
      </div>
      <p className="hediye-mini-card__name">{product.name}</p>
      <p className="hediye-mini-card__price">{product.price} TL</p>
      <button
        className="hediye-mini-card__add"
        onClick={(e) => { e.stopPropagation(); onAuthCart(product, location.pathname) }}
      >
        Sepete Ekle
      </button>
    </motion.div>
  )
}

export default function HediyePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [activeOccasion, setActiveOccasion] = useState('tumu')

  const authCart = (product, fromPath) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(fromPath || location.pathname)}`)
      return
    }
    addToCart(product, 1)
  }
  const [activePriceRange, setActivePriceRange] = useState('all')
  const [noteText, setNoteText] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  /* Filter gift sets */
  const filteredSets = GIFT_SETS.filter((set) => {
    const priceRange = PRICE_RANGES.find((r) => r.id === activePriceRange)
    const matchesPrice = set.price >= priceRange.min && set.price < priceRange.max
    const matchesOccasion = activeOccasion === 'tumu' || set.occasions.includes(activeOccasion)
    return matchesPrice && matchesOccasion
  })

  /* Filter individual products */
  const filteredProducts = TAGGED_PRODUCTS.filter((p) => {
    const priceRange = PRICE_RANGES.find((r) => r.id === activePriceRange)
    const matchesPrice = p.price >= priceRange.min && p.price < priceRange.max
    const matchesOccasion = activeOccasion === 'tumu' || p.occasions.includes(activeOccasion)
    return matchesPrice && matchesOccasion
  }).slice(0, 8)

  const handleAddSet = (set) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }
    const matchingProducts = products.filter((p) => set.includes.includes(p.name))
    if (matchingProducts.length > 0) {
      matchingProducts.forEach((p) => addToCart(p, 1))
    } else {
      const fallback = products[0]
      addToCart({ ...fallback, name: set.name, price: set.price, id: set.id }, 1)
    }
  }

  const handleNoteSave = () => {
    if (!noteText.trim()) return
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 3000)
  }

  return (
    <div className="hediye-page">

      {/* ── Hero ── */}
      <section className="hediye-hero">
        <motion.div
          className="hediye-hero__inner"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hediye-hero__eyebrow">Laydora Atölyesi</p>
          <h1 className="hediye-hero__title">
            Hediye <em>Rehberi</em>
          </h1>
          <p className="hediye-hero__desc">
            Sevdiklerinize ışık ve koku armağan edin. Her an için özenle hazırlanmış setler ve bireysel seçimler.
          </p>
          <div className="hediye-hero__cta-row">
            <button className="hediye-hero__cta" onClick={() => document.getElementById('hediye-setler').scrollIntoView({ behavior: 'smooth' })}>
              Setleri Keşfet
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="hediye-hero__cta hediye-hero__cta--outline" onClick={() => navigate('/urunler')}>
              Tüm Ürünler
            </button>
          </div>
        </motion.div>
        <div className="hediye-hero__grid" aria-hidden="true">
          {products.slice(0, 6).map((p, i) => (
            <div key={p.id} className={`hediye-hero__grid-item hediye-hero__grid-item--${i + 1}`}>
              <img src={p.image} alt="" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Laydora ── */}
      <section className="hediye-why">
        <div className="hediye-why__inner">
          {[
            { icon: '✦', title: 'El Yapımı', desc: 'Her mum Laydora atölyesinde ustalar tarafından tek tek üretilir.' },
            { icon: '◈', title: 'Özel Ambalaj', desc: 'Hediye kutuları, altın folyo şerit ve kişisel not kartıyla teslim edilir.' },
            { icon: '◇', title: 'Kargo Önceliği', desc: 'Hediye siparişleri 1 iş günü içinde kargoya verilir.' },
            { icon: '◉', title: 'Kişiselleştirme', desc: 'Dilediğiniz metni mumun üzerine yazdırabileceğiniz özel seçenek.' },
          ].map((item) => (
            <div key={item.title} className="hediye-why__item">
              <span className="hediye-why__icon">{item.icon}</span>
              <p className="hediye-why__title">{item.title}</p>
              <p className="hediye-why__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="hediye-filters-section">
        <div className="hediye-filters-inner">
          {/* Occasion */}
          <div className="hediye-filter-group">
            <p className="hediye-filter-group__label">Özel Gün</p>
            <div className="hediye-filter-group__pills">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  className={`hediye-pill ${activeOccasion === occ.id ? 'hediye-pill--active' : ''}`}
                  onClick={() => setActiveOccasion(occ.id)}
                >
                  {occ.label}
                </button>
              ))}
            </div>
          </div>
          {/* Price */}
          <div className="hediye-filter-group">
            <p className="hediye-filter-group__label">Bütçe</p>
            <div className="hediye-filter-group__pills">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  className={`hediye-pill ${activePriceRange === range.id ? 'hediye-pill--active' : ''}`}
                  onClick={() => setActivePriceRange(range.id)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gift Sets ── */}
      <section id="hediye-setler" className="hediye-sets-section">
        <div className="hediye-section-header">
          <p className="hediye-section-eyebrow">Özenle Hazırlanan</p>
          <h2 className="hediye-section-title">Hediye <em>Setleri</em></h2>
          <p className="hediye-section-desc">Her sete özel kutu, ipek kağıt ve el yazısı not kartı dahildir.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeOccasion + activePriceRange + 'sets'}
            className="hediye-sets-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredSets.length > 0
              ? filteredSets.map((set) => (
                  <GiftSetCard key={set.id} set={set} onAddAll={handleAddSet} />
                ))
              : (
                <div className="hediye-empty">
                  <p>Bu kriterlere uygun set bulunamadı.</p>
                  <button className="hediye-empty__btn" onClick={() => { setActiveOccasion('tumu'); setActivePriceRange('all') }}>
                    Filtreleri Temizle
                  </button>
                </div>
              )
            }
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Individual Products ── */}
      <section className="hediye-products-section">
        <div className="hediye-section-header">
          <p className="hediye-section-eyebrow">Tek Ürün Hediye</p>
          <h2 className="hediye-section-title">Bireysel <em>Seçimler</em></h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeOccasion + activePriceRange + 'products'}
            className="hediye-products-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.length > 0
              ? filteredProducts.map((p) => <MiniProductCard key={p.id} product={p} onAuthCart={authCart} />)
              : (
                <div className="hediye-empty">
                  <p>Bu kriterlere uygun ürün bulunamadı.</p>
                </div>
              )
            }
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Gift Note ── */}
      <section className="hediye-note-section">
        <div className="hediye-note-inner">
          <div className="hediye-note-text">
            <p className="hediye-note__eyebrow">Kişisel Dokunuş</p>
            <h2 className="hediye-note__title">Hediye Notunuzu <em>Ekleyin</em></h2>
            <p className="hediye-note__desc">
              Sepetinizdeki hediyeye özel bir not ekleyin. Siparişinizle birlikte altın folyo not kartına basılarak gönderilir.
            </p>
          </div>
          <div className="hediye-note-form">
            <textarea
              className="hediye-note-textarea"
              placeholder="Hediye notunuzu buraya yazın… (max 200 karakter)"
              maxLength={200}
              value={noteText}
              onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false) }}
              rows={5}
            />
            <div className="hediye-note-footer">
              <span className="hediye-note-count">{noteText.length}/200</span>
              <div className="hediye-note-actions">
                {noteSaved && <span className="hediye-note-saved">Not kaydedildi!</span>}
                <button
                  className="hediye-note-save-btn"
                  onClick={handleNoteSave}
                  disabled={!noteText.trim()}
                >
                  Notu Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gift Card ── */}
      <section className="hediye-card-section">
        <div className="hediye-card-inner">
          <div className="hediye-card-visual" aria-hidden="true">
            <div className="hediye-card-visual__card">
              <span className="hediye-card-visual__logo">Laydora</span>
              <span className="hediye-card-visual__amount">500 TL</span>
            </div>
          </div>
          <div className="hediye-card-body">
            <p className="hediye-card__eyebrow">Karar Veremeyenler İçin</p>
            <h2 className="hediye-card__title">Dijital Hediye <em>Kartı</em></h2>
            <p className="hediye-card__desc">
              Sevdiklerinizin kendi koleksiyonunu oluşturmasına izin verin. 100 TL'den 1000 TL'ye kadar değer seçenekleriyle anında e-posta ile gönderilir.
            </p>
            <div className="hediye-card__amounts">
              {[100, 250, 500, 1000].map((amt) => (
                <button key={amt} className="hediye-card__amount-btn">{amt} TL</button>
              ))}
            </div>
            <button className="hediye-card__cta">
              Hediye Kartı Satın Al
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

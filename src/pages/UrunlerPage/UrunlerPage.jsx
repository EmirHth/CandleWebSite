import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import products from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './UrunlerPage.css'

const CATEGORIES = ['Tümü', 'Soy Mum', 'Masaj Mumu', 'Difüzör', 'Set']

const SORT_OPTIONS = [
  { value: 'featured', label: 'Öne Çıkanlar' },
  { value: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

function ProductCard({ product }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleClick = () => navigate(`/urun/${product.slug}`)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }
    addToCart(product, 1)
  }

  return (
    <motion.article
      className="urunler-card"
      variants={cardVariants}
      layout
      onClick={handleClick}
    >
      {/* Tüm içerik kart içinde — hover'da info paneli alttan kayar */}
      <div className="urunler-card__inner">
        <img
          src={product.image}
          alt={product.name}
          className="urunler-card__img"
          loading="lazy"
        />

        {product.badge && (
          <span className="urunler-card__badge">{product.badge}</span>
        )}

        {/* Bilgi paneli: normal halde gizli, hover'da alttan açılır */}
        <div className="urunler-card__info">
          <p className="urunler-card__info-category">{product.category}</p>
          <h3 className="urunler-card__info-name">{product.name}</h3>
          <p className="urunler-card__info-subtitle">{product.subtitle}</p>
          <div className="urunler-card__info-bottom">
            <div className="urunler-card__info-price-row">
              <span className="urunler-card__info-price">{product.price} TL</span>
              {product.originalPrice && (
                <span className="urunler-card__info-original">{product.originalPrice} TL</span>
              )}
            </div>
            <button className="urunler-card__info-btn" onClick={handleAddToCart}>
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function UrunlerPage() {
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [sortValue, setSortValue] = useState('featured')

  const filteredAndSorted = useMemo(() => {
    let list =
      activeCategory === 'Tümü'
        ? [...products]
        : products.filter((p) => p.category === activeCategory)

    if (sortValue === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortValue === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [activeCategory, sortValue])

  return (
    <div className="urunler-page">
      {/* Hero — editorial split layout */}
      <section className="urunler-hero">
        <div className="urunler-hero__top-line">
          <span className="urunler-hero__eyebrow">Laydora Atölyesi</span>
          <span className="urunler-hero__count-label">{products.length} Ürün</span>
        </div>
        <div className="urunler-hero__body">
          <h1 className="urunler-hero__title">
            Tüm<br /><em>Koleksiyon</em>
          </h1>
          <div className="urunler-hero__right">
            <p className="urunler-hero__desc">
              El yapımı, doğal malzemeli mumlardan oluşan özenle seçilmiş
              koleksiyonumuzu keşfedin. Her mum bir hikâye anlatır.
            </p>
            <div className="urunler-hero__stats">
              <div className="urunler-hero__stat">
                <span className="urunler-hero__stat-num">100%</span>
                <span className="urunler-hero__stat-label">Doğal Soy</span>
              </div>
              <div className="urunler-hero__stat">
                <span className="urunler-hero__stat-num">El</span>
                <span className="urunler-hero__stat-label">Yapımı</span>
              </div>
              <div className="urunler-hero__stat">
                <span className="urunler-hero__stat-num">TR</span>
                <span className="urunler-hero__stat-label">Üretim</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="urunler-filter-bar">
        <div className="urunler-filter-bar__inner">
          <div className="urunler-filter-bar__pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`urunler-filter-pill ${activeCategory === cat ? 'urunler-filter-pill--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="urunler-filter-bar__sort">
            <label htmlFor="sort-select" className="urunler-filter-bar__sort-label">
              Sırala:
            </label>
            <select
              id="sort-select"
              className="urunler-sort-select"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="urunler-grid-wrapper">
        <p className="urunler-count">{filteredAndSorted.length} ürün</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + sortValue}
            className="urunler-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

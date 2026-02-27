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
      <div className="urunler-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="urunler-card__img"
          loading="lazy"
        />
        {product.badge && (
          <span className="urunler-card__badge">{product.badge}</span>
        )}
        <div className="urunler-card__overlay">
          <button className="urunler-card__overlay-btn" onClick={handleClick}>
            İncele
          </button>
        </div>
      </div>

      <div className="urunler-card__body">
        <p className="urunler-card__category">{product.category}</p>
        <h3 className="urunler-card__name">{product.name}</h3>
        <p className="urunler-card__subtitle">{product.subtitle}</p>

        <div className="urunler-card__price-row">
          <span className="urunler-card__price">{product.price} TL</span>
          {product.originalPrice && (
            <span className="urunler-card__original-price">
              {product.originalPrice} TL
            </span>
          )}
        </div>

        <button
          className="urunler-card__add-btn"
          onClick={handleAddToCart}
        >
          Sepete Ekle
        </button>
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
      {/* Hero */}
      <section className="urunler-hero">
        <p className="urunler-hero__eyebrow">Laydora Atölyesi</p>
        <h1 className="urunler-hero__title">Koleksiyonumuz</h1>
        <p className="urunler-hero__desc">
          El yapımı, doğal malzemeli mumlardan oluşan özenle seçilmiş koleksiyonumuzu keşfedin.
        </p>
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

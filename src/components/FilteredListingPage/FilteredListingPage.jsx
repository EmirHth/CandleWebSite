import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './FilteredListingPage.css'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Öne Çıkanlar' },
  { value: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
]

function ProductCard({ product }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

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
      className="flp-card"
      variants={cardVariants}
      layout
      onClick={() => navigate(`/urun/${product.slug}`)}
    >
      <div className="flp-card__image-wrap">
        <img src={product.image} alt={product.name} className="flp-card__img" loading="lazy" />
        {product.badge && <span className="flp-card__badge">{product.badge}</span>}
        <div className="flp-card__overlay">
          <button
            className="flp-card__overlay-btn"
            onClick={(e) => { e.stopPropagation(); navigate(`/urun/${product.slug}`) }}
          >
            İncele
          </button>
        </div>
      </div>

      <div className="flp-card__body">
        <p className="flp-card__category">{product.category}</p>
        <h3 className="flp-card__name">{product.name}</h3>
        <p className="flp-card__subtitle">{product.subtitle}</p>
        <div className="flp-card__price-row">
          <span className="flp-card__price">{product.price} TL</span>
          {product.originalPrice && (
            <span className="flp-card__original-price">{product.originalPrice} TL</span>
          )}
        </div>
        <button className="flp-card__add-btn" onClick={handleAddToCart}>
          Sepete Ekle
        </button>
      </div>
    </motion.article>
  )
}

/* ── pills: [{ label, href, active }] ── */
export default function FilteredListingPage({ title, eyebrow, desc, products, pills }) {
  const [sortValue, setSortValue] = useState('featured')

  const sorted = [...products].sort((a, b) => {
    if (sortValue === 'price-asc') return a.price - b.price
    if (sortValue === 'price-desc') return b.price - a.price
    return 0
  })

  return (
    <div className="flp">
      {/* Filter Bar */}
      <div className="flp-filter-bar">
        <div className="flp-filter-bar__inner">
          <div className="flp-filter-bar__pills">
            {pills.map((pill) => (
              <Link
                key={pill.href}
                to={pill.href}
                className={`flp-filter-pill${pill.active ? ' flp-filter-pill--active' : ''}`}
              >
                {pill.label}
              </Link>
            ))}
          </div>

          <div className="flp-filter-bar__sort">
            <label htmlFor="flp-sort" className="flp-filter-bar__sort-label">Sırala:</label>
            <select
              id="flp-sort"
              className="flp-sort-select"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flp-grid-wrapper">
        {sorted.length === 0 ? (
          <p className="flp-empty">Bu kategoride henüz ürün bulunmuyor.</p>
        ) : (
          <>
            <div className="flp-page-id">
              {eyebrow && <span className="flp-page-id__eyebrow">{eyebrow}</span>}
              <span className="flp-page-id__title">{title}</span>
              <span className="flp-page-id__count">{sorted.length} ürün</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={sortValue + pills.find(p => p.active)?.href}
                className="flp-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

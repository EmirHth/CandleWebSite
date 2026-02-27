import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import products from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { logActivity, LOG_TYPES } from '../../utils/activityLogger'
import './UrunDetayPage.css'

/* ── Accordion item ── */
function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`detay-accordion__item ${open ? 'detay-accordion__item--open' : ''}`}>
      <button
        className="detay-accordion__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`detay-accordion__chevron ${open ? 'detay-accordion__chevron--open' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="detay-accordion__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="detay-accordion__content">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Related product mini card ── */
function RelatedCard({ product }) {
  const navigate = useNavigate()

  return (
    <div
      className="detay-related-card"
      onClick={() => navigate(`/urun/${product.slug}`)}
    >
      <div className="detay-related-card__img-wrap">
        <img src={product.image} alt={product.name} className="detay-related-card__img" />
      </div>
      <div className="detay-related-card__body">
        <p className="detay-related-card__name">{product.name}</p>
        <p className="detay-related-card__price">{product.price} TL</p>
      </div>
    </div>
  )
}

export default function UrunDetayPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [favorited, setFavorited] = useState(false)

  const product = products.find((p) => p.slug === slug)

  useEffect(() => {
    if (product) {
      logActivity(LOG_TYPES.VIEW_PRODUCT, {
        productId: product.id,
        productName: product.name,
        price: product.price,
      }, user?.id ?? null)
    }
  }, [slug]) // eslint-disable-line

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
      return false
    }
    action()
    return true
  }

  if (!product) {
    return (
      <div className="detay-notfound">
        <p>Ürün bulunamadı.</p>
        <button onClick={() => navigate('/urunler')}>Koleksiyona Dön</button>
      </div>
    )
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const fallbackRelated = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4 - related.length)

  const relatedProducts = [...related, ...fallbackRelated].slice(0, 4)

  const decrement = () => setQuantity((q) => Math.max(1, q - 1))
  const increment = () => setQuantity((q) => q + 1)

  return (
    <div className="detay-page">
      {/* Back button */}
      <div className="detay-back-bar">
        <button className="detay-back-btn" onClick={() => navigate('/urunler')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Koleksiyona Dön
        </button>
      </div>

      {/* Main split layout */}
      <div className="detay-main">
        {/* Left: image */}
        <motion.div
          className="detay-img-col"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="detay-img-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="detay-img"
            />
          </div>
        </motion.div>

        {/* Right: info */}
        <motion.div
          className="detay-info-col"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge chip */}
          {product.badge && (
            <span className="detay-badge">{product.badge}</span>
          )}

          {/* Stock indicator */}
          {!product.inStock && (
            <p className="detay-out-of-stock">Stokta Yok</p>
          )}

          {/* Name & subtitle */}
          <h1 className="detay-name">{product.name}</h1>
          <p className="detay-subtitle">{product.subtitle}</p>

          {/* Price */}
          <div className="detay-price-row">
            <span className="detay-price">{product.price} TL</span>
            {product.originalPrice && (
              <span className="detay-original-price">{product.originalPrice} TL</span>
            )}
          </div>

          {/* Rating */}
          <div className="detay-rating">
            <span className="detay-stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className="detay-review-count">{product.reviewCount} değerlendirme</span>
          </div>

          {/* Scents */}
          <div className="detay-scents">
            <p className="detay-scents__label">Koku Notaları</p>
            <div className="detay-scents__tags">
              {product.scents.map((scent) => (
                <span key={scent} className="detay-scent-tag">{scent}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="detay-description">{product.description}</p>

          {/* Ingredients */}
          <div className="detay-ingredients">
            <p className="detay-ingredients__label">İçerikler</p>
            <ul className="detay-ingredients__list">
              {product.ingredients.map((item) => (
                <li key={item} className="detay-ingredients__item">
                  <span className="detay-ingredients__dot" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity selector */}
          <div className="detay-qty-row">
            <p className="detay-qty__label">Adet</p>
            <div className="detay-qty-control">
              <button
                className="detay-qty-btn"
                onClick={decrement}
                aria-label="Azalt"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="detay-qty-num">{quantity}</span>
              <button
                className="detay-qty-btn"
                onClick={increment}
                aria-label="Artır"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <button
            className="detay-add-to-cart"
            disabled={!product.inStock}
            onClick={() => product.inStock && requireAuth(() => addToCart(product, quantity))}
          >
            {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>

          <button
            className={`detay-favorite-btn ${favorited ? 'detay-favorite-btn--active' : ''}`}
            onClick={() => requireAuth(() => setFavorited((v) => !v))}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={favorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favorited ? 'Favorilerden Çıkar' : 'Favoriye Ekle'}
          </button>
        </motion.div>
      </div>

      {/* Accordion section */}
      <motion.div
        className="detay-accordion-section"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="detay-accordion-section__title">Ürün Detayları</h2>
        <div className="detay-accordion">
          <AccordionItem title="Yanma Süresi & Ağırlık">
            <div className="detay-specs">
              <div className="detay-spec-row">
                <span className="detay-spec-label">Yanma Süresi</span>
                <span className="detay-spec-value">{product.burnTime}</span>
              </div>
              <div className="detay-spec-row">
                <span className="detay-spec-label">Net Ağırlık</span>
                <span className="detay-spec-value">{product.weight}</span>
              </div>
              <div className="detay-spec-row">
                <span className="detay-spec-label">Kategori</span>
                <span className="detay-spec-value">{product.category}</span>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem title="İçerik & Hammaddeler">
            <ul className="detay-accordion-list">
              {product.ingredients.map((ing) => (
                <li key={ing} className="detay-accordion-list__item">{ing}</li>
              ))}
            </ul>
          </AccordionItem>
          <AccordionItem title="Kullanım Talimatları">
            <div className="detay-usage">
              <p>İlk kullanımda mumu en az 2 saat yakarak mumun tüm yüzeyinin erimesini sağlayın. Bu, mum havuzunun tüm genişliğe yayılmasını ve tünel oluşmasını önler.</p>
              <p>Fitil uzunluğunu her yakıştan önce 5–6mm'de tutun. Bu, daha temiz yanma ve daha az is sağlar.</p>
              <p>Mumu asla 4 saatten uzun yakmayın ve rüzgarlı veya taslak alanlardan uzak tutun.</p>
            </div>
          </AccordionItem>
          <AccordionItem title="Kargo & İade">
            <div className="detay-shipping">
              <p>500 TL üzeri siparişlerde ücretsiz kargo. Standart teslimat 2–4 iş günü içindedir.</p>
              <p>Kullanılmamış ve orijinal ambalajında ürünler satın alma tarihinden itibaren 14 gün içinde iade edilebilir.</p>
            </div>
          </AccordionItem>
        </div>
      </motion.div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <motion.div
          className="detay-related"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="detay-related__title">Benzer Ürünler</h2>
          <div className="detay-related__scroll">
            {relatedProducts.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

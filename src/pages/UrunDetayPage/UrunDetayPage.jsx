import { useState, useEffect, useRef } from 'react'
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

/* ── Stars component ── */
function Stars({ rating, size = 14 }) {
  return (
    <span style={{ fontSize: size, color: 'rgba(210,160,80,0.9)', letterSpacing: 2 }}>
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? '½' : ''}
      {'☆'.repeat(5 - Math.ceil(rating))}
    </span>
  )
}

/* ── Mock reviews ── */
const MOCK_REVIEWS = [
  { id: 1, author: 'Zeynep A.', avatar: 'ZA', rating: 5, date: '2026-02-18', title: 'Muhteşem koku, uzun süre gidiyor!', body: 'Bu mumu aldığımda çok şüpheliydim ama gerçekten beklentilerimi aştı. Koku oda dolduruyor ve 40 saat yandı. Kesinlikle tavsiye ederim.', images: [] },
  { id: 2, author: 'Emir K.', avatar: 'EK', rating: 5, date: '2026-02-10', title: 'Hediye olarak aldım, çok beğenildi', body: 'Annem için aldım, ambalajı çok şık geldi. Kokusu narin ama uzun süre gidiyor. Kesinlikle tekrar alacağım.', images: ['img1'] },
  { id: 3, author: 'Fatma Y.', avatar: 'FY', rating: 4, date: '2026-01-28', title: 'Kalite gerçekten iyi', body: 'Daha önce başka marka mumlar almıştım ama bu çok daha kaliteli. Tek eksiğim kokusu biraz daha yoğun olabilirdi.', images: [] },
  { id: 4, author: 'Can Ö.', avatar: 'CÖ', rating: 5, date: '2026-01-15', title: 'Tam istediğim gibi', body: 'Hem görsel hem de koku olarak harika. El yapımı olduğu belli, fitili çok düzgün yanıyor. Laydora\'ya güven tam.', images: [] },
  { id: 5, author: 'Selin T.', avatar: 'ST', rating: 4, date: '2026-01-05', title: 'Güzel ürün, hızlı kargo', body: 'Ürün güzel geldi, kargo da çok hızlıydı. 3 gün içinde elime ulaştı. Kokusu hafif başlangıçta ama yanarken açılıyor.', images: [] },
]

export default function UrunDetayPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [favorited, setFavorited] = useState(false)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, title: '', body: '' })
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [reviewSortBy, setReviewSortBy] = useState('recent')

  const product = products.find((p) => p.slug === slug)

  useEffect(() => {
    if (product) {
      logActivity(LOG_TYPES.VIEW_PRODUCT, {
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
        userFullName: user ? `${user.firstName} ${user.lastName}` : null,
        userEmail: user?.email ?? null,
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

  /* ── Image hover preview ── */
  const [showPreview, setShowPreview] = useState(false)
  const hideTimer = useRef(null)
  const openPreview  = () => { clearTimeout(hideTimer.current); setShowPreview(true) }
  const closePreview = () => { hideTimer.current = setTimeout(() => setShowPreview(false), 120) }

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
          <div
            className="detay-img-wrap"
            onMouseEnter={openPreview}
            onMouseLeave={closePreview}
          >
            <img
              src={product.image}
              alt={product.name}
              className="detay-img"
            />
            <div className="detay-img-hint" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
              Büyüt
            </div>
          </div>

          {/* Full preview overlay */}
          <AnimatePresence>
            {showPreview && (
              <>
                <motion.div
                  className="detay-img-preview-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="detay-img-preview-overlay"
                  style={{ x: '-50%', y: '-50%' }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={openPreview}
                  onMouseLeave={closePreview}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="detay-img-preview-img"
                  />
                  <p className="detay-img-preview-name">{product.name}</p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
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

      {/* ── Reviews Section ── */}
      <motion.div
        className="detay-reviews-section"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="detay-reviews-header">
          <div>
            <h2 className="detay-reviews-title">Müşteri Yorumları</h2>
            <p className="detay-reviews-sub">{reviews.length} değerlendirme</p>
          </div>
          <button
            className="detay-reviews-write-btn"
            onClick={() => requireAuth(() => setReviewFormOpen(v => !v))}
          >
            {reviewFormOpen ? 'İptal' : '+ Yorum Yaz'}
          </button>
        </div>

        {/* Rating Summary */}
        <div className="detay-reviews-summary">
          <div className="detay-reviews-score">
            <span className="detay-reviews-score__num">{product.rating.toFixed(1)}</span>
            <Stars rating={product.rating} size={18} />
            <span className="detay-reviews-score__total">{product.reviewCount} değerlendirme</span>
          </div>
          <div className="detay-reviews-bars">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
              return (
                <div key={star} className="detay-reviews-bar-row">
                  <span className="detay-reviews-bar-label">{star} ★</span>
                  <div className="detay-reviews-bar-track">
                    <div className="detay-reviews-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="detay-reviews-bar-pct">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Write Review Form */}
        <AnimatePresence>
          {reviewFormOpen && (
            <motion.div
              className="detay-review-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="detay-review-form__inner">
                <p className="detay-review-form__label">Puanınız</p>
                <div className="detay-review-form__stars">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      className={`detay-review-star-btn ${newReview.rating >= s ? 'detay-review-star-btn--active' : ''}`}
                      onClick={() => setNewReview(v => ({ ...v, rating: s }))}
                    >★</button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Başlık (isteğe bağlı)"
                  className="detay-review-input"
                  value={newReview.title}
                  onChange={e => setNewReview(v => ({ ...v, title: e.target.value }))}
                />
                <textarea
                  placeholder="Deneyiminizi paylaşın…"
                  className="detay-review-textarea"
                  rows={4}
                  value={newReview.body}
                  onChange={e => setNewReview(v => ({ ...v, body: e.target.value }))}
                />
                <div className="detay-review-form__footer">
                  <label className="detay-review-img-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    Fotoğraf Ekle
                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} />
                  </label>
                  <button
                    className="detay-review-submit"
                    disabled={!newReview.body.trim()}
                    onClick={() => {
                      if (!newReview.body.trim()) return
                      const initials = user?.firstName?.[0]?.toUpperCase() + (user?.lastName?.[0]?.toUpperCase() || '')
                      setReviews(prev => [{
                        id: Date.now(),
                        author: `${user?.firstName || 'Kullanıcı'} ${(user?.lastName?.[0] || '')}.`,
                        avatar: initials || 'K',
                        rating: newReview.rating,
                        date: new Date().toISOString().split('T')[0],
                        title: newReview.title,
                        body: newReview.body,
                        images: [],
                      }, ...prev])
                      setNewReview({ rating: 5, title: '', body: '' })
                      setReviewFormOpen(false)
                    }}
                  >
                    Yorumu Gönder
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort */}
        <div className="detay-reviews-sort">
          {[{ key: 'recent', label: 'En Yeni' }, { key: 'highest', label: 'En Yüksek Puan' }, { key: 'lowest', label: 'En Düşük Puan' }].map(s => (
            <button
              key={s.key}
              className={`detay-reviews-sort-btn ${reviewSortBy === s.key ? 'detay-reviews-sort-btn--active' : ''}`}
              onClick={() => setReviewSortBy(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Review list */}
        <div className="detay-review-list">
          {[...reviews]
            .sort((a, b) =>
              reviewSortBy === 'highest' ? b.rating - a.rating
              : reviewSortBy === 'lowest' ? a.rating - b.rating
              : new Date(b.date) - new Date(a.date)
            )
            .map(review => (
              <div key={review.id} className="detay-review-item">
                <div className="detay-review-item__avatar">{review.avatar}</div>
                <div className="detay-review-item__body">
                  <div className="detay-review-item__top">
                    <div>
                      <Stars rating={review.rating} size={12} />
                      {review.title && <p className="detay-review-item__title">{review.title}</p>}
                    </div>
                    <div className="detay-review-item__meta">
                      <span className="detay-review-item__author">{review.author}</span>
                      <span className="detay-review-item__date">{new Date(review.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <p className="detay-review-item__text">{review.body}</p>
                  {review.images?.length > 0 && (
                    <div className="detay-review-item__imgs">
                      {review.images.map((_, i) => (
                        <div key={i} className="detay-review-item__img-placeholder">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          }
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

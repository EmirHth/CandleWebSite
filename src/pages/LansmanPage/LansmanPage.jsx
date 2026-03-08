import { useNavigate, useLocation } from 'react-router-dom'
import products from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './LansmanPage.css'

const lansmanProducts = products.filter(p => p.badge === 'Yeni' || p.badge === 'Sınırlı')

function LansmanCard({ product }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { addToCart }      = useCart()
  const { isAuthenticated } = useAuth()

  const goDetail = () => navigate(`/urun/${product.slug}`)

  const handleCart = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }
    addToCart(product, 1)
  }

  return (
    <div className="lansm-card-wrap">
    <div className="lansm-card" onClick={goDetail}>

      {/* Rozet */}
      <span className={`lansm-card__badge lansm-card__badge--${product.badge === 'Yeni' ? 'yeni' : 'sinirli'}`}>
        {product.badge === 'Yeni' ? 'Yeni' : 'Sınırlı'}
      </span>

      {/* Sağ üst: ikon buton */}
      <div className="lansm-card__side-actions">
        <button className="lansm-card__action-btn" onClick={(e) => { e.stopPropagation(); goDetail() }} aria-label="İncele">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      {/* Görsel — hover'da sağa kayar */}
      <div className="lansm-card__img-wrap">
        <img src={product.image} alt={product.name} className="lansm-card__img" loading="lazy" />
      </div>

      {/* Bilgi paneli — başlangıçta gizli, hover'da alttan kayar */}
      <div className="lansm-card__info">
        <div className="lansm-card__info-top">
          <p className="lansm-card__category">{product.category}</p>
          <h3 className="lansm-card__name">{product.name}</h3>
          <p className="lansm-card__subtitle">{product.subtitle}</p>
        </div>
        <div className="lansm-card__info-bottom">
          <div className="lansm-card__price-group">
            <span className="lansm-card__price">{product.price} ₺</span>
            {product.originalPrice && (
              <span className="lansm-card__original-price">{product.originalPrice} ₺</span>
            )}
          </div>
          <button className="lansm-card__cart-btn" onClick={handleCart}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Sepete Ekle
          </button>
        </div>
      </div>

    </div>
    </div>
  )
}

export default function LansmanPage() {
  const navigate = useNavigate()

  return (
    <div className="lansm-page">
      <div className="lansm-container">

        {lansmanProducts.length > 0 ? (
          <div className="lansm-grid">

            {/* Editorial text card — ilk hücre, başlık olarak entegre */}
            <div className="lansm-text-card">
              <div className="lansm-tc__top">
                <span className="lansm-tc__eyebrow">Lansman Koleksiyonu</span>
                <div className="lansm-tc__accent-line" aria-hidden="true" />
              </div>

              <h1 className="lansm-tc__title">
                Yeni<br /><em>&</em><br />Özel
              </h1>

              <div className="lansm-tc__bottom">
                <p className="lansm-tc__desc">
                  Sınırlı üretim,<br />ilk kez sunulan<br />koleksiyonlar.
                </p>
                <div className="lansm-tc__meta">
                  <span className="lansm-tc__meta-item">
                    <span className="lansm-tc__meta-dot">✦</span>
                    {lansmanProducts.length} Ürün
                  </span>
                  <span className="lansm-tc__meta-item">
                    <span className="lansm-tc__meta-dot">✦</span>
                    Sınırlı Stok
                  </span>
                </div>
              </div>
            </div>

            {lansmanProducts.map(product => (
              <LansmanCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="lansm-empty">Şu an için lansman ürünü bulunmuyor.</div>
        )}

      </div>
    </div>
  )
}

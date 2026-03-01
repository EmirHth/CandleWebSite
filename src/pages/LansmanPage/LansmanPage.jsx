import { useNavigate } from 'react-router-dom'
import products from '../../data/products'
import './LansmanPage.css'

const lansmanProducts = products.filter(p => p.badge === 'Yeni' || p.badge === 'Sınırlı')

export default function LansmanPage() {
  const navigate = useNavigate()

  return (
    <div className="lansm-page">
      <div className="lansm-container">

        {/* Header */}
        <header className="lansm-header">
          <p className="lansm-header__eyebrow">Lansman Koleksiyonu</p>
          <h1 className="lansm-header__title">Yeni & Özel Ürünler</h1>
          <p className="lansm-header__sub">
            Sınırlı üretim ve ilk kez sunulan koleksiyonlarımızla tanışın.
            Her parça, özenle seçilmiş esanslardan ve doğal içeriklerden oluşuyor.
          </p>
          <div className="lansm-badge-strip">
            <span className="lansm-badge">Yeni Gelenler</span>
            <span className="lansm-badge">Sınırlı Stok</span>
            <span className="lansm-badge">{lansmanProducts.length} Ürün</span>
          </div>
        </header>

        {/* Product Grid */}
        {lansmanProducts.length > 0 ? (
          <div className="lansm-grid">
            {lansmanProducts.map(product => (
              <div
                key={product.id}
                className="lansm-card"
                onClick={() => navigate(`/urun/${product.slug}`)}
              >
                <div className="lansm-card__img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="lansm-card__img"
                  />
                  <span
                    className={`lansm-card__badge lansm-card__badge--${
                      product.badge === 'Yeni' ? 'yeni' : 'sinirli'
                    }`}
                  >
                    {product.badge === 'Yeni' ? 'Yeni' : 'Sınırlı'}
                  </span>
                </div>

                <div className="lansm-card__info">
                  <p className="lansm-card__category">{product.category}</p>
                  <h3 className="lansm-card__name">{product.name}</h3>
                  <p className="lansm-card__subtitle">{product.subtitle}</p>

                  <div className="lansm-card__footer">
                    <div>
                      <span className="lansm-card__price">{product.price} ₺</span>
                      {product.originalPrice && (
                        <span className="lansm-card__original-price">
                          {product.originalPrice} ₺
                        </span>
                      )}
                    </div>
                    <div className="lansm-card__arrow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="lansm-empty">Şu an için lansman ürünü bulunmuyor.</div>
        )}

      </div>
    </div>
  )
}

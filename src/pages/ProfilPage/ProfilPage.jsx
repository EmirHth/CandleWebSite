import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import products from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './ProfilPage.css'

/* ─── Mock data ─── */
const MOCK_ORDERS = [
  {
    id: '#LYD-2026-0390',
    date: '27 Şubat 2026',
    status: 'kargoda',
    shipping: { carrier: 'Yurtiçi Kargo', trackingNo: 'YK9283746512', eta: '1–2 iş günü' },
    address: 'Bağcılar Mah. Gül Sok. No:12/4, Bağcılar / İstanbul',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[4], quantity: 2 },
    ],
    total: 927,
  },
  {
    id: '#LYD-2026-0312',
    date: '14 Ocak 2026',
    status: 'teslim edildi',
    shipping: { carrier: 'MNG Kargo', trackingNo: 'MNG8812345670', eta: 'Teslim edildi' },
    address: 'Maslak Mah. Büyükdere Cad. No:255, Sarıyer / İstanbul',
    items: [
      { product: products[1], quantity: 1 },
      { product: products[6], quantity: 1 },
    ],
    total: 648,
  },
  {
    id: '#LYD-2025-0198',
    date: '18 Kasım 2025',
    status: 'teslim edildi',
    shipping: { carrier: 'Aras Kargo', trackingNo: 'AR7730192845', eta: 'Teslim edildi' },
    address: 'Bağcılar Mah. Gül Sok. No:12/4, Bağcılar / İstanbul',
    items: [
      { product: products[3], quantity: 3 },
    ],
    total: 747,
  },
]

const INITIAL_ADDRESSES = [
  { id: 1, label: 'Ev', name: 'Emir K.', phone: '+90 532 000 00 00', line1: 'Bağcılar Mah. Gül Sok. No:12/4', line2: 'Bağcılar / İstanbul, 34200', isDefault: true },
  { id: 2, label: 'İş Yeri', name: 'Emir K.', phone: '+90 532 000 00 00', line1: 'Maslak Mah. Büyükdere Cad. No:255', line2: 'Sarıyer / İstanbul, 34398', isDefault: false },
]

const FAVORITE_PRODUCTS = [products[0], products[4], products[5], products[6]]

const TABS = [
  { id: 'profil',    label: 'Profilim' },
  { id: 'siparisler', label: 'Siparişlerim' },
  { id: 'favoriler', label: 'Favorilerim' },
  { id: 'adresler',  label: 'Adreslerim' },
  { id: 'ayarlar',   label: 'Ayarlar' },
]

const tabVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
}

/* ── Toggle switch ── */
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`profil-toggle ${checked ? 'profil-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="profil-toggle__thumb" />
    </button>
  )
}

/* ── Profilim tab ── */
function ProfilTab({ user }) {
  const [form, setForm] = useState({
    ad: user?.firstName || '',
    soyad: user?.lastName || '',
    email: user?.email || '',
    telefon: '+90 532 000 00 00',
    dogumtarihi: '1995-06-15',
  })
  const [saved, setSaved] = useState(false)
  const [pwForm, setPwForm] = useState({ mevcut: '', yeni: '', tekrar: '' })
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [pwVisible, setPwVisible] = useState({ mevcut: false, yeni: false, tekrar: false })

  const handleChange = (e) => { setSaved(false); setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePwChange = (e) => { setPwError(''); setPwForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  const handlePwSave = (e) => {
    e.preventDefault()
    if (pwForm.mevcut.length < 1) { setPwError('Mevcut şifrenizi girin.'); return }
    if (pwForm.yeni.length < 8) { setPwError('Yeni şifre en az 8 karakter olmalıdır.'); return }
    if (pwForm.yeni !== pwForm.tekrar) { setPwError('Yeni şifreler eşleşmiyor.'); return }
    setPwSaved(true)
    setPwForm({ mevcut: '', yeni: '', tekrar: '' })
    setTimeout(() => setPwSaved(false), 3000)
  }

  const togglePwVisible = (field) => setPwVisible(v => ({ ...v, [field]: !v[field] }))

  return (
    <div className="profil-tab-content">
      <div className="profil-section-header">
        <h2 className="profil-section-title">Kişisel Bilgiler</h2>
        <p className="profil-section-desc">Profil bilgilerinizi güncelleyin.</p>
      </div>

      <form className="profil-form" onSubmit={handleSave}>
        <div className="profil-form__grid">
          <div className="profil-form__field">
            <label className="profil-form__label" htmlFor="pf-ad">Ad</label>
            <input id="pf-ad" type="text" name="ad" className="profil-form__input" value={form.ad} onChange={handleChange} placeholder="Adınız" />
          </div>
          <div className="profil-form__field">
            <label className="profil-form__label" htmlFor="pf-soyad">Soyad</label>
            <input id="pf-soyad" type="text" name="soyad" className="profil-form__input" value={form.soyad} onChange={handleChange} placeholder="Soyadınız" />
          </div>
          <div className="profil-form__field profil-form__field--full">
            <label className="profil-form__label" htmlFor="pf-email">E-posta</label>
            <input id="pf-email" type="email" name="email" className="profil-form__input" value={form.email} onChange={handleChange} />
          </div>
          <div className="profil-form__field profil-form__field--full">
            <label className="profil-form__label" htmlFor="pf-tel">Telefon</label>
            <input id="pf-tel" type="tel" name="telefon" className="profil-form__input" value={form.telefon} onChange={handleChange} placeholder="+90 5__ ___ __ __" />
          </div>
          <div className="profil-form__field profil-form__field--full">
            <label className="profil-form__label" htmlFor="pf-dogum">Doğum Tarihi</label>
            <input id="pf-dogum" type="date" name="dogumtarihi" className="profil-form__input profil-form__input--date" value={form.dogumtarihi} onChange={handleChange} />
          </div>
        </div>
        <div className="profil-form__actions">
          {saved && <span className="profil-form__saved">Kaydedildi!</span>}
          <button type="submit" className="profil-save-btn">Değişiklikleri Kaydet</button>
        </div>
      </form>

      <div className="profil-section-divider" />

      <div className="profil-section-header">
        <h2 className="profil-section-title">Şifre Değiştir</h2>
        <p className="profil-section-desc">Güvenliğiniz için düzenli olarak şifrenizi değiştirin.</p>
      </div>

      <form className="profil-form" onSubmit={handlePwSave}>
        <div className="profil-form__grid profil-form__grid--single">
          {[
            { id: 'mevcut', label: 'Mevcut Şifre', placeholder: '••••••••' },
            { id: 'yeni', label: 'Yeni Şifre', placeholder: 'En az 8 karakter' },
            { id: 'tekrar', label: 'Yeni Şifre (Tekrar)', placeholder: '••••••••' },
          ].map(({ id, label, placeholder }) => (
            <div key={id} className="profil-form__field profil-form__field--full">
              <label className="profil-form__label" htmlFor={`pw-${id}`}>{label}</label>
              <div className="profil-form__pw-wrap">
                <input
                  id={`pw-${id}`}
                  type={pwVisible[id] ? 'text' : 'password'}
                  name={id}
                  className="profil-form__input"
                  value={pwForm[id]}
                  onChange={handlePwChange}
                  placeholder={placeholder}
                  autoComplete="new-password"
                />
                <button type="button" className="profil-form__pw-eye" onClick={() => togglePwVisible(id)} aria-label={pwVisible[id] ? 'Gizle' : 'Göster'}>
                  {pwVisible[id]
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
        {pwError && <p className="profil-form__error">{pwError}</p>}
        {pwSaved && <p className="profil-form__saved">Şifreniz güncellendi!</p>}
        <div className="profil-form__actions">
          <button type="submit" className="profil-save-btn profil-save-btn--outline">Şifreyi Güncelle</button>
        </div>
      </form>
    </div>
  )
}

/* ── Siparişlerim tab ── */
function SiparislerTab() {
  const [expanded, setExpanded] = useState(null)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div className="profil-tab-content">
      <div className="profil-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 className="profil-section-title">Siparişlerim</h2>
          <p className="profil-section-desc">{MOCK_ORDERS.length} sipariş — tüm geçmiş</p>
        </div>
        <button
          onClick={() => navigate('/siparislerim')}
          style={{ background: 'rgba(255,215,100,0.08)', border: '1px solid rgba(255,215,100,0.25)', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', color: 'rgba(255,215,100,0.85)', fontFamily: 'Jost,sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
        >
          Detaylı Görünüm →
        </button>
      </div>
      <div className="profil-orders">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="profil-order-card">
            <div className="profil-order-card__top">
              <div>
                <p className="profil-order-card__id">{order.id}</p>
                <p className="profil-order-card__date">{order.date}</p>
              </div>
              <div className="profil-order-card__top-right">
                <span className={`profil-order-status profil-order-status--${order.status === 'teslim edildi' ? 'delivered' : 'preparing'}`}>
                  {order.status}
                </span>
                <p className="profil-order-card__total">{order.total} TL</p>
              </div>
            </div>

            <div className="profil-order-card__summary">
              {order.items.map(({ product }) => (
                <span key={product.id} className="profil-order-card__item-pill">{product.name}</span>
              ))}
            </div>

            <div className="profil-order-card__bottom">
              <button
                className="profil-order-card__detail-btn"
                onClick={() => toggleExpand(order.id)}
                aria-expanded={expanded === order.id}
              >
                {expanded === order.id ? 'Gizle' : 'Detaylar'}
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className={`profil-order-chevron ${expanded === order.id ? 'profil-order-chevron--open' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {expanded === order.id && (
                <motion.div
                  className="profil-order-detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="profil-order-detail__inner">
                    {/* Products */}
                    <div className="profil-order-detail__products">
                      {order.items.map(({ product, quantity }) => (
                        <div key={product.id} className="profil-order-detail__row">
                          <div className="profil-order-detail__img-wrap">
                            <img src={product.image} alt={product.name} className="profil-order-detail__img" />
                          </div>
                          <div className="profil-order-detail__info">
                            <p className="profil-order-detail__name">{product.name}</p>
                            <p className="profil-order-detail__meta">{product.category} · {quantity} adet</p>
                          </div>
                          <p className="profil-order-detail__price">{product.price * quantity} TL</p>
                          <button
                            className="profil-order-detail__reorder"
                            onClick={() => addToCart(product, quantity)}
                          >
                            Tekrar Sipariş
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Shipping */}
                    <div className="profil-order-detail__shipping">
                      <div className="profil-order-detail__shipping-row">
                        <span>Kargo Firması</span>
                        <span>{order.shipping.carrier}</span>
                      </div>
                      <div className="profil-order-detail__shipping-row">
                        <span>Takip Numarası</span>
                        <span className="profil-order-detail__tracking">{order.shipping.trackingNo}</span>
                      </div>
                      <div className="profil-order-detail__shipping-row">
                        <span>Teslimat Durumu</span>
                        <span>{order.shipping.eta}</span>
                      </div>
                      <div className="profil-order-detail__shipping-row">
                        <span>Teslimat Adresi</span>
                        <span>{order.address}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Favorilerim tab ── */
function FavorilerTab() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState(FAVORITE_PRODUCTS)

  const remove = (id) => setFavorites(f => f.filter(p => p.id !== id))

  return (
    <div className="profil-tab-content">
      <div className="profil-section-header">
        <h2 className="profil-section-title">Favorilerim</h2>
        <p className="profil-section-desc">{favorites.length} favori ürün</p>
      </div>
      {favorites.length === 0 ? (
        <div className="profil-empty-state">
          <p>Henüz favori ürününüz yok.</p>
          <button className="profil-empty-state__btn" onClick={() => navigate('/urunler')}>Ürünleri Keşfet</button>
        </div>
      ) : (
        <div className="profil-favorites-grid">
          <AnimatePresence>
            {favorites.map((product) => (
              <motion.div
                key={product.id}
                className="profil-fav-card"
                layout
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                <div className="profil-fav-card__img-wrap" onClick={() => navigate(`/urun/${product.slug}`)}>
                  <img src={product.image} alt={product.name} className="profil-fav-card__img" />
                  <button className="profil-fav-card__remove" onClick={(e) => { e.stopPropagation(); remove(product.id) }} aria-label="Favorilerden çıkar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="profil-fav-card__body">
                  <p className="profil-fav-card__name" onClick={() => navigate(`/urun/${product.slug}`)}>{product.name}</p>
                  <p className="profil-fav-card__price">{product.price} TL</p>
                  <button className="profil-fav-card__add" onClick={() => addToCart(product, 1)}>Sepete Ekle</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

/* ── Adreslerim tab ── */
function AdreslerTab() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [editing, setEditing] = useState(null) // address id or 'new'
  const [formData, setFormData] = useState({ label: '', name: '', phone: '', line1: '', line2: '' })
  const [deleted, setDeleted] = useState(null)

  const openNew = () => {
    setFormData({ label: '', name: '', phone: '', line1: '', line2: '' })
    setEditing('new')
  }

  const openEdit = (addr) => {
    setFormData({ label: addr.label, name: addr.name, phone: addr.phone, line1: addr.line1, line2: addr.line2 })
    setEditing(addr.id)
  }

  const handleFormChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    if (editing === 'new') {
      setAddresses(prev => [...prev, { id: Date.now(), ...formData, isDefault: prev.length === 0 }])
    } else {
      setAddresses(prev => prev.map(a => a.id === editing ? { ...a, ...formData } : a))
    }
    setEditing(null)
  }

  const handleDelete = (id) => {
    setDeleted(id)
    setTimeout(() => {
      setAddresses(prev => {
        const remaining = prev.filter(a => a.id !== id)
        if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
          remaining[0].isDefault = true
        }
        return remaining
      })
      setDeleted(null)
    }, 350)
  }

  const setDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
  }

  return (
    <div className="profil-tab-content">
      <div className="profil-section-header">
        <h2 className="profil-section-title">Adreslerim</h2>
        <p className="profil-section-desc">Kayıtlı teslimat adreslerinizi yönetin.</p>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="profil-addr-form-wrap"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="profil-addr-form-title">{editing === 'new' ? 'Yeni Adres Ekle' : 'Adresi Düzenle'}</h3>
            <form className="profil-addr-form" onSubmit={handleSave}>
              <div className="profil-form__grid">
                <div className="profil-form__field">
                  <label className="profil-form__label">Adres Etiketi</label>
                  <input type="text" name="label" className="profil-form__input" value={formData.label} onChange={handleFormChange} placeholder="Ev, İş, vb." required />
                </div>
                <div className="profil-form__field">
                  <label className="profil-form__label">Ad Soyad</label>
                  <input type="text" name="name" className="profil-form__input" value={formData.name} onChange={handleFormChange} placeholder="Alıcı adı" required />
                </div>
                <div className="profil-form__field profil-form__field--full">
                  <label className="profil-form__label">Telefon</label>
                  <input type="tel" name="phone" className="profil-form__input" value={formData.phone} onChange={handleFormChange} placeholder="+90 5__ ___ __ __" required />
                </div>
                <div className="profil-form__field profil-form__field--full">
                  <label className="profil-form__label">Adres Satırı 1</label>
                  <input type="text" name="line1" className="profil-form__input" value={formData.line1} onChange={handleFormChange} placeholder="Sokak, numara, daire" required />
                </div>
                <div className="profil-form__field profil-form__field--full">
                  <label className="profil-form__label">İlçe / İl / Posta Kodu</label>
                  <input type="text" name="line2" className="profil-form__input" value={formData.line2} onChange={handleFormChange} placeholder="Beşiktaş / İstanbul, 34349" required />
                </div>
              </div>
              <div className="profil-form__actions profil-form__actions--gap">
                <button type="button" className="profil-save-btn profil-save-btn--ghost" onClick={() => setEditing(null)}>İptal</button>
                <button type="submit" className="profil-save-btn">Adresi Kaydet</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="profil-addr-grid">
        <AnimatePresence>
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              className={`profil-addr-card ${addr.isDefault ? 'profil-addr-card--default' : ''}`}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: deleted === addr.id ? 0 : 1, scale: deleted === addr.id ? 0.95 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {addr.isDefault && <span className="profil-addr-card__badge">Varsayılan</span>}
              <p className="profil-addr-card__label">{addr.label}</p>
              <p className="profil-addr-card__name">{addr.name}</p>
              <p className="profil-addr-card__phone">{addr.phone}</p>
              <p className="profil-addr-card__line">{addr.line1}</p>
              <p className="profil-addr-card__line">{addr.line2}</p>
              <div className="profil-addr-card__actions">
                <button className="profil-addr-btn" onClick={() => openEdit(addr)}>Düzenle</button>
                {!addr.isDefault && (
                  <button className="profil-addr-btn" onClick={() => setDefault(addr.id)}>Varsayılan Yap</button>
                )}
                <button className="profil-addr-btn profil-addr-btn--delete" onClick={() => handleDelete(addr.id)}>Sil</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button className="profil-addr-add-btn" onClick={openNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Yeni Adres Ekle
        </button>
      </div>
    </div>
  )
}

/* ── Ayarlar tab ── */
function AyarlarTab() {
  const [settings, setSettings] = useState({ newsletter: true, notifications: false, sms: true, twoFactor: false })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))

  const handleSaveSettings = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const settingsConfig = [
    { key: 'newsletter', label: 'E-posta Bülteni', desc: 'Yeni koleksiyonlar, kampanyalar ve özel teklifler hakkında e-posta alın.' },
    { key: 'notifications', label: 'Sipariş Bildirimleri', desc: 'Sipariş durumu ve kargo güncellemeleri için anlık bildirimler.' },
    { key: 'sms', label: 'SMS İletişim', desc: 'Kargo takibi ve özel teklifler için SMS bildirimleri.' },
    { key: 'twoFactor', label: 'İki Faktörlü Doğrulama', desc: 'Her girişte e-posta veya SMS ile ek doğrulama kodu isteyin.' },
  ]

  return (
    <div className="profil-tab-content">
      <div className="profil-section-header">
        <h2 className="profil-section-title">Ayarlar</h2>
        <p className="profil-section-desc">Bildirim ve gizlilik tercihlerinizi yönetin.</p>
      </div>

      <div className="profil-settings">
        {settingsConfig.map((item) => (
          <div key={item.key} className="profil-setting-row">
            <div className="profil-setting-row__info">
              <p className="profil-setting-row__label">{item.label}</p>
              <p className="profil-setting-row__desc">{item.desc}</p>
            </div>
            <Toggle checked={settings[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      <div className="profil-form__actions profil-form__actions--mt">
        {saved && <span className="profil-form__saved">Ayarlar kaydedildi!</span>}
        <button className="profil-save-btn" onClick={handleSaveSettings}>Ayarları Kaydet</button>
      </div>

      <div className="profil-section-divider" />

      <div className="profil-danger-zone">
        <p className="profil-danger-zone__title">Tehlikeli Alan</p>
        <p className="profil-danger-zone__desc">Hesabınızı silmek geri alınamaz. Tüm siparişleriniz, favorileriniz ve kayıtlı bilgileriniz kalıcı olarak silinir.</p>
        {!confirmDelete ? (
          <button className="profil-danger-btn" onClick={() => setConfirmDelete(true)}>Hesabımı Sil</button>
        ) : (
          <div className="profil-danger-confirm">
            <p className="profil-danger-confirm__text">Bu işlemi onaylıyor musunuz? Bu geri alınamaz.</p>
            <div className="profil-danger-confirm__btns">
              <button className="profil-save-btn profil-save-btn--ghost" onClick={() => setConfirmDelete(false)}>Vazgeç</button>
              <button className="profil-danger-btn profil-danger-btn--confirm">Evet, Hesabımı Sil</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function ProfilPage() {
  const navigateTo = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profil')

  const handleLogout = () => {
    logout()
    navigateTo('/')
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'profil':     return <ProfilTab key="profil" user={user} />
      case 'siparisler': return <SiparislerTab key="siparisler" />
      case 'favoriler':  return <FavorilerTab key="favoriler" />
      case 'adresler':   return <AdreslerTab key="adresler" />
      case 'ayarlar':    return <AyarlarTab key="ayarlar" />
      default:           return null
    }
  }

  return (
    <div className="profil-page">
      <div className="profil-layout">
        {/* ── Sidebar ── */}
        <aside className="profil-sidebar">
          <div className="profil-sidebar__avatar-wrap">
            <div className="profil-sidebar__avatar">
              <span>{user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}</span>
            </div>
            <div>
              <p className="profil-sidebar__name">{user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}</p>
              <p className="profil-sidebar__email">{user?.email || ''}</p>
            </div>
          </div>

          {/* Points badge */}
          <div className="profil-sidebar__points">
            <p className="profil-sidebar__points-label">Laydora Puanım</p>
            <p className="profil-sidebar__points-value">1 240 P</p>
            <div className="profil-sidebar__points-bar">
              <div className="profil-sidebar__points-fill" style={{ width: '62%' }} />
            </div>
            <p className="profil-sidebar__points-note">Bir sonraki ödüle 260 puan kaldı</p>
          </div>

          <nav className="profil-sidebar__nav">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`profil-sidebar__nav-item ${activeTab === tab.id ? 'profil-sidebar__nav-item--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button className="profil-sidebar__logout" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Çıkış Yap
          </button>
        </aside>

        {/* ── Content area ── */}
        <main className="profil-content">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="visible" exit="exit">
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

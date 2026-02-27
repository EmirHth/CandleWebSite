import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { logActivity, LOG_TYPES } from '../../utils/activityLogger'
import './SepetPage.css'

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 29.9
const ORDERS_KEY = 'laydora_orders'

function saveOrder(order) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    const existing = raw ? JSON.parse(raw) : []
    localStorage.setItem(ORDERS_KEY, JSON.stringify([...existing, order]))
  } catch {
    // ignore
  }
}

function formatCurrency(n) {
  return Number(n).toFixed(2).replace('.', ',') + ' ₺'
}

function generateOrderId() {
  const digits = Math.floor(100000 + Math.random() * 900000)
  return `LYD-${digits}`
}

function addDays(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/* ── Cart Item ── */
function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <motion.div
      className="sp-item"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, scale: 0.96, transition: { duration: 0.28 } }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="sp-item__img-wrap">
        <img src={item.product.image} alt={item.product.name} className="sp-item__img" />
      </div>

      <div className="sp-item__body">
        <div className="sp-item__meta">
          <span className="sp-item__category">{item.product.category}</span>
          {item.product.badge && <span className="sp-item__badge">{item.product.badge}</span>}
        </div>
        <h3 className="sp-item__name">{item.product.name}</h3>
        <p className="sp-item__subtitle">{item.product.subtitle}</p>
        <p className="sp-item__unit-price">{item.product.price} TL / adet</p>
      </div>

      <div className="sp-item__right">
        <div className="sp-item__qty">
          <button
            className="sp-item__qty-btn"
            onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Azalt"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className="sp-item__qty-num">{item.quantity}</span>
          <button
            className="sp-item__qty-btn"
            onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
            aria-label="Artır"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <p className="sp-item__total-price">{(item.product.price * item.quantity).toFixed(2)} TL</p>
        <button
          className="sp-item__remove"
          onClick={() => onRemove(item.product.id)}
          aria-label={`${item.product.name} ürününü kaldır`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          Kaldır
        </button>
      </div>
    </motion.div>
  )
}

/* ── Checkout Modal ── */
function CheckoutModal({ items, subtotal, shipping, discount, promoCode, total, onClose, onSuccess, user }) {
  const [step, setStep] = useState(1) // 1=address, 2=payment, 3=confirm

  // Address form
  const [address, setAddress] = useState(() => {
    const defaultAddr = user?.addresses?.find(a => a.isDefault)
    if (defaultAddr) {
      return {
        fullName: defaultAddr.fullName || `${user.firstName} ${user.lastName}`,
        phone: defaultAddr.phone || '',
        city: defaultAddr.city || '',
        district: defaultAddr.district || '',
        address: defaultAddr.address || '',
      }
    }
    return {
      fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      phone: user?.phone || '',
      city: '', district: '', address: '',
    }
  })

  // Payment
  const [payMethod, setPayMethod] = useState('Kredi Kartı')
  const [card, setCard] = useState({ no: '', name: '', expire: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})

  const formatCardNo = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpire = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  const validateAddress = () => {
    return address.fullName.trim() && address.phone.trim() && address.city.trim() && address.district.trim() && address.address.trim()
  }

  const validateCard = () => {
    if (payMethod !== 'Kredi Kartı') return true
    const errors = {}
    if (card.no.replace(/\s/g, '').length < 16) errors.no = 'Kart numarası 16 haneli olmalı'
    if (!card.name.trim()) errors.name = 'Kart üzerindeki isim gerekli'
    if (card.expire.length < 5) errors.expire = 'Geçerlilik tarihi gerekli'
    if (card.cvv.length < 3) errors.cvv = 'CVV 3 haneli olmalı'
    setCardErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleConfirm = () => {
    const orderId = generateOrderId()
    const carrier = items[0]?.product?.carrier || 'MNG'
    const order = {
      id: orderId,
      userId: user.id,
      date: new Date().toISOString(),
      items: items.map(i => ({
        product: {
          id: i.product.id,
          name: i.product.name,
          subtitle: i.product.subtitle,
          category: i.product.category,
          image: i.product.image,
          price: i.product.price,
        },
        quantity: i.quantity,
      })),
      subtotal,
      shipping,
      discount,
      promoCode: promoCode || null,
      total,
      status: 'Hazırlanıyor',
      address,
      paymentMethod: payMethod,
      carrier,
      trackingNo: null,
      estimatedDelivery: addDays(3),
    }
    saveOrder(order)
    onSuccess(order)
  }

  const stepLabel = (n) => ['', 'Teslimat Adresi', 'Ödeme', 'Onay'][n]

  return (
    <div className="sp-checkout-overlay" onClick={onClose}>
      <motion.div
        className="sp-checkout-modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sp-cmodal-header">
          <div>
            <p className="sp-cmodal-steps">Adım {step} / 3</p>
            <h2 className="sp-cmodal-title">{stepLabel(step)}</h2>
          </div>
          <button className="sp-cmodal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Step indicators */}
        <div className="sp-cmodal-stepper">
          {[1, 2, 3].map(n => (
            <div key={n} className={`sp-cmodal-step${step >= n ? ' sp-cmodal-step--done' : ''}`}>
              <div className="sp-cmodal-step__dot">{step > n ? '✓' : n}</div>
              <span>{stepLabel(n)}</span>
            </div>
          ))}
        </div>

        <div className="sp-cmodal-body">
          {/* ── Step 1: Address ── */}
          {step === 1 && (
            <div className="sp-cmodal-form">
              <div className="sp-cform-grid">
                <div className="sp-cform-field sp-cform-field--full">
                  <label>Ad Soyad *</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))}
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div className="sp-cform-field sp-cform-field--full">
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                    placeholder="05xx xxx xx xx"
                  />
                </div>
                <div className="sp-cform-field">
                  <label>İl *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                    placeholder="İstanbul"
                  />
                </div>
                <div className="sp-cform-field">
                  <label>İlçe *</label>
                  <input
                    type="text"
                    value={address.district}
                    onChange={e => setAddress(a => ({ ...a, district: e.target.value }))}
                    placeholder="Kadıköy"
                  />
                </div>
                <div className="sp-cform-field sp-cform-field--full">
                  <label>Adres *</label>
                  <textarea
                    value={address.address}
                    onChange={e => setAddress(a => ({ ...a, address: e.target.value }))}
                    placeholder="Mahalle, cadde, sokak, bina no, daire no…"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <div className="sp-cmodal-form">
              <div className="sp-cform-payment-methods">
                {['Kredi Kartı', 'Kapıda Ödeme', 'Havale / EFT'].map(m => (
                  <label key={m} className={`sp-cform-paymethod${payMethod === m ? ' sp-cform-paymethod--active' : ''}`}>
                    <input
                      type="radio"
                      name="paymethod"
                      value={m}
                      checked={payMethod === m}
                      onChange={() => setPayMethod(m)}
                    />
                    <span className="sp-cform-paymethod__dot" />
                    <span>{m}</span>
                  </label>
                ))}
              </div>

              {payMethod === 'Kredi Kartı' && (
                <div className="sp-cform-card">
                  <div className="sp-cform-field sp-cform-field--full">
                    <label>Kart Numarası</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={card.no}
                      onChange={e => setCard(c => ({ ...c, no: formatCardNo(e.target.value) }))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                    {cardErrors.no && <span className="sp-cform-error">{cardErrors.no}</span>}
                  </div>
                  <div className="sp-cform-field sp-cform-field--full">
                    <label>Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      value={card.name}
                      onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                      placeholder="AD SOYAD"
                    />
                    {cardErrors.name && <span className="sp-cform-error">{cardErrors.name}</span>}
                  </div>
                  <div className="sp-cform-grid">
                    <div className="sp-cform-field">
                      <label>Son Kullanma</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.expire}
                        onChange={e => setCard(c => ({ ...c, expire: formatExpire(e.target.value) }))}
                        placeholder="AA/YY"
                        maxLength={5}
                      />
                      {cardErrors.expire && <span className="sp-cform-error">{cardErrors.expire}</span>}
                    </div>
                    <div className="sp-cform-field">
                      <label>CVV</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.cvv}
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                        placeholder="123"
                        maxLength={3}
                      />
                      {cardErrors.cvv && <span className="sp-cform-error">{cardErrors.cvv}</span>}
                    </div>
                  </div>
                  <p className="sp-cform-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    256-bit SSL ile şifrelenmiş güvenli ödeme
                  </p>
                </div>
              )}

              {payMethod === 'Kapıda Ödeme' && (
                <div className="sp-cform-info-box">
                  <p>Ürünleriniz teslim edilirken nakit veya kart ile ödeme yapabilirsiniz.</p>
                  <p style={{ marginTop: 6, opacity: 0.6 }}>Not: Kapıda ödeme için ek ücret uygulanmaz.</p>
                </div>
              )}

              {payMethod === 'Havale / EFT' && (
                <div className="sp-cform-info-box">
                  <p style={{ marginBottom: 10 }}>Aşağıdaki hesaba havale/EFT yapabilirsiniz:</p>
                  <p><strong>Banka:</strong> Garanti BBVA</p>
                  <p><strong>Hesap Sahibi:</strong> Laydora Ltd. Şti.</p>
                  <p><strong>IBAN:</strong> TR94 0006 2001 3340 0006 2991 33</p>
                  <p style={{ marginTop: 8, opacity: 0.6, fontSize: '0.78rem' }}>Açıklama kısmına sipariş numaranızı yazmayı unutmayınız.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (
            <div className="sp-cmodal-confirm">
              <div className="sp-cconfirm-section">
                <p className="sp-cconfirm-label">Teslimat Adresi</p>
                <p className="sp-cconfirm-val">
                  {address.fullName} · {address.phone}<br />
                  {address.address}, {address.district} / {address.city}
                </p>
              </div>
              <div className="sp-cconfirm-section">
                <p className="sp-cconfirm-label">Ödeme Yöntemi</p>
                <p className="sp-cconfirm-val">{payMethod}</p>
              </div>
              <div className="sp-cconfirm-section">
                <p className="sp-cconfirm-label">Sipariş Özeti</p>
                <div className="sp-cconfirm-items">
                  {items.map(item => (
                    <div key={item.product.id} className="sp-cconfirm-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="sp-cconfirm-totals">
                  <div className="sp-cconfirm-total-line">
                    <span>Ara Toplam</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="sp-cconfirm-total-line">
                    <span>Kargo</span>
                    <span>{shipping === 0 ? 'Ücretsiz' : formatCurrency(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="sp-cconfirm-total-line">
                      <span>İndirim</span><span>−{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="sp-cconfirm-total-line sp-cconfirm-total-line--total">
                    <span>Genel Toplam</span><strong>{formatCurrency(total)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sp-cmodal-footer">
          {step > 1 && (
            <button className="sp-cmodal-back" onClick={() => setStep(s => s - 1)}>
              ← Geri
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button
              className="sp-cmodal-next"
              onClick={() => {
                if (step === 1 && !validateAddress()) return
                if (step === 2 && !validateCard()) return
                setStep(s => s + 1)
              }}
            >
              Devam Et →
            </button>
          ) : (
            <button className="sp-cmodal-confirm-btn" onClick={handleConfirm}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Siparişi Tamamla
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Success Screen ── */
function SuccessScreen({ order, onPrint, onOrders }) {
  return (
    <motion.div
      className="sp-success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="sp-success__icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="sp-success__title">Siparişiniz Alındı!</h2>
      <p className="sp-success__sub">
        Sipariş No: <strong style={{ color: 'rgba(255,215,100,0.9)' }}>{order.id}</strong>
      </p>
      <p className="sp-success__desc">
        Siparişiniz hazırlanmaya başlanacak. Tahmini teslim tarihi: <strong>{order.estimatedDelivery}</strong>
      </p>
      <div className="sp-success__actions">
        <button className="sp-success__btn sp-success__btn--gold" onClick={onPrint}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Dekont Yazdır / PDF
        </button>
        <button className="sp-success__btn sp-success__btn--ghost" onClick={onOrders}>
          Siparişlerime Git →
        </button>
      </div>
    </motion.div>
  )
}

function printOrderReceipt(order) {
  const formatCurr = (n) => Number(n).toFixed(2).replace('.', ',') + ' ₺'
  const formatDate = (iso) => new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  const itemsRows = order.items.map(item =>
    `<tr>
      <td>${item.product.name}</td>
      <td>${item.product.category}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">${formatCurr(item.product.price)}</td>
      <td style="text-align:right">${formatCurr(item.product.price * item.quantity)}</td>
    </tr>`
  ).join('')

  const discountLine = order.discount > 0
    ? `<div class="tl"><span>İndirim (${order.promoCode})</span><span>-${formatCurr(order.discount)}</span></div>`
    : ''

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laydora Dekont – ${order.id}</title>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Cormorant+Garamond:wght@600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Jost', sans-serif; color: #1a1a1a; background: #fff; padding: 40px; }
    .hd { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; letter-spacing: 0.1em; }
    .tl2 { font-size: 0.68rem; letter-spacing: 0.12em; opacity: 0.45; margin-top: 4px; }
    .rno-l { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5; }
    .rno { font-size: 1.05rem; font-weight: 700; margin-top: 4px; }
    .rdate { font-size: 0.78rem; opacity: 0.5; margin-top: 4px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; padding: 16px; background: #f8f8f8; border-radius: 8px; }
    .mb strong { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.5; margin-bottom: 6px; }
    .mb p { font-size: 0.8rem; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th { text-align: left; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.5; padding: 8px 10px; border-bottom: 2px solid #1a1a1a; }
    tbody td { padding: 10px 10px; font-size: 0.82rem; border-bottom: 1px solid #f0f0f0; }
    tbody td:nth-child(3) { text-align: center; }
    tbody td:nth-child(4), tbody td:nth-child(5) { text-align: right; }
    .totals { width: 280px; margin-left: auto; }
    .tl { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 5px 0; border-bottom: 1px solid #f0f0f0; }
    .tt { display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 700; padding: 12px 0 0; border-top: 2px solid #1a1a1a; margin-top: 4px; }
    .ft { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 0.72rem; color: #888; text-align: center; line-height: 1.8; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="hd">
    <div>
      <div class="brand">LAYDORA</div>
      <div class="tl2">EL YAPIMI DOĞAL MUMLAR</div>
    </div>
    <div style="text-align:right">
      <div class="rno-l">Sipariş Dekontu</div>
      <div class="rno">${order.id}</div>
      <div class="rdate">${formatDate(order.date)}</div>
    </div>
  </div>
  <div class="meta">
    <div class="mb">
      <strong>Teslimat Adresi</strong>
      <p>${order.address.fullName}<br>${order.address.address}<br>${order.address.district}, ${order.address.city}<br>${order.address.phone}</p>
    </div>
    <div class="mb">
      <strong>Ödeme Bilgileri</strong>
      <p>Yöntem: ${order.paymentMethod}<br>Durum: Ödeme Alındı<br>Kargo: ${order.carrier || '—'}<br>Tahmini Teslim: ${order.estimatedDelivery || '—'}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Ürün</th><th>Kategori</th>
        <th style="text-align:center">Adet</th>
        <th style="text-align:right">Birim Fiyat</th>
        <th style="text-align:right">Toplam</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>
  <div class="totals">
    <div class="tl"><span>Ara Toplam</span><span>${formatCurr(order.subtotal)}</span></div>
    <div class="tl"><span>Kargo</span><span>${order.shipping === 0 ? 'Ücretsiz' : formatCurr(order.shipping)}</span></div>
    ${discountLine}
    <div class="tt"><span>GENEL TOPLAM</span><span>${formatCurr(order.total)}</span></div>
  </div>
  <div class="ft">
    Laydora El Yapımı Doğal Mumlar — laydora.com<br>
    Bu belge sipariş kaydınızın resmi dekontu niteliğindedir.<br>
    Sorularınız için: destek@laydora.com · 0850 xxx xx xx
  </div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`

  const w = window.open('', '_blank')
  if (w) {
    w.document.write(html)
    w.document.close()
  }
}

/* ── Main SepetPage ── */
export default function SepetPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + shipping - discount
  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal)

  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === 'LAYDORA10') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Geçersiz promosyon kodu.')
      setPromoApplied(false)
    }
  }

  const handleOrderSuccess = (order) => {
    clearCart()
    setShowCheckout(false)
    setCompletedOrder(order)
    logActivity(LOG_TYPES.PURCHASE, {
      orderId: order.id,
      total: order.total,
      itemCount: order.items.length,
    }, user?.id)
    if (promoApplied) {
      logActivity(LOG_TYPES.PROMO_APPLIED, { promoCode: 'LAYDORA10' }, user?.id)
    }
  }

  /* ── Success screen after purchase ── */
  if (completedOrder) {
    return (
      <div className="sp-page sp-page--empty">
        <SuccessScreen
          order={completedOrder}
          onPrint={() => printOrderReceipt(completedOrder)}
          onOrders={() => navigate('/siparislerim')}
        />
      </div>
    )
  }

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <div className="sp-page sp-page--empty">
        <motion.div
          className="sp-empty"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sp-empty__icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2 className="sp-empty__title">Sepetiniz Boş</h2>
          <p className="sp-empty__desc">
            Henüz sepetinize ürün eklemediniz.<br />Koleksiyonumuzu keşfedin.
          </p>
          <button className="sp-empty__btn" onClick={() => navigate('/urunler')}>
            Alışverişe Başla
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="sp-page">
        <div className="sp-container">

          {/* Header */}
          <motion.div
            className="sp-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="sp-header__eyebrow">Laydora</p>
              <h1 className="sp-header__title">Sepetim</h1>
            </div>
            <span className="sp-header__count">{items.length} ürün</span>
          </motion.div>

          {/* Shipping progress */}
          {shipping > 0 && (
            <motion.div
              className="sp-shipping-bar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div className="sp-shipping-bar__text">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  Ücretsiz kargoya <strong>{remaining.toFixed(0)} TL</strong> kaldı
                </span>
                <span className="sp-shipping-bar__pct">{shippingProgress.toFixed(0)}%</span>
              </div>
              <div className="sp-shipping-bar__track">
                <motion.div
                  className="sp-shipping-bar__fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          )}

          {shipping === 0 && (
            <motion.div
              className="sp-shipping-free"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tebrikler! Siparişiniz ücretsiz kargoya hak kazandı.
            </motion.div>
          )}

          {/* Main layout */}
          <div className="sp-layout">

            {/* Left: items */}
            <div className="sp-items-col">
              <div className="sp-items-head">
                <span>Ürün</span>
                <span>Adet</span>
                <span>Fiyat</span>
              </div>

              <AnimatePresence>
                {items.map(item => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onQuantityChange={(id, qty) => { if (qty >= 1) updateQuantity(id, qty) }}
                    onRemove={removeFromCart}
                  />
                ))}
              </AnimatePresence>

              <button className="sp-continue-btn" onClick={() => navigate('/urunler')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Alışverişe Devam Et
              </button>
            </div>

            {/* Right: summary */}
            <motion.aside
              className="sp-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="sp-summary__title">Sipariş Özeti</h2>

              <div className="sp-summary__lines">
                <div className="sp-summary__line">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toFixed(2)} TL</span>
                </div>
                <div className="sp-summary__line">
                  <span>Kargo</span>
                  <span className={shipping === 0 ? 'sp-summary__free' : ''}>
                    {shipping === 0 ? 'Ücretsiz' : `${SHIPPING_COST.toFixed(2)} TL`}
                  </span>
                </div>
                {promoApplied && (
                  <div className="sp-summary__line sp-summary__line--discount">
                    <span>İndirim (LAYDORA10)</span>
                    <span>−{discount.toFixed(2)} TL</span>
                  </div>
                )}
                <div className="sp-summary__divider" />
                <div className="sp-summary__line sp-summary__line--total">
                  <span>Genel Toplam</span>
                  <strong>{total.toFixed(2)} TL</strong>
                </div>
              </div>

              {/* Promo */}
              <div className="sp-promo">
                <p className="sp-promo__label">Promosyon Kodu</p>
                <div className="sp-promo__row">
                  <input
                    type="text"
                    className="sp-promo__input"
                    placeholder="Kod girin…"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError('') }}
                    disabled={promoApplied}
                  />
                  <button
                    className="sp-promo__btn"
                    onClick={handlePromo}
                    disabled={promoApplied || !promoCode.trim()}
                  >
                    {promoApplied ? 'Uygulandı' : 'Uygula'}
                  </button>
                </div>
                {promoError && <p className="sp-promo__error">{promoError}</p>}
                {promoApplied && <p className="sp-promo__success">%10 indirim uygulandı!</p>}
              </div>

              {/* CTA */}
              <button className="sp-checkout-btn" onClick={() => setShowCheckout(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Ödemeye Geç
              </button>

              {/* Trust badges */}
              <div className="sp-trust">
                <div className="sp-trust__item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Güvenli Ödeme</span>
                </div>
                <div className="sp-trust__item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <span>Hızlı Teslimat</span>
                </div>
                <div className="sp-trust__item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                  </svg>
                  <span>Kolay İade</span>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            promoCode={promoApplied ? 'LAYDORA10' : null}
            total={total}
            user={user}
            onClose={() => setShowCheckout(false)}
            onSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>
    </>
  )
}

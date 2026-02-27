import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './SiparislerimPage.css'

const ORDERS_KEY = 'laydora_orders'

const STATUS_STEPS = ['Sipariş Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi']

const STATUS_STEP_INDEX = {
  'Hazırlanıyor': 1,
  'Kargoda': 2,
  'Teslim Edildi': 3,
  'İptal': -1,
}

// Seed mock orders for demo
const MOCK_ORDERS = [
  {
    id: 'LYD-741852',
    userId: 2,
    date: '2026-02-20T14:30:00.000Z',
    items: [
      { product: { id: 2, name: 'Kış Mumu', subtitle: 'Karda Sıcaklık', category: 'Soy Mum', image: '/images/kis-mumu.jpg', price: 259 }, quantity: 2 },
      { product: { id: 7, name: 'Gece Koleksiyonu', subtitle: 'Kadife Karanlık', category: 'Set', image: '/images/gece-koleksiyon.jpg', price: 389 }, quantity: 1 },
    ],
    subtotal: 907,
    shipping: 0,
    discount: 0,
    promoCode: null,
    total: 907,
    status: 'Kargoda',
    address: { fullName: 'Emir K.', phone: '0532 xxx xx xx', city: 'İstanbul', district: 'Kadıköy', address: 'Moda Cad. No:45/3' },
    paymentMethod: 'Kredi Kartı',
    carrier: 'MNG',
    trackingNo: 'MNG-4827163920',
    estimatedDelivery: '2026-03-01',
  },
  {
    id: 'LYD-369147',
    userId: 2,
    date: '2026-01-28T09:15:00.000Z',
    items: [
      { product: { id: 10, name: 'Sarı & Turuncu', subtitle: 'Güneş Enerjisi', category: 'Soy Mum', image: '/images/sari-turuncu.jpg', price: 249 }, quantity: 1 },
    ],
    subtotal: 249,
    shipping: 29.9,
    discount: 24.9,
    promoCode: 'LAYDORA10',
    total: 254,
    status: 'Teslim Edildi',
    address: { fullName: 'Emir K.', phone: '0532 xxx xx xx', city: 'İstanbul', district: 'Kadıköy', address: 'Moda Cad. No:45/3' },
    paymentMethod: 'Kredi Kartı',
    carrier: 'Yurtiçi',
    trackingNo: 'YK-2934761850',
    estimatedDelivery: '2026-01-31',
  },
]

function seedOrders(userId) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    const existing = raw ? JSON.parse(raw) : []
    const hasMock = existing.some(o => o.id === 'LYD-741852' || o.id === 'LYD-369147')
    if (!hasMock && userId === 2) {
      const merged = [...existing, ...MOCK_ORDERS]
      localStorage.setItem(ORDERS_KEY, JSON.stringify(merged))
      return merged
    }
    return existing
  } catch {
    return []
  }
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatCurrency(n) {
  return Number(n).toFixed(2).replace('.', ',') + ' ₺'
}

function StatusBadge({ status }) {
  const cls = status === 'Hazırlanıyor' ? 'sip-status--hazir'
    : status === 'Kargoda' ? 'sip-status--kargo'
    : status === 'Teslim Edildi' ? 'sip-status--teslim'
    : 'sip-status--iptal'

  const icon = status === 'Hazırlanıyor' ? '⏳'
    : status === 'Kargoda' ? '🚚'
    : status === 'Teslim Edildi' ? '✓'
    : '✕'

  return (
    <span className={`sip-status ${cls}`}>
      {icon} {status}
    </span>
  )
}

function OrderTimeline({ status }) {
  if (status === 'İptal') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', fontSize: '0.8rem', color: '#f87171', fontFamily: 'Jost,sans-serif' }}>
        <span>✕</span> Bu sipariş iptal edildi.
      </div>
    )
  }

  const currentIdx = STATUS_STEP_INDEX[status] ?? 0

  return (
    <div className="sip-timeline">
      {STATUS_STEPS.map((step, i) => {
        const isDone = i <= currentIdx && currentIdx >= 0
        const isCurrent = i === currentIdx
        return (
          <div
            key={step}
            className={`sip-timeline__step${isDone ? ' sip-timeline__step--done' : ''}${isCurrent ? ' sip-timeline__step--current' : ''}`}
          >
            <div className="sip-timeline__dot">
              {isDone ? '✓' : i + 1}
            </div>
            <span className="sip-timeline__label">{step}</span>
          </div>
        )
      })}
    </div>
  )
}

function printReceipt(order) {
  const itemsRows = order.items.map(item =>
    `<tr>
      <td>${item.product.name}</td>
      <td>${item.product.category}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">${formatCurrency(item.product.price)}</td>
      <td style="text-align:right">${formatCurrency(item.product.price * item.quantity)}</td>
    </tr>`
  ).join('')

  const discountLine = order.discount > 0
    ? `<div class="sip-receipt__totals-line"><span>İndirim (${order.promoCode})</span><span>-${formatCurrency(order.discount)}</span></div>`
    : ''

  const shippingLine = `<div class="sip-receipt__totals-line"><span>Kargo</span><span>${order.shipping === 0 ? 'Ücretsiz' : formatCurrency(order.shipping)}</span></div>`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laydora Dekont – ${order.id}</title>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Cormorant+Garamond:wght@600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Jost', sans-serif; color: #1a1a1a; background: #fff; padding: 40px; }
    .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; letter-spacing: 0.1em; }
    .tagline { font-size: 0.68rem; letter-spacing: 0.12em; opacity: 0.5; margin-top: 4px; }
    .receipt-no-label { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5; }
    .receipt-no { font-size: 1rem; font-weight: 700; margin-top: 4px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; padding: 16px; background: #f8f8f8; border-radius: 8px; }
    .meta-block strong { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.5; margin-bottom: 6px; }
    .meta-block p { font-size: 0.8rem; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th { text-align: left; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.5; padding: 8px 10px; border-bottom: 2px solid #1a1a1a; }
    thead th:last-child, thead th:nth-last-child(2) { text-align: right; }
    tbody td { padding: 10px 10px; font-size: 0.82rem; border-bottom: 1px solid #f0f0f0; }
    tbody td:nth-child(3) { text-align: center; }
    tbody td:nth-child(4), tbody td:nth-child(5) { text-align: right; }
    .totals { width: 260px; margin-left: auto; }
    .totals-line { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 5px 0; border-bottom: 1px solid #f0f0f0; }
    .totals-total { display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 700; padding: 12px 0 0; border-top: 2px solid #1a1a1a; margin-top: 4px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 0.72rem; color: #888; text-align: center; line-height: 1.8; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="receipt-header">
    <div>
      <div class="brand">LAYDORA</div>
      <div class="tagline">EL YAPIMI DOĞAL MUMLAR</div>
    </div>
    <div style="text-align:right">
      <div class="receipt-no-label">Sipariş Dekontu</div>
      <div class="receipt-no">${order.id}</div>
      <div style="font-size:0.78rem; opacity:0.5; margin-top:4px">${formatDate(order.date)}</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-block">
      <strong>Teslimat Adresi</strong>
      <p>${order.address.fullName}<br>${order.address.address}<br>${order.address.district}, ${order.address.city}<br>${order.address.phone}</p>
    </div>
    <div class="meta-block">
      <strong>Ödeme Bilgileri</strong>
      <p>Yöntem: ${order.paymentMethod}<br>Durum: Ödeme Alındı<br>Kargo: ${order.carrier || '—'}<br>Tahmini Teslim: ${order.estimatedDelivery || '—'}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Ürün</th>
        <th>Kategori</th>
        <th style="text-align:center">Adet</th>
        <th style="text-align:right">Birim Fiyat</th>
        <th style="text-align:right">Toplam</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals">
    <div class="totals-line"><span>Ara Toplam</span><span>${formatCurrency(order.subtotal)}</span></div>
    ${shippingLine}
    ${discountLine}
    <div class="totals-total"><span>GENEL TOPLAM</span><span>${formatCurrency(order.total)}</span></div>
  </div>

  <div class="footer">
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

const FILTER_TABS = [
  { key: 'tumu', label: 'Tümü' },
  { key: 'Hazırlanıyor', label: 'Hazırlanıyor' },
  { key: 'Kargoda', label: 'Kargoda' },
  { key: 'Teslim Edildi', label: 'Teslim Edildi' },
  { key: 'İptal', label: 'İptal' },
]

export default function SiparislerimPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState('tumu')

  useEffect(() => {
    if (user) {
      const all = seedOrders(user.id)
      const userOrders = all
        .filter(o => o.userId === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      setOrders(userOrders)
    }
  }, [user])

  const countByStatus = (status) => orders.filter(o => o.status === status).length

  const filtered = activeTab === 'tumu' ? orders : orders.filter(o => o.status === activeTab)

  return (
    <div className="sip-page">
      <div className="sip-container">
        <motion.div
          className="sip-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="sip-header__eyebrow">Laydora</p>
          <h1 className="sip-header__title">Siparişlerim</h1>
          <p className="sip-header__sub">{orders.length} sipariş bulundu</p>
        </motion.div>

        <motion.div
          className="sip-tabs"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              className={`sip-tab${activeTab === tab.key ? ' sip-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key !== 'tumu' && countByStatus(tab.key) > 0 && (
                <span className="sip-tab__count">{countByStatus(tab.key)}</span>
              )}
              {tab.key === 'tumu' && orders.length > 0 && (
                <span className="sip-tab__count">{orders.length}</span>
              )}
            </button>
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            className="sip-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sip-empty__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h2 className="sip-empty__title">Henüz Sipariş Yok</h2>
            <p className="sip-empty__sub">Bu kategoride henüz siparişiniz bulunmuyor.</p>
            <button className="sip-empty__btn" onClick={() => navigate('/urunler')}>
              Alışverişe Başla
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </motion.div>
        ) : (
          <div>
            {filtered.map((order, idx) => {
              const isExpanded = expandedId === order.id
              const thumbs = order.items.slice(0, 3)
              const extraCount = order.items.length - 3

              return (
                <motion.div
                  key={order.id}
                  className="sip-order"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  {/* Header row */}
                  <div
                    className="sip-order__header"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="sip-order__left">
                      {/* Thumbnails */}
                      <div className="sip-order__thumbs">
                        {thumbs.map(item => (
                          <img
                            key={item.product.id}
                            src={item.product.image}
                            alt={item.product.name}
                            className="sip-order__thumb"
                          />
                        ))}
                        {extraCount > 0 && (
                          <div className="sip-order__more">+{extraCount}</div>
                        )}
                      </div>
                      <div>
                        <div className="sip-order__no">{order.id}</div>
                        <div className="sip-order__date">{formatDate(order.date)}</div>
                      </div>
                    </div>

                    <div className="sip-order__right">
                      <StatusBadge status={order.status} />
                      <span className="sip-order__total">{formatCurrency(order.total)}</span>
                      <svg
                        className={`sip-order__chevron${isExpanded ? ' sip-order__chevron--open' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="sip-order__detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        {/* Timeline */}
                        <OrderTimeline status={order.status} />

                        {/* Delivery + Payment info */}
                        <div className="sip-detail-grid">
                          <div>
                            <p className="sip-detail-section__title">Teslimat Adresi</p>
                            <p className="sip-detail-section__text">
                              {order.address.fullName}<br />
                              {order.address.address}<br />
                              {order.address.district}, {order.address.city}<br />
                              {order.address.phone}
                            </p>
                          </div>
                          <div>
                            <p className="sip-detail-section__title">Kargo & Ödeme</p>
                            <p className="sip-detail-section__text">
                              Ödeme: {order.paymentMethod}<br />
                              Kargo Firması: {order.carrier || '—'}<br />
                              {order.trackingNo && <>Takip No: {order.trackingNo}<br /></>}
                              Tahmini Teslim: {order.estimatedDelivery || '—'}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="sip-detail-items">
                          {order.items.map(item => (
                            <div key={item.product.id} className="sip-detail-item">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="sip-detail-item__img"
                              />
                              <div>
                                <div className="sip-detail-item__name">{item.product.name}</div>
                                <div className="sip-detail-item__qty">{item.quantity} adet × {formatCurrency(item.product.price)}</div>
                              </div>
                              <div className="sip-detail-item__price">
                                {formatCurrency(item.product.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Summary */}
                        <div className="sip-detail-summary">
                          <div className="sip-detail-summary__line">
                            <span>Ara Toplam</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div className="sip-detail-summary__line">
                            <span>Kargo</span>
                            <span>{order.shipping === 0 ? 'Ücretsiz' : formatCurrency(order.shipping)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="sip-detail-summary__line">
                              <span>İndirim ({order.promoCode})</span>
                              <span>−{formatCurrency(order.discount)}</span>
                            </div>
                          )}
                          <div className="sip-detail-summary__line sip-detail-summary__total">
                            <span>Genel Toplam</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="sip-detail-actions">
                          <button
                            className="sip-btn sip-btn--gold"
                            onClick={() => printReceipt(order)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                              <rect x="6" y="14" width="12" height="8"/>
                            </svg>
                            Dekont Yazdır / PDF
                          </button>
                          {order.status !== 'İptal' && order.status !== 'Teslim Edildi' && (
                            <button className="sip-btn sip-btn--ghost">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                              </svg>
                              Kargo Takip
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import INITIAL_ORDERS from '../../../data/orders'
import { downloadCSV, printTable } from '../../../utils/exportUtils'

const STATUS_OPTIONS = [
  'hazırlanıyor', 'kargoda', 'teslim edildi', 'iptal edildi',
  'iade talep edildi', 'iade onaylandı', 'iade reddedildi', 'iade tamamlandı',
]

const STATUS_COLORS = {
  'teslim edildi': 'adm-status--delivered',
  'kargoda': 'adm-status--shipping',
  'hazırlanıyor': 'adm-status--preparing',
  'iptal edildi': 'adm-status--cancelled',
  'iade talep edildi': 'adm-status--return-req',
  'iade onaylandı': 'adm-status--return-approved',
  'iade reddedildi': 'adm-status--return-rejected',
  'iade tamamlandı': 'adm-status--return-done',
}

const FILTER_TABS = ['tümü', 'hazırlanıyor', 'kargoda', 'teslim edildi', 'iptal edildi']

const CANCEL_REASONS = ['Müşteri talebi', 'Stok tükendi', 'Hatalı sipariş', 'Diğer']
const RETURN_REASON_OPTIONS = [
  { code: 'damaged', label: 'Ürün hasarlı geldi' },
  { code: 'wrong', label: 'Yanlış ürün gönderildi' },
  { code: 'missing', label: 'Eksik ürün' },
  { code: 'quality', label: 'Kalite sorunu' },
  { code: 'changed_mind', label: 'Fikir değişikliği' },
]

const RETURN_BADGE = {
  'iade talep edildi': { cls: 'adm-return-badge--pending', label: 'Talep Edildi' },
  'iade onaylandı': { cls: 'adm-return-badge--approved', label: 'Onaylandı' },
  'iade reddedildi': { cls: 'adm-return-badge--rejected', label: 'Reddedildi' },
  'iade tamamlandı': { cls: 'adm-return-badge--done', label: 'Tamamlandı' },
}

function now() {
  return new Date().toLocaleString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).replace(',', '')
}

export default function AdminSiparisler() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [filter, setFilter] = useState('tümü')
  const [expanded, setExpanded] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const [editNoteId, setEditNoteId] = useState(null)
  const [noteInput, setNoteInput] = useState('')
  const [editFinanceId, setEditFinanceId] = useState(null)
  const [financeInput, setFinanceInput] = useState({ bankTransactionNo: '', financialNote: '' })
  const [editInvoiceId, setEditInvoiceId] = useState(null)
  const [invoiceInput, setInvoiceInput] = useState({ recipientName: '', taxNo: '', company: '', billingAddress: '' })

  // Return / cancel action state
  const [actionPanel, setActionPanel] = useState(null) // { orderId, type: 'iptal'|'iade'|'approve'|'reject' }
  const [actionForm, setActionForm] = useState({ reason: '', reasonCode: '', amount: 0, note: '' })

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'tümü' || o.status === filter
    const q = searchQ.toLowerCase()
    const matchSearch = !searchQ ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const totalRevenue = orders.reduce((s, o) => o.status !== 'iptal edildi' ? s + o.amount : s, 0)
  const preparingCount = orders.filter(o => o.status === 'hazırlanıyor').length
  const shippingCount = orders.filter(o => o.status === 'kargoda').length
  const deliveredCount = orders.filter(o => o.status === 'teslim edildi').length
  const cancelledCount = orders.filter(o => o.status === 'iptal edildi').length
  const countBy = (f) => f === 'tümü' ? orders.length : orders.filter(o => o.status === f).length

  const updateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o
      return {
        ...o,
        status: newStatus,
        timeline: [
          ...o.timeline,
          { event: `Durum: ${newStatus}`, date: now(), actor: 'Admin', note: null },
        ],
      }
    }))
  }

  const saveNote = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, notes: noteInput || null } : o))
    setEditNoteId(null)
  }

  const saveFinance = (id) => {
    setOrders(prev => prev.map(o => o.id === id
      ? { ...o, bankTransactionNo: financeInput.bankTransactionNo || null, financialNote: financeInput.financialNote || null }
      : o
    ))
    setEditFinanceId(null)
  }

  const saveInvoice = (id) => {
    setOrders(prev => prev.map(o => o.id === id
      ? { ...o, invoice: { ...invoiceInput } }
      : o
    ))
    setEditInvoiceId(null)
  }

  const openAction = (orderId, type) => {
    const order = orders.find(o => o.id === orderId)
    setActionForm({
      reason: '',
      reasonCode: RETURN_REASON_OPTIONS[0].code,
      amount: order?.amount || 0,
      note: '',
    })
    setActionPanel({ orderId, type })
  }

  const handleIptal = () => {
    const { orderId } = actionPanel
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return {
        ...o,
        status: 'iptal edildi',
        cancellationReason: actionForm.reason,
        timeline: [
          ...o.timeline,
          { event: 'Sipariş İptal Edildi', date: now(), actor: 'Admin', note: actionForm.reason || null },
        ],
      }
    }))
    setActionPanel(null)
  }

  const handleIadeOlustur = () => {
    const { orderId } = actionPanel
    const label = RETURN_REASON_OPTIONS.find(r => r.code === actionForm.reasonCode)?.label || actionForm.reason
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return {
        ...o,
        status: 'iade talep edildi',
        returnRequest: {
          reason: label,
          reasonCode: actionForm.reasonCode,
          requestDate: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: Number(actionForm.amount),
          status: 'iade talep edildi',
          adminNote: actionForm.note || null,
          processedDate: null,
        },
        timeline: [
          ...o.timeline,
          { event: 'İade Talebi Oluşturuldu', date: now(), actor: 'Admin', note: label },
        ],
      }
    }))
    setActionPanel(null)
  }

  const handleIadeOnayla = () => {
    const { orderId } = actionPanel
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return {
        ...o,
        status: 'iade onaylandı',
        returnRequest: {
          ...o.returnRequest,
          status: 'iade onaylandı',
          adminNote: actionForm.note || null,
          processedDate: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
        },
        timeline: [
          ...o.timeline,
          { event: 'İade Onaylandı', date: now(), actor: 'Admin', note: actionForm.note || null },
        ],
      }
    }))
    setActionPanel(null)
  }

  const handleIadeReddet = () => {
    const { orderId } = actionPanel
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return {
        ...o,
        status: 'iade reddedildi',
        returnRequest: {
          ...o.returnRequest,
          status: 'iade reddedildi',
          adminNote: actionForm.note || null,
          processedDate: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
        },
        timeline: [
          ...o.timeline,
          { event: 'İade Reddedildi', date: now(), actor: 'Admin', note: actionForm.note || null },
        ],
      }
    }))
    setActionPanel(null)
  }

  const CustomerAvatar = ({ name }) => (
    <div style={{
      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
      background: 'rgba(240,174,50,0.08)', border: '1px solid rgba(240,174,50,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.6rem', fontWeight: 700, color: 'var(--adm-gold)',
    }}>
      {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
    </div>
  )

  return (
    <div className="adm-siparisler">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Siparişler</h1>
          <p className="adm-page-sub">Sipariş takibi, durum güncelleme ve teslimat yönetimi</p>
        </div>
        <div className="adm-page-actions">
          <button
            className="adm-ghost-btn"
            style={{ fontSize: '0.75rem' }}
            onClick={() => {
              const headers = ['Sipariş No', 'Müşteri', 'E-posta', 'Tarih', 'Durum', 'Tutar (₺)', 'Ödeme', 'Banka İşlem No']
              const rows = orders.map(o => [
                o.id, o.customer, o.email,
                new Date(o.date).toLocaleDateString('tr-TR'),
                o.status, o.amount,
                o.paymentMethod || '—',
                o.bankTransactionNo || '—',
              ])
              downloadCSV(rows, headers, `laydora-siparisler-${Date.now()}.csv`)
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Excel İndir
          </button>
          <button
            className="adm-ghost-btn"
            style={{ fontSize: '0.75rem' }}
            onClick={() => {
              const headers = ['Sipariş No', 'Müşteri', 'E-posta', 'Tarih', 'Durum', 'Tutar (₺)']
              const rows = filtered.map(o => [
                o.id, o.customer, o.email,
                new Date(o.date).toLocaleDateString('tr-TR'),
                o.status, `₺${o.amount.toLocaleString('tr-TR')}`,
              ])
              printTable({
                title: 'Sipariş Raporu',
                subtitle: `${filtered.length} sipariş — ${new Date().toLocaleDateString('tr-TR')}`,
                headers,
                rows,
              })
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            PDF Yazdır
          </button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="adm-status-cards">
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Toplam Gelir</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f0ae32" strokeWidth="1.8" strokeLinecap="round" opacity="0.6">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="adm-status-card__val" style={{ color: 'var(--adm-gold)' }}>
            ₺{totalRevenue.toLocaleString('tr-TR')}
          </div>
          <div className="adm-status-card__sub">{orders.filter(o => o.status !== 'iptal edildi').length} aktif sipariş</div>
        </div>
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Hazırlanıyor</span>
            <span className="adm-status-card__dot" style={{ background: '#fbbf24', boxShadow: '0 0 8px #fbbf2450' }} />
          </div>
          <div className="adm-status-card__val" style={{ color: '#fbbf24' }}>{preparingCount}</div>
          <div className="adm-status-card__sub">işlemde</div>
        </div>
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Kargoda</span>
            <span className="adm-status-card__dot" style={{ background: '#60a5fa', boxShadow: '0 0 8px #60a5fa50' }} />
          </div>
          <div className="adm-status-card__val" style={{ color: '#60a5fa' }}>{shippingCount}</div>
          <div className="adm-status-card__sub">yolda</div>
        </div>
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Teslim Edildi</span>
            <span className="adm-status-card__dot" style={{ background: '#34d399', boxShadow: '0 0 8px #34d39950' }} />
          </div>
          <div className="adm-status-card__val" style={{ color: '#34d399' }}>{deliveredCount}</div>
          <div className="adm-status-card__sub">tamamlandı</div>
        </div>
      </div>

      {/* Search + Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 4, flexWrap: 'wrap' }}>
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="adm-search adm-search--icon"
            placeholder="Sipariş ID, müşteri adı veya e-posta ara…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        {cancelledCount > 0 && (
          <span style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.7)' }}>{cancelledCount} iptal edilmiş sipariş</span>
        )}
      </div>

      <div className="adm-tab-filters">
        {FILTER_TABS.map(f => (
          <button
            key={f}
            className={`adm-tab-filter ${filter === f ? 'adm-tab-filter--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="adm-tab-count">{countBy(f)}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <p className="adm-card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ marginRight: 7, opacity: 0.5 }}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Sipariş Listesi
            </p>
            <p className="adm-card-sub">{filtered.length} sipariş gösteriliyor</p>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Sipariş ID</th>
                <th>Müşteri</th>
                <th>Tarih</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th style={{ textAlign: 'center' }}>Detay</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <React.Fragment key={order.id}>
                  <tr className={expanded === order.id ? 'adm-tr--expanded' : ''}>
                    <td>
                      <div>
                        <p className="adm-table-id">{order.id}</p>
                        {order.tracking && (
                          <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', marginTop: 2, fontFamily: 'monospace' }}>
                            📦 {order.tracking}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <CustomerAvatar name={order.customer} />
                        <div>
                          <p className="adm-product-name">{order.customer}</p>
                          <p className="adm-product-sub">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--adm-text-3)', fontSize: '0.76rem' }}>{order.date}</td>
                    <td>
                      <p className="adm-table-amount">₺{order.amount.toLocaleString('tr-TR')}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)' }}>{order.items.length} ürün</p>
                    </td>
                    <td>
                      <select
                        className={`adm-status-select adm-status ${STATUS_COLORS[order.status] || ''}`}
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="adm-action-btn"
                        onClick={() => setExpanded(prev => prev === order.id ? null : order.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                      >
                        <svg
                          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          style={{ transition: 'transform 0.2s', transform: expanded === order.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                        {expanded === order.id ? 'Kapat' : 'Detay'}
                      </button>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr key={`${order.id}-detail`} className="adm-tr--detail">
                      <td colSpan={6}>
                        <div className="adm-order-detail--v2">

                          {/* Bölüm 1: Sipariş İçeriği */}
                          <div className="adm-order-detail__section">
                            <p className="adm-order-detail__section-title">Sipariş İçeriği</p>
                            {order.items.map(({ product, quantity }) => (
                              <div key={product.id} className="adm-order-product-row">
                                <img src={product.image} alt={product.name} className="adm-order-product-img" />
                                <span style={{ flex: 1, color: 'var(--adm-text-2)' }}>{product.name}</span>
                                <span style={{ color: 'var(--adm-text-3)', fontSize: '0.75rem' }}>× {quantity}</span>
                                <span className="adm-table-amount" style={{ fontSize: '0.82rem' }}>₺{(product.price * quantity).toLocaleString('tr-TR')}</span>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--adm-border)' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-3)', marginRight: 12 }}>Toplam Tutar</span>
                              <span className="adm-table-amount" style={{ fontSize: '0.9rem' }}>₺{order.amount.toLocaleString('tr-TR')}</span>
                            </div>
                            <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>
                                Ödeme: <strong style={{ color: 'var(--adm-text-2)' }}>{order.paymentMethod || '—'}</strong>
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>
                                Kargo: <strong style={{ color: 'var(--adm-text-2)' }}>
                                  {order.shippingCost === 0 ? 'Ücretsiz' : `₺${order.shippingCost}`}
                                </strong>
                              </span>
                            </div>
                          </div>

                          {/* Bölüm 2: Teslimat & Notlar */}
                          <div className="adm-order-detail__section">
                            <p className="adm-order-detail__section-title">Teslimat & Notlar</p>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2, color: 'var(--adm-text-3)' }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              <p style={{ fontSize: '0.76rem', color: 'var(--adm-text-2)', lineHeight: 1.5 }}>{order.address}</p>
                            </div>

                            {order.tracking && (
                              <div style={{ marginBottom: 12 }}>
                                <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Kargo Takip</p>
                                <p style={{ fontSize: '0.78rem', color: '#60a5fa', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                                  {order.tracking}
                                </p>
                              </div>
                            )}

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notlar</p>
                                {editNoteId !== order.id && (
                                  <button
                                    className="adm-card-link"
                                    style={{ fontSize: '0.65rem' }}
                                    onClick={() => { setEditNoteId(order.id); setNoteInput(order.notes || '') }}
                                  >
                                    {order.notes ? 'Düzenle' : '+ Ekle'}
                                  </button>
                                )}
                              </div>
                              {editNoteId === order.id ? (
                                <div style={{ display: 'flex', gap: 6, flexDirection: 'column' }}>
                                  <textarea
                                    value={noteInput}
                                    onChange={e => setNoteInput(e.target.value)}
                                    style={{
                                      background: 'rgba(255,255,255,0.035)', border: '1px solid var(--adm-border)',
                                      borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)',
                                      fontFamily: 'Jost,sans-serif', fontSize: '0.78rem', outline: 'none',
                                      resize: 'none', minHeight: 60
                                    }}
                                    placeholder="Sipariş notu ekleyin…"
                                  />
                                  <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                                    <button className="adm-ghost-btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }} onClick={() => setEditNoteId(null)}>İptal</button>
                                    <button className="adm-primary-btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }} onClick={() => saveNote(order.id)}>Kaydet</button>
                                  </div>
                                </div>
                              ) : (
                                <p style={{ fontSize: '0.76rem', color: order.notes ? 'var(--adm-text-2)' : 'var(--adm-text-3)', lineHeight: 1.55, fontStyle: order.notes ? 'normal' : 'italic' }}>
                                  {order.notes || 'Not yok'}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Bölüm 2b: Finansal Bilgiler */}
                          <div className="adm-order-detail__section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <p className="adm-order-detail__section-title" style={{ marginBottom: 0 }}>Finansal Bilgiler</p>
                              {editFinanceId !== order.id && (
                                <button className="adm-card-link" style={{ fontSize: '0.65rem' }}
                                  onClick={() => {
                                    setEditFinanceId(order.id)
                                    setFinanceInput({ bankTransactionNo: order.bankTransactionNo || '', financialNote: order.financialNote || '' })
                                  }}
                                >Düzenle</button>
                              )}
                            </div>

                            {/* Ödeme & Taksit */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 10 }}>
                              <div>
                                <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Ödeme Yöntemi</p>
                                <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{order.paymentMethod || '—'}</p>
                              </div>
                              <div>
                                <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Taksit</p>
                                <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>
                                  {order.installments
                                    ? `${order.installments.count} Taksit — ${order.installments.bank}`
                                    : 'Peşin'}
                                </p>
                              </div>
                              {order.installments && (
                                <div>
                                  <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Taksit Tutarı</p>
                                  <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>
                                    ₺{(order.amount / order.installments.count).toFixed(2)} × {order.installments.count}
                                  </p>
                                </div>
                              )}
                              {order.installments?.transactionDate && (
                                <div>
                                  <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>İşlem Tarihi</p>
                                  <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{order.installments.transactionDate}</p>
                                </div>
                              )}
                            </div>

                            {/* Banka TX No & Finansal Not */}
                            {editFinanceId === order.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div>
                                  <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', marginBottom: 4 }}>Banka İşlem No</p>
                                  <input type="text" value={financeInput.bankTransactionNo}
                                    onChange={e => setFinanceInput(f => ({ ...f, bankTransactionNo: e.target.value }))}
                                    placeholder="TXN-XXX-..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'monospace', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
                                  />
                                </div>
                                <div>
                                  <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', marginBottom: 4 }}>Finansal Not</p>
                                  <textarea value={financeInput.financialNote}
                                    onChange={e => setFinanceInput(f => ({ ...f, financialNote: e.target.value }))}
                                    placeholder="Finansal not…"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.78rem', outline: 'none', resize: 'none', minHeight: 56, boxSizing: 'border-box' }}
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                                  <button className="adm-ghost-btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }} onClick={() => setEditFinanceId(null)}>İptal</button>
                                  <button className="adm-primary-btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }} onClick={() => saveFinance(order.id)}>Kaydet</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div>
                                  <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Banka İşlem No</p>
                                  <p style={{ fontSize: '0.75rem', color: order.bankTransactionNo ? '#60a5fa' : 'var(--adm-text-3)', fontFamily: 'monospace', letterSpacing: '0.04em', fontStyle: order.bankTransactionNo ? 'normal' : 'italic' }}>
                                    {order.bankTransactionNo || 'Girilmedi'}
                                  </p>
                                </div>
                                {order.financialNote && (
                                  <div>
                                    <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Finansal Not</p>
                                    <p style={{ fontSize: '0.76rem', color: 'var(--adm-text-2)', lineHeight: 1.55 }}>{order.financialNote}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Bölüm 2c: Fatura Bilgileri */}
                          <div className="adm-order-detail__section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <p className="adm-order-detail__section-title" style={{ marginBottom: 0 }}>Fatura Bilgileri</p>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button className="adm-card-link" style={{ fontSize: '0.65rem', opacity: 0.6 }}>
                                  📄 PDF İndir
                                </button>
                                {editInvoiceId !== order.id && (
                                  <button className="adm-card-link" style={{ fontSize: '0.65rem' }}
                                    onClick={() => {
                                      setEditInvoiceId(order.id)
                                      setInvoiceInput({
                                        recipientName: order.invoice?.recipientName || order.customer,
                                        taxNo: order.invoice?.taxNo || '',
                                        company: order.invoice?.company || '',
                                        billingAddress: order.invoice?.billingAddress || order.address,
                                      })
                                    }}
                                  >Düzenle</button>
                                )}
                              </div>
                            </div>

                            {editInvoiceId === order.id ? (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {[
                                  { label: 'Ad Soyad / Unvan', key: 'recipientName', placeholder: 'Zeynep Arslan' },
                                  { label: 'TC / Vergi No', key: 'taxNo', placeholder: '12345678901' },
                                  { label: 'Şirket (opsiyonel)', key: 'company', placeholder: 'ABC Ltd.' },
                                ].map(f => (
                                  <div key={f.key}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', marginBottom: 4 }}>{f.label}</p>
                                    <input type="text" value={invoiceInput[f.key]}
                                      onChange={e => setInvoiceInput(prev => ({ ...prev, [f.key]: e.target.value }))}
                                      placeholder={f.placeholder}
                                      style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                  </div>
                                ))}
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', marginBottom: 4 }}>Fatura Adresi</p>
                                  <textarea value={invoiceInput.billingAddress}
                                    onChange={e => setInvoiceInput(prev => ({ ...prev, billingAddress: e.target.value }))}
                                    placeholder="Fatura adresi…"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.78rem', outline: 'none', resize: 'none', minHeight: 56, boxSizing: 'border-box' }}
                                  />
                                </div>
                                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                                  <button className="adm-ghost-btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }} onClick={() => setEditInvoiceId(null)}>İptal</button>
                                  <button className="adm-primary-btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }} onClick={() => saveInvoice(order.id)}>Kaydet</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                                {[
                                  { label: 'Ad Soyad / Unvan', val: order.invoice?.recipientName || order.customer },
                                  { label: 'TC / Vergi No', val: order.invoice?.taxNo || '—' },
                                  { label: 'Şirket', val: order.invoice?.company || '—' },
                                  { label: 'Teslimat Adresi', val: order.address },
                                ].map(f => (
                                  <div key={f.label}>
                                    <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{f.label}</p>
                                    <p style={{ fontSize: '0.76rem', color: 'var(--adm-text-2)', lineHeight: 1.5 }}>{f.val}</p>
                                  </div>
                                ))}
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Fatura Adresi</p>
                                  <p style={{ fontSize: '0.76rem', color: 'var(--adm-text-2)', lineHeight: 1.5 }}>{order.invoice?.billingAddress || order.address}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bölüm 3: Zaman Çizelgesi */}
                          <div className="adm-order-detail__section">
                            <p className="adm-order-detail__section-title">Sipariş Zaman Çizelgesi</p>
                            {order.timeline?.length ? (
                              <div className="adm-timeline">
                                {order.timeline.map((item, i) => (
                                  <div key={i} className="adm-timeline__item">
                                    <div className="adm-timeline__dot-wrap">
                                      <div className={`adm-timeline__dot ${i === order.timeline.length - 1 ? '' : 'adm-timeline__dot--grey'}`} />
                                      {i < order.timeline.length - 1 && <div className="adm-timeline__line" />}
                                    </div>
                                    <div className="adm-timeline__content">
                                      <p className="adm-timeline__event">{item.event}</p>
                                      <p className="adm-timeline__meta">{item.date} · {item.actor}</p>
                                      {item.note && <p className="adm-timeline__note">{item.note}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-3)', fontStyle: 'italic' }}>Kayıt yok</p>
                            )}
                          </div>

                          {/* Bölüm 4: İade / İptal Aksiyonları */}
                          <div className="adm-order-detail__section">
                            <p className="adm-order-detail__section-title">Aksiyon</p>

                            {/* Mevcut iade talebi kartı */}
                            {order.returnRequest && (
                              <div className={`adm-return-card ${
                                order.returnRequest.status === 'iade reddedildi' ? 'adm-return-card--red' :
                                order.returnRequest.status === 'iade onaylandı' || order.returnRequest.status === 'iade tamamlandı' ? 'adm-return-card--green' : ''
                              }`} style={{ marginBottom: 10 }}>
                                <div className="adm-return-card__header">
                                  <span className="adm-return-card__title">İade Talebi</span>
                                  {RETURN_BADGE[order.returnRequest.status] && (
                                    <span className={`adm-return-badge ${RETURN_BADGE[order.returnRequest.status].cls}`}>
                                      {RETURN_BADGE[order.returnRequest.status].label}
                                    </span>
                                  )}
                                </div>
                                <div className="adm-return-card__row">
                                  <span>Sebep</span>
                                  <strong>{order.returnRequest.reason}</strong>
                                </div>
                                <div className="adm-return-card__row">
                                  <span>Tarih</span>
                                  <strong>{order.returnRequest.requestDate}</strong>
                                </div>
                                <div className="adm-return-card__row">
                                  <span>İade Tutarı</span>
                                  <strong>₺{order.returnRequest.amount?.toLocaleString('tr-TR')}</strong>
                                </div>
                                {order.returnRequest.adminNote && (
                                  <div className="adm-return-card__row">
                                    <span>Admin Notu</span>
                                    <strong>{order.returnRequest.adminNote}</strong>
                                  </div>
                                )}
                                {order.returnRequest.processedDate && (
                                  <div className="adm-return-card__row">
                                    <span>İşlem Tarihi</span>
                                    <strong>{order.returnRequest.processedDate}</strong>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* İptal sebebi gösterimi */}
                            {order.cancellationReason && (
                              <div style={{ fontSize: '0.73rem', color: 'rgba(248,113,113,0.7)', marginBottom: 8 }}>
                                İptal sebebi: {order.cancellationReason}
                              </div>
                            )}

                            {/* Aksiyon butonları */}
                            <div className="adm-action-zone">
                              {(order.status === 'hazırlanıyor' || order.status === 'kargoda') && (
                                <button className="adm-cancel-btn" onClick={() => openAction(order.id, 'iptal')}>
                                  Siparişi İptal Et
                                </button>
                              )}
                              {order.status === 'teslim edildi' && !order.returnRequest && (
                                <button className="adm-return-init-btn" onClick={() => openAction(order.id, 'iade')}>
                                  İade Talebi Oluştur
                                </button>
                              )}
                              {order.status === 'iade talep edildi' && (
                                <>
                                  <button className="adm-approve-btn" onClick={() => openAction(order.id, 'approve')}>
                                    İadeyi Onayla
                                  </button>
                                  <button className="adm-reject-btn" onClick={() => openAction(order.id, 'reject')}>
                                    İadeyi Reddet
                                  </button>
                                </>
                              )}
                              {!order.cancellationReason && !order.returnRequest && !['hazırlanıyor','kargoda','teslim edildi','iade talep edildi'].includes(order.status) && (
                                <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', fontStyle: 'italic' }}>Bu sipariş için aksiyon alınamaz.</p>
                              )}
                            </div>

                            {/* Inline action forms */}
                            {actionPanel?.orderId === order.id && (

                              /* İPTAL FORMU */
                              actionPanel.type === 'iptal' ? (
                                <div className="adm-return-form" style={{ marginTop: 12 }}>
                                  <p className="adm-return-form__title">İptal Sebebi</p>
                                  <select value={actionForm.reason} onChange={e => setActionForm(f => ({ ...f, reason: e.target.value }))}>
                                    <option value="">Seçin…</option>
                                    {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                  </select>
                                  <textarea
                                    placeholder="Ek not (opsiyonel)"
                                    value={actionForm.note}
                                    onChange={e => setActionForm(f => ({ ...f, note: e.target.value }))}
                                  />
                                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                    <button className="adm-ghost-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setActionPanel(null)}>Vazgeç</button>
                                    <button className="adm-cancel-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={handleIptal} disabled={!actionForm.reason}>
                                      Onayla & İptal Et
                                    </button>
                                  </div>
                                </div>

                              /* İADE OLUŞTURMA FORMU */
                              ) : actionPanel.type === 'iade' ? (
                                <div className="adm-return-form" style={{ marginTop: 12 }}>
                                  <p className="adm-return-form__title">İade Talebi Oluştur</p>
                                  <select
                                    value={actionForm.reasonCode}
                                    onChange={e => setActionForm(f => ({ ...f, reasonCode: e.target.value }))}
                                  >
                                    {RETURN_REASON_OPTIONS.map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
                                  </select>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', flexShrink: 0 }}>İade Tutarı (₺)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={actionForm.amount}
                                      onChange={e => setActionForm(f => ({ ...f, amount: e.target.value }))}
                                    />
                                  </div>
                                  <textarea
                                    placeholder="Admin notu (opsiyonel)"
                                    value={actionForm.note}
                                    onChange={e => setActionForm(f => ({ ...f, note: e.target.value }))}
                                  />
                                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                    <button className="adm-ghost-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setActionPanel(null)}>Vazgeç</button>
                                    <button className="adm-return-init-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={handleIadeOlustur}>
                                      Talebi Oluştur
                                    </button>
                                  </div>
                                </div>

                              /* ONAYLAMA / REDDETME FORMU */
                              ) : (actionPanel.type === 'approve' || actionPanel.type === 'reject') ? (
                                <div className="adm-return-form" style={{ marginTop: 12 }}>
                                  <p className="adm-return-form__title">
                                    {actionPanel.type === 'approve' ? 'İadeyi Onayla' : 'İadeyi Reddet'}
                                  </p>
                                  <textarea
                                    placeholder="Admin notu (opsiyonel)"
                                    value={actionForm.note}
                                    onChange={e => setActionForm(f => ({ ...f, note: e.target.value }))}
                                  />
                                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                    <button className="adm-ghost-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setActionPanel(null)}>Vazgeç</button>
                                    {actionPanel.type === 'approve' ? (
                                      <button className="adm-approve-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={handleIadeOnayla}>
                                        Onayla
                                      </button>
                                    ) : (
                                      <button className="adm-reject-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={handleIadeReddet}>
                                        Reddet
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <div className="adm-empty">
                      <div className="adm-empty__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                          <line x1="3" y1="6" x2="21" y2="6"/>
                        </svg>
                      </div>
                      <p className="adm-empty__title">
                        {searchQ ? 'Arama sonucu bulunamadı' : 'Bu filtrede sipariş yok'}
                      </p>
                      <p className="adm-empty__sub">
                        {searchQ ? `"${searchQ}" için sonuç bulunamadı.` : 'Farklı bir durum filtresi seçin.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

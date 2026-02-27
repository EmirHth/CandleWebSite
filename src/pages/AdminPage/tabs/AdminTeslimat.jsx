import { useState } from 'react'
import INITIAL_ORDERS from '../../../data/orders'

const CARRIERS = ['PTT Kargo', 'UPS', 'MNG Kargo', 'Yurtiçi Kargo', 'Aras Kargo', 'Sürat Kargo']

const DELIVERY_STATUSES = ['hazırlanıyor', 'kargoda', 'teslim edildi', 'iptal edildi']

const CARRIER_COLORS = {
  'PTT Kargo': { bg: 'rgba(255,165,0,0.1)', color: '#fbbf24', border: 'rgba(255,165,0,0.2)' },
  'UPS': { bg: 'rgba(139,90,43,0.12)', color: '#d4a55c', border: 'rgba(139,90,43,0.25)' },
  'MNG Kargo': { bg: 'rgba(220,50,50,0.1)', color: '#f87171', border: 'rgba(220,50,50,0.2)' },
  'Yurtiçi Kargo': { bg: 'rgba(220,38,38,0.08)', color: '#f87171', border: 'rgba(220,38,38,0.2)' },
  'Aras Kargo': { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
  'Sürat Kargo': { bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.2)' },
}

function detectCarrier(tracking) {
  if (!tracking) return null
  if (tracking.includes('PTT')) return 'PTT Kargo'
  if (tracking.includes('UPS')) return 'UPS'
  if (tracking.includes('MNG')) return 'MNG Kargo'
  if (tracking.includes('ARS')) return 'Aras Kargo'
  if (tracking.includes('SRT')) return 'Sürat Kargo'
  if (tracking.includes('YKI')) return 'Yurtiçi Kargo'
  return 'PTT Kargo'
}

function daysUntil(dateStr) {
  const parts = dateStr?.split(' ')
  if (!parts || parts.length < 3) return null
  const months = { 'Oca': 0,'Şub': 1,'Mar': 2,'Nis': 3,'May': 4,'Haz': 5,'Tem': 6,'Ağu': 7,'Eyl': 8,'Eki': 9,'Kas': 10,'Ara': 11 }
  const d = new Date(Number(parts[2]), months[parts[1]], Number(parts[0]))
  const today = new Date(2026, 1, 27)
  const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
  return diff
}

export default function AdminTeslimat() {
  const [orders, setOrders] = useState(
    INITIAL_ORDERS.map(o => ({
      ...o,
      carrier: o.tracking ? detectCarrier(o.tracking) : null,
      deliveryNote: '',
      estimatedDelivery: o.estimatedDeliveryDate || null,
    }))
  )
  const [searchQ, setSearchQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('tümü')
  const [carrierFilter, setCarrierFilter] = useState('tümü')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ tracking: '', carrier: '', estimatedDelivery: '', deliveryNote: '' })
  const [selected, setSelected] = useState(new Set())
  const [bulkCarrier, setBulkCarrier] = useState('PTT Kargo')
  const [bulkStatus, setBulkStatus] = useState('kargoda')
  const [showBulkPanel, setShowBulkPanel] = useState(false)

  const shippableOrders = orders.filter(o => ['hazırlanıyor', 'kargoda', 'teslim edildi'].includes(o.status))

  const filtered = shippableOrders.filter(o => {
    const q = searchQ.toLowerCase()
    const matchQ = !searchQ || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || (o.tracking || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'tümü' || o.status === statusFilter
    const matchCarrier = carrierFilter === 'tümü' || o.carrier === carrierFilter
    return matchQ && matchStatus && matchCarrier
  })

  const inTransit = orders.filter(o => o.status === 'kargoda').length
  const preparing = orders.filter(o => o.status === 'hazırlanıyor').length
  const delivered = orders.filter(o => o.status === 'teslim edildi').length
  const delayed = orders.filter(o => {
    if (o.status !== 'kargoda') return false
    const days = daysUntil(o.estimatedDelivery)
    return days !== null && days < 0
  }).length

  const openEdit = (order) => {
    setEditForm({
      tracking: order.tracking || '',
      carrier: order.carrier || 'PTT Kargo',
      estimatedDelivery: order.estimatedDelivery || '',
      deliveryNote: order.deliveryNote || '',
    })
    setEditingId(order.id)
  }

  const saveEdit = () => {
    setOrders(prev => prev.map(o =>
      o.id === editingId
        ? { ...o, tracking: editForm.tracking || null, carrier: editForm.carrier, estimatedDelivery: editForm.estimatedDelivery, deliveryNote: editForm.deliveryNote }
        : o
    ))
    setEditingId(null)
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const applyBulkUpdate = () => {
    setOrders(prev => prev.map(o =>
      selected.has(o.id)
        ? { ...o, carrier: bulkCarrier, status: bulkStatus, timeline: [...(o.timeline || []), { event: `Durum: ${bulkStatus}`, date: new Date().toLocaleString('tr-TR'), actor: 'Admin', note: `Toplu güncelleme — ${bulkCarrier}` }] }
        : o
    ))
    setSelected(new Set())
    setShowBulkPanel(false)
  }

  const StatusDot = ({ status }) => {
    const colors = { 'hazırlanıyor': '#fbbf24', 'kargoda': '#60a5fa', 'teslim edildi': '#34d399', 'iptal edildi': '#f87171' }
    return <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: colors[status] || '#94a3b8', marginRight: 5, boxShadow: `0 0 5px ${colors[status] || '#94a3b8'}50` }} />
  }

  return (
    <div className="adm-teslimat">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Teslimat</h1>
          <p className="adm-page-sub">Kargo takibi, servis yönetimi ve teslimat durumları</p>
        </div>
        <div className="adm-page-actions">
          {selected.size > 0 && (
            <button className="adm-ghost-btn" style={{ fontSize: '0.75rem' }} onClick={() => setShowBulkPanel(true)}>
              {selected.size} Sipariş Güncelle
            </button>
          )}
          <button className="adm-ghost-btn" style={{ fontSize: '0.75rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            CSV İndir
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="adm-status-cards">
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Hazırlanıyor</span>
            <span className="adm-status-card__dot" style={{ background: '#fbbf24', boxShadow: '0 0 8px #fbbf2450' }} />
          </div>
          <div className="adm-status-card__val" style={{ color: '#fbbf24' }}>{preparing}</div>
          <div className="adm-status-card__sub">beklemede</div>
        </div>
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Kargoda</span>
            <span className="adm-status-card__dot" style={{ background: '#60a5fa', boxShadow: '0 0 8px #60a5fa50' }} />
          </div>
          <div className="adm-status-card__val" style={{ color: '#60a5fa' }}>{inTransit}</div>
          <div className="adm-status-card__sub">yolda</div>
        </div>
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Teslim Edildi</span>
            <span className="adm-status-card__dot" style={{ background: '#34d399', boxShadow: '0 0 8px #34d39950' }} />
          </div>
          <div className="adm-status-card__val" style={{ color: '#34d399' }}>{delivered}</div>
          <div className="adm-status-card__sub">tamamlandı</div>
        </div>
        <div className="adm-status-card">
          <div className="adm-status-card__top">
            <span className="adm-status-card__label">Geciken</span>
            <span className="adm-status-card__dot" style={{ background: '#f87171', boxShadow: '0 0 8px #f8717150' }} />
          </div>
          <div className="adm-status-card__val" style={{ color: '#f87171' }}>{delayed}</div>
          <div className="adm-status-card__sub">gecikme uyarısı</div>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-filters" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" className="adm-search adm-search--icon" placeholder="Sipariş ID, müşteri, takip no…"
            value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: 260 }} />
        </div>
        <div className="adm-filter-pills">
          {['tümü', 'hazırlanıyor', 'kargoda', 'teslim edildi'].map(s => (
            <button key={s} className={`adm-pill ${statusFilter === s ? 'adm-pill--active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="adm-filter-pills" style={{ marginLeft: 'auto' }}>
          <select
            className="adm-search"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            value={carrierFilter}
            onChange={e => setCarrierFilter(e.target.value)}
          >
            <option value="tümü">Tüm Kargolar</option>
            {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Gecikme Uyarıları */}
      {delayed > 0 && (
        <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ fontSize: '0.78rem', color: '#f87171' }}>
            <strong>{delayed} sipariş</strong> tahmini teslimat tarihini geçmiş. Müşteri bildirimi gerekebilir.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <p className="adm-card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ marginRight: 7, opacity: 0.5 }}>
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              Kargo Takip Paneli
            </p>
            <p className="adm-card-sub">{filtered.length} gönderi</p>
          </div>
          {selected.size > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--adm-gold)' }}>{selected.size} seçili</span>
          )}
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={() => {
                      if (selected.size === filtered.length) setSelected(new Set())
                      else setSelected(new Set(filtered.map(o => o.id)))
                    }}
                    style={{ cursor: 'pointer', width: 14, height: 14 }}
                  />
                </th>
                <th>Sipariş</th>
                <th>Müşteri</th>
                <th>Kargo Firması</th>
                <th>Takip No</th>
                <th>Teslimat Notu</th>
                <th>Tahmini Teslim</th>
                <th>Durum</th>
                <th style={{ textAlign: 'right' }}>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const days = daysUntil(order.estimatedDelivery)
                const isLate = order.status === 'kargoda' && days !== null && days < 0
                const carrierStyle = CARRIER_COLORS[order.carrier] || {}
                return (
                  <tr key={order.id} style={{ background: isLate ? 'rgba(248,113,113,0.03)' : undefined }}>
                    <td>
                      <input type="checkbox" checked={selected.has(order.id)} onChange={() => toggleSelect(order.id)}
                        style={{ cursor: 'pointer', width: 14, height: 14 }} />
                    </td>
                    <td>
                      <p className="adm-table-id">{order.id}</p>
                      <p style={{ fontSize: '0.66rem', color: 'var(--adm-text-3)', marginTop: 2 }}>{order.date}</p>
                    </td>
                    <td>
                      <p className="adm-product-name">{order.customer}</p>
                      <p className="adm-product-sub" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.address}</p>
                    </td>
                    <td>
                      {order.carrier ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 5, background: carrierStyle.bg || 'rgba(255,255,255,0.05)', border: `1px solid ${carrierStyle.border || 'var(--adm-border)'}`, color: carrierStyle.color || 'var(--adm-text-2)' }}>
                          {order.carrier}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', fontStyle: 'italic' }}>Atanmadı</span>
                      )}
                    </td>
                    <td>
                      {order.tracking ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '0.73rem', color: '#60a5fa', letterSpacing: '0.03em' }}>{order.tracking}</span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', fontStyle: 'italic' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', color: order.deliveryNote ? 'var(--adm-text-2)' : 'var(--adm-text-3)', fontStyle: order.deliveryNote ? 'normal' : 'italic', maxWidth: 140, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.deliveryNote || '—'}
                      </span>
                    </td>
                    <td>
                      {order.estimatedDelivery ? (
                        <div>
                          <p style={{ fontSize: '0.73rem', color: 'var(--adm-text-2)' }}>{order.estimatedDelivery}</p>
                          {isLate && (
                            <p style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: 600, marginTop: 2 }}>
                              {Math.abs(days)} gün gecikti!
                            </p>
                          )}
                          {days !== null && days >= 0 && order.status === 'kargoda' && (
                            <p style={{ fontSize: '0.62rem', color: '#fbbf24', marginTop: 2 }}>{days === 0 ? 'Bugün' : `${days} gün kaldı`}</p>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', fontStyle: 'italic' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <StatusDot status={order.status} />
                        <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-2)' }}>{order.status}</span>
                      </span>
                    </td>
                    <td>
                      <div className="adm-row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="adm-action-btn" onClick={() => openEdit(order)}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Düzenle
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 0 }}>
                    <div className="adm-empty">
                      <div className="adm-empty__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="1" y="3" width="15" height="13"/>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        </svg>
                      </div>
                      <p className="adm-empty__title">Sonuç bulunamadı</p>
                      <p className="adm-empty__sub">Filtre kriterlerini değiştirin.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editingId && (
        <div className="adm-modal-overlay" onClick={() => setEditingId(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>Kargo Bilgilerini Güncelle</h2>
              <button className="adm-modal-close" onClick={() => setEditingId(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Kargo Firması', key: 'carrier', type: 'select', options: CARRIERS },
                { label: 'Kargo Takip No', key: 'tracking', placeholder: 'TR-XXX-0000000' },
                { label: 'Tahmini Teslim Tarihi', key: 'estimatedDelivery', placeholder: '1 Mar 2026' },
                { label: 'Teslimat Açıklaması', key: 'deliveryNote', placeholder: 'Kapı görevlisine teslim…' },
              ].map(f => (
                <div key={f.key}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginBottom: 5 }}>{f.label}</p>
                  {f.type === 'select' ? (
                    <select value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.8rem', outline: 'none' }}>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: f.key === 'tracking' ? 'monospace' : 'Jost,sans-serif', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="adm-modal-footer">
              <button className="adm-ghost-btn" onClick={() => setEditingId(null)}>İptal</button>
              <button className="adm-primary-btn" onClick={saveEdit}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Update Panel ── */}
      {showBulkPanel && (
        <div className="adm-modal-overlay" onClick={() => setShowBulkPanel(false)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>Toplu Güncelleme ({selected.size} sipariş)</h2>
              <button className="adm-modal-close" onClick={() => setShowBulkPanel(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginBottom: 5 }}>Kargo Firması</p>
                <select value={bulkCarrier} onChange={e => setBulkCarrier(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.8rem', outline: 'none' }}>
                  {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginBottom: 5 }}>Yeni Durum</p>
                <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.8rem', outline: 'none' }}>
                  {DELIVERY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-ghost-btn" onClick={() => setShowBulkPanel(false)}>İptal</button>
              <button className="adm-primary-btn" onClick={applyBulkUpdate}>
                {selected.size} Siparişi Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

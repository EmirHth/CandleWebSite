import { useState, useRef } from 'react'
import productsData from '../../../data/products'

const CATEGORIES = ['Soy Mum', 'Masaj Mumu', 'Set', 'Difüzör']
const CARRIERS = ['MNG', 'Yurtiçi', 'Aras', 'PTT', 'Sürat', 'Diğer']
const PACKAGE_TYPES = ['Kutu', 'Zarf', 'Kırılabilir', 'Özel']
const SORT_OPTIONS = [
  { val: 'default', label: 'Varsayılan' },
  { val: 'name_asc', label: 'Ad A→Z' },
  { val: 'name_desc', label: 'Ad Z→A' },
  { val: 'price_asc', label: 'Fiyat ↑' },
  { val: 'price_desc', label: 'Fiyat ↓' },
  { val: 'stock', label: 'Stok Durumu' },
]

function sortProducts(arr, sort) {
  const a = [...arr]
  switch (sort) {
    case 'name_asc': return a.sort((x, y) => x.name.localeCompare(y.name))
    case 'name_desc': return a.sort((x, y) => y.name.localeCompare(x.name))
    case 'price_asc': return a.sort((x, y) => x.price - y.price)
    case 'price_desc': return a.sort((x, y) => y.price - x.price)
    case 'stock': return a.sort((x, y) => (y.stockQuantity || 0) - (x.stockQuantity || 0))
    default: return a
  }
}

export default function AdminUrunler() {
  const [products, setProducts] = useState(productsData)
  const [searchQ, setSearchQ] = useState('')
  const [catFilter, setCatFilter] = useState('tumu')
  const [sortBy, setSortBy] = useState('default')
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({})
  const [selected, setSelected] = useState(new Set())
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const [expandedStats, setExpandedStats] = useState(null)
  const fileInputRef = useRef(null)

  const cats = ['tumu', ...new Set(productsData.map(p => p.category))]

  const filtered = sortProducts(
    products.filter(p => {
      const matchCat = catFilter === 'tumu' || p.category === catFilter
      const matchQ = !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        (p.subtitle || '').toLowerCase().includes(searchQ.toLowerCase())
      return matchCat && matchQ
    }),
    sortBy
  )

  const inStockCount = products.filter(p => p.inStock).length
  const outStockCount = products.filter(p => !p.inStock).length

  const openEdit = (product) => {
    setForm({
      sku: '', barcode: '', taxRate: 20,
      netWeight: '', grossWeight: '', volume: '',
      dimensions: { width: '', height: '', depth: '' },
      variations: [],
      carrier: 'MNG', packageType: 'Kutu',
      ...product,
    })
    setEditingId(product.id)
    setIsNew(false)
  }

  const openNew = () => {
    const ts = Date.now().toString().slice(-6)
    setForm({
      id: Date.now(),
      name: '', subtitle: '', price: '', originalPrice: '', category: 'Soy Mum',
      badge: '', inStock: true, stockQuantity: 100, image: '/images/gece-mumu.jpg',
      slug: '', scents: '', burnTime: '', weight: '', description: '',
      rating: 4.5, reviewCount: 0,
      shippingThreshold: 200, estimatedDeliveryDays: '2-3', soldCount: 0,
      sku: `LYD-${ts}`,
      barcode: '',
      taxRate: 20,
      netWeight: '',
      grossWeight: '',
      volume: '',
      dimensions: { width: '', height: '', depth: '' },
      variations: [],
      carrier: 'MNG',
      packageType: 'Kutu',
    })
    setEditingId('new')
    setIsNew(true)
  }

  const handleImageFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(f => ({ ...f, image: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const stockQty = Number(form.stockQuantity) || 0
    const updatedForm = { ...form, stockQuantity: stockQty, inStock: stockQty > 0 }
    if (isNew) {
      setProducts(prev => [...prev, { ...updatedForm, id: Date.now() }])
    } else {
      setProducts(prev => prev.map(p => p.id === form.id ? updatedForm : p))
    }
    setEditingId(null)
  }

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    setConfirmDelete(null)
  }

  const handleBulkDelete = () => {
    setProducts(prev => prev.filter(p => !selected.has(p.id)))
    setSelected(new Set())
    setBulkConfirm(false)
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(p => p.id)))
    }
  }

  const IconEdit = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )

  const IconDelete = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
    </svg>
  )

  return (
    <div className="adm-urunler">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Ürünler</h1>
          <p className="adm-page-sub">Ürün kataloğunu yönetin, düzenleyin ve güncelleyin</p>
        </div>
        <div className="adm-page-actions">
          {selected.size > 0 && (
            <button className="adm-danger-btn" style={{ fontSize: '0.75rem', padding: '7px 14px' }} onClick={() => setBulkConfirm(true)}>
              {selected.size} Ürünü Sil
            </button>
          )}
          <button className="adm-primary-btn" onClick={openNew}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Yeni Ürün
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="adm-mini-stats">
        {[
          { icon: '📦', val: products.length, label: 'Toplam Ürün', valClass: 'adm-mini-stat__val--gold', bg: 'rgba(240,174,50,0.08)', border: 'rgba(240,174,50,0.15)', iconColor: '#f0ae32' },
          { icon: '✅', val: inStockCount, label: 'Stokta', valClass: 'adm-mini-stat__val--green', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)', iconColor: '#34d399' },
          { icon: '⚠️', val: outStockCount, label: 'Tükendi', valClass: 'adm-mini-stat__val--red', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)', iconColor: '#f87171' },
          { icon: '🔍', val: filtered.length, label: 'Filtrelenen', valClass: 'adm-mini-stat__val--blue', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)', iconColor: '#60a5fa' },
        ].map((s, i) => (
          <div key={i} className="adm-mini-stat">
            <div className="adm-mini-stat__icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
            </div>
            <div className="adm-mini-stat__body">
              <span className={`adm-mini-stat__val ${s.valClass}`}>{s.val}</span>
              <span className="adm-mini-stat__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-filters">
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="adm-search adm-search--icon"
            placeholder="Ürün adı veya açıklama ara…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>
        <div className="adm-filter-pills">
          {cats.map(cat => (
            <button
              key={cat}
              className={`adm-pill ${catFilter === cat ? 'adm-pill--active' : ''}`}
              onClick={() => setCatFilter(cat)}
            >
              {cat === 'tumu' ? 'Tümü' : cat}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            className="adm-search"
            style={{ width: 150, padding: '7px 12px' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
          </select>
          <div className="adm-view-toggle">
            <button className={`adm-view-btn ${view === 'list' ? 'adm-view-btn--active' : ''}`} onClick={() => setView('list')} title="Liste">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
            <button className={`adm-view-btn ${view === 'grid' ? 'adm-view-btn--active' : ''}`} onClick={() => setView('grid')} title="Izgara">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid View ── */}
      {view === 'grid' && (
        <div className="adm-product-grid">
          {filtered.map(p => (
            <div key={p.id} className="adm-product-card">
              <img src={p.image} alt={p.name} className="adm-product-card__img" />
              <div className="adm-product-card__body">
                <p className="adm-product-card__name">{p.name}</p>
                <p className="adm-product-card__cat">{p.category}</p>
                {p.badge && <span className="adm-badge">{p.badge}</span>}
                <div className="adm-product-card__footer">
                  <div>
                    <p className="adm-product-card__price">₺{p.price}</p>
                    <span className={`adm-status ${p.inStock ? 'adm-status--delivered' : 'adm-status--cancelled'}`} style={{ marginTop: 4, display: 'inline-flex' }}>
                      {p.inStock ? `${p.stockQuantity ?? '—'} adet` : 'Tükendi'}
                    </span>
                  </div>
                  <div className="adm-product-card__actions">
                    <button className="adm-product-card__btn" onClick={() => openEdit(p)} title="Düzenle">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="adm-product-card__btn adm-product-card__btn--del" onClick={() => setConfirmDelete(p.id)} title="Sil">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="adm-empty" style={{ gridColumn: '1/-1' }}>
              <div className="adm-empty__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <p className="adm-empty__title">Sonuç bulunamadı</p>
              <p className="adm-empty__sub">Arama kriterlerinizi değiştirin.</p>
            </div>
          )}
        </div>
      )}

      {/* ── List View ── */}
      {view === 'list' && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <p className="adm-card-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ marginRight: 7, opacity: 0.5 }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                Katalog
              </p>
              <p className="adm-card-sub">{filtered.length} ürün listeleniyor</p>
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
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', width: 14, height: 14 }}
                    />
                  </th>
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Puan</th>
                  <th>Stok</th>
                  <th style={{ textAlign: 'right' }}>Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <>
                    <tr key={p.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          style={{ cursor: 'pointer', width: 14, height: 14 }}
                        />
                      </td>
                      <td>
                        <div className="adm-product-cell">
                          <div className="adm-product-thumb">
                            <img src={p.image} alt={p.name} />
                          </div>
                          <div>
                            <p className="adm-product-name">{p.name}</p>
                            <p className="adm-product-sub">{p.subtitle}</p>
                            {p.sku && <span style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', fontFamily: 'monospace', letterSpacing: '0.03em' }}>{p.sku}</span>}
                            {p.badge && <span className="adm-badge" style={{ marginLeft: p.sku ? 6 : 0 }}>{p.badge}</span>}
                          </div>
                        </div>
                      </td>
                      <td><span className="adm-cat-tag">{p.category}</span></td>
                      <td>
                        <p className="adm-table-amount">₺{p.price}</p>
                        {p.originalPrice && (
                          <p style={{ fontSize: '0.66rem', color: 'var(--adm-text-3)', textDecoration: 'line-through' }}>₺{p.originalPrice}</p>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: '#f0ae32' }}>★</span>
                          {p.rating?.toFixed(1) || '—'}
                          <span style={{ color: 'var(--adm-text-3)', fontSize: '0.68rem' }}>({p.reviewCount || 0})</span>
                        </span>
                      </td>
                      <td>
                        <span className={`adm-status ${p.inStock ? 'adm-status--delivered' : 'adm-status--cancelled'}`}>
                          {p.inStock ? `${p.stockQuantity ?? '—'} adet` : 'Tükendi'}
                        </span>
                      </td>
                      <td>
                        <div className="adm-row-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="adm-action-btn"
                            onClick={() => setExpandedStats(prev => prev === p.id ? null : p.id)}
                            style={{ fontSize: '0.65rem' }}
                          >
                            {expandedStats === p.id ? '▲ Gizle' : '▼ İstatistik'}
                          </button>
                          <button className="adm-action-btn" onClick={() => openEdit(p)}>
                            <IconEdit /> Düzenle
                          </button>
                          <button className="adm-action-btn adm-action-btn--delete" onClick={() => setConfirmDelete(p.id)}>
                            <IconDelete /> Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedStats === p.id && (
                      <tr key={`${p.id}-stats`}>
                        <td colSpan={7} style={{ padding: 0, borderTop: 'none' }}>
                          <div className="adm-product-stats-row">
                            <span>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                              Satış: <strong>{(p.soldCount || 0).toLocaleString('tr-TR')} adet</strong>
                            </span>
                            <span>
                              Gelir: <strong>₺{((p.soldCount || 0) * p.price).toLocaleString('tr-TR')}</strong>
                            </span>
                            <span>
                              Kargo eşiği: <strong>₺{p.shippingThreshold ?? '—'}</strong>
                            </span>
                            <span>
                              Teslimat: <strong>{p.estimatedDeliveryDays ?? '—'} gün</strong>
                            </span>
                            <span>
                              Firma: <strong>{p.carrier ?? '—'}</strong>
                            </span>
                            <span>
                              Paket: <strong>{p.packageType ?? '—'}</strong>
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 0 }}>
                      <div className="adm-empty">
                        <div className="adm-empty__icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                          </svg>
                        </div>
                        <p className="adm-empty__title">Sonuç bulunamadı</p>
                        <p className="adm-empty__sub">Arama veya filtre kriterlerinizi değiştirin.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Edit / New Modal ── */}
      {editingId && (
        <div className="adm-modal-overlay" onClick={() => setEditingId(null)}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h2>{isNew ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}</h2>
                {!isNew && <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginTop: 3 }}>ID #{form.id}</p>}
              </div>
              <button className="adm-modal-close" onClick={() => setEditingId(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div className="adm-product-preview">
              <div className="adm-product-preview__img">
                {form.image && <img src={form.image} alt="" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--adm-text)' }}>{form.name || '—'}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', marginTop: 3 }}>
                  {form.category || '—'}{form.price ? ` · ₺${form.price}` : ''}
                  {form.burnTime ? ` · ${form.burnTime} saat yanma` : ''}
                </p>
              </div>
              <span className={`adm-status ${form.inStock || Number(form.stockQuantity) > 0 ? 'adm-status--delivered' : 'adm-status--cancelled'}`}>
                {Number(form.stockQuantity) > 0 ? `${form.stockQuantity} adet` : 'Tükendi'}
              </span>
            </div>

            <form className="adm-modal-form" onSubmit={handleSave}>
              <div className="adm-form-grid">
                <div className="adm-form-field">
                  <label>Ürün Adı *</label>
                  <input type="text" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Örn: Gece Mumu" />
                </div>
                <div className="adm-form-field">
                  <label>Altyazı</label>
                  <input type="text" value={form.subtitle || ''} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Kısa açıklama" />
                </div>
                <div className="adm-form-field">
                  <label>Fiyat (₺) *</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required min="0" placeholder="0" />
                </div>
                <div className="adm-form-field">
                  <label>Orijinal Fiyat (₺)</label>
                  <input type="number" value={form.originalPrice || ''} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value ? Number(e.target.value) : null }))} min="0" placeholder="İndirim öncesi fiyat" />
                </div>
                <div className="adm-form-field">
                  <label>Stok Adedi</label>
                  <input type="number" value={form.stockQuantity ?? ''} onChange={e => setForm(f => ({ ...f, stockQuantity: Number(e.target.value) }))} min="0" placeholder="0 = tükendi" />
                </div>
                <div className="adm-form-field">
                  <label>Kategori</label>
                  <select value={form.category || 'Soy Mum'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-field">
                  <label>Yanma Süresi (saat)</label>
                  <input type="text" value={form.burnTime || ''} onChange={e => setForm(f => ({ ...f, burnTime: e.target.value }))} placeholder="40-45" />
                </div>
                <div className="adm-form-field">
                  <label>Ağırlık (gr)</label>
                  <input type="text" value={form.weight || ''} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="230" />
                </div>
                <div className="adm-form-field">
                  <label>Ücretsiz Kargo Eşiği (₺)</label>
                  <input type="number" value={form.shippingThreshold ?? ''} onChange={e => setForm(f => ({ ...f, shippingThreshold: Number(e.target.value) }))} min="0" placeholder="200" />
                </div>
                <div className="adm-form-field">
                  <label>Tahmini Teslimat (gün)</label>
                  <input type="text" value={form.estimatedDeliveryDays || ''} onChange={e => setForm(f => ({ ...f, estimatedDeliveryDays: e.target.value }))} placeholder="2-3" />
                </div>
                <div className="adm-form-field">
                  <label>Kargo Firması</label>
                  <select value={form.carrier || 'MNG'} onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))}>
                    {CARRIERS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-field">
                  <label>Paket Tipi</label>
                  <select value={form.packageType || 'Kutu'} onChange={e => setForm(f => ({ ...f, packageType: e.target.value }))}>
                    {PACKAGE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="adm-form-field">
                  <label>Rozet (opsiyonel)</label>
                  <input type="text" value={form.badge || ''} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Yeni, Çok Satan, Özel…" />
                </div>
                <div className="adm-form-field">
                  <label>Koku Notaları</label>
                  <input type="text" value={form.scents || ''} onChange={e => setForm(f => ({ ...f, scents: e.target.value }))} placeholder="Sandal ağacı, Vanilya, Misk" />
                </div>
                {/* ── SKU & Barkod ── */}
                <div className="adm-form-field">
                  <label>SKU (Stok Kodu)</label>
                  <input type="text" value={form.sku || ''} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="LYD-123456" />
                </div>
                <div className="adm-form-field">
                  <label>Barkod (EAN / UPC)</label>
                  <input type="text" value={form.barcode || ''} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="8691234567890" />
                </div>

                {/* ── Ağırlık & Hacim ── */}
                <div className="adm-form-field">
                  <label>Net Ağırlık (g)</label>
                  <input type="number" value={form.netWeight || ''} onChange={e => setForm(f => ({ ...f, netWeight: e.target.value }))} min="0" placeholder="230" />
                </div>
                <div className="adm-form-field">
                  <label>Brüt Ağırlık (g)</label>
                  <input type="number" value={form.grossWeight || ''} onChange={e => setForm(f => ({ ...f, grossWeight: e.target.value }))} min="0" placeholder="310" />
                </div>
                <div className="adm-form-field">
                  <label>Hacim (ml)</label>
                  <input type="number" value={form.volume || ''} onChange={e => setForm(f => ({ ...f, volume: e.target.value }))} min="0" placeholder="200" />
                </div>
                <div className="adm-form-field">
                  <label>KDV Oranı</label>
                  <select value={form.taxRate ?? 20} onChange={e => setForm(f => ({ ...f, taxRate: Number(e.target.value) }))}>
                    <option value={0}>%0 — KDV'siz</option>
                    <option value={8}>%8 — İndirimli</option>
                    <option value={20}>%20 — Standart</option>
                  </select>
                </div>

                {/* ── Boyutlar ── */}
                <div className="adm-form-field adm-form-field--full">
                  <label>Boyutlar (cm) — En / Boy / Yükseklik</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <input type="number" value={form.dimensions?.width || ''} onChange={e => setForm(f => ({ ...f, dimensions: { ...f.dimensions, width: e.target.value } }))} min="0" placeholder="En" />
                    <input type="number" value={form.dimensions?.height || ''} onChange={e => setForm(f => ({ ...f, dimensions: { ...f.dimensions, height: e.target.value } }))} min="0" placeholder="Boy" />
                    <input type="number" value={form.dimensions?.depth || ''} onChange={e => setForm(f => ({ ...f, dimensions: { ...f.dimensions, depth: e.target.value } }))} min="0" placeholder="Yükseklik" />
                  </div>
                </div>

                {/* ── Varyasyonlar ── */}
                <div className="adm-form-field adm-form-field--full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ marginBottom: 0 }}>Varyasyonlar (Koku / Renk / Boyut)</label>
                    <button
                      type="button"
                      className="adm-ghost-btn"
                      style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                      onClick={() => setForm(f => ({ ...f, variations: [...(f.variations || []), { name: '', priceDiff: 0, stock: 0 }] }))}
                    >
                      + Varyasyon Ekle
                    </button>
                  </div>
                  {(form.variations || []).length === 0 ? (
                    <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', padding: '8px 0' }}>Henüz varyasyon eklenmedi.</p>
                  ) : (
                    <div className="adm-table-wrap" style={{ maxHeight: 200 }}>
                      <table className="adm-table" style={{ fontSize: '0.75rem' }}>
                        <thead>
                          <tr>
                            <th>Varyasyon Adı</th>
                            <th>Fiyat Farkı (₺)</th>
                            <th>Stok</th>
                            <th style={{ width: 36 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(form.variations || []).map((v, vi) => (
                            <tr key={vi}>
                              <td>
                                <input
                                  type="text"
                                  value={v.name}
                                  onChange={e => setForm(f => {
                                    const vars = [...f.variations]
                                    vars[vi] = { ...vars[vi], name: e.target.value }
                                    return { ...f, variations: vars }
                                  })}
                                  placeholder="Örn: Lavanta, Gül, XL"
                                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, padding: '5px 8px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.73rem', outline: 'none', width: '100%' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={v.priceDiff}
                                  onChange={e => setForm(f => {
                                    const vars = [...f.variations]
                                    vars[vi] = { ...vars[vi], priceDiff: Number(e.target.value) }
                                    return { ...f, variations: vars }
                                  })}
                                  placeholder="0"
                                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, padding: '5px 8px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.73rem', outline: 'none', width: '100%' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={v.stock}
                                  onChange={e => setForm(f => {
                                    const vars = [...f.variations]
                                    vars[vi] = { ...vars[vi], stock: Number(e.target.value) }
                                    return { ...f, variations: vars }
                                  })}
                                  min="0"
                                  placeholder="0"
                                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, padding: '5px 8px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.73rem', outline: 'none', width: '100%' }}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }}
                                  onClick={() => setForm(f => ({ ...f, variations: f.variations.filter((_, i) => i !== vi) }))}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M18 6 6 18M6 6l12 12"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="adm-form-field adm-form-field--full">
                  <label>Görsel Yükle</label>
                  <div className="adm-img-upload">
                    <div className="adm-img-upload__preview">
                      {form.image
                        ? <img src={form.image} alt="" />
                        : <span className="adm-img-upload__placeholder">Görsel yok</span>
                      }
                    </div>
                    <label className="adm-img-upload__btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Dosya Seç
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFile} />
                    </label>
                    <input
                      type="text"
                      style={{ flex: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text-3)', fontFamily: 'Jost,sans-serif', fontSize: '0.72rem', outline: 'none' }}
                      value={form.image || ''}
                      onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                      placeholder="/images/urun-adi.jpg veya base64…"
                    />
                  </div>
                </div>
                <div className="adm-form-field adm-form-field--full">
                  <label>Ürün Açıklaması</label>
                  <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ürünün detaylı açıklaması…" style={{ minHeight: 88 }} />
                </div>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-ghost-btn" onClick={() => setEditingId(null)}>İptal</button>
                <button type="submit" className="adm-primary-btn">{isNew ? 'Ürünü Oluştur' : 'Değişiklikleri Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {confirmDelete && (
        <div className="adm-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>Ürünü Sil</h2>
              <button className="adm-modal-close" onClick={() => setConfirmDelete(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="adm-modal-confirm-title" style={{ fontSize: '0.88rem', padding: '20px 22px 0', color: 'var(--adm-text)' }}>
              {products.find(p => p.id === confirmDelete)?.name} silinsin mi?
            </p>
            <p className="adm-modal-confirm-desc">
              Bu işlem <strong style={{ color: '#f87171' }}>geri alınamaz</strong>. Ürün kalıcı olarak katalogdan kaldırılacak.
            </p>
            <div className="adm-modal-footer">
              <button className="adm-ghost-btn" onClick={() => setConfirmDelete(null)}>İptal</button>
              <button className="adm-danger-btn" onClick={() => handleDelete(confirmDelete)}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Delete Confirm ── */}
      {bulkConfirm && (
        <div className="adm-modal-overlay" onClick={() => setBulkConfirm(false)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>Toplu Silme</h2>
              <button className="adm-modal-close" onClick={() => setBulkConfirm(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="adm-modal-confirm-desc">
              Seçili <strong style={{ color: '#f87171' }}>{selected.size} ürün</strong> kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </p>
            <div className="adm-modal-footer">
              <button className="adm-ghost-btn" onClick={() => setBulkConfirm(false)}>İptal</button>
              <button className="adm-danger-btn" onClick={handleBulkDelete}>{selected.size} Ürünü Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

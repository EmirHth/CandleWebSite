import { useState } from 'react'

const CAMPAIGN_TYPES = [
  { id: 'percent', label: 'Yüzde İndirim', icon: '%' },
  { id: 'fixed', label: 'Sabit TL İndirim', icon: '₺' },
  { id: 'freeship', label: 'Ücretsiz Kargo', icon: '🚚' },
  { id: 'gift', label: 'Hediye Çeki', icon: '🎁' },
]

const INITIAL_COUPONS = [
  {
    id: 1, code: 'HOSGELDIN10', type: 'percent', value: 10, minOrder: 150,
    validFrom: '2026-02-01', validTo: '2026-03-31', usageLimit: 500, usedCount: 128,
    active: true, description: 'Yeni üye hoşgeldin kuponu',
  },
  {
    id: 2, code: 'SEVGILI50', type: 'fixed', value: 50, minOrder: 300,
    validFrom: '2026-02-14', validTo: '2026-02-28', usageLimit: 200, usedCount: 187,
    active: false, description: 'Sevgililer Günü özel indirimi',
  },
  {
    id: 3, code: 'UCRETSIZKARGODAN', type: 'freeship', value: 0, minOrder: 100,
    validFrom: '2026-03-01', validTo: '2026-03-31', usageLimit: 1000, usedCount: 0,
    active: true, description: '100 TL üzeri ücretsiz kargo',
  },
  {
    id: 4, code: 'ILKYIL100', type: 'gift', value: 100, minOrder: 500,
    validFrom: '2026-01-01', validTo: '2026-12-31', usageLimit: 100, usedCount: 34,
    active: true, description: 'Yıl dönümü hediye çeki',
  },
  {
    id: 5, code: 'MART20', type: 'percent', value: 20, minOrder: 200,
    validFrom: '2026-03-01', validTo: '2026-03-31', usageLimit: 300, usedCount: 0,
    active: true, description: 'Mart ayı özel kampanyası',
  },
]

const EMPTY_FORM = {
  code: '', type: 'percent', value: '', minOrder: '', description: '',
  validFrom: '', validTo: '', usageLimit: '', active: true,
}

function typeLabel(type) {
  return CAMPAIGN_TYPES.find(t => t.id === type)?.label || type
}

function typeIcon(type) {
  return CAMPAIGN_TYPES.find(t => t.id === type)?.icon || ''
}

function discountLabel(coupon) {
  if (coupon.type === 'percent') return `%${coupon.value} indirim`
  if (coupon.type === 'fixed') return `₺${coupon.value} indirim`
  if (coupon.type === 'freeship') return 'Ücretsiz kargo'
  if (coupon.type === 'gift') return `₺${coupon.value} hediye çeki`
  return '—'
}

export default function AdminKampanya() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS)
  const [searchQ, setSearchQ] = useState('')
  const [typeFilter, setTypeFilter] = useState('tümü')
  const [statusFilter, setStatusFilter] = useState('tümü')
  const [editingId, setEditingId] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = coupons.filter(c => {
    const matchQ = !searchQ || c.code.toLowerCase().includes(searchQ.toLowerCase()) || c.description.toLowerCase().includes(searchQ.toLowerCase())
    const matchType = typeFilter === 'tümü' || c.type === typeFilter
    const matchStatus = statusFilter === 'tümü' || (statusFilter === 'aktif' ? c.active : !c.active)
    return matchQ && matchType && matchStatus
  })

  const activeCount = coupons.filter(c => c.active).length
  const totalUsage = coupons.reduce((s, c) => s + c.usedCount, 0)

  const openNew = () => {
    setForm({ ...EMPTY_FORM, code: `KOD${Date.now().toString().slice(-4)}` })
    setEditingId('new')
    setIsNew(true)
  }

  const openEdit = (c) => {
    setForm({ ...c })
    setEditingId(c.id)
    setIsNew(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const saved = {
      ...form,
      value: Number(form.value) || 0,
      minOrder: Number(form.minOrder) || 0,
      usageLimit: Number(form.usageLimit) || 0,
      usedCount: isNew ? 0 : (form.usedCount || 0),
      id: isNew ? Date.now() : form.id,
    }
    if (isNew) {
      setCoupons(prev => [saved, ...prev])
    } else {
      setCoupons(prev => prev.map(c => c.id === saved.id ? saved : c))
    }
    setEditingId(null)
  }

  const toggleActive = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  const handleDelete = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id))
    setConfirmDelete(null)
  }

  const usagePercent = (c) => c.usageLimit > 0 ? Math.min(100, (c.usedCount / c.usageLimit) * 100) : 0

  return (
    <div className="adm-kampanya">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Kampanyalar</h1>
          <p className="adm-page-sub">Kupon ve indirim kampanyalarını yönetin</p>
        </div>
        <div className="adm-page-actions">
          <button className="adm-primary-btn" onClick={openNew}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Yeni Kampanya
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="adm-mini-stats">
        {[
          { icon: '🎁', val: coupons.length, label: 'Toplam Kampanya', cls: 'adm-mini-stat__val--gold', bg: 'rgba(240,174,50,0.08)', border: 'rgba(240,174,50,0.15)' },
          { icon: '✅', val: activeCount, label: 'Aktif', cls: 'adm-mini-stat__val--green', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)' },
          { icon: '⏸️', val: coupons.length - activeCount, label: 'Pasif', cls: 'adm-mini-stat__val--red', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
          { icon: '🔢', val: totalUsage, label: 'Toplam Kullanım', cls: 'adm-mini-stat__val--blue', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)' },
        ].map((s, i) => (
          <div key={i} className="adm-mini-stat">
            <div className="adm-mini-stat__icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
            </div>
            <div className="adm-mini-stat__body">
              <span className={`adm-mini-stat__val ${s.cls}`}>{s.val}</span>
              <span className="adm-mini-stat__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-filters" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" className="adm-search adm-search--icon" placeholder="Kupon kodu veya açıklama ara…"
            value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: 260 }} />
        </div>
        <div className="adm-filter-pills">
          {['tümü', ...CAMPAIGN_TYPES.map(t => t.id)].map(t => (
            <button key={t} className={`adm-pill ${typeFilter === t ? 'adm-pill--active' : ''}`} onClick={() => setTypeFilter(t)}>
              {t === 'tümü' ? 'Tümü' : typeLabel(t)}
            </button>
          ))}
        </div>
        <div className="adm-filter-pills" style={{ marginLeft: 'auto' }}>
          {['tümü', 'aktif', 'pasif'].map(s => (
            <button key={s} className={`adm-pill ${statusFilter === s ? 'adm-pill--active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <p className="adm-card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ marginRight: 7, opacity: 0.5 }}>
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="22" x2="12" y2="7"/>
              </svg>
              Kampanya Listesi
            </p>
            <p className="adm-card-sub">{filtered.length} kampanya gösteriliyor</p>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Kod</th>
                <th>Tür</th>
                <th>İndirim</th>
                <th>Min. Sipariş</th>
                <th>Geçerlilik</th>
                <th>Kullanım</th>
                <th>Durum</th>
                <th style={{ textAlign: 'right' }}>Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div>
                      <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: 'var(--adm-gold)', letterSpacing: '0.05em' }}>{c.code}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginTop: 2 }}>{c.description}</p>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: '0.9rem' }}>{typeIcon(c.type)}</span>
                      {typeLabel(c.type)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#34d399', fontSize: '0.82rem' }}>{discountLabel(c)}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)' }}>
                      {c.minOrder > 0 ? `₺${c.minOrder}` : '—'}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>
                        {c.validFrom} — {c.validTo}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div style={{ minWidth: 100 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)' }}>
                          {c.usedCount}/{c.usageLimit > 0 ? c.usageLimit : '∞'}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)' }}>
                          {c.usageLimit > 0 ? `${Math.round(usagePercent(c))}%` : ''}
                        </span>
                      </div>
                      {c.usageLimit > 0 && (
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 2,
                            width: `${usagePercent(c)}%`,
                            background: usagePercent(c) >= 90 ? '#f87171' : usagePercent(c) >= 60 ? '#fbbf24' : '#34d399',
                            transition: 'width 0.3s',
                          }} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(c.id)}
                      className={`adm-status ${c.active ? 'adm-status--delivered' : 'adm-status--cancelled'}`}
                      style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                      title="Durumu değiştir"
                    >
                      {c.active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td>
                    <div className="adm-row-actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="adm-action-btn" onClick={() => openEdit(c)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Düzenle
                      </button>
                      <button className="adm-action-btn adm-action-btn--delete" onClick={() => setConfirmDelete(c.id)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                        </svg>
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <div className="adm-empty">
                      <div className="adm-empty__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <polyline points="20 12 20 22 4 22 4 12"/>
                          <rect x="2" y="7" width="20" height="5"/>
                        </svg>
                      </div>
                      <p className="adm-empty__title">Kampanya bulunamadı</p>
                      <p className="adm-empty__sub">Yeni bir kampanya oluşturun veya filtreyi değiştirin.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {editingId && (
        <div className="adm-modal-overlay" onClick={() => setEditingId(null)}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h2>{isNew ? 'Yeni Kampanya Ekle' : 'Kampanyayı Düzenle'}</h2>
                {!isNew && <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginTop: 3 }}>Kod: {form.code}</p>}
              </div>
              <button className="adm-modal-close" onClick={() => setEditingId(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form className="adm-modal-form" onSubmit={handleSave}>
              <div className="adm-form-grid">
                <div className="adm-form-field">
                  <label>Kupon Kodu *</label>
                  <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required placeholder="YENI10" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} />
                </div>
                <div className="adm-form-field">
                  <label>Kampanya Türü</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {CAMPAIGN_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                  </select>
                </div>
                {(form.type === 'percent' || form.type === 'fixed' || form.type === 'gift') && (
                  <div className="adm-form-field">
                    <label>İndirim Değeri {form.type === 'percent' ? '(%)' : '(₺)'}</label>
                    <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} min="0" required placeholder={form.type === 'percent' ? '10' : '50'} />
                  </div>
                )}
                <div className="adm-form-field">
                  <label>Min. Sipariş Tutarı (₺)</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} min="0" placeholder="0 = limitsiz" />
                </div>
                <div className="adm-form-field">
                  <label>Başlangıç Tarihi</label>
                  <input type="date" value={form.validFrom} onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))} />
                </div>
                <div className="adm-form-field">
                  <label>Bitiş Tarihi</label>
                  <input type="date" value={form.validTo} onChange={e => setForm(f => ({ ...f, validTo: e.target.value }))} />
                </div>
                <div className="adm-form-field">
                  <label>Kullanım Limiti</label>
                  <input type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} min="0" placeholder="0 = limitsiz" />
                </div>
                <div className="adm-form-field">
                  <label>Durum</label>
                  <select value={form.active ? 'aktif' : 'pasif'} onChange={e => setForm(f => ({ ...f, active: e.target.value === 'aktif' }))}>
                    <option value="aktif">Aktif</option>
                    <option value="pasif">Pasif</option>
                  </select>
                </div>
                <div className="adm-form-field adm-form-field--full">
                  <label>Açıklama</label>
                  <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Kampanya açıklaması…" />
                </div>
              </div>

              {/* Preview */}
              {form.code && (
                <div style={{ background: 'rgba(240,174,50,0.06)', border: '1px solid rgba(240,174,50,0.15)', borderRadius: 10, padding: '12px 16px', margin: '12px 22px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: 'var(--adm-gold)', letterSpacing: '0.08em' }}>{form.code}</span>
                  <span style={{ color: 'var(--adm-text-3)', fontSize: '0.75rem' }}>→</span>
                  <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>{discountLabel({ type: form.type, value: form.value })}</span>
                  {form.minOrder > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>· min ₺{form.minOrder}</span>}
                </div>
              )}

              <div className="adm-modal-footer">
                <button type="button" className="adm-ghost-btn" onClick={() => setEditingId(null)}>İptal</button>
                <button type="submit" className="adm-primary-btn">{isNew ? 'Kampanya Oluştur' : 'Kaydet'}</button>
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
              <h2>Kampanyayı Sil</h2>
              <button className="adm-modal-close" onClick={() => setConfirmDelete(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="adm-modal-confirm-desc">
              <strong style={{ color: 'var(--adm-gold)' }}>{coupons.find(c => c.id === confirmDelete)?.code}</strong> kodu silinecek. Bu işlem geri alınamaz.
            </p>
            <div className="adm-modal-footer">
              <button className="adm-ghost-btn" onClick={() => setConfirmDelete(null)}>İptal</button>
              <button className="adm-danger-btn" onClick={() => handleDelete(confirmDelete)}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

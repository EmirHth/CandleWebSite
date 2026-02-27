import { useState, useEffect } from 'react'
import INITIAL_ORDERS from '../../../data/orders'
import { downloadCSV, printTable } from '../../../utils/exportUtils'
import { getLogs, LOG_LABELS } from '../../../utils/activityLogger'

function loadUsers() {
  try {
    const raw = localStorage.getItem('laydora_users')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveUsers(users) {
  try { localStorage.setItem('laydora_users', JSON.stringify(users)) } catch {}
}

const ROLE_FILTER_TABS = ['tümü', 'admin', 'kullanıcı', 'dondurulmuş']

const MEMBERSHIP_TIERS = [
  { id: 'standart', label: 'Standart', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', minSpend: 0 },
  { id: 'gümüş', label: 'Gümüş', color: '#cbd5e1', bg: 'rgba(203,213,225,0.08)', border: 'rgba(203,213,225,0.2)', minSpend: 500 },
  { id: 'altın', label: 'Altın', color: '#f0ae32', bg: 'rgba(240,174,50,0.1)', border: 'rgba(240,174,50,0.25)', minSpend: 1500 },
  { id: 'platin', label: 'Platin', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', minSpend: 3000 },
]

const CUSTOMER_SEGMENTS = [
  { id: 'yeni', label: 'Yeni', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
  { id: 'aktif', label: 'Aktif', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
  { id: 'vip', label: 'VIP', color: '#f0ae32', bg: 'rgba(240,174,50,0.1)', border: 'rgba(240,174,50,0.25)' },
  { id: 'uyuyan', label: 'Uyuyan', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
  { id: 'kayıp', label: 'Kayıp', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
]

function getMembershipTier(spent) {
  if (spent >= 3000) return MEMBERSHIP_TIERS[3]
  if (spent >= 1500) return MEMBERSHIP_TIERS[2]
  if (spent >= 500) return MEMBERSHIP_TIERS[1]
  return MEMBERSHIP_TIERS[0]
}

function getAutoSegment(orderCount, spent) {
  if (orderCount === 0) return CUSTOMER_SEGMENTS[4] // kayıp
  if (spent >= 1000 && orderCount >= 2) return CUSTOMER_SEGMENTS[2] // vip
  if (orderCount >= 3) return CUSTOMER_SEGMENTS[1] // aktif
  if (orderCount === 1) return CUSTOMER_SEGMENTS[0] // yeni
  return CUSTOMER_SEGMENTS[1] // aktif
}

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

export default function AdminKullanicilar() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [detailTab, setDetailTab] = useState('profil')
  const [searchQ, setSearchQ] = useState('')
  const [roleFilter, setRoleFilter] = useState('tümü')
  const [segmentOverrides, setSegmentOverrides] = useState({})

  useEffect(() => { setUsers(loadUsers()) }, [])

  const updateUsers = (updated) => {
    setUsers(updated)
    saveUsers(updated)
  }

  const toggleRole = (id) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
    )
    updateUsers(updated)
    if (selectedUser?.id === id)
      setSelectedUser(prev => ({ ...prev, role: prev.role === 'admin' ? 'user' : 'admin' }))
  }

  const toggleFrozen = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, frozen: !u.frozen } : u)
    updateUsers(updated)
    if (selectedUser?.id === id)
      setSelectedUser(prev => ({ ...prev, frozen: !prev.frozen }))
  }

  const openDetail = (user) => {
    setSelectedUser(user)
    setDetailTab('profil')
  }

  const filtered = users.filter(u => {
    const q = searchQ.toLowerCase()
    const matchQ = !searchQ ||
      (u.firstName + ' ' + u.lastName).toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)

    const matchRole =
      roleFilter === 'tümü' ? true :
      roleFilter === 'admin' ? u.role === 'admin' :
      roleFilter === 'kullanıcı' ? u.role === 'user' && !u.frozen :
      roleFilter === 'dondurulmuş' ? u.frozen : true

    return matchQ && matchRole
  })

  const adminCount = users.filter(u => u.role === 'admin').length
  const frozenCount = users.filter(u => u.frozen).length
  const activeCount = users.filter(u => !u.frozen).length

  const countByTab = (t) => {
    if (t === 'tümü') return users.length
    if (t === 'admin') return adminCount
    if (t === 'kullanıcı') return users.filter(u => u.role === 'user' && !u.frozen).length
    if (t === 'dondurulmuş') return frozenCount
    return 0
  }

  // Orders for selected user
  const userOrders = selectedUser
    ? INITIAL_ORDERS.filter(o => o.userId === selectedUser.id)
    : []

  const userOrderCount = selectedUser
    ? INITIAL_ORDERS.filter(o => o.userId === selectedUser.id).length
    : 0

  const userSpent = selectedUser
    ? INITIAL_ORDERS
        .filter(o => o.userId === selectedUser.id && o.status !== 'iptal edildi')
        .reduce((s, o) => s + o.amount, 0)
    : 0

  const UserAvatar = ({ user, size = 34 }) => (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.27),
      flexShrink: 0,
      background: user.role === 'admin' ? 'rgba(240,174,50,0.1)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${user.role === 'admin' ? 'rgba(240,174,50,0.22)' : 'var(--adm-border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size < 40 ? '0.6rem' : '0.95rem', fontWeight: 700,
      color: user.role === 'admin' ? 'var(--adm-gold)' : 'var(--adm-text-3)',
    }}>
      {user.firstName?.[0]}{user.lastName?.[0]}
    </div>
  )

  return (
    <div className="adm-kullanicilar">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Kullanıcılar</h1>
          <p className="adm-page-sub">Müşteri hesaplarını, rolleri ve erişim durumlarını yönetin</p>
        </div>
        <div className="adm-page-actions">
          <button
            className="adm-ghost-btn"
            style={{ fontSize: '0.75rem' }}
            onClick={() => {
              const headers = ['ID', 'Ad', 'Soyad', 'E-posta', 'Rol', 'Kayıt Tarihi', 'Durum']
              const rows = users.map(u => [
                u.id,
                u.firstName,
                u.lastName,
                u.email,
                u.role,
                u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '—',
                u.frozen ? 'Dondurulmuş' : 'Aktif',
              ])
              downloadCSV(rows, headers, `laydora-kullanicilar-${Date.now()}.csv`)
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
              const headers = ['ID', 'Ad Soyad', 'E-posta', 'Rol', 'Kayıt Tarihi', 'Durum']
              const rows = users.map(u => [
                u.id,
                `${u.firstName} ${u.lastName}`,
                u.email,
                u.role,
                u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '—',
                u.frozen ? 'Dondurulmuş' : 'Aktif',
              ])
              printTable({
                title: 'Kullanıcı Raporu',
                subtitle: `${users.length} kayıt — ${new Date().toLocaleDateString('tr-TR')}`,
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

      {/* Mini Stats */}
      <div className="adm-mini-stats">
        {[
          { icon: '👥', val: users.length, label: 'Toplam Kayıt', cls: 'adm-mini-stat__val--gold', bg: 'rgba(240,174,50,0.08)', border: 'rgba(240,174,50,0.15)' },
          { icon: '✅', val: activeCount, label: 'Aktif Hesap', cls: 'adm-mini-stat__val--green', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)' },
          { icon: '🔒', val: frozenCount, label: 'Dondurulmuş', cls: 'adm-mini-stat__val--red', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
          { icon: '⭐', val: adminCount, label: 'Admin', cls: 'adm-mini-stat__val--gold', bg: 'rgba(240,174,50,0.06)', border: 'rgba(240,174,50,0.1)' },
        ].map((s, i) => (
          <div key={i} className="adm-mini-stat">
            <div className="adm-mini-stat__icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ fontSize: '0.92rem' }}>{s.icon}</span>
            </div>
            <div className="adm-mini-stat__body">
              <span className={`adm-mini-stat__val ${s.cls}`}>{s.val}</span>
              <span className="adm-mini-stat__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="adm-filters">
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="adm-search adm-search--icon"
            placeholder="Ad, soyad veya e-posta ile ara…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            style={{ width: 280 }}
          />
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="adm-tab-filters">
        {ROLE_FILTER_TABS.map(t => (
          <button
            key={t}
            className={`adm-tab-filter ${roleFilter === t ? 'adm-tab-filter--active' : ''}`}
            onClick={() => setRoleFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="adm-tab-count">{countByTab(t)}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <p className="adm-card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ marginRight: 7, opacity: 0.5 }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              Kullanıcı Listesi
            </p>
            <p className="adm-card-sub">{filtered.length} kullanıcı listeleniyor</p>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>E-posta</th>
                <th>Kayıt Tarihi</th>
                <th>Sipariş</th>
                <th>Harcama</th>
                <th>Kademe</th>
                <th>Segment</th>
                <th>Rol</th>
                <th>Durum</th>
                <th style={{ textAlign: 'right' }}>Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const uOrders = INITIAL_ORDERS.filter(o => o.userId === user.id)
                const uSpent = uOrders.filter(o => o.status !== 'iptal edildi').reduce((s, o) => s + o.amount, 0)
                const tier = getMembershipTier(uSpent)
                const segment = segmentOverrides[user.id]
                  ? CUSTOMER_SEGMENTS.find(s => s.id === segmentOverrides[user.id]) || getAutoSegment(uOrders.length, uSpent)
                  : getAutoSegment(uOrders.length, uSpent)
                return (
                  <tr key={user.id} className={user.frozen ? 'adm-tr--frozen' : ''}>
                    <td>
                      <div className="adm-user-cell">
                        <UserAvatar user={user} />
                        <div>
                          <p className="adm-product-name">{user.firstName} {user.lastName}</p>
                          {user.frozen && (
                            <p className="adm-product-sub" style={{ color: 'rgba(248,113,113,0.55)' }}>Hesap dondurulmuş</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)' }}>{user.email}</td>
                    <td style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>
                        {uOrders.length}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--adm-gold)', fontWeight: 600, opacity: 0.85 }}>
                        {uSpent > 0 ? `₺${uSpent.toLocaleString('tr-TR')}` : '₺0'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 5, background: tier.bg, border: `1px solid ${tier.border}`, color: tier.color }}>
                        {tier.label}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 5, background: segment.bg, border: `1px solid ${segment.border}`, color: segment.color }}>
                        {segment.label}
                        {segmentOverrides[user.id] && <span style={{ opacity: 0.6, marginLeft: 3 }}>✎</span>}
                      </span>
                    </td>
                    <td>
                      <span className={`adm-status ${user.role === 'admin' ? 'adm-status--admin' : 'adm-status--user'}`}>
                        {user.role === 'admin' ? '★ Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td>
                      <span className={`adm-status ${user.frozen ? 'adm-status--cancelled' : 'adm-status--delivered'}`}>
                        {user.frozen ? 'Dondurulmuş' : 'Aktif'}
                      </span>
                    </td>
                    <td>
                      <div className="adm-row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="adm-action-btn" onClick={() => openDetail(user)}>
                          Detay
                        </button>
                        <button
                          className="adm-action-btn"
                          onClick={() => toggleRole(user.id)}
                          title={user.role === 'admin' ? 'User yap' : 'Admin yap'}
                        >
                          {user.role === 'admin' ? '↓ User Yap' : '↑ Admin Yap'}
                        </button>
                        <button
                          className={`adm-action-btn ${!user.frozen ? 'adm-action-btn--delete' : 'adm-action-btn--success'}`}
                          onClick={() => toggleFrozen(user.id)}
                        >
                          {user.frozen ? '✓ Aktifleştir' : '🔒 Dondur'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: 0 }}>
                    <div className="adm-empty">
                      <div className="adm-empty__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                      </div>
                      <p className="adm-empty__title">
                        {users.length === 0 ? 'Henüz kullanıcı yok' : 'Sonuç bulunamadı'}
                      </p>
                      <p className="adm-empty__sub">
                        {users.length === 0
                          ? 'Kullanıcılar kayıt oldukça burada görünecek.'
                          : 'Farklı bir arama veya filtre deneyin.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── User Detail Modal — Tabbed ── */}
      {selectedUser && (
        <div className="adm-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div className="adm-modal-header" style={{ padding: '18px 22px' }}>
              <h2>Kullanıcı Profili</h2>
              <button className="adm-modal-close" onClick={() => setSelectedUser(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Avatar + name */}
            <div className="adm-user-detail" style={{ paddingTop: 0, paddingBottom: 14 }}>
              <div className="adm-user-detail__avatar">
                {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
              </div>
              <p className="adm-user-detail__name">{selectedUser.firstName} {selectedUser.lastName}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 0 }}>
                <span className={`adm-status ${selectedUser.role === 'admin' ? 'adm-status--admin' : 'adm-status--user'}`}>
                  {selectedUser.role === 'admin' ? '★ Admin' : 'Kullanıcı'}
                </span>
                <span className={`adm-status ${selectedUser.frozen ? 'adm-status--cancelled' : 'adm-status--delivered'}`}>
                  {selectedUser.frozen ? 'Dondurulmuş' : 'Aktif'}
                </span>
              </div>
            </div>

            {/* Kademe & Segment badges */}
            {(() => {
              const uSpent = INITIAL_ORDERS
                .filter(o => o.userId === selectedUser.id && o.status !== 'iptal edildi')
                .reduce((s, o) => s + o.amount, 0)
              const uOrderCount = INITIAL_ORDERS.filter(o => o.userId === selectedUser.id).length
              const tier = getMembershipTier(uSpent)
              const seg = segmentOverrides[selectedUser.id]
                ? CUSTOMER_SEGMENTS.find(s => s.id === segmentOverrides[selectedUser.id]) || getAutoSegment(uOrderCount, uSpent)
                : getAutoSegment(uOrderCount, uSpent)
              return (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 5, background: tier.bg, border: `1px solid ${tier.border}`, color: tier.color }}>
                    {tier.label} Üye
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 5, background: seg.bg, border: `1px solid ${seg.border}`, color: seg.color }}>
                    {seg.label}
                    {segmentOverrides[selectedUser.id] && <span style={{ opacity: 0.6, marginLeft: 3 }}>✎</span>}
                  </span>
                </div>
              )
            })()}

            {/* Tabs */}
            <div className="adm-user-tabs">
              {['profil', 'siparişler', 'adresler', 'aktivite'].map(tab => (
                <button
                  key={tab}
                  className={`adm-user-tab ${detailTab === tab ? 'adm-user-tab--active' : ''}`}
                  onClick={() => setDetailTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'siparişler' && (
                    <span style={{ marginLeft: 4, fontSize: '0.64rem', opacity: 0.7 }}>({userOrderCount})</span>
                  )}
                  {tab === 'adresler' && (
                    <span style={{ marginLeft: 4, fontSize: '0.64rem', opacity: 0.7 }}>({(selectedUser.addresses || []).length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="adm-user-tab-content">
              {/* Profil */}
              {detailTab === 'profil' && (
                <div className="adm-user-detail__rows">
                  <div className="adm-user-detail__row">
                    <span>E-posta</span>
                    <span>{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="adm-user-detail__row">
                      <span>Telefon</span>
                      <span>{selectedUser.phone}</span>
                    </div>
                  )}
                  <div className="adm-user-detail__row">
                    <span>Kayıt Tarihi</span>
                    <span>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                  <div className="adm-user-detail__row">
                    <span>Toplam Sipariş</span>
                    <span style={{ fontWeight: 600, color: 'var(--adm-text)' }}>{userOrderCount}</span>
                  </div>
                  <div className="adm-user-detail__row">
                    <span>Toplam Harcama</span>
                    <span style={{ fontWeight: 600, color: 'var(--adm-gold)' }}>
                      {userSpent > 0 ? `₺${userSpent.toLocaleString('tr-TR')}` : '₺0'}
                    </span>
                  </div>
                  {userOrderCount > 0 && (
                    <div className="adm-user-detail__row">
                      <span>Ort. Sepet</span>
                      <span style={{ color: 'var(--adm-text-2)' }}>
                        ₺{Math.round(userSpent / userOrderCount).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}
                  {userOrderCount > 1 && (
                    <div className="adm-user-detail__row">
                      <span>Müşteri Değeri (CLV)</span>
                      <span style={{ fontWeight: 700, color: 'var(--adm-gold)' }}>
                        ₺{Math.round(userSpent * 1.8).toLocaleString('tr-TR')}
                        <span style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', fontWeight: 400, marginLeft: 4 }}>tahmini</span>
                      </span>
                    </div>
                  )}
                  <div className="adm-user-detail__row">
                    <span>Kullanıcı ID</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{selectedUser.id}</span>
                  </div>
                  <div className="adm-user-detail__row" style={{ alignItems: 'flex-start' }}>
                    <span>Segment (Override)</span>
                    <select
                      value={segmentOverrides[selectedUser.id] || ''}
                      onChange={e => setSegmentOverrides(prev => ({ ...prev, [selectedUser.id]: e.target.value || undefined }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, padding: '4px 8px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.75rem', outline: 'none' }}
                    >
                      <option value="">Otomatik</option>
                      {CUSTOMER_SEGMENTS.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Siparişler */}
              {detailTab === 'siparişler' && (
                <div>
                  {userOrders.length === 0 ? (
                    <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
                      Bu kullanıcıya ait sipariş yok.
                    </p>
                  ) : (
                    userOrders.map(order => (
                      <div key={order.id} className="adm-order-mini-row">
                        <span className="adm-order-mini-id">{order.id}</span>
                        <span className="adm-order-mini-date">{order.date}</span>
                        <span style={{ flex: 1 }} />
                        <span className={`adm-status ${STATUS_COLORS[order.status] || ''}`} style={{ fontSize: '0.64rem', padding: '2px 7px' }}>
                          {order.status}
                        </span>
                        <span className="adm-order-mini-amount">₺{order.amount.toLocaleString('tr-TR')}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Adresler */}
              {detailTab === 'adresler' && (
                <div>
                  {!(selectedUser.addresses?.length) ? (
                    <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
                      Kayıtlı adres yok.
                    </p>
                  ) : (
                    selectedUser.addresses.map(addr => (
                      <div key={addr.id} className="adm-addr-card">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2, color: 'var(--adm-text-3)' }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <div className="adm-addr-card__body">
                          <p className="adm-addr-card__title">
                            {addr.title}
                            {addr.isDefault && <span className="adm-addr-default-badge">Varsayılan</span>}
                          </p>
                          <p className="adm-addr-card__line">{addr.fullName} · {addr.phone}</p>
                          <p className="adm-addr-card__line">{addr.address}, {addr.district} / {addr.city}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Aktivite Logu */}
              {detailTab === 'aktivite' && (() => {
                const logs = getLogs(selectedUser.id)
                return (
                  <div>
                    {logs.length === 0 ? (
                      <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
                        Henüz aktivite kaydı yok.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
                        {logs.slice(0, 50).map(log => (
                          <div key={log.id} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--adm-border)', fontSize: '0.76rem', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--adm-text-3)', flexShrink: 0, width: 120 }}>
                              {new Date(log.timestamp).toLocaleString('tr-TR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                            </span>
                            <span style={{ background: 'rgba(255,215,100,0.08)', border: '1px solid rgba(255,215,100,0.15)', color: 'rgba(255,215,100,0.8)', padding: '1px 7px', borderRadius: 100, fontSize: '0.68rem', flexShrink: 0 }}>
                              {LOG_LABELS[log.type] || log.type}
                            </span>
                            {log.productName && (
                              <span style={{ color: 'var(--adm-text-2)' }}>{log.productName}</span>
                            )}
                            {log.orderId && (
                              <span style={{ color: 'var(--adm-text-2)' }}>Sipariş: {log.orderId}</span>
                            )}
                            {log.page && (
                              <span style={{ color: 'var(--adm-text-3)' }}>{log.page}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Footer */}
            <div className="adm-modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="adm-ghost-btn"
                  style={{ fontSize: '0.72rem', padding: '7px 13px' }}
                  onClick={() => toggleRole(selectedUser.id)}
                >
                  {selectedUser.role === 'admin' ? '↓ User Yap' : '↑ Admin Yap'}
                </button>
                <button
                  className={selectedUser.frozen ? 'adm-ghost-btn' : 'adm-danger-btn'}
                  style={{ fontSize: '0.72rem', padding: '7px 13px' }}
                  onClick={() => toggleFrozen(selectedUser.id)}
                >
                  {selectedUser.frozen ? 'Aktifleştir' : '🔒 Dondur'}
                </button>
              </div>
              <button className="adm-ghost-btn" onClick={() => setSelectedUser(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

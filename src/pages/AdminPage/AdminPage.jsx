import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminDashboard from './tabs/AdminDashboard'
import AdminUrunler from './tabs/AdminUrunler'
import AdminSiparisler from './tabs/AdminSiparisler'
import AdminKullanicilar from './tabs/AdminKullanicilar'
import AdminAyarlar from './tabs/AdminAyarlar'
import AdminKampanya from './tabs/AdminKampanya'
import AdminFinans from './tabs/AdminFinans'
import AdminAnalitik from './tabs/AdminAnalitik'
import AdminDestek from './tabs/AdminDestek'
import AdminTeslimat from './tabs/AdminTeslimat'
import './AdminPage.css'

const NAV_MAIN = [
  {
    id: 'dashboard', label: 'Dashboard', path: '/admin',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'urunler', label: 'Ürünler', path: '/admin/urunler',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    id: 'siparisler', label: 'Siparişler', path: '/admin/siparisler', badge: 3,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    id: 'kullanicilar', label: 'Kullanıcılar', path: '/admin/kullanicilar',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'kampanya', label: 'Kampanyalar', path: '/admin/kampanyalar',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    id: 'finans', label: 'Finans', path: '/admin/finans',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: 'analitik', label: 'Analitik', path: '/admin/analitik',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    id: 'destek', label: 'Müşteri Destek', path: '/admin/destek',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'teslimat', label: 'Teslimat', path: '/admin/teslimat',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
]

const NAV_SYSTEM = [
  {
    id: 'ayarlar', label: 'Ayarlar', path: '/admin/ayarlar',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
]

const PAGE_TITLES = {
  '/admin': { title: 'Dashboard', sub: 'Mağazanıza genel bakış' },
  '/admin/urunler': { title: 'Ürünler', sub: 'Ürün kataloğunu yönetin ve güncelleyin' },
  '/admin/siparisler': { title: 'Siparişler', sub: 'Sipariş takibi ve durum yönetimi' },
  '/admin/kullanicilar': { title: 'Kullanıcılar', sub: 'Müşteri hesapları ve roller' },
  '/admin/ayarlar': { title: 'Ayarlar', sub: 'Mağaza yapılandırması ve tercihler' },
  '/admin/kampanyalar': { title: 'Kampanyalar', sub: 'Kupon ve kampanya yönetimi' },
  '/admin/finans': { title: 'Finans', sub: 'Finansal raporlar, iadeler ve ödeme yönetimi' },
  '/admin/analitik': { title: 'Analitik', sub: 'KPI raporları ve satış analizleri' },
  '/admin/destek': { title: 'Müşteri Destek', sub: 'Destek talepleri ve müşteri iletişimi' },
  '/admin/teslimat': { title: 'Teslimat', sub: 'Kargo takibi ve teslimat yönetimi' },
}

const NOTIFICATIONS = [
  { icon: '📦', text: 'Yeni sipariş: #LYD-2026-0390 — Zeynep A.', time: '2 dk önce', unread: true },
  { icon: '⚠️', text: 'Kış Akşamı Mumu stoku tükendi!', time: '1 sa önce', unread: true },
  { icon: '👤', text: 'Yeni üye: Ayşe Toprak kayıt oldu', time: '3 sa önce', unread: true },
  { icon: '✅', text: '#LYD-2026-0387 teslim edildi', time: '5 sa önce', unread: false },
  { icon: '⭐', text: 'Yeni yorum: Gece Mumu — 5 yıldız!', time: '1 gün önce', unread: false },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path)

  const currentPage = PAGE_TITLES[location.pathname] || PAGE_TITLES['/admin']
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`

  const greeting = () => {
    const h = currentTime.getHours()
    if (h < 12) return 'Günaydın'
    if (h < 18) return 'İyi Öğlenler'
    return 'İyi Akşamlar'
  }

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  const NavItem = ({ item }) => (
    <button
      className={`admin-nav__item ${isActive(item.path) ? 'admin-nav__item--active' : ''}`}
      onClick={() => navigate(item.path)}
      title={collapsed ? item.label : undefined}
    >
      <span className="admin-nav__icon">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="admin-nav__label">{item.label}</span>
          {item.badge && <span className="admin-nav__badge">{item.badge}</span>}
        </>
      )}
      {collapsed && item.badge && <span className="admin-nav__badge admin-nav__badge--dot" />}
    </button>
  )

  return (
    <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-sidebar__logo-area">
          <button className="admin-collapse-btn" onClick={() => setCollapsed(v => !v)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          {!collapsed && (
            <div className="admin-sidebar__brand">
              <div className="admin-sidebar__flame">
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                  <path d="M9 1C9 1 3 6.5 3 12a6 6 0 0 0 12 0c0-2-1-4-2-5.5C12 9 11 11 9 12c0-3 1.5-6 0-11z" fill="rgba(255,190,60,0.95)"/>
                  <path d="M9 8C9 8 6.5 10.5 6.5 13a2.5 2.5 0 0 0 5 0c0-1.5-1-2.5-1-2.5C10 12 9.5 13 9 13c0-2 0.5-3.5 0-5z" fill="rgba(255,120,20,0.85)"/>
                </svg>
              </div>
              <div>
                <span className="admin-sidebar__brand-name">Laydora</span>
                <span className="admin-sidebar__brand-sub">Admin Panel</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="admin-sidebar__flame admin-sidebar__flame--solo">
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                <path d="M9 1C9 1 3 6.5 3 12a6 6 0 0 0 12 0c0-2-1-4-2-5.5C12 9 11 11 9 12c0-3 1.5-6 0-11z" fill="rgba(255,190,60,0.95)"/>
                <path d="M9 8C9 8 6.5 10.5 6.5 13a2.5 2.5 0 0 0 5 0c0-1.5-1-2.5-1-2.5C10 12 9.5 13 9 13c0-2 0.5-3.5 0-5z" fill="rgba(255,120,20,0.85)"/>
              </svg>
            </div>
          )}
        </div>

        {/* User card */}
        {!collapsed ? (
          <div className="admin-sidebar__user-card">
            <div className="admin-user-avatar">{initials}</div>
            <div className="admin-user-info">
              <p className="admin-user-name">{user?.firstName} {user?.lastName}</p>
              <span className="admin-user-badge">
                <span className="admin-user-badge__dot" />
                Süper Admin
              </span>
            </div>
          </div>
        ) : (
          <div className="admin-sidebar__user-card admin-sidebar__user-card--collapsed">
            <div className="admin-user-avatar admin-user-avatar--sm" title={`${user?.firstName} ${user?.lastName}`}>{initials}</div>
          </div>
        )}

        {/* Navigation */}
        <nav className="admin-nav">
          {!collapsed && <p className="admin-nav__section-label">Yönetim</p>}
          {NAV_MAIN.slice(0, 4).map(item => <NavItem key={item.id} item={item} />)}

          {!collapsed && <p className="admin-nav__section-label" style={{ marginTop: 12 }}>Pazarlama & Finans</p>}
          {collapsed && <div style={{ height: 8 }} />}
          {NAV_MAIN.slice(4, 7).map(item => <NavItem key={item.id} item={item} />)}

          {!collapsed && <p className="admin-nav__section-label" style={{ marginTop: 12 }}>Operasyon</p>}
          {NAV_MAIN.slice(7).map(item => <NavItem key={item.id} item={item} />)}

          {!collapsed && <p className="admin-nav__section-label" style={{ marginTop: 12 }}>Sistem</p>}
          {collapsed && <div style={{ height: 8 }} />}
          {NAV_SYSTEM.map(item => <NavItem key={item.id} item={item} />)}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__footer-divider" />
          <button className="admin-nav__item admin-nav__item--muted" onClick={() => navigate('/')} title={collapsed ? 'Mağazaya Git' : undefined}>
            <span className="admin-nav__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            {!collapsed && <span className="admin-nav__label">Mağazayı Görüntüle</span>}
          </button>
          <button className="admin-nav__item admin-nav__item--danger" onClick={handleLogout} title={collapsed ? 'Çıkış Yap' : undefined}>
            <span className="admin-nav__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            {!collapsed && <span className="admin-nav__label">Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="admin-content-area">

        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <div className="admin-breadcrumb">
              <span className="admin-breadcrumb__root">Laydora</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <span className="admin-breadcrumb__current">{currentPage.title}</span>
            </div>
            <div className="admin-topbar__title-row">
              <h1 className="admin-topbar__title">{currentPage.title}</h1>
              <span className="admin-topbar__sub">{currentPage.sub}</span>
            </div>
          </div>

          <div className="admin-topbar__right">
            <div className="admin-topbar-time">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{currentTime.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            <div className="admin-topbar-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Hızlı ara…" className="admin-topbar-search__input" />
              <kbd className="admin-topbar-search__kbd">⌘K</kbd>
            </div>

            <div className="admin-notif-wrap">
              <button className="admin-topbar-btn" onClick={() => setNotifOpen(v => !v)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && <span className="admin-notif-dot" />}
              </button>
              {notifOpen && (
                <div className="admin-notif-panel">
                  <div className="admin-notif-panel__header">
                    <p>Bildirimler</p>
                    <span className="admin-notif-panel__badge">{unreadCount} yeni</span>
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className={`admin-notif-item ${n.unread ? 'admin-notif-item--unread' : ''}`}>
                      <span className="admin-notif-item__icon">{n.icon}</span>
                      <div>
                        <p className="admin-notif-item__text">{n.text}</p>
                        <p className="admin-notif-item__time">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="admin-notif-panel__footer">
                    <button>Tümünü Gör</button>
                    <button>Okundu İşaretle</button>
                  </div>
                </div>
              )}
            </div>

            <button className="admin-topbar-user" onClick={() => navigate('/admin/kullanicilar')}>
              <div className="admin-user-avatar admin-user-avatar--sm">{initials}</div>
              <span className="admin-topbar-user__name">{greeting()}, {user?.firstName}</span>
            </button>
          </div>
        </header>

        <main className="admin-main">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="urunler" element={<AdminUrunler />} />
            <Route path="siparisler" element={<AdminSiparisler />} />
            <Route path="kullanicilar" element={<AdminKullanicilar />} />
            <Route path="ayarlar" element={<AdminAyarlar />} />
            <Route path="kampanyalar" element={<AdminKampanya />} />
            <Route path="finans" element={<AdminFinans />} />
            <Route path="analitik" element={<AdminAnalitik />} />
            <Route path="destek" element={<AdminDestek />} />
            <Route path="teslimat" element={<AdminTeslimat />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

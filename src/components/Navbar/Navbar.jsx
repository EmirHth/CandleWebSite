import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

/* ─── Navigation data ─── */
const NAV_ITEMS = [
  { label: 'YENİ', href: '#' },
  { label: 'ÇOK SATANLAR', href: '#' },
  {
    label: 'MARKALAR',
    href: '#',
    wide: true,
    viewAll: 'Tüm Markaları Gör',
    dropdown: [
      'Akamuti', 'Annabel Trends', 'Aromatique', 'Bahoma', 'Botanica',
      'Cote Noire', 'D.L. & Co.', 'Glasshouse', 'Illume', 'La Jolie Muse',
      'Maison Margiela', 'Nest', 'Paddywax', 'Voluspa', 'Woodwick',
    ],
  },
  {
    label: 'KOKULAR',
    href: '#',
    viewAll: 'Tüm Kokuları Gör',
    dropdown: [
      'Ahşap & Toprak', 'Amber & Reçine', 'Aquatik & Deniz',
      'Baharat & Oryantal', 'Çiçek & Botanik', 'Meyveli & Tatlı',
      'Misk & Pudra', 'Sedir & Yeşil', 'Temiz & Ferah', 'Vanilya & Kremsi',
    ],
  },
  {
    label: 'ÜRÜNLER',
    href: '/urunler',
    viewAll: 'Tüm Ürünleri Gör',
    dropdown: [
      'Soy Mumlar', 'Balmumu Mumlar', 'Masaj Mumları',
      'Mum Bakım Seti', 'Mumluklar', 'Oda Spreyleri',
      'Difüzörler', 'Sabunlar & Losyonlar',
    ],
  },
  {
    label: 'MEVSİMLER',
    href: '#',
    viewAll: 'Mevsimsel Koleksiyonlar',
    dropdown: ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış', 'Yılbaşı & Bayram'],
  },
  { label: 'HEDİYE FİKİRLERİ', href: '#' },
]

/* ─── Icon components ─── */
function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      className="nav-chevron-icon">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/* ─── Logo ─── */
function Logo({ dark = false }) {
  return (
    <Link to="/" className="navbar__logo" aria-label="Laydora Candles – Ana Sayfa">
      <img
        src="/images/LOGO.png"
        alt="Laydora Candles"
        className={`navbar__logo-img${dark ? ' navbar__logo-img--dark' : ''}`}
        draggable="false"
      />
    </Link>
  )
}

/* ─── Main Navbar ─── */
export default function Navbar() {
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [isScrolled, setIsScrolled]         = useState(false)
  const [isHovered, setIsHovered]           = useState(false)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [searchOpen, setSearchOpen]         = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)

  const dropdownTimer  = useRef(null)
  const searchInputRef = useRef(null)

  /* Compute whether the navbar bg should be white */
  const isNavWhite = isHovered || isScrolled || searchOpen

  /* ── scroll listener ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* ── focus search on open ── */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  /* ── dropdown hover helpers ── */
  const openDropdown = useCallback((label) => {
    clearTimeout(dropdownTimer.current)
    setActiveDropdown(label)
  }, [])

  const closeDropdown = useCallback(() => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 140)
  }, [])

  const keepDropdown = useCallback(() => {
    clearTimeout(dropdownTimer.current)
  }, [])

  return (
    <>
      {/* ═══ Fixed header (announcement + navbar) ═══ */}
      <header
        className={`site-header ${isNavWhite ? 'site-header--white' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* ─── Announcement Bar ─── */}
        <div className="announcement-bar" role="banner" aria-label="Kampanya duyuruları">
          <div className="announcement-track">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="announcement-segment">
                <span>YENİ ÜYELİKTE %20 İNDİRİM</span>
                <span className="announcement-sep">|</span>
                <span>SEÇİLİ ÜRÜNLERDE %30&rsquo;A VARAN FIRSAT</span>
                <span className="announcement-sep">|</span>
                <span>500 TL ÜZERİ SİPARİŞLERDE ÜCRETSİZ KARGO</span>
                <span className="announcement-sep">|</span>
                <span>ÖZEL SETLERİMİZDE %25 İNDİRİM</span>
                <span className="announcement-sep">|</span>
              </span>
            ))}
          </div>
        </div>

        {/* ─── Main Navbar Bar ─── */}
        <div className="navbar">
          <div className="navbar__container">

            {/* Hamburger – mobile only */}
            <button
              className={`hamburger ${mobileOpen ? 'hamburger--open' : ''}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileOpen}
            >
              <span className="hamburger__line" />
              <span className="hamburger__line" />
              <span className="hamburger__line" />
            </button>

            {/* Logo */}
            <Logo />

            {/* Primary navigation – desktop */}
            <nav className="navbar__primary-nav" aria-label="Ana navigasyon">
              <ul className="navbar__nav-list" role="menubar">
                {NAV_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className="navbar__nav-item"
                    role="none"
                    onMouseEnter={() => item.dropdown && openDropdown(item.label)}
                    onMouseLeave={() => item.dropdown && closeDropdown()}
                  >
                    <a
                      href={item.href}
                      className="navbar__nav-link"
                      role="menuitem"
                      aria-haspopup={!!item.dropdown}
                      aria-expanded={activeDropdown === item.label}
                    >
                      <span className="navbar__nav-text">{item.label}</span>
                      {item.dropdown && <ChevronDown />}
                    </a>

                    {/* Dropdown panel */}
                    {item.dropdown && (
                      <div
                        className={`navbar__dropdown ${item.wide ? 'navbar__dropdown--wide' : ''} ${activeDropdown === item.label ? 'navbar__dropdown--open' : ''}`}
                        onMouseEnter={keepDropdown}
                        onMouseLeave={closeDropdown}
                        role="menu"
                        aria-label={item.label}
                      >
                        {/* Dropdown header */}
                        <div className="navbar__dropdown-heading">
                          <span className="navbar__dropdown-heading-label">{item.label}</span>
                          <span className="navbar__dropdown-heading-line" />
                        </div>

                        {/* Items grid */}
                        <ul className={`navbar__dropdown-list ${item.wide ? 'navbar__dropdown-list--grid' : ''}`}>
                          {item.dropdown.map((sub) => (
                            <li key={sub} role="none">
                              <a href="#" className="navbar__dropdown-link" role="menuitem">
                                <span className="navbar__dropdown-arrow" aria-hidden="true">→</span>
                                {sub}
                              </a>
                            </li>
                          ))}
                        </ul>

                        {/* View all footer */}
                        {item.viewAll && (
                          <div className="navbar__dropdown-footer">
                            <a href="#" className="navbar__dropdown-viewall">
                              {item.viewAll}
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Secondary nav – icons */}
            <div className="navbar__secondary-nav">
              <button
                className="icon-btn"
                onClick={() => setSearchOpen(v => !v)}
                aria-label="Ara"
                aria-expanded={searchOpen}
              >
                <SearchIcon />
              </button>
              {isAuthenticated ? (
                <div className="navbar__account-wrap">
                  {isAdmin ? (
                    <button className="icon-btn navbar__admin-btn" aria-label="Admin Panel" onClick={() => navigate('/admin')}>
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </button>
                  ) : (
                    <button className="icon-btn" aria-label="Profilim" onClick={() => navigate('/profil')}>
                      <AccountIcon />
                    </button>
                  )}
                  <button
                    className="icon-btn navbar__logout-btn"
                    aria-label="Çıkış Yap"
                    onClick={() => { logout(); navigate('/') }}
                    title="Çıkış Yap"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button className="icon-btn" aria-label="Giriş Yap" onClick={() => navigate('/login')}>
                  <AccountIcon />
                </button>
              )}
              <button className="icon-btn" aria-label={`Sepet (${cartCount} ürün)`} onClick={() => navigate('/sepet')}>
                <CartIcon />
                {cartCount > 0 && (
                  <span className="cart-badge" aria-hidden="true">{cartCount > 9 ? '9+' : cartCount}</span>
                )}
              </button>
            </div>

          </div>{/* /navbar__container */}

          {/* ─── Search Bar ─── */}
          <div
            className={`navbar__search-bar ${searchOpen ? 'navbar__search-bar--open' : ''}`}
            aria-hidden={!searchOpen}
          >
            <div className="navbar__search-inner">
              <SearchIcon />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Ürün, marka veya koku arayın…"
                className="navbar__search-input"
                tabIndex={searchOpen ? 0 : -1}
              />
              <button
                className="navbar__search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Aramayı kapat"
                tabIndex={searchOpen ? 0 : -1}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

        </div>{/* /navbar */}
      </header>

      {/* ═══ Mobile overlay ═══ */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'mobile-overlay--open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ═══ Mobile drawer ═══ */}
      <aside
        className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}
        aria-label="Mobil menü"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu__header">
          <Logo dark />
          <button
            className="mobile-menu__close"
            onClick={() => setMobileOpen(false)}
            aria-label="Menüyü kapat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mobile-menu__nav">
          <ul className="mobile-menu__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="mobile-menu__item">
                {item.dropdown ? (
                  <>
                    <button
                      className={`mobile-menu__link mobile-menu__link--toggle ${mobileExpanded === item.label ? 'mobile-menu__link--active' : ''}`}
                      onClick={() => setMobileExpanded(v => v === item.label ? null : item.label)}
                      aria-expanded={mobileExpanded === item.label}
                    >
                      <span>{item.label}</span>
                      <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        className={`mobile-chevron ${mobileExpanded === item.label ? 'mobile-chevron--open' : ''}`}
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                    <ul
                      className="mobile-menu__sub-list"
                      style={{ maxHeight: mobileExpanded === item.label ? `${item.dropdown.length * 48}px` : '0px' }}
                    >
                      {item.dropdown.map((sub) => (
                        <li key={sub}>
                          <a href="#" className="mobile-menu__sub-link">{sub}</a>
                        </li>
                      ))}
                      {item.viewAll && (
                        <li>
                          <a href="#" className="mobile-menu__sub-link mobile-menu__sub-link--viewall">
                            {item.viewAll} →
                          </a>
                        </li>
                      )}
                    </ul>
                  </>
                ) : (
                  <a href={item.href} className="mobile-menu__link">{item.label}</a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <footer className="mobile-menu__footer">
          <a href="#" className="mobile-menu__footer-link">Hesabım</a>
          <a href="#" className="mobile-menu__footer-link">Hakkımızda</a>
          <a href="#" className="mobile-menu__footer-link">İletişim</a>
          <a href="#" className="mobile-menu__footer-link">Yardım</a>
        </footer>
      </aside>
    </>
  )
}

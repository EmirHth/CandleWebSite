import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import NewProducts from './components/NewProducts/NewProducts'
import FeaturedProduct from './components/FeaturedProduct/FeaturedProduct'
import Carousel3D from './components/Carousel3D/Carousel3D'
import LansmanaOzel from './components/LansmanaOzel/LansmanaOzel'
import SmoothScrollHero from './components/SmoothScrollHero/SmoothScrollHero'
import Footer from './components/Footer/Footer'
import UrunlerPage from './pages/UrunlerPage/UrunlerPage'
import UrunDetayPage from './pages/UrunDetayPage/UrunDetayPage'
import SepetPage from './pages/SepetPage/SepetPage'
import ProfilPage from './pages/ProfilPage/ProfilPage'
import HediyePage from './pages/HediyePage/HediyePage'
import LoginPage from './pages/LoginPage/LoginPage'
import AdminPage from './pages/AdminPage/AdminPage'
import SiparislerimPage from './pages/SiparislerimPage/SiparislerimPage'
import ChatbotWidget from './components/ChatbotWidget/ChatbotWidget'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

/* ── Navbar toplam yüksekliği (announcement 46px + bar 72px) ── */
const NAVBAR_H = 118

/* ── Akıcı scroll-reveal wrapper ── */
function Reveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION-BY-SECTION SCROLL HOOK
══════════════════════════════════════════════════════════ */
function useSectionScroll() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) return

    const SEL      = ['.hero', '.new-products', '.featured', '.c3d', '.lansm', '.lansm-row-2', '.ssh', '.site-footer']
    const COOLDOWN = 900
    let lastSnap   = 0
    let sections   = []

    const init = () => {
      sections = SEL.map(s => document.querySelector(s)).filter(Boolean)
    }

    const currentIdx = () => {
      const threshold = window.innerHeight * 0.35
      let best = 0
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= threshold) best = i
      })
      return best
    }

    const goTo = (idx) => {
      if (idx < 0 || idx >= sections.length) return
      lastSnap = Date.now()

      const sec    = sections[idx]
      const top    = sec.getBoundingClientRect().top + window.scrollY
      const target = idx === 0 ? 0 : Math.max(0, top - NAVBAR_H)

      window.scrollTo({ top: target, behavior: 'smooth' })
    }

    const onWheel = (e) => {
      init()
      if (!sections.length) return

      const idx = currentIdx()
      const sec = sections[idx]

      if (sec && sec.classList.contains('ssh')) {
        const rect     = sec.getBoundingClientRect()
        const atBottom = window.scrollY + window.innerHeight >= sec.offsetTop + sec.offsetHeight - 80
        const atTop    = rect.top >= NAVBAR_H - 20

        if (e.deltaY > 0 && !atBottom) return
        if (e.deltaY < 0 && !atTop)   return
      }

      if (Date.now() - lastSnap < COOLDOWN) {
        e.preventDefault()
        return
      }

      e.preventDefault()
      goTo(idx + (e.deltaY > 0 ? 1 : -1))
    }

    init()
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [isHome])
}

/* ── Route guards ── */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }
  return children
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}

/* ── Homepage ── */
function HomePage() {
  useSectionScroll()

  return (
    <main>
      <Hero />
      <Reveal><NewProducts /></Reveal>
      <Reveal><FeaturedProduct /></Reveal>
      <Reveal><Carousel3D /></Reveal>
      <Reveal><LansmanaOzel /></Reveal>
      <SmoothScrollHero />
      <Reveal><Footer /></Reveal>
    </main>
  )
}

/* ── AppShell — single Navbar above all routes ── */
function AppShell() {
  useSectionScroll()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isLoginRoute = location.pathname === '/login'

  return (
    <div className="app">
      {!isAdminRoute && !isLoginRoute && <Navbar />}
      {!isAdminRoute && !isLoginRoute && <ChatbotWidget />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/urunler" element={<UrunlerPage />} />
        <Route path="/urun/:slug" element={<UrunDetayPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/sepet"
          element={
            <ProtectedRoute>
              <SepetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilPage />
            </ProtectedRoute>
          }
        />
        <Route path="/hediye" element={<HediyePage />} />
        <Route
          path="/siparislerim"
          element={
            <ProtectedRoute>
              <SiparislerimPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

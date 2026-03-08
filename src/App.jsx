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
import LansmanPage from './pages/LansmanPage/LansmanPage'
import KategoriPage from './pages/KategoriPage/KategoriPage'
import KokularPage from './pages/KokularPage/KokularPage'
import MevsimlerPage from './pages/MevsimlerPage/MevsimlerPage'
import HakkimizdaPage from './pages/HakkimizdaPage/HakkimizdaPage'
import SSSPage from './pages/SSSPage/SSSPage'
import KargoPage from './pages/KargoPage/KargoPage'
import ChatbotWidget from './components/ChatbotWidget/ChatbotWidget'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

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
        <Route path="/lansman" element={<LansmanPage />} />
        <Route path="/kategori" element={<KategoriPage />} />
        <Route path="/kategori/:slug" element={<KategoriPage />} />
        <Route path="/kokular" element={<KokularPage />} />
        <Route path="/kokular/:slug" element={<KokularPage />} />
        <Route path="/mevsimler" element={<MevsimlerPage />} />
        <Route path="/mevsimler/:slug" element={<MevsimlerPage />} />
        <Route path="/hakkimizda" element={<HakkimizdaPage />} />
        <Route path="/sss" element={<SSSPage />} />
        <Route path="/kargo" element={<KargoPage />} />
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

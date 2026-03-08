import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

const IconEyeOpen = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, isAuthenticated, isAdmin } = useAuth()
  const [tab, setTab] = useState('giris')

  // Detect mobile to disable the swap animation (panel is hidden anyway)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )

  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPw, setShowLoginPw] = useState(false)

  // Register state
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', email: '', password: '', passwordConfirm: '' })
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPw, setShowRegPw] = useState(false)

  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : redirect, { replace: true })
    }
  }, [isAuthenticated, isAdmin, navigate, redirect])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginForm.email || !loginForm.password) { setLoginError('Lütfen tüm alanları doldurun.'); return }
    setLoginLoading(true)
    await new Promise(r => setTimeout(r, 420))
    const result = login(loginForm.email, loginForm.password)
    setLoginLoading(false)
    if (!result.success) { setLoginError(result.error); return }
    navigate(result.user.role === 'admin' ? '/admin' : redirect, { replace: true })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    if (!regForm.firstName || !regForm.lastName || !regForm.email || !regForm.password) { setRegError('Lütfen tüm alanları doldurun.'); return }
    if (regForm.password.length < 6) { setRegError('Şifre en az 6 karakter olmalıdır.'); return }
    if (regForm.password !== regForm.passwordConfirm) { setRegError('Şifreler eşleşmiyor.'); return }
    setRegLoading(true)
    await new Promise(r => setTimeout(r, 420))
    const result = register(regForm.firstName, regForm.lastName, regForm.email, regForm.password)
    setRegLoading(false)
    if (!result.success) { setRegError(result.error); return }
    navigate(redirect, { replace: true })
  }

  // Panel slide transition — both panels move together
  const PANEL = { duration: 0.68, ease: [0.22, 1, 0.36, 1] }
  // Form content fade (quick, happens while panels are moving)
  const FADE = { duration: 0.2 }

  const isKayit = tab === 'kayit'

  return (
    <div className="lp-root">

      {/* ══════════════════════════════════════
          IMAGE PANEL — starts left, slides right on register
      ══════════════════════════════════════ */}
      <motion.div
        className="lp-visual"
        initial={false}
        animate={{ x: isKayit ? '100%' : '0%' }}
        transition={PANEL}
      >
        <img src="/images/gece-mumu.jpg" alt="" className="lp-visual__img" />
        <div className="lp-visual__overlay" />
        {/* Right-edge fade into form panel */}
        <div className="lp-visual__edge" />

        <div className="lp-visual__content">
          <Link to="/" className="lp-visual__back">
            <IconArrow /> Mağazaya Dön
          </Link>
          <blockquote className="lp-quote">
            <p>"Işığın doğduğu yerde, kokuların hikâyesi başlar."</p>
            <cite>— Laydora Atölyesi</cite>
          </blockquote>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════
          FORM PANEL — starts right, slides left on register
      ══════════════════════════════════════ */}
      <motion.div
        className="lp-form-panel"
        initial={false}
        animate={{ x: (!isMobile && isKayit) ? '-100%' : '0%' }}
        transition={PANEL}
      >
        {/* Bleed ghost — LEFT edge: login mode (resim solda → sol kenarda çizgiler) */}
        <motion.div
          className="lp-bleed lp-bleed--left"
          initial={false}
          animate={{ opacity: isKayit ? 0 : 1 }}
          transition={{ duration: 0.4, delay: isKayit ? 0 : 0.5 }}
        >
          <img src="/images/gece-mumu.jpg" className="lp-bleed__img" alt="" />
        </motion.div>

        {/* Bleed ghost — RIGHT edge: register mode (resim sağda → sağ kenarda çizgiler) */}
        <motion.div
          className="lp-bleed lp-bleed--right"
          initial={false}
          animate={{ opacity: isKayit ? 1 : 0 }}
          transition={{ duration: 0.4, delay: isKayit ? 0.5 : 0 }}
        >
          <img src="/images/gece-mumu.jpg" className="lp-bleed__img lp-bleed__img--r" alt="" />
        </motion.div>

        {/* Mobile only: back link */}
        <Link to="/" className="lp-back-mobile">
          <IconArrow /> Mağazaya Dön
        </Link>

        <div className="lp-form-wrap">
          <AnimatePresence mode="wait">

            {/* ── GİRİŞ YAP ── */}
            {tab === 'giris' && (
              <motion.div
                key="giris"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={FADE}
              >
                <h1 className="lp-title">Tekrar Hoş Geldiniz</h1>
                <p className="lp-subtitle">Hesabınıza giriş yapın</p>

                <form className="lp-form" onSubmit={handleLogin} noValidate>
                  <div className="lp-field">
                    <input id="l-email" type="email" className="lp-input" placeholder=" "
                      value={loginForm.email}
                      onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      autoComplete="email" />
                    <label htmlFor="l-email" className="lp-label">E-posta</label>
                    <span className="lp-field__line" />
                  </div>

                  <div className="lp-field lp-field--pw">
                    <input id="l-pw" type={showLoginPw ? 'text' : 'password'} className="lp-input" placeholder=" "
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      autoComplete="current-password" />
                    <label htmlFor="l-pw" className="lp-label">Şifre</label>
                    <span className="lp-field__line" />
                    <button type="button" className="lp-eye" onClick={() => setShowLoginPw(v => !v)} aria-label={showLoginPw ? 'Gizle' : 'Göster'}>
                      {showLoginPw ? <IconEyeOff /> : <IconEyeOpen />}
                    </button>
                  </div>

                  {loginError && (
                    <motion.p className="lp-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      {loginError}
                    </motion.p>
                  )}

                  <button type="submit" className="lp-submit" disabled={loginLoading}>
                    {loginLoading ? <span className="lp-spinner" /> : 'Giriş Yap'}
                  </button>
                </form>

                <p className="lp-switch">
                  Hesabınız yok mu?{' '}
                  <button className="lp-switch__btn" onClick={() => setTab('kayit')}>
                    Hemen oluşturun
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── HESAP OLUŞTUR ── */}
            {tab === 'kayit' && (
              <motion.div
                key="kayit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={FADE}
              >
                <h1 className="lp-title">Hesap Oluştur</h1>
                <p className="lp-subtitle">Laydora ailesine katılın</p>

                <form className="lp-form" onSubmit={handleRegister} noValidate>
                  <div className="lp-field-row">
                    <div className="lp-field">
                      <input id="r-fname" type="text" className="lp-input" placeholder=" "
                        value={regForm.firstName} onChange={e => setRegForm(f => ({ ...f, firstName: e.target.value }))}
                        autoComplete="given-name" />
                      <label htmlFor="r-fname" className="lp-label">Ad</label>
                      <span className="lp-field__line" />
                    </div>
                    <div className="lp-field">
                      <input id="r-lname" type="text" className="lp-input" placeholder=" "
                        value={regForm.lastName} onChange={e => setRegForm(f => ({ ...f, lastName: e.target.value }))}
                        autoComplete="family-name" />
                      <label htmlFor="r-lname" className="lp-label">Soyad</label>
                      <span className="lp-field__line" />
                    </div>
                  </div>

                  <div className="lp-field">
                    <input id="r-email" type="email" className="lp-input" placeholder=" "
                      value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                      autoComplete="email" />
                    <label htmlFor="r-email" className="lp-label">E-posta</label>
                    <span className="lp-field__line" />
                  </div>

                  <div className="lp-field lp-field--pw">
                    <input id="r-pw" type={showRegPw ? 'text' : 'password'} className="lp-input" placeholder=" "
                      value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                      autoComplete="new-password" />
                    <label htmlFor="r-pw" className="lp-label">Şifre</label>
                    <span className="lp-field__line" />
                    <button type="button" className="lp-eye" onClick={() => setShowRegPw(v => !v)} aria-label={showRegPw ? 'Gizle' : 'Göster'}>
                      {showRegPw ? <IconEyeOff /> : <IconEyeOpen />}
                    </button>
                  </div>

                  <div className="lp-field">
                    <input id="r-pw2" type="password" className="lp-input" placeholder=" "
                      value={regForm.passwordConfirm} onChange={e => setRegForm(f => ({ ...f, passwordConfirm: e.target.value }))}
                      autoComplete="new-password" />
                    <label htmlFor="r-pw2" className="lp-label">Şifre Tekrar</label>
                    <span className="lp-field__line" />
                  </div>

                  {regError && (
                    <motion.p className="lp-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      {regError}
                    </motion.p>
                  )}

                  <button type="submit" className="lp-submit" disabled={regLoading}>
                    {regLoading ? <span className="lp-spinner" /> : 'Hesap Oluştur'}
                  </button>
                </form>

                <p className="lp-switch">
                  Zaten hesabınız var mı?{' '}
                  <button className="lp-switch__btn" onClick={() => setTab('giris')}>
                    Giriş yapın
                  </button>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

    </div>
  )
}

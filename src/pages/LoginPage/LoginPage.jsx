import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, isAuthenticated, isAdmin } = useAuth()
  const [tab, setTab] = useState('giris')

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

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true })
      } else {
        navigate(redirect, { replace: true })
      }
    }
  }, [isAuthenticated, isAdmin, navigate, redirect])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Lütfen tüm alanları doldurun.')
      return
    }
    setLoginLoading(true)
    // Simulate slight delay for UX
    await new Promise(r => setTimeout(r, 400))
    const result = login(loginForm.email, loginForm.password)
    setLoginLoading(false)
    if (!result.success) {
      setLoginError(result.error)
      return
    }
    // Redirect: admin → /admin, user → redirect param
    if (result.user.role === 'admin') {
      navigate('/admin', { replace: true })
    } else {
      navigate(redirect, { replace: true })
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    if (!regForm.firstName || !regForm.lastName || !regForm.email || !regForm.password) {
      setRegError('Lütfen tüm alanları doldurun.')
      return
    }
    if (regForm.password.length < 6) {
      setRegError('Şifre en az 6 karakter olmalıdır.')
      return
    }
    if (regForm.password !== regForm.passwordConfirm) {
      setRegError('Şifreler eşleşmiyor.')
      return
    }
    setRegLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = register(regForm.firstName, regForm.lastName, regForm.email, regForm.password)
    setRegLoading(false)
    if (!result.success) {
      setRegError(result.error)
      return
    }
    navigate(redirect, { replace: true })
  }

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
  }

  const tabDir = tab === 'giris' ? -1 : 1

  return (
    <div className="login-page">
      {/* Left: visual panel */}
      <div className="login-visual">
        <div className="login-visual__overlay" />
        <img
          src="/images/gece-mumu.jpg"
          alt="Laydora Candles"
          className="login-visual__img"
        />
        <div className="login-visual__content">
          <Link to="/" className="login-visual__logo-link">
            <img src="/images/LOGO.png" alt="Laydora Candles" className="login-visual__logo" />
          </Link>
          <blockquote className="login-visual__quote">
            <p>"Işığın doğduğu yerde, kokuların hikâyesi başlar."</p>
            <cite>— Laydora Atölyesi</cite>
          </blockquote>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="login-form-panel">
        <div className="login-form-wrap">
          {/* Mobile logo */}
          <Link to="/" className="login-mobile-logo">
            <img src="/images/LOGO.png" alt="Laydora Candles" />
          </Link>

          {/* Tabs */}
          <div className="login-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'giris'}
              className={`login-tab ${tab === 'giris' ? 'login-tab--active' : ''}`}
              onClick={() => { setTab('giris'); setLoginError('') }}
            >
              Giriş Yap
            </button>
            <button
              role="tab"
              aria-selected={tab === 'kayit'}
              className={`login-tab ${tab === 'kayit' ? 'login-tab--active' : ''}`}
              onClick={() => { setTab('kayit'); setRegError('') }}
            >
              Hesap Oluştur
            </button>
            <div className={`login-tabs__indicator ${tab === 'kayit' ? 'login-tabs__indicator--right' : ''}`} />
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait" custom={tabDir}>
            {tab === 'giris' ? (
              <motion.div
                key="giris"
                custom={tabDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="login-form-title">Tekrar Hoş Geldiniz</h1>
                <p className="login-form-subtitle">Hesabınıza giriş yapın.</p>

                <form className="login-form" onSubmit={handleLogin} noValidate>
                  <div className="login-field">
                    <label htmlFor="login-email" className="login-label">E-posta</label>
                    <input
                      id="login-email"
                      type="email"
                      className="login-input"
                      placeholder="ad@ornek.com"
                      value={loginForm.email}
                      onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      autoComplete="email"
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="login-password" className="login-label">Şifre</label>
                    <div className="login-pw-wrap">
                      <input
                        id="login-password"
                        type={showLoginPw ? 'text' : 'password'}
                        className="login-input"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="login-pw-eye"
                        onClick={() => setShowLoginPw(v => !v)}
                        aria-label={showLoginPw ? 'Gizle' : 'Göster'}
                      >
                        {showLoginPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <motion.p
                      className="login-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {loginError}
                    </motion.p>
                  )}

                  <button type="submit" className="login-submit" disabled={loginLoading}>
                    {loginLoading ? <span className="login-spinner" /> : 'Giriş Yap'}
                  </button>
                </form>

                <p className="login-switch-text">
                  Hesabınız yok mu?{' '}
                  <button className="login-switch-btn" onClick={() => setTab('kayit')}>
                    Hemen oluşturun
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="kayit"
                custom={tabDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="login-form-title">Hesap Oluştur</h1>
                <p className="login-form-subtitle">Laydora ailesine katılın.</p>

                <form className="login-form" onSubmit={handleRegister} noValidate>
                  <div className="login-field-row">
                    <div className="login-field">
                      <label htmlFor="reg-firstname" className="login-label">Ad</label>
                      <input
                        id="reg-firstname"
                        type="text"
                        className="login-input"
                        placeholder="Adınız"
                        value={regForm.firstName}
                        onChange={e => setRegForm(f => ({ ...f, firstName: e.target.value }))}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="login-field">
                      <label htmlFor="reg-lastname" className="login-label">Soyad</label>
                      <input
                        id="reg-lastname"
                        type="text"
                        className="login-input"
                        placeholder="Soyadınız"
                        value={regForm.lastName}
                        onChange={e => setRegForm(f => ({ ...f, lastName: e.target.value }))}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="login-field">
                    <label htmlFor="reg-email" className="login-label">E-posta</label>
                    <input
                      id="reg-email"
                      type="email"
                      className="login-input"
                      placeholder="ad@ornek.com"
                      value={regForm.email}
                      onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                      autoComplete="email"
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="reg-password" className="login-label">Şifre</label>
                    <div className="login-pw-wrap">
                      <input
                        id="reg-password"
                        type={showRegPw ? 'text' : 'password'}
                        className="login-input"
                        placeholder="En az 6 karakter"
                        value={regForm.password}
                        onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="login-pw-eye"
                        onClick={() => setShowRegPw(v => !v)}
                        aria-label={showRegPw ? 'Gizle' : 'Göster'}
                      >
                        {showRegPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <div className="login-field">
                    <label htmlFor="reg-password-confirm" className="login-label">Şifre Tekrar</label>
                    <input
                      id="reg-password-confirm"
                      type="password"
                      className="login-input"
                      placeholder="••••••••"
                      value={regForm.passwordConfirm}
                      onChange={e => setRegForm(f => ({ ...f, passwordConfirm: e.target.value }))}
                      autoComplete="new-password"
                    />
                  </div>

                  {regError && (
                    <motion.p
                      className="login-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {regError}
                    </motion.p>
                  )}

                  <button type="submit" className="login-submit" disabled={regLoading}>
                    {regLoading ? <span className="login-spinner" /> : 'Hesap Oluştur'}
                  </button>
                </form>

                <p className="login-switch-text">
                  Zaten hesabınız var mı?{' '}
                  <button className="login-switch-btn" onClick={() => setTab('giris')}>
                    Giriş yapın
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

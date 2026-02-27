import { useState } from 'react'
import './Footer.css'

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="footer__inner">

        {/* ── Left / Center: logo + nav ── */}
        <div className="footer__brand">
          <div className="footer__logo-wrap">
            <img
              src="/images/LOGO.png"
              alt="Laydora"
              className="footer__logo"
              loading="lazy"
            />
          </div>
          <p className="footer__tagline">El yapımı premium mumlarla<br />her ana ışık katın.</p>

          <nav className="footer__nav" aria-label="Footer navigasyon">
            <a href="#" className="footer__nav-link">Koleksiyon</a>
            <a href="#" className="footer__nav-link">Hakkımızda</a>
            <a href="#" className="footer__nav-link">Kargo Bilgisi</a>
            <a href="#" className="footer__nav-link">SSS</a>
          </nav>

          <p className="footer__copy">© 2025 Laydora. Tüm hakları saklıdır.</p>
        </div>

        {/* ── Divider ── */}
        <div className="footer__divider" aria-hidden="true" />

        {/* ── Right: contact form ── */}
        <div className="footer__contact">
          <span className="footer__form-eyebrow">İletişim</span>
          <h2 className="footer__form-title">Bize <em>Ulaşın</em></h2>

          {sent ? (
            <div className="footer__form-success">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p>Mesajınız alındı, en kısa sürede dönüş yapacağız.</p>
            </div>
          ) : (
            <form className="footer__form" onSubmit={handleSubmit} noValidate>
              <div className="footer__field">
                <label className="footer__label" htmlFor="f-name">Ad Soyad</label>
                <input
                  id="f-name"
                  name="name"
                  type="text"
                  className="footer__input"
                  placeholder="Adınız"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="footer__field">
                <label className="footer__label" htmlFor="f-email">E-posta</label>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  className="footer__input"
                  placeholder="eposta@ornek.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="footer__field">
                <label className="footer__label" htmlFor="f-message">Mesajınız</label>
                <textarea
                  id="f-message"
                  name="message"
                  className="footer__textarea"
                  placeholder="Size nasıl yardımcı olabiliriz?"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="footer__submit">
                <span>Gönder</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          )}
        </div>

      </div>
    </footer>
  )
}

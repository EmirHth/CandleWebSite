import { useState } from 'react'

/* ── Toggle Component ── */
function Toggle({ checked, onChange }) {
  return (
    <label className="adm-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="adm-toggle__slider" />
    </label>
  )
}

/* ── Section Component ── */
function Section({ title, sub, children, badge }) {
  return (
    <div className="adm-settings-section">
      <div className="adm-settings-section__header">
        <div>
          <p className="adm-settings-section__title">{title}</p>
          {sub && <p className="adm-settings-section__sub">{sub}</p>}
        </div>
        {badge && (
          <span style={{ fontSize: '0.65rem', padding: '3px 9px', borderRadius: 999, background: 'rgba(240,174,50,0.1)', color: 'var(--adm-gold)', border: '1px solid rgba(240,174,50,0.2)', fontWeight: 600 }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

/* ── Row Component ── */
function Row({ label, sub, children }) {
  return (
    <div className="adm-settings-row">
      <div className="adm-settings-row__label">
        <p>{label}</p>
        {sub && <span>{sub}</span>}
      </div>
      <div className="adm-settings-row__control">
        {children}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AdminAyarlar() {
  const [activeTab, setActiveTab] = useState('genel')
  const [saved, setSaved] = useState(false)

  /* Genel */
  const [storeInfo, setStoreInfo] = useState({
    name: 'Laydora Candles',
    tagline: 'El yapımı soy mum koleksiyonu',
    email: 'info@laydora.com',
    phone: '+90 (212) 000 00 00',
    address: 'Bağcılar, İstanbul',
    currency: 'TRY',
    language: 'tr',
    timezone: 'Europe/Istanbul',
    returnPolicy: '14 gün içinde ücretsiz iade.',
  })

  /* Bildirimler */
  const [notifs, setNotifs] = useState({
    yeniSiparis: true,
    stokUyari: true,
    yeniUye: true,
    iadeTalebi: true,
    haftalikRapor: true,
    aylikRapor: false,
    urunYorum: true,
    kampanyaHat: false,
  })

  /* Kargo */
  const [shipping, setShipping] = useState({
    freeThreshold: 500,
    carrier: 'PTT Kargo',
    avgDeliveryDays: '2-4',
    expressDays: '1',
    expressPrice: 39,
    pakageFee: 0,
    regions: ['İstanbul', 'Ankara', 'İzmir', 'Tüm Türkiye'],
    selectedRegion: 'Tüm Türkiye',
  })

  /* Ödeme */
  const [payment, setPayment] = useState({
    creditCard: true,
    doorPayment: true,
    bankTransfer: true,
    installment: true,
    inst3: true, inst6: true, inst9: true, inst12: false,
    minInstallment: 300,
  })

  /* Güvenlik */
  const [security, setSecurity] = useState({ current: '', newPw: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)
    if (!security.current) return setPwError('Mevcut şifrenizi girin.')
    if (security.newPw.length < 6) return setPwError('Yeni şifre en az 6 karakter olmalıdır.')
    if (security.newPw !== security.confirm) return setPwError('Şifreler eşleşmiyor.')
    setPwSuccess(true)
    setSecurity({ current: '', newPw: '', confirm: '' })
    setTimeout(() => setPwSuccess(false), 4000)
  }

  const TABS = [
    { id: 'genel', label: 'Genel', icon: '🏪' },
    { id: 'bildirimler', label: 'Bildirimler', icon: '🔔' },
    { id: 'kargo', label: 'Kargo', icon: '🚚' },
    { id: 'odeme', label: 'Ödeme', icon: '💳' },
    { id: 'guvenlik', label: 'Güvenlik', icon: '🔐' },
  ]

  return (
    <div className="adm-settings">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Ayarlar</h1>
          <p className="adm-page-sub">Mağaza yapılandırması, entegrasyonlar ve sistem tercihleri</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="adm-settings-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`adm-settings-tab ${activeTab === t.id ? 'adm-settings-tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span style={{ fontSize: '0.9rem' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ GENEL ═══ */}
      {activeTab === 'genel' && (
        <>
          <Section title="Mağaza Kimliği" sub="Markanızın temel bilgileri ve müşterilere gösterilen detaylar">
            <Row label="Mağaza Adı" sub="Müşteriye gösterilen resmi marka adı">
              <input className="adm-settings-input" value={storeInfo.name} onChange={e => setStoreInfo(s => ({ ...s, name: e.target.value }))} />
            </Row>
            <Row label="Slogan" sub="Kısa tanıtım cümlesi">
              <input className="adm-settings-input" value={storeInfo.tagline} onChange={e => setStoreInfo(s => ({ ...s, tagline: e.target.value }))} />
            </Row>
            <Row label="İletişim E-postası" sub="Müşteri sorguları bu adrese yönlendirilir">
              <input type="email" className="adm-settings-input" value={storeInfo.email} onChange={e => setStoreInfo(s => ({ ...s, email: e.target.value }))} />
            </Row>
            <Row label="Telefon" sub="Destek hattı numarası">
              <input type="tel" className="adm-settings-input" value={storeInfo.phone} onChange={e => setStoreInfo(s => ({ ...s, phone: e.target.value }))} />
            </Row>
            <Row label="Adres" sub="Mağaza / atölye adresi">
              <input className="adm-settings-input" value={storeInfo.address} onChange={e => setStoreInfo(s => ({ ...s, address: e.target.value }))} />
            </Row>
          </Section>

          <Section title="Yerel Ayarlar" sub="Para birimi, dil ve saat dilimi yapılandırması">
            <Row label="Para Birimi" sub="Tüm fiyatlar bu birimde gösterilir">
              <select className="adm-settings-select" value={storeInfo.currency} onChange={e => setStoreInfo(s => ({ ...s, currency: e.target.value }))}>
                <option value="TRY">₺ Türk Lirası (TRY)</option>
                <option value="USD">$ Amerikan Doları (USD)</option>
                <option value="EUR">€ Euro (EUR)</option>
              </select>
            </Row>
            <Row label="Dil" sub="Yönetim paneli ve mağaza dili">
              <select className="adm-settings-select" value={storeInfo.language} onChange={e => setStoreInfo(s => ({ ...s, language: e.target.value }))}>
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </Row>
            <Row label="Saat Dilimi" sub="Sipariş ve aktivite kayıtları için">
              <select className="adm-settings-select" value={storeInfo.timezone} onChange={e => setStoreInfo(s => ({ ...s, timezone: e.target.value }))}>
                <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                <option value="UTC">UTC</option>
              </select>
            </Row>
          </Section>

          <Section title="İade Politikası" sub="Müşteri siparişlerinde gösterilen iade koşulları">
            <div style={{ padding: '14px 22px' }}>
              <textarea
                className="adm-settings-textarea"
                value={storeInfo.returnPolicy}
                onChange={e => setStoreInfo(s => ({ ...s, returnPolicy: e.target.value }))}
                placeholder="İade politikası metnini buraya girin…"
                style={{ minHeight: 100 }}
              />
            </div>
          </Section>
        </>
      )}

      {/* ═══ BİLDİRİMLER ═══ */}
      {activeTab === 'bildirimler' && (
        <>
          <Section title="Sipariş Bildirimleri" sub="Sipariş olaylarında e-posta bildirimi alın">
            <Row label="Yeni Sipariş" sub="Her yeni sipariş oluşturulduğunda bildir">
              <Toggle checked={notifs.yeniSiparis} onChange={v => setNotifs(n => ({ ...n, yeniSiparis: v }))} />
            </Row>
            <Row label="İade Talebi" sub="Müşteri iade talebi oluşturduğunda bildir">
              <Toggle checked={notifs.iadeTalebi} onChange={v => setNotifs(n => ({ ...n, iadeTalebi: v }))} />
            </Row>
          </Section>

          <Section title="Stok & Ürün Bildirimleri" sub="Stok durumu değişikliklerinde uyarı alın">
            <Row label="Stok Uyarısı" sub="Ürün stoku kritik seviyeye düştüğünde bildir (≤3 adet)">
              <Toggle checked={notifs.stokUyari} onChange={v => setNotifs(n => ({ ...n, stokUyari: v }))} />
            </Row>
            <Row label="Ürün Yorumu" sub="Yeni ürün yorumu eklendiğinde bildir">
              <Toggle checked={notifs.urunYorum} onChange={v => setNotifs(n => ({ ...n, urunYorum: v }))} />
            </Row>
          </Section>

          <Section title="Kullanıcı Bildirimleri" sub="Müşteri hesabı olaylarında bildirim">
            <Row label="Yeni Üye Kaydı" sub="Yeni kullanıcı kayıt olduğunda bildir">
              <Toggle checked={notifs.yeniUye} onChange={v => setNotifs(n => ({ ...n, yeniUye: v }))} />
            </Row>
          </Section>

          <Section title="Periyodik Raporlar" sub="Otomatik performans raporu e-postası">
            <Row label="Haftalık Rapor" sub="Her Pazartesi haftalık özet gönder">
              <Toggle checked={notifs.haftalikRapor} onChange={v => setNotifs(n => ({ ...n, haftalikRapor: v }))} />
            </Row>
            <Row label="Aylık Rapor" sub="Her ayın ilk günü aylık analiz gönder">
              <Toggle checked={notifs.aylikRapor} onChange={v => setNotifs(n => ({ ...n, aylikRapor: v }))} />
            </Row>
            <Row label="Kampanya Hatırlatıcısı" sub="Aktif kampanyalar için hatırlatma">
              <Toggle checked={notifs.kampanyaHat} onChange={v => setNotifs(n => ({ ...n, kampanyaHat: v }))} />
            </Row>
          </Section>
        </>
      )}

      {/* ═══ KARGO ═══ */}
      {activeTab === 'kargo' && (
        <>
          <Section title="Ücretsiz Kargo" sub="Belirli sepet tutarı üzerinde ücretsiz kargo">
            <Row label="Ücretsiz Kargo Eşiği" sub="Bu tutarın üzerindeki siparişler için kargo ücretsiz">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--adm-text-3)' }}>₺</span>
                <input
                  type="number"
                  className="adm-settings-input adm-settings-input--sm"
                  value={shipping.freeThreshold}
                  onChange={e => setShipping(s => ({ ...s, freeThreshold: Number(e.target.value) }))}
                  min="0"
                />
              </div>
            </Row>
          </Section>

          <Section title="Kargo Firması" sub="Varsayılan teslimat firması ve süreleri">
            <Row label="Varsayılan Kargo Firması" sub="Siparişler bu firma ile gönderilir">
              <select className="adm-settings-select" value={shipping.carrier} onChange={e => setShipping(s => ({ ...s, carrier: e.target.value }))}>
                {['PTT Kargo', 'UPS Kargo', 'MNG Kargo', 'Yurtiçi Kargo', 'Aras Kargo', 'Sürat Kargo'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Row>
            <Row label="Standart Teslimat Süresi" sub="İş günü cinsinden">
              <input
                className="adm-settings-input adm-settings-input--sm"
                value={shipping.avgDeliveryDays}
                onChange={e => setShipping(s => ({ ...s, avgDeliveryDays: e.target.value }))}
                placeholder="2-4"
              />
            </Row>
            <Row label="Ekspres Teslimat Süresi" sub="Ek ücretli hızlı teslimat">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="adm-settings-input adm-settings-input--sm"
                  value={shipping.expressDays}
                  onChange={e => setShipping(s => ({ ...s, expressDays: e.target.value }))}
                  placeholder="1"
                  style={{ width: 60 }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>iş günü</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)', marginLeft: 8 }}>+₺</span>
                <input
                  type="number"
                  className="adm-settings-input adm-settings-input--sm"
                  value={shipping.expressPrice}
                  onChange={e => setShipping(s => ({ ...s, expressPrice: Number(e.target.value) }))}
                  style={{ width: 80 }}
                />
              </div>
            </Row>
          </Section>

          <Section title="Teslimat Bölgesi" sub="Aktif teslimat yapılan coğrafi bölgeler">
            <Row label="Bölge" sub="Teslimat kapsamı">
              <select className="adm-settings-select" value={shipping.selectedRegion} onChange={e => setShipping(s => ({ ...s, selectedRegion: e.target.value }))}>
                {shipping.regions.map(r => <option key={r}>{r}</option>)}
              </select>
            </Row>
            <Row label="Paket Ücreti" sub="Ambalaj ve kargolama gideri (0 = ücretsiz)">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--adm-text-3)' }}>₺</span>
                <input
                  type="number"
                  className="adm-settings-input adm-settings-input--sm"
                  value={shipping.pakageFee}
                  onChange={e => setShipping(s => ({ ...s, pakageFee: Number(e.target.value) }))}
                  min="0"
                />
              </div>
            </Row>
          </Section>
        </>
      )}

      {/* ═══ ÖDEME ═══ */}
      {activeTab === 'odeme' && (
        <>
          <Section title="Ödeme Yöntemleri" sub="Müşterilere sunulan ödeme seçenekleri">
            <Row label="Kredi / Banka Kartı" sub="Visa, Mastercard ve diğer kartlar">
              <Toggle checked={payment.creditCard} onChange={v => setPayment(p => ({ ...p, creditCard: v }))} />
            </Row>
            <Row label="Kapıda Ödeme" sub="Teslimatta nakit veya kart ile ödeme">
              <Toggle checked={payment.doorPayment} onChange={v => setPayment(p => ({ ...p, doorPayment: v }))} />
            </Row>
            <Row label="EFT / Havale" sub="Banka havalesi ile ödeme">
              <Toggle checked={payment.bankTransfer} onChange={v => setPayment(p => ({ ...p, bankTransfer: v }))} />
            </Row>
          </Section>

          <Section title="Taksit Seçenekleri" sub="Kart ile taksit imkânı ayarları">
            <Row label="Taksiti Etkinleştir" sub="Kart ödemelerinde taksit seçeneği sun">
              <Toggle checked={payment.installment} onChange={v => setPayment(p => ({ ...p, installment: v }))} />
            </Row>
            {payment.installment && (
              <>
                <Row label="Minimum Taksit Tutarı" sub="Bu tutarın altındaki siparişlerde taksit gösterilmez">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--adm-text-3)' }}>₺</span>
                    <input
                      type="number"
                      className="adm-settings-input adm-settings-input--sm"
                      value={payment.minInstallment}
                      onChange={e => setPayment(p => ({ ...p, minInstallment: Number(e.target.value) }))}
                      min="0"
                    />
                  </div>
                </Row>
                <Row label="3 Taksit" sub="">
                  <Toggle checked={payment.inst3} onChange={v => setPayment(p => ({ ...p, inst3: v }))} />
                </Row>
                <Row label="6 Taksit" sub="">
                  <Toggle checked={payment.inst6} onChange={v => setPayment(p => ({ ...p, inst6: v }))} />
                </Row>
                <Row label="9 Taksit" sub="">
                  <Toggle checked={payment.inst9} onChange={v => setPayment(p => ({ ...p, inst9: v }))} />
                </Row>
                <Row label="12 Taksit" sub="Dikkat: Ek komisyon uygulanabilir">
                  <Toggle checked={payment.inst12} onChange={v => setPayment(p => ({ ...p, inst12: v }))} />
                </Row>
              </>
            )}
          </Section>
        </>
      )}

      {/* ═══ GÜVENLİK ═══ */}
      {activeTab === 'guvenlik' && (
        <>
          <Section title="Şifre Değiştir" sub="Admin hesabınızın şifresini güncelleyin">
            <form onSubmit={handleChangePassword} style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Mevcut Şifre', key: 'current', placeholder: '••••••••' },
                { label: 'Yeni Şifre', key: 'newPw', placeholder: 'En az 6 karakter' },
                { label: 'Yeni Şifre Tekrar', key: 'confirm', placeholder: '••••••••' },
              ].map(f => (
                <div key={f.key} className="adm-form-field" style={{ maxWidth: 380 }}>
                  <label style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--adm-text-3)', fontWeight: 500 }}>
                    {f.label}
                  </label>
                  <input
                    type="password"
                    className="adm-settings-input"
                    value={security[f.key]}
                    onChange={e => setSecurity(s => ({ ...s, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ maxWidth: 380 }}
                  />
                </div>
              ))}
              {pwError && (
                <p style={{ fontSize: '0.78rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: 6 }}>
                  ⚠️ {pwError}
                </p>
              )}
              {pwSuccess && (
                <p style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
                  ✓ Şifreniz başarıyla güncellendi.
                </p>
              )}
              <div>
                <button type="submit" className="adm-primary-btn" style={{ marginTop: 4 }}>
                  Şifreyi Güncelle
                </button>
              </div>
            </form>
          </Section>

          <Section title="Oturum Güvenliği" sub="Aktif oturumlar ve erişim logları">
            <Row label="İki Adımlı Doğrulama" sub="SMS veya uygulama ile ikinci doğrulama katmanı (yakında)">
              <Toggle checked={false} onChange={() => {}} />
            </Row>
            <Row label="Oturum Zaman Aşımı" sub="Hareketsizlik sonrası otomatik çıkış süresi">
              <select className="adm-settings-select adm-settings-input--sm" style={{ minWidth: 140 }}>
                <option>30 dakika</option>
                <option>1 saat</option>
                <option>4 saat</option>
                <option>8 saat</option>
                <option>Hiçbir zaman</option>
              </select>
            </Row>
          </Section>

          <Section title="Tehlike Bölgesi" sub="Geri alınamaz işlemler" badge="Dikkat">
            <Row label="Tüm Demo Verilerini Sıfırla" sub="Kullanıcı ve sipariş verilerini fabrika ayarlarına döndür">
              <button
                className="adm-danger-btn"
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                onClick={() => {
                  if (window.confirm('Tüm veriler sıfırlansın mı? Bu işlem geri alınamaz.')) {
                    localStorage.removeItem('laydora_users')
                    window.location.reload()
                  }
                }}
              >
                Sıfırla
              </button>
            </Row>
          </Section>
        </>
      )}

      {/* ── Save Bar (not security tab) ── */}
      {activeTab !== 'guvenlik' && (
        <div className="adm-settings-save-bar">
          <div>
            {saved ? (
              <p className="adm-settings-save-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Değişiklikler başarıyla kaydedildi.
              </p>
            ) : (
              <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>
                Kaydetmeden ayrılırsanız değişiklikler kaybolur.
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="adm-ghost-btn" style={{ fontSize: '0.78rem' }} onClick={() => setSaved(false)}>
              Sıfırla
            </button>
            <button className="adm-primary-btn" style={{ fontSize: '0.78rem' }} onClick={handleSave}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

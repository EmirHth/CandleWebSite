import { useState } from 'react'
import { getLogs, LOG_LABELS, clearLogs } from '../../../utils/activityLogger'
import { downloadCSV } from '../../../utils/exportUtils'

const DSAR_LIST = [
  { id: 'DSAR-001', user: 'Ayşe Kaya', email: 'ayse.kaya@email.com', type: 'Veri Silme', date: '2026-02-20', status: 'Beklemede', response: 30 },
  { id: 'DSAR-002', user: 'Mehmet Demir', email: 'mdemir@email.com', type: 'Veri Erişimi', date: '2026-02-18', status: 'Tamamlandı', response: 5 },
  { id: 'DSAR-003', user: 'Zeynep Arslan', email: 'z.arslan@gmail.com', type: 'Veri Taşınabilirliği', date: '2026-02-15', status: 'İnceleniyor', response: 12 },
  { id: 'DSAR-004', user: 'Fatih Yılmaz', email: 'fyilmaz@email.com', type: 'Düzeltme', date: '2026-02-12', status: 'Tamamlandı', response: 3 },
  { id: 'DSAR-005', user: 'Emine Şahin', email: 'emine.s@email.com', type: 'Veri Silme', date: '2026-02-10', status: 'Reddedildi', response: 7 },
  { id: 'DSAR-006', user: 'Ali Çelik', email: 'ali.celik@email.com', type: 'Veri Erişimi', date: '2026-02-08', status: 'Beklemede', response: 22 },
  { id: 'DSAR-007', user: 'Selin Öztürk', email: 'selin.oz@email.com', type: 'Veri Taşınabilirliği', date: '2026-02-05', status: 'Tamamlandı', response: 8 },
  { id: 'DSAR-008', user: 'Can Aydın', email: 'can.aydin@email.com', type: 'Düzeltme', date: '2026-01-30', status: 'İnceleniyor', response: 28 },
  { id: 'DSAR-009', user: 'Merve Koç', email: 'merve.koc@email.com', type: 'Veri Silme', date: '2026-01-25', status: 'Tamamlandı', response: 10 },
  { id: 'DSAR-010', user: 'Burak Güler', email: 'bguler@email.com', type: 'Veri Erişimi', date: '2026-01-20', status: 'Reddedildi', response: 14 },
]

const STATUS_STYLE = {
  'Beklemede': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)' },
  'İnceleniyor': { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)' },
  'Tamamlandı': { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)' },
  'Reddedildi': { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
}

const COOKIE_CATEGORIES = [
  {
    id: 'zorunlu', label: 'Zorunlu Çerezler', locked: true, enabled: true,
    desc: 'Sitenin temel işlevselliği için gereklidir. Devre dışı bırakılamaz.',
    cookies: [
      { name: 'laydora_session', provider: 'Laydora', purpose: 'Oturum yönetimi', duration: 'Oturum sonu' },
      { name: 'laydora_auth', provider: 'Laydora', purpose: 'Kimlik doğrulama', duration: '30 gün' },
      { name: 'laydora_cart', provider: 'Laydora', purpose: 'Sepet verisi', duration: '7 gün' },
    ],
  },
  {
    id: 'analitik', label: 'Analitik Çerezler', locked: false, enabled: true,
    desc: 'Site kullanımını anlamak ve performansı ölçmek için kullanılır.',
    cookies: [
      { name: '_ga', provider: 'Google Analytics', purpose: 'Ziyaretçi sayma', duration: '2 yıl' },
      { name: '_gid', provider: 'Google Analytics', purpose: 'Oturum ayırımı', duration: '24 saat' },
      { name: 'hotjar_id', provider: 'Hotjar', purpose: 'Isı haritası', duration: '1 yıl' },
    ],
  },
  {
    id: 'pazarlama', label: 'Pazarlama Çerezleri', locked: false, enabled: false,
    desc: 'Kişiselleştirilmiş reklam ve pazarlama için kullanılır.',
    cookies: [
      { name: '_fbp', provider: 'Meta (Facebook)', purpose: 'Reklam hedefleme', duration: '3 ay' },
      { name: 'tt_pixel', provider: 'TikTok', purpose: 'Reklam dönüşümü', duration: '13 ay' },
      { name: 'ads_user_id', provider: 'Google Ads', purpose: 'Reklam takibi', duration: '1 yıl' },
    ],
  },
  {
    id: 'tercih', label: 'Tercih Çerezleri', locked: false, enabled: true,
    desc: 'Kullanıcı tercihleri ve kişiselleştirme ayarları için kullanılır.',
    cookies: [
      { name: 'lang_pref', provider: 'Laydora', purpose: 'Dil tercihi', duration: '1 yıl' },
      { name: 'theme_pref', provider: 'Laydora', purpose: 'Tema tercihi', duration: '1 yıl' },
    ],
  },
]

export default function AdminKVKK() {
  const [activeTab, setActiveTab] = useState('talepler')
  const [dsarList, setDsarList] = useState(DSAR_LIST)
  const [modalItem, setModalItem] = useState(null)
  const [modalAction, setModalAction] = useState('')
  const [modalNote, setModalNote] = useState('')
  const [cookies, setCookies] = useState(COOKIE_CATEGORIES)
  const [expandedCat, setExpandedCat] = useState(null)
  const [cookieSaved, setCookieSaved] = useState(false)
  const [logFilter, setLogFilter] = useState({ type: '', user: '' })
  const [clearConfirm, setClearConfirm] = useState(false)
  const [retentionDays, setRetentionDays] = useState(90)

  const logs = getLogs()

  const TABS = [
    { id: 'talepler', label: 'Veri Talepleri' },
    { id: 'cerezler', label: 'Çerez Yönetimi' },
    { id: 'loglar', label: 'Log Kaydı' },
  ]

  // Stats
  const total = dsarList.length
  const pending = dsarList.filter(d => d.status === 'Beklemede').length
  const completed = dsarList.filter(d => d.status === 'Tamamlandı').length
  const avgResponse = Math.round(dsarList.filter(d => d.status === 'Tamamlandı').reduce((s, d) => s + d.response, 0) / (completed || 1))

  const openModal = (item, action) => {
    setModalItem(item)
    setModalAction(action)
    setModalNote('')
  }

  const submitModal = () => {
    if (!modalItem) return
    const newStatus = modalAction === 'onayla' ? 'Tamamlandı' : 'Reddedildi'
    setDsarList(prev => prev.map(d => d.id === modalItem.id ? { ...d, status: newStatus } : d))
    setModalItem(null)
  }

  const exportDsar = () => {
    const headers = ['ID', 'Kullanıcı', 'E-posta', 'Talep Türü', 'Tarih', 'Durum', 'Yanıt Süresi (gün)']
    const rows = dsarList.map(d => [d.id, d.user, d.email, d.type, d.date, d.status, d.response])
    downloadCSV(rows, headers, 'kvkk-veri-talepleri.csv')
  }

  const toggleCookie = (id) => {
    setCookies(prev => prev.map(c => c.id === id && !c.locked ? { ...c, enabled: !c.enabled } : c))
  }

  const saveCookiePolicy = () => {
    setCookieSaved(true)
    setTimeout(() => setCookieSaved(false), 2500)
  }

  const filteredLogs = logs.filter(l => {
    const typeOk = !logFilter.type || l.type === logFilter.type
    const userOk = !logFilter.user || (l.userId && String(l.userId).toLowerCase().includes(logFilter.user.toLowerCase()))
    return typeOk && userOk
  })

  const exportLogs = () => {
    const headers = ['Tarih', 'Kullanıcı ID', 'Aktivite Türü', 'Detay']
    const rows = filteredLogs.map(l => [
      new Date(l.timestamp).toLocaleString('tr-TR'),
      l.userId ?? '—',
      LOG_LABELS[l.type] ?? l.type,
      l.productName ?? l.page ?? '—',
    ])
    downloadCSV(rows, headers, 'kvkk-log-kaydi.csv')
  }

  const handleClearLogs = () => {
    clearLogs()
    setClearConfirm(false)
    window.location.reload()
  }

  return (
    <div className="adm-analitik">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">KVKK / GDPR Yönetimi</h1>
          <p className="adm-page-sub">Veri koruma, çerez politikası ve aktivite log yönetimi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="adm-tab-filters" style={{ marginBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.id} className={`adm-tab-filter ${activeTab === t.id ? 'adm-tab-filter--active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── VERİ TALEPLERİ ─── */}
      {activeTab === 'talepler' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Toplam Talep', val: total, color: 'var(--adm-gold)' },
              { label: 'Beklemede', val: pending, color: '#fbbf24' },
              { label: 'Tamamlandı', val: completed, color: '#34d399' },
              { label: 'Ort. Yanıt Süresi', val: `${avgResponse} gün`, color: '#60a5fa' },
            ].map((s, i) => (
              <div key={i} className="adm-status-card">
                <span className="adm-status-card__label">{s.label}</span>
                <div className="adm-status-card__val" style={{ color: s.color, fontSize: '1.4rem' }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Veri Sahibi Başvuruları (DSAR)</p>
                <p className="adm-card-sub">Kişisel veri talepleri ve işlem durumları</p>
              </div>
              <button className="adm-ghost-btn" style={{ fontSize: '0.75rem' }} onClick={exportDsar}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                CSV İndir
              </button>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Kullanıcı</th><th>E-posta</th><th>Talep Türü</th><th>Tarih</th><th>Durum</th><th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {dsarList.map(d => {
                    const s = STATUS_STYLE[d.status] || {}
                    return (
                      <tr key={d.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{d.id}</td>
                        <td style={{ fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.82rem' }}>{d.user}</td>
                        <td style={{ color: 'var(--adm-text-3)', fontSize: '0.78rem' }}>{d.email}</td>
                        <td>
                          <span style={{ fontSize: '0.73rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--adm-text-2)' }}>
                            {d.type}
                          </span>
                        </td>
                        <td style={{ color: 'var(--adm-text-3)', fontSize: '0.78rem' }}>{d.date}</td>
                        <td>
                          <span style={{ fontSize: '0.73rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                            {d.status}
                          </span>
                        </td>
                        <td>
                          {(d.status === 'Beklemede' || d.status === 'İnceleniyor') && (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)', color: '#34d399', cursor: 'pointer' }}
                                onClick={() => openModal(d, 'onayla')}
                              >Onayla</button>
                              <button
                                style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#f87171', cursor: 'pointer' }}
                                onClick={() => openModal(d, 'reddet')}
                              >Reddet</button>
                            </div>
                          )}
                          {(d.status === 'Tamamlandı' || d.status === 'Reddedildi') && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-3)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── ÇEREZ YÖNETİMİ ─── */}
      {activeTab === 'cerezler' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Çerez Kategorileri</p>
                <p className="adm-card-sub">Her kategoride izin durumunu yönetin ve çerez listesini görüntüleyin</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {cookieSaved && (
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>✓ Kaydedildi</span>
                )}
                <button className="adm-btn" onClick={saveCookiePolicy} style={{ fontSize: '0.78rem' }}>
                  Politikayı Kaydet
                </button>
              </div>
            </div>
            <div style={{ padding: '8px 0' }}>
              {cookies.map(cat => (
                <div key={cat.id} style={{ borderBottom: '1px solid var(--adm-border)', padding: '0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0' }}>
                    {/* Toggle */}
                    <button
                      onClick={() => toggleCookie(cat.id)}
                      style={{
                        width: 40, height: 22, borderRadius: 11,
                        background: cat.enabled ? 'var(--adm-gold)' : 'rgba(255,255,255,0.1)',
                        border: 'none', cursor: cat.locked ? 'not-allowed' : 'pointer',
                        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
                        opacity: cat.locked ? 0.6 : 1,
                      }}
                      disabled={cat.locked}
                    >
                      <span style={{
                        position: 'absolute', top: 3, left: cat.enabled ? 20 : 3,
                        width: 16, height: 16, borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s', display: 'block',
                      }} />
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text)' }}>{cat.label}</p>
                        {cat.locked && (
                          <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--adm-text-3)' }}>
                            🔒 Zorunlu
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-3)', marginTop: 2 }}>{cat.desc}</p>
                    </div>
                    <button
                      onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--adm-text-3)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {cat.cookies.length} çerez
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: expandedCat === cat.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  </div>

                  {expandedCat === cat.id && (
                    <div style={{ marginBottom: 12 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--adm-border)' }}>
                            {['Çerez Adı', 'Sağlayıcı', 'Amaç', 'Saklama Süresi'].map(h => (
                              <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--adm-text-3)', fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {cat.cookies.map((ck, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: 'var(--adm-text-2)' }}>{ck.name}</td>
                              <td style={{ padding: '7px 10px', color: 'var(--adm-text-3)' }}>{ck.provider}</td>
                              <td style={{ padding: '7px 10px', color: 'var(--adm-text-3)' }}>{ck.purpose}</td>
                              <td style={{ padding: '7px 10px', color: 'var(--adm-text-3)' }}>{ck.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Consent Banner Preview */}
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Consent Banner Önizleme</p>
            </div>
            <div style={{ padding: '12px 16px 20px' }}>
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 20px', maxWidth: 520 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0ebe0', marginBottom: 8 }}>🍪 Çerez Tercihleri</p>
                <p style={{ fontSize: '0.75rem', color: '#9a9a9a', lineHeight: 1.5, marginBottom: 14 }}>
                  Laydora olarak deneyiminizi kişiselleştirmek ve sitemizin performansını artırmak için çerezler kullanıyoruz. Tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ fontSize: '0.75rem', padding: '7px 16px', borderRadius: 6, background: 'rgba(255,215,100,0.9)', color: '#1a1a1a', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    Tümünü Kabul Et
                  </button>
                  <button style={{ fontSize: '0.75rem', padding: '7px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#f0ebe0', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    Yönet
                  </button>
                  <button style={{ fontSize: '0.75rem', padding: '7px 16px', borderRadius: 6, background: 'none', color: '#9a9a9a', border: 'none', cursor: 'pointer' }}>
                    Zorunlu Olanlar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LOG KAYDI ─── */}
      {activeTab === 'loglar' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Controls */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Aktivite Logları</p>
                <p className="adm-card-sub">{filteredLogs.length} kayıt — localStorage'dan okunuyor</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  style={{ fontSize: '0.75rem', padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text-2)' }}
                  value={retentionDays} onChange={e => setRetentionDays(+e.target.value)}
                >
                  {[30, 60, 90, 180].map(d => <option key={d} value={d}>{d} gün saklama</option>)}
                </select>
                <button className="adm-ghost-btn" style={{ fontSize: '0.75rem' }} onClick={exportLogs}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  CSV İndir
                </button>
                <button
                  style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#f87171', cursor: 'pointer' }}
                  onClick={() => setClearConfirm(true)}
                >
                  Logları Temizle
                </button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--adm-border)' }}>
              <select
                style={{ fontSize: '0.75rem', padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text-2)', flex: 1 }}
                value={logFilter.type} onChange={e => setLogFilter(p => ({ ...p, type: e.target.value }))}
              >
                <option value="">Tüm Aktiviteler</option>
                {Object.entries(LOG_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input
                type="text"
                placeholder="Kullanıcı ID ara..."
                style={{ fontSize: '0.75rem', padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text-2)', flex: 1 }}
                value={logFilter.user} onChange={e => setLogFilter(p => ({ ...p, user: e.target.value }))}
              />
            </div>

            <div className="adm-table-wrap">
              {filteredLogs.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--adm-text-3)', fontSize: '0.82rem' }}>
                  Henüz log kaydı bulunmuyor. Kullanıcı eylemleri otomatik olarak kaydedilir.
                </div>
              ) : (
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Tarih</th><th>Kullanıcı ID</th><th>Aktivite Türü</th><th>Detay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.slice(0, 50).map((l, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)', whiteSpace: 'nowrap' }}>
                          {new Date(l.timestamp).toLocaleString('tr-TR')}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-2)' }}>{l.userId ?? '—'}</td>
                        <td>
                          <span style={{ fontSize: '0.73rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--adm-text-2)' }}>
                            {LOG_LABELS[l.type] ?? l.type}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)' }}>
                          {l.productName ?? l.page ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── DSAR MODAL ─── */}
      {modalItem && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setModalItem(null)}>
          <div style={{
            background: '#18181b', border: '1px solid var(--adm-border)', borderRadius: 14,
            padding: '28px', width: 440, maxWidth: '90vw',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 6 }}>
              {modalAction === 'onayla' ? 'Talebi Onayla' : 'Talebi Reddet'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-3)', marginBottom: 16 }}>
              <strong style={{ color: 'var(--adm-text-2)' }}>{modalItem.user}</strong> — {modalItem.type} talebi
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 6 }}>Not (isteğe bağlı)</label>
              <textarea
                rows={3}
                value={modalNote}
                onChange={e => setModalNote(e.target.value)}
                placeholder="Kullanıcıya gönderilecek açıklama..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--adm-text)', fontSize: '0.8rem', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModalItem(null)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>İptal</button>
              <button
                onClick={submitModal}
                style={{
                  fontSize: '0.8rem', padding: '7px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: modalAction === 'onayla' ? '#34d399' : '#f87171', color: '#fff',
                }}
              >
                {modalAction === 'onayla' ? 'Onayla' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CLEAR LOGS CONFIRM ─── */}
      {clearConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setClearConfirm(false)}>
          <div style={{
            background: '#18181b', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 14,
            padding: '28px', width: 380, maxWidth: '90vw',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171', marginBottom: 8 }}>Logları Temizle</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-3)', marginBottom: 20 }}>
              Tüm aktivite logları kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setClearConfirm(false)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>İptal</button>
              <button onClick={handleClearLogs} style={{ fontSize: '0.8rem', padding: '7px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#f87171', color: '#fff' }}>
                Evet, Temizle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

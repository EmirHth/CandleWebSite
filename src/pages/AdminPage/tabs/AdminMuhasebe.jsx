import { useState } from 'react'

// ─── Mock Data ───────────────────────────────────────────────
const FATURA_LIST = [
  { no: 'EF-2026-001', musteri: 'Ayşe Kaya', vergiNo: '12345678901', tarih: '2026-02-25', tutar: 2580, kdv: 464.4, durum: 'Onaylandı' },
  { no: 'EF-2026-002', musteri: 'Mehmet Demir', vergiNo: '98765432101', tarih: '2026-02-24', tutar: 1890, kdv: 340.2, durum: 'Gönderildi' },
  { no: 'EF-2026-003', musteri: 'Zeynep Arslan', vergiNo: '11122233301', tarih: '2026-02-23', tutar: 3450, kdv: 621, durum: 'Taslak' },
  { no: 'EF-2026-004', musteri: 'Fatih Yılmaz', vergiNo: '44455566601', tarih: '2026-02-22', tutar: 975, kdv: 175.5, durum: 'Hatalı' },
  { no: 'EF-2026-005', musteri: 'Emine Şahin', vergiNo: '77788899901', tarih: '2026-02-20', tutar: 5200, kdv: 936, durum: 'İptal' },
  { no: 'EF-2026-006', musteri: 'Ali Çelik', vergiNo: '33344455501', tarih: '2026-02-18', tutar: 1260, kdv: 226.8, durum: 'Onaylandı' },
  { no: 'EF-2026-007', musteri: 'Selin Öztürk', vergiNo: '55566677701', tarih: '2026-02-15', tutar: 4100, kdv: 738, durum: 'Gönderildi' },
]

const IRSALIYE_LIST = [
  { no: 'EI-2026-001', musteri: 'Ayşe Kaya', tarih: '2026-02-25', urunSayisi: 3, durum: 'Teslim Edildi' },
  { no: 'EI-2026-002', musteri: 'Mehmet Demir', tarih: '2026-02-24', urunSayisi: 1, durum: 'Gönderildi' },
  { no: 'EI-2026-003', musteri: 'Zeynep Arslan', tarih: '2026-02-23', urunSayisi: 5, durum: 'Taslak' },
  { no: 'EI-2026-004', musteri: 'Fatih Yılmaz', tarih: '2026-02-22', urunSayisi: 2, durum: 'Teslim Edildi' },
  { no: 'EI-2026-005', musteri: 'Emine Şahin', tarih: '2026-02-20', urunSayisi: 4, durum: 'Gönderildi' },
]

const CARI_LIST = [
  { id: 1, musteri: 'Ayşe Kaya', bakiye: 2580, limit: 10000, expanded: false,
    islemler: [
      { tarih: '2026-02-25', aciklama: 'Sipariş #LYD-0390', tutar: 2580, tip: 'Borç' },
      { tarih: '2026-02-20', aciklama: 'Ödeme alındı', tutar: -1500, tip: 'Alacak' },
    ]
  },
  { id: 2, musteri: 'Mehmet Demir', bakiye: 7800, limit: 10000, expanded: false,
    islemler: [
      { tarih: '2026-02-24', aciklama: 'Sipariş #LYD-0388', tutar: 1890, tip: 'Borç' },
      { tarih: '2026-02-22', aciklama: 'Sipariş #LYD-0382', tutar: 5910, tip: 'Borç' },
    ]
  },
  { id: 3, musteri: 'Zeynep Arslan', bakiye: 4200, limit: 8000, expanded: false,
    islemler: [
      { tarih: '2026-02-23', aciklama: 'Sipariş #LYD-0385', tutar: 3450, tip: 'Borç' },
      { tarih: '2026-02-15', aciklama: 'Ödeme alındı', tutar: -2500, tip: 'Alacak' },
      { tarih: '2026-02-10', aciklama: 'Sipariş #LYD-0370', tutar: 3250, tip: 'Borç' },
    ]
  },
  { id: 4, musteri: 'Fatih Yılmaz', bakiye: 975, limit: 5000, expanded: false,
    islemler: [
      { tarih: '2026-02-22', aciklama: 'Sipariş #LYD-0383', tutar: 975, tip: 'Borç' },
    ]
  },
]

const DEPOLAR = [
  { id: 1, ad: 'Ana Depo', sehir: 'İstanbul', kapasite: 1000, dolu: 743, urunSayisi: 12, stokDegeri: 285000 },
  { id: 2, ad: 'Şube Depo', sehir: 'Ankara', kapasite: 400, dolu: 182, urunSayisi: 8, stokDegeri: 74000 },
  { id: 3, ad: 'Transit Depo', sehir: 'İzmir', kapasite: 200, dolu: 56, urunSayisi: 5, stokDegeri: 22000 },
]

const URUN_STOK = [
  { urun: 'Gece Mumu', depolar: [142, 38, 12] },
  { urun: 'Vanilya Serenity', depolar: [98, 24, 8] },
  { urun: 'Kış Mumu', depolar: [87, 31, 6] },
  { urun: 'Romantic Set', depolar: [64, 18, 5] },
  { urun: 'Bergamot Difüzör', depolar: [112, 42, 14] },
  { urun: 'Gül Masaj Mumu', depolar: [56, 14, 4] },
  { urun: 'Lavanta Mumu', depolar: [184, 55, 7] },
]

const ERP_SYSTEMS = [
  { id: 'logo', name: 'Logo Tiger', version: '3.2.1', color: '#60a5fa' },
  { id: 'mikro', name: 'Mikro ERP', version: '16.4', color: '#a78bfa' },
  { id: 'nebim', name: 'Nebim V3', version: '3.8.5', color: '#34d399' },
]

const FATURA_STATUS = {
  'Taslak': { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)' },
  'Gönderildi': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
  'Onaylandı': { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  'Hatalı': { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  'İptal': { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
}

const IRSALIYE_STATUS = {
  'Taslak': { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
  'Gönderildi': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  'Teslim Edildi': { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
}

// ─── Component ───────────────────────────────────────────────
export default function AdminMuhasebe() {
  const [activeTab, setActiveTab] = useState('efatura')
  const [faturaFilter, setFaturaFilter] = useState('')
  const [erpState, setErpState] = useState(() =>
    ERP_SYSTEMS.reduce((acc, s) => ({
      ...acc,
      [s.id]: { apiUrl: '', apiKey: '', status: 'disconnected', testing: false, lastSync: null, syncItems: { urunler: true, siparisler: true, musteriler: false, stok: true }, frequency: '1sa' },
    }), {})
  )
  const [cariList, setCariList] = useState(CARI_LIST)
  const [hareketModal, setHareketModal] = useState(false)
  const [transferModal, setTransferModal] = useState(false)
  const [newDepoModal, setNewDepoModal] = useState(false)
  const [transferForm, setTransferForm] = useState({ kaynak: '1', hedef: '2', urun: '', miktar: '' })
  const [hareketForm, setHareketForm] = useState({ musteri: '', tip: 'Borç', tutar: '', aciklama: '' })
  const [syncing, setSyncing] = useState({})

  const TABS = [
    { id: 'efatura', label: 'e-Fatura' },
    { id: 'earsiv', label: 'e-Arşiv' },
    { id: 'eirsaliye', label: 'e-İrsaliye' },
    { id: 'erp', label: 'ERP Bağlantı' },
    { id: 'cari', label: 'Cari Hesap' },
    { id: 'depo', label: 'Çoklu Depo' },
  ]

  const testConnection = (erpId) => {
    setErpState(prev => ({ ...prev, [erpId]: { ...prev[erpId], testing: true } }))
    setTimeout(() => {
      setErpState(prev => ({
        ...prev,
        [erpId]: {
          ...prev[erpId],
          testing: false,
          status: prev[erpId].apiUrl && prev[erpId].apiKey ? 'connected' : 'error',
        }
      }))
    }, 1800)
  }

  const syncNow = (erpId) => {
    setSyncing(prev => ({ ...prev, [erpId]: true }))
    setTimeout(() => {
      setSyncing(prev => ({ ...prev, [erpId]: false }))
      setErpState(prev => ({ ...prev, [erpId]: { ...prev[erpId], lastSync: new Date().toISOString() } }))
    }, 2200)
  }

  const toggleCari = (id) => {
    setCariList(prev => prev.map(c => c.id === id ? { ...c, expanded: !c.expanded } : c))
  }

  const filteredFatura = FATURA_LIST.filter(f =>
    !faturaFilter || f.durum === faturaFilter
  )

  const getRisk = (bakiye, limit) => {
    const pct = (bakiye / limit) * 100
    if (pct < 50) return { label: 'OK', color: '#34d399', bg: 'rgba(52,211,153,0.1)' }
    if (pct < 80) return { label: 'Uyarı', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' }
    return { label: 'Kritik', color: '#f87171', bg: 'rgba(248,113,113,0.1)' }
  }

  // Arşiv groups by month
  const arsivGroups = [
    { ay: 'Şubat 2026', count: 7, toplam: 20455 },
    { ay: 'Ocak 2026', count: 24, toplam: 98320 },
    { ay: 'Aralık 2025', count: 38, toplam: 182640 },
    { ay: 'Kasım 2025', count: 27, toplam: 124500 },
    { ay: 'Ekim 2025', count: 21, toplam: 87300 },
  ]

  return (
    <div className="adm-analitik">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Muhasebe & ERP</h1>
          <p className="adm-page-sub">e-Fatura, ERP entegrasyonu, cari hesap ve çoklu depo yönetimi</p>
        </div>
        {/* GIB Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 6px #34d399' }} />
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>GİB Bağlantısı Aktif</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="adm-tab-filters" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} className={`adm-tab-filter ${activeTab === t.id ? 'adm-tab-filter--active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── e-FATURA ─── */}
      {activeTab === 'efatura' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">e-Fatura Listesi</p>
                <p className="adm-card-sub">{filteredFatura.length} fatura</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  className="adm-search"
                  style={{ width: 150, padding: '6px 10px', fontSize: '0.75rem' }}
                  value={faturaFilter} onChange={e => setFaturaFilter(e.target.value)}
                >
                  <option value="">Tüm Durumlar</option>
                  {Object.keys(FATURA_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="adm-btn" style={{ fontSize: '0.78rem' }}>+ Yeni e-Fatura</button>
              </div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Fatura No</th><th>Müşteri</th><th>Vergi No</th><th>Tarih</th><th>Tutar</th><th>KDV</th><th>Durum</th><th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFatura.map((f, i) => {
                    const s = FATURA_STATUS[f.durum] || {}
                    return (
                      <tr key={i}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{f.no}</td>
                        <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--adm-text)' }}>{f.musteri}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--adm-text-3)' }}>{f.vergiNo}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{f.tarih}</td>
                        <td><span className="adm-table-amount">₺{f.tutar.toLocaleString('tr-TR')}</span></td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>₺{f.kdv.toLocaleString('tr-TR', { minimumFractionDigits: 1 })}</td>
                        <td>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                            {f.durum}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {['Görüntüle', 'İndir'].map(a => (
                              <button key={a} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--adm-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--adm-text-3)', cursor: 'pointer' }}>
                                {a}
                              </button>
                            ))}
                          </div>
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

      {/* ─── e-ARŞİV ─── */}
      {activeTab === 'earsiv' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">e-Arşiv Faturaları</p>
                <p className="adm-card-sub">Aylara göre gruplu arşiv</p>
              </div>
              <button className="adm-ghost-btn" style={{ fontSize: '0.75rem' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Tümünü İndir
              </button>
            </div>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                <input type="text" placeholder="Müşteri ara..." style={{ flex: 1, fontSize: '0.75rem', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text-2)' }} />
                <input type="month" style={{ fontSize: '0.75rem', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text-2)' }} />
              </div>
              {arsivGroups.map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--adm-border)', borderRadius: 8 }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text)' }}>{g.ay}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', marginTop: 2 }}>{g.count} fatura · ₺{g.toplam.toLocaleString('tr-TR')} toplam</p>
                  </div>
                  <button style={{ fontSize: '0.72rem', padding: '5px 12px', borderRadius: 6, border: '1px solid var(--adm-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--adm-text-2)', cursor: 'pointer' }}>
                    İndir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── e-İRSALİYE ─── */}
      {activeTab === 'eirsaliye' && (
        <div style={{ marginTop: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">e-İrsaliye Listesi</p>
                <p className="adm-card-sub">Sevk irsaliyeleri</p>
              </div>
              <button className="adm-btn" style={{ fontSize: '0.78rem' }}>+ Yeni İrsaliye</button>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>İrsaliye No</th><th>Müşteri</th><th>Tarih</th><th>Ürün Sayısı</th><th>Durum</th><th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {IRSALIYE_LIST.map((ir, i) => {
                    const s = IRSALIYE_STATUS[ir.durum] || {}
                    return (
                      <tr key={i}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{ir.no}</td>
                        <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--adm-text)' }}>{ir.musteri}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{ir.tarih}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-2)', textAlign: 'center' }}>{ir.urunSayisi}</td>
                        <td>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, color: s.color, background: s.bg }}>
                            {ir.durum}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {['Görüntüle', 'Yazdır'].map(a => (
                              <button key={a} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--adm-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--adm-text-3)', cursor: 'pointer' }}>
                                {a}
                              </button>
                            ))}
                          </div>
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

      {/* ─── ERP BAĞLANTI ─── */}
      {activeTab === 'erp' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ERP_SYSTEMS.map(sys => {
            const st = erpState[sys.id]
            const isTesting = st.testing
            const isSync = syncing[sys.id]
            return (
              <div key={sys.id} className="adm-card" style={{ borderLeft: `3px solid ${sys.color}40` }}>
                <div className="adm-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${sys.color}15`, border: `1px solid ${sys.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sys.color} strokeWidth="1.8" strokeLinecap="round">
                        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--adm-text)' }}>{sys.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--adm-text-3)' }}>v{sys.version}</p>
                    </div>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, marginLeft: 8,
                      color: st.status === 'connected' ? '#34d399' : st.status === 'error' ? '#f87171' : 'var(--adm-text-3)',
                      background: st.status === 'connected' ? 'rgba(52,211,153,0.1)' : st.status === 'error' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)',
                    }}>
                      {st.status === 'connected' ? '● Bağlı' : st.status === 'error' ? '● Bağlantı Hatası' : '○ Bağlı Değil'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => testConnection(sys.id)}
                      disabled={isTesting}
                      className="adm-ghost-btn" style={{ fontSize: '0.75rem' }}
                    >
                      {isTesting ? 'Test ediliyor…' : 'Bağlantıyı Test Et'}
                    </button>
                    <button
                      onClick={() => syncNow(sys.id)}
                      disabled={isSync}
                      className="adm-btn" style={{ fontSize: '0.75rem' }}
                    >
                      {isSync ? '⟳ Senkronize…' : 'Manuel Senkronizasyon'}
                    </button>
                  </div>
                </div>
                <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>API URL</label>
                      <input
                        type="text"
                        placeholder={`https://${sys.id}.api.example.com`}
                        value={st.apiUrl}
                        onChange={e => setErpState(prev => ({ ...prev, [sys.id]: { ...prev[sys.id], apiUrl: e.target.value } }))}
                        style={{ width: '100%', fontSize: '0.78rem', padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>API Key</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        value={st.apiKey}
                        onChange={e => setErpState(prev => ({ ...prev, [sys.id]: { ...prev[sys.id], apiKey: e.target.value } }))}
                        style={{ width: '100%', fontSize: '0.78rem', padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 6 }}>Senkronizasyon Sıklığı</label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['15dk', '1sa', '4sa', 'Günlük'].map(f => (
                          <button
                            key={f}
                            onClick={() => setErpState(prev => ({ ...prev, [sys.id]: { ...prev[sys.id], frequency: f } }))}
                            style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 4, border: `1px solid ${st.frequency === f ? sys.color : 'var(--adm-border)'}`, background: st.frequency === f ? `${sys.color}15` : 'rgba(255,255,255,0.03)', color: st.frequency === f ? sys.color : 'var(--adm-text-3)', cursor: 'pointer' }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', marginBottom: 8 }}>Senkronize Edilecekler</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {Object.entries(st.syncItems).map(([key, val]) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={val}
                            onChange={e => setErpState(prev => ({
                              ...prev,
                              [sys.id]: { ...prev[sys.id], syncItems: { ...prev[sys.id].syncItems, [key]: e.target.checked } }
                            }))}
                            style={{ accentColor: sys.color }}
                          />
                          <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>
                            {key === 'urunler' ? 'Ürünler' : key === 'siparisler' ? 'Siparişler' : key === 'musteriler' ? 'Müşteriler' : 'Stok'}
                          </span>
                        </label>
                      ))}
                    </div>
                    {st.lastSync && (
                      <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginTop: 12 }}>
                        Son senkronizasyon: {new Date(st.lastSync).toLocaleString('tr-TR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── CARİ HESAP ─── */}
      {activeTab === 'cari' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Toplam Alacak', val: '₺16,555', color: '#34d399' },
              { label: 'Toplam Borç', val: '₺24,200', color: '#f87171' },
              { label: 'Vadesi Geçen', val: '₺7,800', color: '#fbbf24' },
              { label: 'Ortalama Vade', val: '18 gün', color: 'var(--adm-gold)' },
            ].map((k, i) => (
              <div key={i} className="adm-status-card">
                <span className="adm-status-card__label">{k.label}</span>
                <div className="adm-status-card__val" style={{ color: k.color, fontSize: '1.3rem' }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Müşteri Cari Hesapları</p>
              </div>
              <button className="adm-btn" style={{ fontSize: '0.78rem' }} onClick={() => setHareketModal(true)}>
                + Yeni Hareket
              </button>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th></th><th>Müşteri</th><th>Bakiye</th><th>Kredi Limiti</th><th>Kullanım</th><th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {cariList.map(c => {
                    const pct = Math.round((c.bakiye / c.limit) * 100)
                    const risk = getRisk(c.bakiye, c.limit)
                    return (
                      <>
                        <tr key={c.id}>
                          <td>
                            <button onClick={() => toggleCari(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-text-3)', padding: '2px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: c.expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                                <path d="m9 18 6-6-6-6"/>
                              </svg>
                            </button>
                          </td>
                          <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--adm-text)' }}>{c.musteri}</td>
                          <td><span className="adm-table-amount">₺{c.bakiye.toLocaleString('tr-TR')}</span></td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-3)' }}>₺{c.limit.toLocaleString('tr-TR')}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 80, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: risk.color, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: '0.72rem', color: risk.color }}>%{pct}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, color: risk.color, background: risk.bg }}>
                              {risk.label}
                            </span>
                          </td>
                        </tr>
                        {c.expanded && (
                          <tr>
                            <td colSpan={6} style={{ padding: 0 }}>
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 24px 12px', borderBottom: '1px solid var(--adm-border)' }}>
                                <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', marginBottom: 8 }}>İşlem Geçmişi</p>
                                {c.islemler.map((is, idx) => (
                                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: idx < c.islemler.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{is.tarih}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-2)', flex: 1, marginLeft: 16 }}>{is.aciklama}</span>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: is.tip === 'Borç' ? '#f87171' : '#34d399' }}>
                                      {is.tip === 'Borç' ? '+' : ''}₺{Math.abs(is.tutar).toLocaleString('tr-TR')}
                                    </span>
                                    <span style={{ fontSize: '0.68rem', color: is.tip === 'Borç' ? '#f87171' : '#34d399', marginLeft: 8 }}>{is.tip}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── ÇOKLU DEPO ─── */}
      {activeTab === 'depo' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Depo Kartları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {DEPOLAR.map(d => {
              const pct = Math.round((d.dolu / d.kapasite) * 100)
              const color = pct < 60 ? '#34d399' : pct < 85 ? '#fbbf24' : '#f87171'
              return (
                <div key={d.id} className="adm-status-card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--adm-text)' }}>{d.ad}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', marginTop: 2 }}>{d.sehir}</p>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Doluluk', val: `${d.dolu}/${d.kapasite}` },
                      { label: 'Ürün Çeşidi', val: d.urunSayisi },
                      { label: 'Stok Değeri', val: `₺${(d.stokDegeri / 1000).toFixed(0)}k` },
                    ].map((m, i) => (
                      <div key={i}>
                        <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)' }}>{m.label}</p>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stok Matrix + Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Ürün × Depo Stok Matrisi</p>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      {DEPOLAR.map(d => <th key={d.id}>{d.ad}</th>)}
                      <th>Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {URUN_STOK.map((u, i) => {
                      const total = u.depolar.reduce((s, v) => s + v, 0)
                      return (
                        <tr key={i}>
                          <td style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--adm-text)' }}>{u.urun}</td>
                          {u.depolar.map((v, j) => (
                            <td key={j} style={{ textAlign: 'center', fontSize: '0.82rem', color: v > 50 ? '#34d399' : v > 20 ? 'var(--adm-gold)' : '#f87171', fontWeight: 600 }}>{v}</td>
                          ))}
                          <td style={{ textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, color: 'var(--adm-text)' }}>{total}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
              <button className="adm-btn" style={{ fontSize: '0.78rem' }} onClick={() => setTransferModal(true)}>
                Stok Transfer
              </button>
              <button className="adm-ghost-btn" style={{ fontSize: '0.78rem' }} onClick={() => setNewDepoModal(true)}>
                + Yeni Depo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── YENİ HAREKET MODAL ─── */}
      {hareketModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setHareketModal(false)}>
          <div style={{ background: '#18181b', border: '1px solid var(--adm-border)', borderRadius: 14, padding: 28, width: 420, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 16 }}>Yeni Cari Hareket</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Müşteri', field: 'musteri', type: 'text', placeholder: 'Müşteri adı' },
                { label: 'Tutar (₺)', field: 'tutar', type: 'number', placeholder: '0.00' },
                { label: 'Açıklama', field: 'aciklama', type: 'text', placeholder: 'Hareket açıklaması' },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={hareketForm[f.field]}
                    onChange={e => setHareketForm(p => ({ ...p, [f.field]: e.target.value }))}
                    style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 6 }}>Tür</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Borç', 'Alacak'].map(t => (
                    <button key={t} onClick={() => setHareketForm(p => ({ ...p, tip: t }))}
                      style={{ flex: 1, padding: '7px', borderRadius: 6, border: `1px solid ${hareketForm.tip === t ? (t === 'Borç' ? '#f87171' : '#34d399') : 'var(--adm-border)'}`, background: hareketForm.tip === t ? (t === 'Borç' ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)') : 'rgba(255,255,255,0.03)', color: hareketForm.tip === t ? (t === 'Borç' ? '#f87171' : '#34d399') : 'var(--adm-text-3)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setHareketModal(false)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>İptal</button>
              <button onClick={() => setHareketModal(false)} className="adm-btn" style={{ fontSize: '0.8rem' }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STOK TRANSFER MODAL ─── */}
      {transferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setTransferModal(false)}>
          <div style={{ background: '#18181b', border: '1px solid var(--adm-border)', borderRadius: 14, padding: 28, width: 420, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 16 }}>Stok Transfer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Kaynak Depo', field: 'kaynak' },
                { label: 'Hedef Depo', field: 'hedef' },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <select value={transferForm[f.field]} onChange={e => setTransferForm(p => ({ ...p, [f.field]: e.target.value }))}
                    style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box' }}>
                    {DEPOLAR.map(d => <option key={d.id} value={d.id}>{d.ad} ({d.sehir})</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Ürün</label>
                <select value={transferForm.urun} onChange={e => setTransferForm(p => ({ ...p, urun: e.target.value }))}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box' }}>
                  <option value="">Ürün seçin...</option>
                  {URUN_STOK.map(u => <option key={u.urun} value={u.urun}>{u.urun}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Miktar</label>
                <input type="number" placeholder="0" value={transferForm.miktar} onChange={e => setTransferForm(p => ({ ...p, miktar: e.target.value }))}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setTransferModal(false)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>İptal</button>
              <button onClick={() => setTransferModal(false)} className="adm-btn" style={{ fontSize: '0.8rem' }}>Transferi Onayla</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── YENİ DEPO MODAL ─── */}
      {newDepoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setNewDepoModal(false)}>
          <div style={{ background: '#18181b', border: '1px solid var(--adm-border)', borderRadius: 14, padding: 28, width: 380, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 16 }}>Yeni Depo Ekle</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Depo Adı', placeholder: 'Depo adı...' },
                { label: 'Şehir', placeholder: 'İstanbul' },
                { label: 'Kapasite (adet)', placeholder: '500' },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder}
                    style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setNewDepoModal(false)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>İptal</button>
              <button onClick={() => setNewDepoModal(false)} className="adm-btn" style={{ fontSize: '0.8rem' }}>Depo Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

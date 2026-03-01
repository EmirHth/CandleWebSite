import { useState } from 'react'

// ─── Mock Data ───────────────────────────────────────────────

const GELIR_GIDER = [
  { id: 1, tarih: '2026-02-25', aciklama: 'LYD-0412 Sipariş Ödemesi', kategori: 'Satış Geliri', tip: 'Gelir', tutar: 1890 },
  { id: 2, tarih: '2026-02-24', aciklama: 'Yurtiçi Kargo Ücreti Tahsilatı', kategori: 'Kargo Geliri', tip: 'Gelir', tutar: 180 },
  { id: 3, tarih: '2026-02-23', aciklama: 'Soya Wax Hammadde Alımı', kategori: 'Hammadde', tip: 'Gider', tutar: 2400 },
  { id: 4, tarih: '2026-02-22', aciklama: 'LYD-0408 Sipariş Ödemesi', kategori: 'Satış Geliri', tip: 'Gelir', tutar: 975 },
  { id: 5, tarih: '2026-02-20', aciklama: 'MNG Kargo Faturası', kategori: 'Kargo Gideri', tip: 'Gider', tutar: 640 },
  { id: 6, tarih: '2026-02-18', aciklama: 'Instagram Reklam Ödemesi', kategori: 'Pazarlama', tip: 'Gider', tutar: 1200 },
  { id: 7, tarih: '2026-02-17', aciklama: 'LYD-0401 Sipariş Ödemesi', kategori: 'Satış Geliri', tip: 'Gelir', tutar: 3450 },
  { id: 8, tarih: '2026-02-15', aciklama: 'Esans ve Koku Yağları', kategori: 'Hammadde', tip: 'Gider', tutar: 1850 },
  { id: 9, tarih: '2026-02-12', aciklama: 'LYD-0395 Sipariş Ödemesi', kategori: 'Satış Geliri', tip: 'Gelir', tutar: 2580 },
  { id: 10, tarih: '2026-02-10', aciklama: 'Ocak KDV Ödemesi', kategori: 'KDV Ödemesi', tip: 'Gider', tutar: 3210 },
  { id: 11, tarih: '2026-02-08', aciklama: 'Ambalaj Malzemesi', kategori: 'Genel Gider', tip: 'Gider', tutar: 720 },
  { id: 12, tarih: '2026-02-05', aciklama: 'LYD-0388 Sipariş Ödemesi', kategori: 'Satış Geliri', tip: 'Gelir', tutar: 1260 },
]

const KATEGORILER = ['Satış Geliri', 'Kargo Geliri', 'Hammadde', 'Kargo Gideri', 'Pazarlama', 'Genel Gider', 'KDV Ödemesi']

const AYLIK_VERI = [
  { ay: 'Eyl', gelir: 8400, gider: 4800 },
  { ay: 'Eki', gelir: 11200, gider: 5900 },
  { ay: 'Kas', gelir: 14600, gider: 6800 },
  { ay: 'Ara', gelir: 18900, gider: 7200 },
  { ay: 'Oca', gelir: 13500, gider: 6100 },
  { ay: 'Şub', gelir: 10335, gider: 10020 },
]

const GIDER_KATEGORI = [
  { ad: 'Hammadde', tutar: 4250, renk: '#c47f3a' },
  { ad: 'Pazarlama', tutar: 1200, renk: '#9a7fc4' },
  { ad: 'Kargo Gideri', tutar: 640, renk: '#a0856d' },
]

const FATURALAR = [
  { no: 'LYD-F-001', musteri: 'Ayşe Kaya', email: 'ayse.kaya@email.com', adres: 'Bağcılar Mah. No:12, Kadıköy / İstanbul', tel: '0532 111 22 33', odeme: 'Kredi Kartı', tarih: '2026-02-25', tutar: 1890, durum: 'Ödendi',
    kalemler: [{ ad: 'Gece Mumu', adet: 2, fiyat: 620 }, { ad: 'Vanilya Serenity', adet: 1, fiyat: 650 }] },
  { no: 'LYD-F-002', musteri: 'Mehmet Demir', email: 'mdemir@email.com', adres: 'Çarşı Cad. No:5/3, Şişli / İstanbul', tel: '0542 333 44 55', odeme: 'Havale/EFT', tarih: '2026-02-24', tutar: 975, durum: 'Bekliyor',
    kalemler: [{ ad: 'Kış Mumu', adet: 1, fiyat: 590 }, { ad: 'Lavanta Mumu', adet: 1, fiyat: 385 }] },
  { no: 'LYD-F-003', musteri: 'Zeynep Arslan', email: 'z.arslan@gmail.com', adres: 'Atatürk Blv. No:88, Çankaya / Ankara', tel: '0505 666 77 88', odeme: 'Kredi Kartı', tarih: '2026-02-22', tutar: 3450, durum: 'Ödendi',
    kalemler: [{ ad: 'Romantic Set', adet: 2, fiyat: 1100 }, { ad: 'Bergamot Difüzör', adet: 1, fiyat: 1250 }] },
  { no: 'LYD-F-004', musteri: 'Fatih Yılmaz', email: 'fyilmaz@email.com', adres: 'Konak Mah. No:2, Konak / İzmir', tel: '0554 999 00 11', odeme: 'Kredi Kartı', tarih: '2026-02-20', tutar: 620, durum: 'İptal',
    kalemler: [{ ad: 'Gece Mumu', adet: 1, fiyat: 620 }] },
  { no: 'LYD-F-005', musteri: 'Emine Şahin', email: 'emine.s@email.com', adres: 'Feriköy Mah. No:34, Şişli / İstanbul', tel: '0533 222 55 66', odeme: 'Kapıda Ödeme', tarih: '2026-02-18', tutar: 2580, durum: 'Ödendi',
    kalemler: [{ ad: 'Gül Masaj Mumu', adet: 2, fiyat: 870 }, { ad: 'Kış Mumu', adet: 1, fiyat: 840 }] },
  { no: 'LYD-F-006', musteri: 'Ali Çelik', email: 'ali.celik@email.com', adres: 'Yıldız Mah. No:7, Beşiktaş / İstanbul', tel: '0544 888 11 22', odeme: 'Havale/EFT', tarih: '2026-02-15', tutar: 1260, durum: 'Bekliyor',
    kalemler: [{ ad: 'Vanilya Serenity', adet: 2, fiyat: 630 }] },
  { no: 'LYD-F-007', musteri: 'Selin Öztürk', email: 'selin.oz@email.com', adres: 'Alsancak Mah. No:21, Konak / İzmir', tel: '0506 777 33 44', odeme: 'Kredi Kartı', tarih: '2026-02-12', tutar: 4100, durum: 'Ödendi',
    kalemler: [{ ad: 'Romantic Set', adet: 3, fiyat: 1100 }, { ad: 'Bergamot Difüzör', adet: 1, fiyat: 800 }] },
  { no: 'LYD-F-008', musteri: 'Berk Aydın', email: 'berk.a@email.com', adres: 'Kızılay Mah. No:9, Çankaya / Ankara', tel: '0555 444 66 77', odeme: 'Kredi Kartı', tarih: '2026-02-08', tutar: 780, durum: 'Bekliyor',
    kalemler: [{ ad: 'Lavanta Mumu', adet: 2, fiyat: 390 }] },
]

const STOK_URUNLER = [
  { urun: 'Gece Mumu', stok: 48, maliyet: 180, satis: 620 },
  { urun: 'Vanilya Serenity', stok: 32, maliyet: 195, satis: 650 },
  { urun: 'Kış Mumu', stok: 61, maliyet: 165, satis: 590 },
  { urun: 'Romantic Set', stok: 14, maliyet: 380, satis: 1100 },
  { urun: 'Bergamot Difüzör', stok: 27, maliyet: 420, satis: 1250 },
  { urun: 'Gül Masaj Mumu', stok: 9, maliyet: 290, satis: 870 },
  { urun: 'Lavanta Mumu', stok: 73, maliyet: 140, satis: 385 },
  { urun: 'Turunçgil Mumu', stok: 38, maliyet: 155, satis: 520 },
]

// Project palette — no generic green/red
const C_GELIR = 'rgba(255,215,100,0.85)'   // warm amber-gold (income / good)
const C_GIDER = '#c47f3a'                   // copper-bronze (expense / warning)
const C_AMBER = '#fbbf24'                   // yellow-amber (pending / KDV)

const DURUM_STYLE = {
  'Ödendi': { color: C_GELIR, bg: 'rgba(255,215,100,0.08)', border: 'rgba(255,215,100,0.2)' },
  'Bekliyor': { color: C_AMBER, bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
  'İptal': { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
}

const EMPTY_KAYIT = { aciklama: '', kategori: 'Satış Geliri', tip: 'Gelir', tutar: '', tarih: '' }
const EMPTY_FATURA = { musteri: '', tarih: '', tutar: '' }

// ─── Helpers ─────────────────────────────────────────────────

function fmt(n) { return '₺' + Number(n).toLocaleString('tr-TR') }

const INPUT_STYLE = {
  width: '100%', fontSize: '0.8rem', padding: '7px 10px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)',
  borderRadius: 6, color: 'var(--adm-text)', boxSizing: 'border-box',
}

// ─── Modal Wrapper ────────────────────────────────────────────

function Modal({ onClose, children, width = 460 }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#18181b', border: '1px solid var(--adm-border)', borderRadius: 14, padding: 28, width, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Print Fatura ─────────────────────────────────────────────

function printFatura(f) {
  const kdvOrani = 0.18
  const kdvHaric = Math.round(f.tutar / (1 + kdvOrani))
  const kdv = f.tutar - kdvHaric

  const kalemRows = f.kalemler.map(k => `
    <tr>
      <td>${k.ad}</td>
      <td style="text-align:center">${k.adet}</td>
      <td style="text-align:right">₺${Number(k.fiyat).toLocaleString('tr-TR')}</td>
      <td style="text-align:right">₺${Number(k.fiyat * k.adet).toLocaleString('tr-TR')}</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laydora Fatura – ${f.no}</title>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Cormorant+Garamond:wght@600&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Jost',sans-serif; color:#1a1a1a; background:#fff; padding:44px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:22px; border-bottom:2px solid #1a1a1a; margin-bottom:28px; }
    .brand { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:700; letter-spacing:0.1em; }
    .tagline { font-size:0.65rem; letter-spacing:0.14em; opacity:0.4; margin-top:4px; text-transform:uppercase; }
    .badge { display:inline-block; font-size:0.65rem; letter-spacing:0.08em; text-transform:uppercase; padding:3px 10px; border-radius:4px; background:#f0f0f0; margin-top:8px; }
    .fatura-no-label { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; opacity:0.4; }
    .fatura-no { font-size:1rem; font-weight:700; margin:4px 0; }
    .meta { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:28px; }
    .meta-block { background:#f8f8f8; border-radius:8px; padding:16px; }
    .meta-block h4 { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; opacity:0.4; margin-bottom:10px; font-weight:700; }
    .meta-block p { font-size:0.8rem; line-height:1.75; }
    table { width:100%; border-collapse:collapse; margin-bottom:28px; }
    thead th { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; opacity:0.4; padding:8px 10px; border-bottom:2px solid #1a1a1a; text-align:left; }
    thead th:nth-child(2) { text-align:center; }
    thead th:nth-child(3), thead th:nth-child(4) { text-align:right; }
    tbody td { padding:10px 10px; font-size:0.82rem; border-bottom:1px solid #f0f0f0; }
    .totals { margin-left:auto; width:260px; }
    .tot-line { display:flex; justify-content:space-between; font-size:0.82rem; padding:5px 0; border-bottom:1px solid #f0f0f0; }
    .tot-total { display:flex; justify-content:space-between; font-size:1.05rem; font-weight:700; padding-top:12px; border-top:2px solid #1a1a1a; margin-top:4px; }
    .footer { margin-top:44px; padding-top:16px; border-top:1px solid #e0e0e0; font-size:0.7rem; color:#999; text-align:center; line-height:2; }
    @media print { body { padding:20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">LAYDORA</div>
      <div class="tagline">El Yapımı Doğal Mumlar &amp; Kozmetik</div>
      <div class="badge">${f.durum === 'Ödendi' ? '✓ ÖDENDİ' : f.durum === 'Bekliyor' ? 'ÖDEME BEKLİYOR' : 'İPTAL'}</div>
    </div>
    <div style="text-align:right">
      <div class="fatura-no-label">Fatura</div>
      <div class="fatura-no">${f.no}</div>
      <div style="font-size:0.75rem; opacity:0.45; margin-top:2px">${f.tarih}</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-block">
      <h4>Müşteri Bilgileri</h4>
      <p>
        <strong>${f.musteri}</strong><br>
        ${f.email || ''}<br>
        ${f.tel || ''}<br>
        ${f.adres || ''}
      </p>
    </div>
    <div class="meta-block">
      <h4>Ödeme Bilgileri</h4>
      <p>
        Yöntem: <strong>${f.odeme || '—'}</strong><br>
        Durum: ${f.durum}<br>
        Fatura Tarihi: ${f.tarih}<br>
        KDV Oranı: %18
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Ürün / Hizmet</th>
        <th style="text-align:center">Adet</th>
        <th style="text-align:right">Birim Fiyat</th>
        <th style="text-align:right">Tutar</th>
      </tr>
    </thead>
    <tbody>${kalemRows}</tbody>
  </table>

  <div class="totals">
    <div class="tot-line"><span>Ara Toplam (KDV Hariç)</span><span>₺${kdvHaric.toLocaleString('tr-TR')}</span></div>
    <div class="tot-line"><span>KDV (%18)</span><span>₺${kdv.toLocaleString('tr-TR')}</span></div>
    <div class="tot-total"><span>GENEL TOPLAM</span><span>₺${Number(f.tutar).toLocaleString('tr-TR')}</span></div>
  </div>

  <div class="footer">
    Laydora El Yapımı Doğal Mumlar — laydora.com<br>
    Bu belge resmi fatura niteliğindedir. Vergi numarası: 1234567890<br>
    Sorularınız için: muhasebe@laydora.com · 0850 XXX XX XX
  </div>
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`

  const w = window.open('', '_blank')
  if (w) { w.document.write(html); w.document.close() }
}

// ─── Component ───────────────────────────────────────────────

export default function AdminMuhasebe() {
  const [activeTab, setActiveTab] = useState('genel')

  // Gelir & Gider state
  const [kayitlar, setKayitlar] = useState(GELIR_GIDER)
  const [gelirGiderFilter, setGelirGiderFilter] = useState('')
  const [kayitModal, setKayitModal] = useState(false)
  const [kayitForm, setKayitForm] = useState(EMPTY_KAYIT)

  // Fatura state
  const [faturalar, setFaturalar] = useState(FATURALAR)
  const [faturaDurumFilter, setFaturaDurumFilter] = useState('')
  const [goruntuleFatura, setGoruntuleFatura] = useState(null)
  const [yeniFaturaModal, setYeniFaturaModal] = useState(false)
  const [faturaForm, setFaturaForm] = useState(EMPTY_FATURA)

  // Stok state
  const [stoklar, setStoklar] = useState(STOK_URUNLER)
  const [editStokId, setEditStokId] = useState(null)
  const [stokInput, setStokInput] = useState('')

  const TABS = [
    { id: 'genel', label: 'Genel Bakış' },
    { id: 'gelir', label: 'Gelir & Gider' },
    { id: 'fatura', label: 'Fatura Takibi' },
    { id: 'stok', label: 'Stok & Maliyet' },
  ]

  // ── Computed values ──────────────────────────────────────────
  const buAyGelir = kayitlar.filter(k => k.tip === 'Gelir').reduce((s, k) => s + k.tutar, 0)
  const buAyGider = kayitlar.filter(k => k.tip === 'Gider').reduce((s, k) => s + k.tutar, 0)
  const netKar = buAyGelir - buAyGider
  const kdvBorcu = Math.round(buAyGelir * 0.18)

  const maxAylik = Math.max(...AYLIK_VERI.map(a => Math.max(a.gelir, a.gider)))
  const CHART_H = 110

  const filteredKayitlar = kayitlar.filter(k => !gelirGiderFilter || k.tip === gelirGiderFilter)
  const toplamGelir = filteredKayitlar.filter(k => k.tip === 'Gelir').reduce((s, k) => s + k.tutar, 0)
  const toplamGider = filteredKayitlar.filter(k => k.tip === 'Gider').reduce((s, k) => s + k.tutar, 0)

  const filteredFaturalar = faturalar.filter(f => !faturaDurumFilter || f.durum === faturaDurumFilter)

  const toplamStokDegeri = stoklar.reduce((s, u) => s + u.stok * u.maliyet, 0)
  const maxGiderKat = Math.max(...GIDER_KATEGORI.map(g => g.tutar))

  // ── Handlers ────────────────────────────────────────────────
  function kayitKaydet() {
    if (!kayitForm.aciklama || !kayitForm.tutar) return
    setKayitlar(prev => [
      { ...kayitForm, id: Date.now(), tutar: parseFloat(kayitForm.tutar) },
      ...prev,
    ])
    setKayitForm(EMPTY_KAYIT)
    setKayitModal(false)
  }

  function faturaKaydet() {
    if (!faturaForm.musteri || !faturaForm.tutar) return
    const no = `LYD-F-${String(faturalar.length + 1).padStart(3, '0')}`
    setFaturalar(prev => [
      { ...faturaForm, no, durum: 'Bekliyor', tutar: parseFloat(faturaForm.tutar), kalemler: [] },
      ...prev,
    ])
    setFaturaForm(EMPTY_FATURA)
    setYeniFaturaModal(false)
  }

  function stokGuncelle(idx) {
    const val = parseInt(stokInput, 10)
    if (isNaN(val) || val < 0) return
    setStoklar(prev => prev.map((u, i) => i === idx ? { ...u, stok: val } : u))
    setEditStokId(null)
    setStokInput('')
  }

  // ─── RENDER ────────────────────────────────────────────────

  return (
    <div className="adm-analitik">
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Muhasebe</h1>
          <p className="adm-page-sub">Gelir, gider, fatura ve stok maliyet yönetimi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="adm-tab-filters" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`adm-tab-filter${activeTab === t.id ? ' adm-tab-filter--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          TAB 1: GENEL BAKIŞ
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'genel' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Bu Ay Gelir', val: fmt(buAyGelir), color: C_GELIR },
              { label: 'Bu Ay Gider', val: fmt(buAyGider), color: C_GIDER },
              { label: 'Net Kâr', val: fmt(netKar), color: netKar >= 0 ? C_GELIR : C_GIDER },
              { label: 'KDV Borcu', val: fmt(kdvBorcu), color: C_AMBER },
            ].map((k, i) => (
              <div key={i} className="adm-status-card">
                <span className="adm-status-card__label">{k.label}</span>
                <div className="adm-status-card__val" style={{ color: k.color, fontSize: '1.4rem' }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">6 Aylık Gelir / Gider</p>
                <p className="adm-card-sub">Son 6 ay karşılaştırması</p>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: C_GELIR, display: 'inline-block' }} />
                  Gelir
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: C_GIDER, display: 'inline-block' }} />
                  Gider
                </span>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <svg viewBox={`0 0 ${AYLIK_VERI.length * 80} ${CHART_H + 36}`} style={{ width: '100%', overflow: 'visible' }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                  <line
                    key={i}
                    x1={0} y1={CHART_H * (1 - pct)}
                    x2={AYLIK_VERI.length * 80} y2={CHART_H * (1 - pct)}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                  />
                ))}
                {AYLIK_VERI.map((d, i) => {
                  const x = i * 80 + 10
                  const gelirH = Math.round((d.gelir / maxAylik) * CHART_H)
                  const giderH = Math.round((d.gider / maxAylik) * CHART_H)
                  const barW = 24
                  return (
                    <g key={i}>
                      {/* Gelir bar */}
                      <rect
                        x={x} y={CHART_H - gelirH}
                        width={barW} height={gelirH}
                        rx={3} fill={C_GELIR} opacity={0.9}
                      />
                      {/* Gider bar */}
                      <rect
                        x={x + barW + 4} y={CHART_H - giderH}
                        width={barW} height={giderH}
                        rx={3} fill={C_GIDER} opacity={0.85}
                      />
                      {/* Label */}
                      <text
                        x={x + barW} y={CHART_H + 18}
                        textAnchor="middle" fontSize={11}
                        fill="rgba(255,255,255,0.4)"
                      >
                        {d.ay}
                      </text>
                      {/* Gelir value */}
                      <text
                        x={x + barW / 2} y={CHART_H - gelirH - 5}
                        textAnchor="middle" fontSize={9}
                        fill={C_GELIR} opacity={0.8}
                      >
                        {(d.gelir / 1000).toFixed(1)}k
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Top Gider Kategorileri */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Bu Ay Gider Dağılımı</p>
                <p className="adm-card-sub">En yüksek 3 gider kalemi</p>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {GIDER_KATEGORI.map((g, i) => {
                const pct = Math.round((g.tutar / maxGiderKat) * 100)
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--adm-text-2)' }}>{g.ad}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: g.renk }}>{fmt(g.tutar)}</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: g.renk, borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginTop: 3, display: 'block' }}>%{pct} oranında</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 2: GELİR & GİDER
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'gelir' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Gelir & Gider Kayıtları</p>
                <p className="adm-card-sub">{filteredKayitlar.length} kayıt</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Filter */}
                <div className="adm-tab-filters" style={{ marginBottom: 0 }}>
                  {['', 'Gelir', 'Gider'].map(f => (
                    <button
                      key={f}
                      className={`adm-tab-filter${gelirGiderFilter === f ? ' adm-tab-filter--active' : ''}`}
                      onClick={() => setGelirGiderFilter(f)}
                      style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                    >
                      {f || 'Tümü'}
                    </button>
                  ))}
                </div>
                <button className="adm-btn" style={{ fontSize: '0.78rem' }} onClick={() => setKayitModal(true)}>
                  + Yeni Kayıt
                </button>
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Açıklama</th>
                    <th>Kategori</th>
                    <th>Tip</th>
                    <th>Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKayitlar.map((k) => (
                    <tr key={k.id} style={{ borderLeft: `3px solid ${k.tip === 'Gelir' ? 'rgba(255,215,100,0.3)' : 'rgba(196,127,58,0.35)'}` }}>
                      <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{k.tarih}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--adm-text)' }}>{k.aciklama}</td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{k.kategori}</td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                          color: k.tip === 'Gelir' ? C_GELIR : C_GIDER,
                          background: k.tip === 'Gelir' ? 'rgba(255,215,100,0.08)' : 'rgba(196,127,58,0.1)',
                          border: `1px solid ${k.tip === 'Gelir' ? 'rgba(255,215,100,0.2)' : 'rgba(196,127,58,0.25)'}`,
                        }}>
                          {k.tip}
                        </span>
                      </td>
                      <td>
                        <span className="adm-table-amount" style={{ color: k.tip === 'Gelir' ? C_GELIR : C_GIDER }}>
                          {k.tip === 'Gider' ? '-' : '+'}{fmt(k.tutar)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--adm-border)', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--adm-text-3)' }}>
                Toplam Gelir: <strong style={{ color: C_GELIR }}>{fmt(toplamGelir)}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--adm-text-3)' }}>
                Toplam Gider: <strong style={{ color: C_GIDER }}>{fmt(toplamGider)}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--adm-text-3)' }}>
                Net: <strong style={{ color: toplamGelir - toplamGider >= 0 ? C_GELIR : C_GIDER }}>
                  {fmt(toplamGelir - toplamGider)}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 3: FATURA TAKİBİ
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'fatura' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Fatura Listesi</p>
                <p className="adm-card-sub">{filteredFaturalar.length} fatura</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="adm-tab-filters" style={{ marginBottom: 0 }}>
                  {['', 'Ödendi', 'Bekliyor', 'İptal'].map(f => (
                    <button
                      key={f}
                      className={`adm-tab-filter${faturaDurumFilter === f ? ' adm-tab-filter--active' : ''}`}
                      onClick={() => setFaturaDurumFilter(f)}
                      style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                    >
                      {f || 'Tümü'}
                    </button>
                  ))}
                </div>
                <button className="adm-btn" style={{ fontSize: '0.78rem' }} onClick={() => setYeniFaturaModal(true)}>
                  + Yeni Fatura
                </button>
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Müşteri</th>
                    <th>Tarih</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaturalar.map((f, i) => {
                    const ds = DURUM_STYLE[f.durum] || {}
                    return (
                      <tr key={i}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{f.no}</td>
                        <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--adm-text)' }}>{f.musteri}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{f.tarih}</td>
                        <td><span className="adm-table-amount">{fmt(f.tutar)}</span></td>
                        <td>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                            color: ds.color, background: ds.bg, border: `1px solid ${ds.border}`,
                          }}>
                            {f.durum}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => setGoruntuleFatura(f)}
                              style={{
                                fontSize: '0.72rem', padding: '3px 10px', borderRadius: 4,
                                border: '1px solid var(--adm-border)', background: 'rgba(255,255,255,0.04)',
                                color: 'var(--adm-text-2)', cursor: 'pointer',
                              }}
                            >
                              Görüntüle
                            </button>
                            <button
                              onClick={() => printFatura(f)}
                              style={{
                                fontSize: '0.72rem', padding: '3px 10px', borderRadius: 4,
                                border: `1px solid ${C_GELIR}30`, background: `${C_GELIR}08`,
                                color: C_GELIR, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                              }}
                              title="PDF İndir / Yazdır"
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                <rect x="6" y="14" width="12" height="8"/>
                              </svg>
                              PDF
                            </button>
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

      {/* ══════════════════════════════════════════════════════════
          TAB 4: STOK & MALİYET
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'stok' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stok Değeri KPI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="adm-status-card">
              <span className="adm-status-card__label">Toplam Stok Değeri (Maliyet)</span>
              <div className="adm-status-card__val" style={{ color: 'var(--adm-gold)', fontSize: '1.4rem' }}>{fmt(toplamStokDegeri)}</div>
            </div>
            <div className="adm-status-card">
              <span className="adm-status-card__label">Toplam Ürün Çeşidi</span>
              <div className="adm-status-card__val" style={{ color: 'var(--adm-text)', fontSize: '1.4rem' }}>{stoklar.length}</div>
            </div>
            <div className="adm-status-card">
              <span className="adm-status-card__label">Kritik Stok (10 adet altı)</span>
              <div className="adm-status-card__val" style={{ color: C_GIDER, fontSize: '1.4rem' }}>
                {stoklar.filter(u => u.stok < 10).length} ürün
              </div>
            </div>
          </div>

          {/* Stok Tablosu */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Ürün Stok & Maliyet</p>
                <p className="adm-card-sub">Kâr marjı ve stok durumu</p>
              </div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Stok Adeti</th>
                    <th>Maliyet Fiyatı</th>
                    <th>Satış Fiyatı</th>
                    <th>Kâr Marjı %</th>
                    <th>Stok Durumu</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {stoklar.map((u, i) => {
                    const marj = Math.round(((u.satis - u.maliyet) / u.satis) * 100)
                    const maxStok = 100
                    const pct = Math.min(Math.round((u.stok / maxStok) * 100), 100)
                    const stokRenk = u.stok < 10 ? C_GIDER : u.stok < 25 ? C_AMBER : C_GELIR
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--adm-text)' }}>{u.urun}</td>
                        <td>
                          {editStokId === i ? (
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <input
                                type="number"
                                value={stokInput}
                                onChange={e => setStokInput(e.target.value)}
                                style={{ width: 64, fontSize: '0.78rem', padding: '3px 6px', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--adm-border)', borderRadius: 4, color: 'var(--adm-text)' }}
                                autoFocus
                              />
                              <button
                                onClick={() => stokGuncelle(i)}
                                style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: 4, border: 'none', background: C_GELIR, color: '#1a1000', cursor: 'pointer', fontWeight: 700 }}
                              >
                                OK
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600, color: stokRenk }}>{u.stok} adet</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-3)' }}>{fmt(u.maliyet)}</td>
                        <td><span className="adm-table-amount">{fmt(u.satis)}</span></td>
                        <td>
                          <span style={{
                            fontSize: '0.78rem', fontWeight: 700,
                            color: marj >= 60 ? C_GELIR : marj >= 40 ? C_AMBER : C_GIDER,
                          }}>
                            %{marj}
                          </span>
                        </td>
                        <td style={{ minWidth: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: stokRenk, borderRadius: 3, transition: 'width 0.4s' }} />
                            </div>
                            <span style={{ fontSize: '0.68rem', color: stokRenk, minWidth: 24 }}>{pct}%</span>
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => { setEditStokId(i); setStokInput(String(u.stok)) }}
                            style={{
                              fontSize: '0.7rem', padding: '3px 10px', borderRadius: 4,
                              border: '1px solid var(--adm-border)', background: 'rgba(255,255,255,0.04)',
                              color: 'var(--adm-text-2)', cursor: 'pointer',
                            }}
                          >
                            Stok Güncelle
                          </button>
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

      {/* ══════════════════════════════════════════════════════════
          MODAL: YENİ KAYIT
      ══════════════════════════════════════════════════════════ */}
      {kayitModal && (
        <Modal onClose={() => setKayitModal(false)} width={440}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 18 }}>Yeni Kayıt Ekle</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Açıklama</label>
              <input
                type="text" placeholder="Kayıt açıklaması..."
                value={kayitForm.aciklama}
                onChange={e => setKayitForm(p => ({ ...p, aciklama: e.target.value }))}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Kategori</label>
              <select
                value={kayitForm.kategori}
                onChange={e => setKayitForm(p => ({ ...p, kategori: e.target.value }))}
                style={INPUT_STYLE}
              >
                {KATEGORILER.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 6 }}>Tip</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Gelir', 'Gider'].map(t => (
                  <button
                    key={t}
                    onClick={() => setKayitForm(p => ({ ...p, tip: t }))}
                    style={{
                      flex: 1, padding: '7px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                      border: `1px solid ${kayitForm.tip === t ? (t === 'Gelir' ? 'rgba(255,215,100,0.35)' : 'rgba(196,127,58,0.35)') : 'var(--adm-border)'}`,
                      background: kayitForm.tip === t ? (t === 'Gelir' ? 'rgba(255,215,100,0.1)' : 'rgba(196,127,58,0.12)') : 'rgba(255,255,255,0.03)',
                      color: kayitForm.tip === t ? (t === 'Gelir' ? C_GELIR : C_GIDER) : 'var(--adm-text-3)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Tutar (₺)</label>
              <input
                type="number" placeholder="0.00"
                value={kayitForm.tutar}
                onChange={e => setKayitForm(p => ({ ...p, tutar: e.target.value }))}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Tarih</label>
              <input
                type="date"
                value={kayitForm.tarih}
                onChange={e => setKayitForm(p => ({ ...p, tarih: e.target.value }))}
                style={INPUT_STYLE}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button onClick={() => setKayitModal(false)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>İptal</button>
            <button onClick={kayitKaydet} className="adm-btn" style={{ fontSize: '0.8rem' }}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: FATURA GÖRÜNTÜLE
      ══════════════════════════════════════════════════════════ */}
      {goruntuleFatura && (
        <Modal onClose={() => setGoruntuleFatura(null)} width={480}>
          {/* Mini Invoice Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '20px 22px', border: '1px solid var(--adm-border)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--adm-gold)' }}>LAYDORA</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginTop: 2 }}>El Yapımı Mum & Doğal Kozmetik</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>Fatura No</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--adm-text)', fontFamily: 'monospace' }}>{goruntuleFatura.no}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--adm-text-3)', marginTop: 4 }}>{goruntuleFatura.tarih}</p>
              </div>
            </div>

            {/* Müşteri */}
            <div style={{ marginBottom: 16, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
              <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginBottom: 3 }}>FATURA KESİLEN</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--adm-text)' }}>{goruntuleFatura.musteri}</p>
            </div>

            {/* Kalemler */}
            {goruntuleFatura.kalemler.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px 12px', padding: '6px 0', borderBottom: '1px solid var(--adm-border)', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', fontWeight: 600 }}>ÜRÜN</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', fontWeight: 600, textAlign: 'right' }}>ADET</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', fontWeight: 600, textAlign: 'right' }}>TUTAR</span>
                </div>
                {goruntuleFatura.kalemler.map((k, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '4px 12px', padding: '4px 0' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-2)' }}>{k.ad}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-3)', textAlign: 'right' }}>{k.adet}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--adm-text)', textAlign: 'right' }}>{fmt(k.fiyat * k.adet)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Ara Toplam', val: fmt(Math.round(goruntuleFatura.tutar / 1.18)) },
                { label: 'KDV (%18)', val: fmt(goruntuleFatura.tutar - Math.round(goruntuleFatura.tutar / 1.18)) },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{r.label}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{r.val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--adm-border)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--adm-text)' }}>Genel Toplam</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--adm-gold)' }}>{fmt(goruntuleFatura.tutar)}</span>
              </div>
            </div>

            {/* Durum badge */}
            <div style={{ marginTop: 14, textAlign: 'right' }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 4,
                color: DURUM_STYLE[goruntuleFatura.durum]?.color,
                background: DURUM_STYLE[goruntuleFatura.durum]?.bg,
                border: `1px solid ${DURUM_STYLE[goruntuleFatura.durum]?.border}`,
              }}>
                {goruntuleFatura.durum}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={() => setGoruntuleFatura(null)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>Kapat</button>
            <button
              onClick={() => printFatura(goruntuleFatura)}
              className="adm-btn"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              PDF / Yazdır
            </button>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: YENİ FATURA
      ══════════════════════════════════════════════════════════ */}
      {yeniFaturaModal && (
        <Modal onClose={() => setYeniFaturaModal(false)} width={420}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 18 }}>Yeni Fatura Oluştur</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Müşteri Adı</label>
              <input
                type="text" placeholder="Müşteri adı..."
                value={faturaForm.musteri}
                onChange={e => setFaturaForm(p => ({ ...p, musteri: e.target.value }))}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Tarih</label>
              <input
                type="date"
                value={faturaForm.tarih}
                onChange={e => setFaturaForm(p => ({ ...p, tarih: e.target.value }))}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', display: 'block', marginBottom: 4 }}>Toplam Tutar (₺)</label>
              <input
                type="number" placeholder="0.00"
                value={faturaForm.tutar}
                onChange={e => setFaturaForm(p => ({ ...p, tutar: e.target.value }))}
                style={INPUT_STYLE}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button onClick={() => setYeniFaturaModal(false)} className="adm-ghost-btn" style={{ fontSize: '0.8rem' }}>İptal</button>
            <button onClick={faturaKaydet} className="adm-btn" style={{ fontSize: '0.8rem' }}>Fatura Oluştur</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

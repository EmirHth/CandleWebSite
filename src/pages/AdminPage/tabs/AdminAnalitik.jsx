import { useState } from 'react'

const PERIODS = ['7 Gün', '30 Gün', '3 Ay', '12 Ay']

const MONTHLY_SALES = [
  { month: 'Mar', revenue: 28400, orders: 184, visitors: 8900, views: 4200, addToCart: 1100, converted: 184 },
  { month: 'Nis', revenue: 32100, orders: 208, visitors: 9800, views: 4800, addToCart: 1250, converted: 208 },
  { month: 'May', revenue: 35800, orders: 231, visitors: 10500, views: 5100, addToCart: 1380, converted: 231 },
  { month: 'Haz', revenue: 29600, orders: 192, visitors: 9200, views: 4400, addToCart: 1150, converted: 192 },
  { month: 'Tem', revenue: 22300, orders: 144, visitors: 7800, views: 3700, addToCart: 920, converted: 144 },
  { month: 'Ağu', revenue: 19800, orders: 128, visitors: 7200, views: 3400, addToCart: 840, converted: 128 },
  { month: 'Eyl', revenue: 27500, orders: 178, visitors: 8600, views: 4100, addToCart: 1080, converted: 178 },
  { month: 'Eki', revenue: 33200, orders: 215, visitors: 9900, views: 4700, addToCart: 1280, converted: 215 },
  { month: 'Kas', revenue: 41800, orders: 271, visitors: 12200, views: 5900, addToCart: 1580, converted: 271 },
  { month: 'Ara', revenue: 58600, orders: 380, visitors: 17100, views: 8200, addToCart: 2200, converted: 380 },
  { month: 'Oca', revenue: 44200, orders: 286, visitors: 13000, views: 6200, addToCart: 1680, converted: 286 },
  { month: 'Şub', revenue: 48290, orders: 312, visitors: 14200, views: 6800, addToCart: 1840, converted: 312 },
]

const TOP_PRODUCTS = [
  { name: 'Gece Mumu', category: 'Soy Mum', views: 4820, addToCart: 1240, sold: 387, revenue: 111843, convRate: 8.0 },
  { name: 'Vanilya Serenity', category: 'Soy Mum', views: 3610, addToCart: 890, sold: 248, revenue: 63992, convRate: 6.9 },
  { name: 'Kış Mumu', category: 'Soy Mum', views: 3240, addToCart: 780, sold: 219, revenue: 56661, convRate: 6.8 },
  { name: 'Romantic Set', category: 'Set', views: 2890, addToCart: 620, sold: 164, revenue: 78244, convRate: 5.7 },
  { name: 'Bergamot Difüzör', category: 'Difüzör', views: 2440, addToCart: 520, sold: 138, revenue: 49428, convRate: 5.7 },
  { name: 'Gül Masaj Mumu', category: 'Masaj Mumu', views: 1980, addToCart: 380, sold: 94, revenue: 29986, convRate: 4.7 },
]

const CATEGORY_DATA = [
  { name: 'Soy Mum', revenue: 285000, percent: 59, color: 'var(--adm-gold)' },
  { name: 'Masaj Mumu', revenue: 87000, percent: 18, color: '#a78bfa' },
  { name: 'Set', revenue: 62000, percent: 13, color: '#60a5fa' },
  { name: 'Difüzör', revenue: 48000, percent: 10, color: '#34d399' },
]

const SEGMENT_DATA = [
  { seg: 'VIP', count: 124, revenue: 198400, clv: 1600, color: 'var(--adm-gold)' },
  { seg: 'Aktif', count: 312, revenue: 148320, clv: 475, color: '#34d399' },
  { seg: 'Yeni', count: 218, revenue: 62136, clv: 285, color: '#60a5fa' },
  { seg: 'Uyuyan', count: 186, revenue: 42780, clv: 230, color: '#fbbf24' },
  { seg: 'Kayıp', count: 98, revenue: 0, clv: 0, color: '#f87171' },
]

const ACQUISITION = [
  { source: 'Organik Arama', users: 4820, percent: 34 },
  { source: 'Sosyal Medya', users: 3610, percent: 25 },
  { source: 'Direkt', users: 2890, percent: 20 },
  { source: 'E-posta', users: 1440, percent: 10 },
  { source: 'Referans', users: 860, percent: 6 },
  { source: 'Diğer', users: 720, percent: 5 },
]

const FUNNEL_STEPS = [
  { label: 'Ziyaretçi', count: 14200, icon: '👥' },
  { label: 'Ürün Görüntüleme', count: 6800, icon: '👁️' },
  { label: 'Sepete Ekleme', count: 1840, icon: '🛒' },
  { label: 'Tamamlanan Sipariş', count: 312, icon: '✅' },
]

export default function AdminAnalitik() {
  const [period, setPeriod] = useState('30 Gün')
  const [activeTab, setActiveTab] = useState('genel')
  const [sortProduct, setSortProduct] = useState('revenue')

  const current = MONTHLY_SALES[MONTHLY_SALES.length - 1]
  const prev = MONTHLY_SALES[MONTHLY_SALES.length - 2]
  const maxRevenue = Math.max(...MONTHLY_SALES.map(m => m.revenue))

  const convRate = ((current.converted / current.visitors) * 100).toFixed(2)
  const avgOrder = Math.round(current.revenue / current.orders)

  const sortedProducts = [...TOP_PRODUCTS].sort((a, b) => b[sortProduct] - a[sortProduct])

  const TABS = [
    { id: 'genel', label: 'Genel Bakış' },
    { id: 'urunler', label: 'Ürün Performansı' },
    { id: 'musteriler', label: 'Müşteri & CRM' },
    { id: 'hunisi', label: 'Satış Hunisi' },
    { id: 'kampanya', label: 'Kampanya Motoru' },
    { id: 'finanaliz', label: 'Finansal Analiz' },
  ]

  const KpiChange = ({ val, suffix = '%', up }) => (
    <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: up ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: up ? '#34d399' : '#f87171' }}>
      {up ? '▲' : '▼'} {val}{suffix}
    </span>
  )

  return (
    <div className="adm-analitik">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Analitik</h1>
          <p className="adm-page-sub">KPI raporları, satış analizleri ve müşteri segmentasyonu</p>
        </div>
        <div className="adm-page-actions">
          <div className="adm-filter-pills">
            {PERIODS.map(p => (
              <button key={p} className={`adm-pill ${period === p ? 'adm-pill--active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <button className="adm-ghost-btn" style={{ fontSize: '0.75rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Rapor İndir
          </button>
        </div>
      </div>

      {/* KPI Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Toplam Gelir', val: `₺${current.revenue.toLocaleString('tr-TR')}`, change: 9.3, up: true },
          { label: 'Sipariş Sayısı', val: current.orders, change: 8.1, up: true },
          { label: 'Dönüşüm Oranı', val: `${convRate}%`, change: 0.4, up: true },
          { label: 'Ort. Sipariş Değeri', val: `₺${avgOrder.toLocaleString('tr-TR')}`, change: 2.8, up: true },
        ].map((k, i) => (
          <div key={i} className="adm-status-card">
            <div className="adm-status-card__top">
              <span className="adm-status-card__label">{k.label}</span>
            </div>
            <div className="adm-status-card__val" style={{ color: 'var(--adm-gold)', fontSize: '1.4rem' }}>{k.val}</div>
            <div className="adm-status-card__sub">
              <KpiChange val={k.change} up={k.up} /> vs önceki dönem
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="adm-tab-filters" style={{ marginBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.id} className={`adm-tab-filter ${activeTab === t.id ? 'adm-tab-filter--active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── GENEL BAKIŞ ─── */}
      {activeTab === 'genel' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Satış Grafiği */}
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">12 Aylık Satış Grafiği</p>
              <p className="adm-card-sub">Gelir ve sipariş adeti</p>
            </div>
            <div style={{ padding: '16px 16px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 140 }}>
                {MONTHLY_SALES.map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      {/* Orders bar (behind) */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: '25%', width: '50%',
                        height: `${(m.orders / Math.max(...MONTHLY_SALES.map(x => x.orders))) * 100}%`,
                        background: 'rgba(96,165,250,0.12)', borderRadius: '2px 2px 0 0',
                        border: '1px solid rgba(96,165,250,0.15)',
                      }} />
                      {/* Revenue bar */}
                      <div style={{
                        width: '70%', borderRadius: '3px 3px 0 0',
                        height: `${(m.revenue / maxRevenue) * 100}%`,
                        background: i === MONTHLY_SALES.length - 1
                          ? 'linear-gradient(180deg,rgba(240,174,50,0.9),rgba(210,140,50,0.6))'
                          : 'rgba(255,255,255,0.07)',
                        border: `1px solid ${i === MONTHLY_SALES.length - 1 ? 'rgba(240,174,50,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        position: 'relative', zIndex: 1,
                      }}>
                        {i === MONTHLY_SALES.length - 1 && (
                          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: '0.52rem', color: 'var(--adm-gold)', whiteSpace: 'nowrap', fontWeight: 700 }}>
                            ₺{(m.revenue/1000).toFixed(0)}k
                          </div>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.52rem', color: i === MONTHLY_SALES.length - 1 ? 'var(--adm-gold)' : 'var(--adm-text-3)', marginTop: 4 }}>{m.month}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 6, background: 'rgba(240,174,50,0.7)', borderRadius: 2 }} />
                  <span style={{ fontSize: '0.66rem', color: 'var(--adm-text-3)' }}>Gelir</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 6, background: 'rgba(96,165,250,0.3)', borderRadius: 2 }} />
                  <span style={{ fontSize: '0.66rem', color: 'var(--adm-text-3)' }}>Sipariş</span>
                </div>
              </div>
            </div>
          </div>

          {/* OKR Tablosu */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">OKR İzleme — Şubat 2026</p>
                <p className="adm-card-sub">Hedefler ve Anahtar Sonuçlar</p>
              </div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Hedef</th><th>Anahtar Sonuç</th><th>Hedef</th><th>Gerçekleşen</th><th style={{ width: 120 }}>İlerleme</th><th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { obj: 'Geliri Artır', kr: 'Aylık gelir hedefi', target: '₺60.000', actual: '₺48.290', pct: 80, rag: 'amber' },
                    { obj: 'Geliri Artır', kr: 'Yeni müşteri sayısı', target: '250', actual: '218', pct: 87, rag: 'green' },
                    { obj: 'Müşteri Memnuniyeti', kr: 'Ortalama puan', target: '4.8', actual: '4.6', pct: 96, rag: 'green' },
                    { obj: 'Müşteri Memnuniyeti', kr: 'İade oranı', target: '<%2', actual: '%3.1', pct: 40, rag: 'red' },
                    { obj: 'Dijital Büyüme', kr: 'Organik trafik artışı', target: '%30', actual: '%22', pct: 73, rag: 'amber' },
                    { obj: 'Dijital Büyüme', kr: 'Email açılma oranı', target: '%28', actual: '%31', pct: 100, rag: 'green' },
                  ].map((row, i) => {
                    const ragColor = row.rag === 'green' ? '#34d399' : row.rag === 'amber' ? '#fbbf24' : '#f87171'
                    const ragLabel = row.rag === 'green' ? 'Yeşil' : row.rag === 'amber' ? 'Amber' : 'Kırmızı'
                    return (
                      <tr key={i}>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{row.obj}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--adm-text)', fontWeight: 500 }}>{row.kr}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-3)' }}>{row.target}</td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--adm-text)' }}>{row.actual}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${Math.min(row.pct, 100)}%`, background: ragColor, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: '0.68rem', color: ragColor, minWidth: 28 }}>%{row.pct}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, color: ragColor, background: `${ragColor}18`, border: `1px solid ${ragColor}30` }}>
                            ● {ragLabel}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Kategori Dağılımı */}
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Kategori Gelir Dağılımı</p>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CATEGORY_DATA.map((c, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{c.name}</span>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-3)' }}>₺{c.revenue.toLocaleString('tr-TR')}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: c.color }}>%{c.percent}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.percent}%`, background: c.color, borderRadius: 3, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Müşteri Kazanım */}
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Müşteri Kazanım Kaynakları</p>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ACQUISITION.map((a, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{a.source}</span>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-3)' }}>{a.users.toLocaleString('tr-TR')} kullanıcı</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--adm-gold)' }}>%{a.percent}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${a.percent}%`, background: 'rgba(240,174,50,0.6)', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ÜRÜN PERFORMANSI ─── */}
      {activeTab === 'urunler' && (
        <div style={{ marginTop: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Ürün Performans Tablosu</p>
                <p className="adm-card-sub">Görüntülenme, sepete ekleme, satış ve dönüşüm</p>
              </div>
              <select className="adm-search" style={{ width: 170, padding: '6px 10px', fontSize: '0.78rem' }}
                value={sortProduct} onChange={e => setSortProduct(e.target.value)}>
                <option value="revenue">Gelir (Yüksek→Düşük)</option>
                <option value="sold">Satış Adeti</option>
                <option value="convRate">Dönüşüm Oranı</option>
                <option value="views">Görüntülenme</option>
              </select>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Görüntülenme</th>
                    <th>Sepete Ekleme</th>
                    <th>Satış</th>
                    <th>Dönüşüm</th>
                    <th>Gelir</th>
                    <th>Performans</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((p, i) => {
                    const cartRate = ((p.addToCart / p.views) * 100).toFixed(1)
                    const maxRevP = TOP_PRODUCTS.reduce((m, x) => Math.max(m, x.revenue), 0)
                    return (
                      <tr key={i}>
                        <td>
                          <div>
                            <p className="adm-product-name">{p.name}</p>
                            <span className="adm-cat-tag">{p.category}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--adm-text-3)', fontSize: '0.8rem' }}>{p.views.toLocaleString('tr-TR')}</td>
                        <td>
                          <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-2)' }}>{p.addToCart.toLocaleString('tr-TR')}</p>
                            <p style={{ fontSize: '0.63rem', color: 'var(--adm-text-3)' }}>%{cartRate} görüntülenme</p>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.82rem' }}>{p.sold.toLocaleString('tr-TR')}</span>
                        </td>
                        <td>
                          <span style={{
                            fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                            background: p.convRate >= 7 ? 'rgba(52,211,153,0.1)' : p.convRate >= 5 ? 'rgba(240,174,50,0.1)' : 'rgba(248,113,113,0.08)',
                            color: p.convRate >= 7 ? '#34d399' : p.convRate >= 5 ? 'var(--adm-gold)' : '#f87171',
                          }}>%{p.convRate}</span>
                        </td>
                        <td><span className="adm-table-amount">₺{p.revenue.toLocaleString('tr-TR')}</span></td>
                        <td>
                          <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(p.revenue / maxRevP) * 100}%`, background: 'var(--adm-gold)', borderRadius: 3 }} />
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

      {/* ─── MÜŞTERİ ANALİZİ ─── */}
      {activeTab === 'musteriler' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Müşteri Segmentasyonu</p>
              <p className="adm-card-sub">Harcama ve sipariş geçmişine göre</p>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Segment</th>
                    <th>Müşteri Sayısı</th>
                    <th>Toplam Gelir</th>
                    <th>Ort. CLV</th>
                    <th>Gelir Payı</th>
                  </tr>
                </thead>
                <tbody>
                  {SEGMENT_DATA.map((s, i) => {
                    const totalRev = SEGMENT_DATA.reduce((a, x) => a + x.revenue, 0)
                    const revPercent = totalRev > 0 ? ((s.revenue / totalRev) * 100).toFixed(1) : 0
                    return (
                      <tr key={i}>
                        <td>
                          <span style={{ fontSize: '0.76rem', fontWeight: 600, padding: '3px 10px', borderRadius: 5, color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                            {s.seg}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--adm-text)' }}>{s.count}</td>
                        <td><span className="adm-table-amount">{s.revenue > 0 ? `₺${s.revenue.toLocaleString('tr-TR')}` : '—'}</span></td>
                        <td style={{ color: s.clv > 0 ? 'var(--adm-gold)' : 'var(--adm-text-3)', fontWeight: s.clv > 0 ? 600 : 400 }}>
                          {s.clv > 0 ? `₺${s.clv.toLocaleString('tr-TR')}` : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                              <div style={{ height: '100%', width: `${revPercent}%`, background: s.color, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', width: 28 }}>%{revPercent}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RFM Analizi */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">RFM Analizi</p>
                <p className="adm-card-sub">Recency · Frequency · Monetary — Müşteri segment puanları</p>
              </div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Segment</th><th>Müşteri</th><th>Recency (gün)</th><th>Frequency</th><th>Monetary</th><th>RFM Skoru</th></tr>
                </thead>
                <tbody>
                  {[
                    { seg: 'Champions', count: 68, recency: 7, freq: 12, monetary: '₺2.840', score: '5-5-5', color: '#34d399' },
                    { seg: 'Loyal Customers', count: 124, recency: 18, freq: 7, monetary: '₺1.420', score: '4-4-4', color: '#60a5fa' },
                    { seg: 'Potential Loyalists', count: 89, recency: 24, freq: 4, monetary: '₺820', score: '4-3-3', color: 'var(--adm-gold)' },
                    { seg: 'At Risk', count: 143, recency: 62, freq: 3, monetary: '₺540', score: '2-3-2', color: '#fbbf24' },
                    { seg: 'Hibernating', count: 186, recency: 120, freq: 2, monetary: '₺310', score: '1-2-2', color: '#9ca3af' },
                    { seg: 'Lost Customers', count: 98, recency: 240, freq: 1, monetary: '₺180', score: '1-1-1', color: '#f87171' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: 5, color: r.color, background: `${r.color}18`, border: `1px solid ${r.color}25` }}>
                          {r.seg}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--adm-text)' }}>{r.count}</td>
                      <td style={{ fontSize: '0.8rem', color: r.recency < 30 ? '#34d399' : r.recency < 90 ? 'var(--adm-gold)' : '#f87171' }}>{r.recency} gün</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-2)' }}>×{r.freq}</td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--adm-gold)' }}>{r.monetary}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: r.color }}>{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cohort Retention */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Cohort Retention Analizi</p>
                <p className="adm-card-sub">Aylık müşteri kohortları — retention yüzdesi</p>
              </div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Kohort</th><th>Müşteri</th>
                    {['Ay 0', 'Ay 1', 'Ay 2', 'Ay 3', 'Ay 4', 'Ay 5'].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cohort: 'Eyl 2025', size: 218, ret: [100, 42, 31, 28, 24, 21] },
                    { cohort: 'Eki 2025', size: 271, ret: [100, 44, 33, 29, 26, null] },
                    { cohort: 'Kas 2025', size: 312, ret: [100, 46, 35, 31, null, null] },
                    { cohort: 'Ara 2025', size: 380, ret: [100, 48, 36, null, null, null] },
                    { cohort: 'Oca 2026', size: 286, ret: [100, 51, null, null, null, null] },
                    { cohort: 'Şub 2026', size: 218, ret: [100, null, null, null, null, null] },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)', whiteSpace: 'nowrap' }}>{row.cohort}</td>
                      <td style={{ fontWeight: 600, color: 'var(--adm-text)' }}>{row.size}</td>
                      {row.ret.map((v, j) => (
                        <td key={j} style={{ textAlign: 'center' }}>
                          {v !== null ? (
                            <span style={{
                              fontSize: '0.75rem', fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                              color: v === 100 ? 'var(--adm-text)' : v >= 40 ? '#34d399' : v >= 25 ? 'var(--adm-gold)' : '#f87171',
                              background: v === 100 ? 'rgba(255,255,255,0.08)' : v >= 40 ? 'rgba(52,211,153,0.1)' : v >= 25 ? 'rgba(240,174,50,0.1)' : 'rgba(248,113,113,0.1)',
                            }}>%{v}</span>
                          ) : <span style={{ color: 'var(--adm-text-3)', fontSize: '0.7rem' }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Müşteri Kazanım & Kayıp</p>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Yeni Müşteri (Bu Ay)', val: 218, color: '#60a5fa', icon: '▲' },
                  { label: 'Geri Dönen Müşteri', val: 94, color: '#34d399', icon: '↩' },
                  { label: 'Uyuyan (Son 90 Gün)', val: 186, color: '#fbbf24', icon: '⏸' },
                  { label: 'Kaybedilen Müşteri', val: 98, color: '#f87171', icon: '▼' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--adm-border)' : 'none' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{item.icon} {item.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: item.color }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Müşteri Sadakat Oranı</p>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '1 Sipariş', val: '51%', color: '#60a5fa', w: 51 },
                  { label: '2–3 Sipariş', val: '28%', color: '#34d399', w: 28 },
                  { label: '4–6 Sipariş', val: '14%', color: 'var(--adm-gold)', w: 14 },
                  { label: '7+ Sipariş', val: '7%', color: '#a78bfa', w: 7 },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)' }}>{item.label}</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 600, color: item.color }}>{item.val}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.w}%`, background: item.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── KAMPANYA MOTORU ─── */}
      {activeTab === 'kampanya' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Otomasyon Kuralları */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Otomasyon Kuralları</p>
                <p className="adm-card-sub">Tetikleyici tabanlı kampanya otomasyonu</p>
              </div>
              <button className="adm-btn" style={{ fontSize: '0.78rem' }}>+ Yeni Kural</button>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Kural Adı</th><th>Tetikleyici</th><th>Aksiyon</th><th>Gecikme</th><th>Durum</th><th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sepet Terk Hatırlatması', trigger: 'Sepet Terk', action: 'E-posta (Kupon)', delay: '2 saat', active: true },
                    { name: 'Doğum Günü Sürprizi', trigger: 'Doğum Günü', action: 'E-posta + %15 Kupon', delay: '1 gün önce', active: true },
                    { name: 'İlk Alışveriş Teşekkürü', trigger: 'İlk Sipariş', action: 'E-posta', delay: 'Anlık', active: true },
                    { name: 'Pasif Müşteri Aktivasyonu', trigger: '90 Gün Sessiz', action: 'SMS + Push', delay: 'Anlık', active: false },
                    { name: 'VIP Müşteri Özel Teklif', trigger: '5+ Sipariş', action: 'E-posta + %20 Kupon', delay: '1 gün', active: true },
                  ].map((rule, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--adm-text)' }}>{rule.name}</td>
                      <td><span style={{ fontSize: '0.73rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--adm-text-2)' }}>{rule.trigger}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{rule.action}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{rule.delay}</td>
                      <td>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, color: rule.active ? '#34d399' : 'var(--adm-text-3)', background: rule.active ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)' }}>
                          {rule.active ? '● Aktif' : '○ Pasif'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['Düzenle', 'Sil'].map(a => (
                            <button key={a} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--adm-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--adm-text-3)', cursor: 'pointer' }}>{a}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* A/B Test + Kampanya Performansı */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">A/B Test Sonuçları</p>
              </div>
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { name: 'Konu Satırı Testi', varA: 'Kış İndirimi: %30', varB: 'Bugün Son Gün!', convA: 4.2, convB: 6.8, trafficA: 50, trafficB: 50, winner: 'B' },
                  { name: 'CTA Rengi Testi', varA: 'Altın Buton', varB: 'Beyaz Buton', convA: 3.1, convB: 2.8, trafficA: 50, trafficB: 50, winner: 'A' },
                ].map((test, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '12px 16px' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--adm-text)', marginBottom: 10 }}>{test.name}</p>
                    {[{ label: 'A', text: test.varA, conv: test.convA }, { label: 'B', text: test.varB, conv: test.convB }].map(v => (
                      <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, width: 18, height: 18, borderRadius: 4, background: test.winner === v.label ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)', color: test.winner === v.label ? '#34d399' : 'var(--adm-text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{v.label}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-2)', flex: 1 }}>{v.text}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: test.winner === v.label ? '#34d399' : 'var(--adm-text-3)' }}>%{v.conv}</span>
                        {test.winner === v.label && <span style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(52,211,153,0.15)', color: '#34d399', fontWeight: 700 }}>KAZANAN</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Kampanya Performansı (Son 30 Gün)</p>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Kampanya</th><th>Gönderim</th><th>Açılma</th><th>Tıklama</th><th>Dönüşüm</th></tr></thead>
                  <tbody>
                    {[
                      { name: 'Şubat İndirimi', sent: 4820, open: '38%', click: '12%', conv: '4.2%' },
                      { name: 'Yeni Koleksiyon', sent: 4820, open: '31%', click: '9%', conv: '3.1%' },
                      { name: 'VIP Teklif', sent: 624, open: '62%', click: '28%', conv: '18.4%' },
                      { name: 'Sepet Hatırlatma', sent: 312, open: '71%', click: '34%', conv: '22.1%' },
                    ].map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--adm-text)' }}>{c.name}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{c.sent.toLocaleString('tr-TR')}</td>
                        <td style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600 }}>{c.open}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-gold)', fontWeight: 600 }}>{c.click}</td>
                        <td style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>{c.conv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FİNANSAL ANALİZ ─── */}
      {activeTab === 'finanaliz' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPI Kartları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Brüt Kâr Marjı', val: '%62.4', color: '#34d399', sub: 'Gelir − COGS' },
              { label: 'Net Kâr Marjı', val: '%28.1', color: 'var(--adm-gold)', sub: 'Tüm giderler sonrası' },
              { label: 'EBITDA', val: '₺13.570', color: '#a78bfa', sub: 'Şubat 2026' },
            ].map((k, i) => (
              <div key={i} className="adm-status-card">
                <span className="adm-status-card__label">{k.label}</span>
                <div className="adm-status-card__val" style={{ color: k.color, fontSize: '1.4rem' }}>{k.val}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Maliyet Dağılımı */}
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Maliyet Dağılımı</p>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Malzeme & Üretim', pct: 38, val: '₺18.350', color: '#f87171' },
                  { label: 'Kargo & Lojistik', pct: 14, val: '₺6.760', color: '#fbbf24' },
                  { label: 'Pazarlama & Reklam', pct: 12, val: '₺5.795', color: '#60a5fa' },
                  { label: 'Genel Giderler', pct: 8, val: '₺3.863', color: '#a78bfa' },
                ].map((c, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{c.label}</span>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-3)' }}>{c.val}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: c.color }}>%{c.pct}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Başabaş Analizi */}
            <div className="adm-card">
              <div className="adm-card-header">
                <p className="adm-card-title">Başabaş Analizi</p>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Sabit Maliyetler', val: '₺12.400 / ay' },
                  { label: 'Değişken Maliyet (birim)', val: '₺112' },
                  { label: 'Ortalama Satış Fiyatı', val: '₺296' },
                  { label: 'Katkı Payı', val: '₺184 / adet' },
                  { label: 'BEP Sipariş Adeti', val: '68 adet / ay', highlight: true },
                  { label: 'BEP Geliri', val: '₺20.128 / ay', highlight: true },
                  { label: 'Mevcut Performans', val: '312 adet / ₺48.290', green: true },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < 6 ? '1px solid var(--adm-border)' : 'none' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{row.label}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: row.highlight || row.green ? 700 : 500, color: row.green ? '#34d399' : row.highlight ? 'var(--adm-gold)' : 'var(--adm-text-2)' }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ürün Bazlı Kârlılık */}
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Ürün Bazlı Kârlılık Tablosu</p>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Ürün</th><th>Gelir</th><th>COGS</th><th>Brüt Kâr</th><th>Marj %</th><th>Kârlılık</th></tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Gece Mumu', revenue: 111843, cogs: 38044, margin: 66 },
                    { name: 'Vanilya Serenity', revenue: 63992, cogs: 23037, margin: 64 },
                    { name: 'Kış Mumu', revenue: 56661, cogs: 21931, margin: 61 },
                    { name: 'Romantic Set', revenue: 78244, cogs: 35210, margin: 55 },
                    { name: 'Bergamot Difüzör', revenue: 49428, cogs: 19771, margin: 60 },
                  ].map((p, i) => {
                    const gp = p.revenue - p.cogs
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--adm-text)' }}>{p.name}</td>
                        <td><span className="adm-table-amount">₺{p.revenue.toLocaleString('tr-TR')}</span></td>
                        <td style={{ fontSize: '0.8rem', color: '#f87171' }}>₺{p.cogs.toLocaleString('tr-TR')}</td>
                        <td style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>₺{gp.toLocaleString('tr-TR')}</td>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 5, color: p.margin >= 65 ? '#34d399' : p.margin >= 55 ? 'var(--adm-gold)' : '#fbbf24', background: 'rgba(255,255,255,0.05)' }}>
                            %{p.margin}
                          </span>
                        </td>
                        <td>
                          <div style={{ width: 80, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${p.margin}%`, background: p.margin >= 65 ? '#34d399' : 'var(--adm-gold)', borderRadius: 3 }} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 12 Aylık Nakit Akışı */}
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">12 Aylık Nakit Akışı</p>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Ay</th><th>Giriş</th><th>Çıkış</th><th>Net Akış</th><th>Kümülatif</th></tr>
                </thead>
                <tbody>
                  {MONTHLY_SALES.map((m, i) => {
                    const outflow = Math.round(m.revenue * 0.38)
                    const net = m.revenue - outflow
                    const cumulative = MONTHLY_SALES.slice(0, i + 1).reduce((s, x) => s + x.revenue - Math.round(x.revenue * 0.38), 0)
                    return (
                      <tr key={i}>
                        <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)', fontWeight: i === MONTHLY_SALES.length - 1 ? 700 : 400 }}>{m.month}</td>
                        <td style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>₺{m.revenue.toLocaleString('tr-TR')}</td>
                        <td style={{ fontSize: '0.8rem', color: '#f87171' }}>₺{outflow.toLocaleString('tr-TR')}</td>
                        <td style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--adm-gold)' }}>₺{net.toLocaleString('tr-TR')}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-2)' }}>₺{cumulative.toLocaleString('tr-TR')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SATIŞ HUNİSİ ─── */}
      {activeTab === 'hunisi' && (
        <div style={{ marginTop: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Satış Hunisi (Şubat 2026)</p>
              <p className="adm-card-sub">Ziyaretçiden tamamlanan siparişe</p>
            </div>
            <div style={{ padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {FUNNEL_STEPS.map((step, i) => {
                const pct = i === 0 ? 100 : Math.round((step.count / FUNNEL_STEPS[0].count) * 100)
                const dropRate = i > 0 ? (100 - Math.round((step.count / FUNNEL_STEPS[i - 1].count) * 100)) : null
                const colors = ['rgba(240,174,50,0.25)', 'rgba(96,165,250,0.2)', 'rgba(52,211,153,0.15)', 'rgba(167,139,250,0.2)']
                const textColors = ['var(--adm-gold)', '#60a5fa', '#34d399', '#a78bfa']
                return (
                  <div key={i}>
                    <div style={{
                      background: colors[i], border: `1px solid ${textColors[i]}30`,
                      borderRadius: 10, padding: '14px 20px',
                      display: 'flex', alignItems: 'center', gap: 16,
                      marginBottom: 0,
                      clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--adm-text)' }}>{step.label}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', marginTop: 2 }}>
                          {step.count.toLocaleString('tr-TR')} kişi
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: textColors[i] }}>%{pct}</p>
                        {dropRate !== null && (
                          <p style={{ fontSize: '0.65rem', color: '#f87171', marginTop: 2 }}>-%{dropRate} düşüş</p>
                        )}
                      </div>
                    </div>
                    {i < FUNNEL_STEPS.length - 1 && (
                      <div style={{ textAlign: 'center', padding: '4px 0' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--adm-text-3)" strokeWidth="1.5" strokeLinecap="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: '0 40px 20px' }}>
              {[
                { label: 'Görüntülenme → Sepet', val: `%${((FUNNEL_STEPS[2].count / FUNNEL_STEPS[1].count) * 100).toFixed(1)}`, sub: 'Ürün ilgi oranı' },
                { label: 'Sepet → Sipariş', val: `%${((FUNNEL_STEPS[3].count / FUNNEL_STEPS[2].count) * 100).toFixed(1)}`, sub: 'Tamamlama oranı' },
                { label: 'Genel Dönüşüm', val: `%${((FUNNEL_STEPS[3].count / FUNNEL_STEPS[0].count) * 100).toFixed(2)}`, sub: 'Ziyaretçiden sipariş' },
              ].map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--adm-gold)' }}>{m.val}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--adm-text-2)', marginTop: 3 }}>{m.label}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', marginTop: 2 }}>{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import products from '../../../data/products'

/* ══════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════ */
const KPI_STATS = [
  {
    id: 'gelir',
    label: 'Toplam Gelir',
    value: '₺48.290',
    change: '+12.4%',
    up: true,
    sub: 'geçen aya göre',
    sparkline: [22, 28, 24, 35, 30, 42, 38, 48, 44, 56, 52, 60],
    color: '#f0ae32',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: 'siparis',
    label: 'Toplam Sipariş',
    value: '312',
    change: '+8.1%',
    up: true,
    sub: 'geçen aya göre',
    sparkline: [18, 22, 20, 28, 24, 30, 26, 34, 30, 38, 34, 42],
    color: '#60a5fa',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    id: 'kullanici',
    label: 'Aktif Müşteri',
    value: '1.840',
    change: '+5.3%',
    up: true,
    sub: 'geçen aya göre',
    sparkline: [80, 85, 82, 90, 88, 95, 92, 98, 96, 102, 100, 108],
    color: '#a78bfa',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'sepet',
    label: 'Ort. Sepet Değeri',
    value: '₺154',
    change: '+3.8%',
    up: true,
    sub: 'geçen aya göre',
    sparkline: [120, 130, 125, 140, 135, 145, 142, 150, 148, 155, 152, 158],
    color: '#34d399',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
]

const MONTHLY_REVENUE = [
  { month: 'Mar', val: 32000 },
  { month: 'Nis', val: 28500 },
  { month: 'May', val: 38200 },
  { month: 'Haz', val: 35800 },
  { month: 'Tem', val: 42100 },
  { month: 'Ağu', val: 46300 },
  { month: 'Eyl', val: 40700 },
  { month: 'Eki', val: 53200 },
  { month: 'Kas', val: 58900 },
  { month: 'Ara', val: 69400 },
  { month: 'Oca', val: 44100 },
  { month: 'Şub', val: 48290 },
]

const TOP_PRODUCTS = [
  { id: 2, name: 'Kış Mumu', category: 'Soy Mum', sales: 218, revenue: 56462, share: 100, image: '/images/kis-mumu.jpg' },
  { id: 10, name: 'Sarı & Turuncu', category: 'Soy Mum', sales: 203, revenue: 50547, share: 93, image: '/images/sari-turuncu.jpg' },
  { id: 4, name: 'Deniz Mumu', category: 'Soy Mum', sales: 156, revenue: 38844, share: 72, image: '/images/deniz-mumu.jpg' },
  { id: 1, name: 'Gece Mumu', category: 'Soy Mum', sales: 124, revenue: 35836, share: 57, image: '/images/gece-mumu.jpg' },
  { id: 6, name: 'Hibiskus Mumu', category: 'Soy Mum', sales: 95, revenue: 25555, share: 44, image: '/images/hibiskus.png' },
]

const ACTIVITY = [
  { icon: '🛍️', title: 'Yeni sipariş alındı', desc: '#LYD-2026-0390 — Zeynep Arslan · ₺847', time: '2 dk', color: '#60a5fa' },
  { icon: '👤', title: 'Yeni üye kaydı', desc: 'Fatma Yılmaz hesap oluşturdu', time: '14 dk', color: '#a78bfa' },
  { icon: '📦', title: 'Sipariş kargoya verildi', desc: '#LYD-2026-0388 — Mehmet K.', time: '1 sa', color: '#34d399' },
  { icon: '⚠️', title: 'Stok uyarısı', desc: 'Kış Akşamı Mumu stoku tükendi', time: '2 sa', color: '#f87171' },
  { icon: '✅', title: 'Sipariş teslim edildi', desc: '#LYD-2026-0386 — Can Yıldız', time: '3 sa', color: '#34d399' },
  { icon: '💬', title: 'Yeni ürün yorumu', desc: 'Gece Mumu — ⭐⭐⭐⭐⭐ "Muhteşem!"', time: '4 sa', color: '#f0ae32' },
  { icon: '↩️', title: 'İade talebi', desc: '#LYD-2026-0381 — Ali K. · ₺289', time: '5 sa', color: '#fbbf24' },
]

const LOW_STOCK = products
  .filter(p => !p.inStock)
  .concat([{ id: 99, name: 'Kış Akşamı', category: 'Masaj Mumu', image: '/images/kis-aksami.jpg', inStock: false }])
  .slice(0, 4)
  .map((p, i) => ({ ...p, stock: [0, 0, 2, 3][i] ?? 0 }))

const CATEGORY_DATA = [
  { label: 'Soy Mum', value: 68, color: '#f0ae32' },
  { label: 'Masaj Mumu', value: 15, color: '#a78bfa' },
  { label: 'Difüzör', value: 10, color: '#60a5fa' },
  { label: 'Set', value: 7, color: '#34d399' },
]

const RECENT_ORDERS = [
  { id: '#LYD-0390', customer: 'Zeynep Arslan', amount: '₺847', status: 'hazırlanıyor' },
  { id: '#LYD-0389', customer: 'Mehmet Kaya', amount: '₺319', status: 'kargoda' },
  { id: '#LYD-0388', customer: 'Selin Tekin', amount: '₺638', status: 'kargoda' },
  { id: '#LYD-0387', customer: 'Can Yıldız', amount: '₺289', status: 'teslim edildi' },
  { id: '#LYD-0386', customer: 'Elif Demir', amount: '₺1.192', status: 'teslim edildi' },
]

const FUNNEL = [
  { label: 'Ziyaretçi', val: 12480, pct: 100, color: '#60a5fa' },
  { label: 'Ürün Görüntüleme', val: 6240, pct: 50, color: '#a78bfa' },
  { label: 'Sepete Ekleme', val: 1872, pct: 15, color: '#f0ae32' },
  { label: 'Sipariş Tamamlama', val: 399, pct: 3.2, color: '#34d399' },
]

const STATUS_COLORS = {
  'teslim edildi': 'adm-status--delivered',
  'kargoda': 'adm-status--shipping',
  'hazırlanıyor': 'adm-status--preparing',
}

/* ══════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════ */
function Sparkline({ data, color }) {
  const w = 80, h = 28
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')
  const areaPath = `M0,${h} ${data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `L${x},${y}`
  }).join(' ')} L${w},${h} Z`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function RevenueChart({ data }) {
  const w = 600, h = 150
  const maxVal = Math.max(...data.map(d => d.val))
  const pts = data.map((d, i) => {
    const x = 20 + (i / (data.length - 1)) * (w - 40)
    const y = 14 + (1 - d.val / maxVal) * (h - 36)
    return { x, y, ...d }
  })
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length-1].x},${h-20} L${pts[0].x},${h-20} Z`

  return (
    <div className="adm-revenue-chart-wrap" style={{ height: 150 }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="adm-revenue-svg">
        <defs>
          <linearGradient id="rev-grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0ae32" stopOpacity="0.28"/>
            <stop offset="100%" stopColor="#f0ae32" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i}
            x1="20" y1={14 + t * (h - 36)}
            x2={w - 20} y2={14 + t * (h - 36)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#rev-grad2)"/>
        <path d={linePath} fill="none" stroke="#f0ae32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#f0ae32" opacity="0.65"/>
        ))}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={h - 5} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="Jost,sans-serif">
            {p.month}
          </text>
        ))}
      </svg>
    </div>
  )
}

function DonutChart({ data }) {
  const size = 110, strokeW = 18, r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  let offset = 0
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="adm-donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW}/>
        {data.map((d, i) => {
          const dash = (d.value / total) * circ
          const seg = (
            <circle key={i}
              cx={size/2} cy={size/2} r={r}
              fill="none" stroke={d.color}
              strokeWidth={strokeW - 2}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size/2} ${size/2})`}
              opacity="0.88"
            />
          )
          offset += dash
          return seg
        })}
        <text x={size/2} y={size/2 - 6} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Jost,sans-serif" fontWeight="700">100%</text>
        <text x={size/2} y={size/2 + 9} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="7.5" fontFamily="Jost,sans-serif" letterSpacing="0.08em">SATIŞ</text>
      </svg>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const GOAL_AMOUNT = 60000
const CURRENT_AMOUNT = 48290
const GOAL_PCT = Math.round((CURRENT_AMOUNT / GOAL_AMOUNT) * 100)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [period, setPeriod] = useState('30g')

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Günaydın'
    if (h < 18) return 'İyi öğleden sonralar'
    return 'İyi akşamlar'
  }

  return (
    <div className="adm-dashboard">

      {/* ── Welcome Banner ── */}
      <div className="adm-welcome">
        <div className="adm-welcome__left">
          <h2 className="adm-welcome__greeting">
            {greeting()}, {user?.firstName || 'Admin'} 👋
          </h2>
          <p className="adm-welcome__sub">
            Bugün Laydora'da <strong style={{ color: 'var(--adm-gold)' }}>12 yeni sipariş</strong>, <strong style={{ color: '#34d399' }}>₺4.280 gelir</strong> ve <strong style={{ color: '#a78bfa' }}>3 yeni üye</strong> var.
            Stok uyarısı için kontrol edin.
          </p>
        </div>
        <div className="adm-welcome__today">
          <div className="adm-today-stat">
            <span className="adm-today-stat__val">12</span>
            <span className="adm-today-stat__label">Bugün Sipariş</span>
          </div>
          <div className="adm-today-stat">
            <span className="adm-today-stat__val">₺4.280</span>
            <span className="adm-today-stat__label">Bugün Gelir</span>
          </div>
          <div className="adm-today-stat">
            <span className="adm-today-stat__val">3</span>
            <span className="adm-today-stat__label">Yeni Üye</span>
          </div>
        </div>
      </div>

      {/* ── Period Selector ── */}
      <div className="adm-dashboard-meta">
        <div className="adm-period-tabs">
          {['7g', '30g', '3a', '12a'].map(p => (
            <button
              key={p}
              className={`adm-period-tab ${period === p ? 'adm-period-tab--active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === '7g' ? '7 Gün' : p === '30g' ? '30 Gün' : p === '3a' ? '3 Ay' : '12 Ay'}
            </button>
          ))}
        </div>
        <span className="adm-dashboard-date">Şubat 2026</span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="adm-kpi-grid">
        {KPI_STATS.map(stat => (
          <div key={stat.id} className="adm-kpi-card" style={{ '--kpi-color': stat.color }}>
            <div className="adm-kpi-card__header">
              <p className="adm-kpi-card__label">{stat.label}</p>
              <div className="adm-kpi-card__icon">{stat.icon}</div>
            </div>
            <p className="adm-kpi-card__value">{stat.value}</p>
            <div className="adm-kpi-card__footer">
              <span className="adm-kpi-card__sub">{stat.sub}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span className={`adm-kpi-card__change ${stat.up ? 'adm-kpi-up' : 'adm-kpi-down'}`}>
                  {stat.up ? '↑' : '↓'} {stat.change}
                </span>
                <Sparkline data={stat.sparkline} color={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue Chart + Category ── */}
      <div className="adm-row adm-row--7-3">
        <div className="adm-card adm-card--chart">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Aylık Gelir Performansı</h2>
              <p className="adm-card-sub">Son 12 ay kümülatif gelir grafiği</p>
            </div>
            <div className="adm-chart-total">
              <span className="adm-chart-total__val">₺48.290</span>
              <span className="adm-chart-total__change adm-kpi-up">↑ 12.4%</span>
            </div>
          </div>
          <RevenueChart data={MONTHLY_REVENUE} />
        </div>

        <div className="adm-card">
          <div className="adm-card-header">
            <h2 className="adm-card-title">Kategori Dağılımı</h2>
          </div>
          <div className="adm-category-chart">
            <DonutChart data={CATEGORY_DATA} />
            <div className="adm-category-legend">
              {CATEGORY_DATA.map(d => (
                <div key={d.label} className="adm-legend-item">
                  <span className="adm-legend-dot" style={{ background: d.color }} />
                  <span className="adm-legend-label">{d.label}</span>
                  <span className="adm-legend-val">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Monthly Goal + Funnel ── */}
      <div className="adm-row adm-row--2">
        <div className="adm-card adm-card--gold">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Aylık Hedef</h2>
              <p className="adm-card-sub">Şubat 2026 satış hedefi</p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--adm-gold)' }}>
              %{GOAL_PCT}
            </span>
          </div>
          <div className="adm-goal-bar-track">
            <div className="adm-goal-bar-fill" style={{ width: `${GOAL_PCT}%` }} />
          </div>
          <div className="adm-goal-meta">
            <span style={{ color: 'var(--adm-text-3)' }}>₺{CURRENT_AMOUNT.toLocaleString('tr-TR')} / ₺{GOAL_AMOUNT.toLocaleString('tr-TR')}</span>
            <span style={{ color: '#34d399' }}>Hedefe ₺{(GOAL_AMOUNT - CURRENT_AMOUNT).toLocaleString('tr-TR')} kaldı</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
            {[
              { label: 'Tamamlanan', val: `%${GOAL_PCT}`, c: 'var(--adm-gold)' },
              { label: 'Kalan Hedef', val: '₺11.710', c: '#60a5fa' },
              { label: 'Günlük Ort.', val: '₺1.724', c: '#34d399' },
            ].map((m, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid var(--adm-border)',
                borderRadius: 10,
                padding: '10px 14px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: m.c, letterSpacing: '-0.02em', marginBottom: 3 }}>{m.val}</p>
                <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--adm-text-3)' }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Satış Hunisi</h2>
              <p className="adm-card-sub">Ziyaretçiden siparişe dönüşüm</p>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34d399' }}>%3.2 dönüşüm</span>
          </div>
          <div className="adm-funnel">
            {FUNNEL.map((f, i) => (
              <div key={i} className="adm-funnel-item">
                <div className="adm-funnel-header">
                  <span className="adm-funnel-label">{f.label}</span>
                  <span className="adm-funnel-val">
                    {f.val.toLocaleString('tr-TR')}
                    <span className="adm-funnel-pct">(%{f.pct})</span>
                  </span>
                </div>
                <div className="adm-funnel-track">
                  <div className="adm-funnel-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Products + Activity + Stock/Orders ── */}
      <div className="adm-row adm-row--5-3-2">

        {/* Top Products */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">En Çok Satan Ürünler</h2>
              <p className="adm-card-sub">Bu ay satış ve gelire göre</p>
            </div>
            <button className="adm-card-link" onClick={() => navigate('/admin/urunler')}>Tümünü Gör →</button>
          </div>
          <div className="adm-top-products">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.id} className="adm-top-product">
                <span className="adm-top-rank">{i + 1}</span>
                <img src={p.image} alt={p.name} className="adm-top-img" />
                <div className="adm-top-info">
                  <p className="adm-top-name">{p.name}</p>
                  <div className="adm-top-bar-track">
                    <div className="adm-top-bar-fill" style={{ width: `${p.share}%` }} />
                  </div>
                </div>
                <div className="adm-top-nums">
                  <p className="adm-top-sales">{p.sales} sat.</p>
                  <p className="adm-top-rev">₺{(p.revenue / 1000).toFixed(1)}k</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Son Aktiviteler</h2>
              <p className="adm-card-sub">Bugün & dün</p>
            </div>
            <button className="adm-card-link" onClick={() => navigate('/admin/kvkk')}>Log Kaydı →</button>
          </div>
          <div className="adm-activity">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="adm-activity-item">
                <div className="adm-activity-icon" style={{ '--act-color': a.color }}>
                  {a.icon}
                </div>
                <div className="adm-activity-body">
                  <p className="adm-activity-title">{a.title}</p>
                  <p className="adm-activity-desc">{a.desc}</p>
                </div>
                <span className="adm-activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock alerts + pending orders */}
        <div className="adm-col-stack">
          <div className="adm-card adm-card--alert">
            <div className="adm-card-header">
              <h2 className="adm-card-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 6 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Stok Uyarıları
              </h2>
              <button className="adm-card-link" onClick={() => navigate('/admin/urunler')}>Ürünler →</button>
            </div>
            <div className="adm-stock-list">
              {LOW_STOCK.map(p => (
                <div key={p.id} className="adm-stock-item">
                  <img src={p.image} alt={p.name} className="adm-stock-img" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="adm-stock-name">{p.name}</p>
                    <p className="adm-stock-qty">
                      {p.stock === 0
                        ? <span className="adm-stock-out">Stok Tükendi</span>
                        : <span className="adm-stock-low">{p.stock} adet kaldı</span>
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header">
              <h2 className="adm-card-title">Aktif Siparişler</h2>
              <button className="adm-card-link" onClick={() => navigate('/admin/siparisler')}>Tümü →</button>
            </div>
            <div className="adm-quick-orders">
              {RECENT_ORDERS.filter(o => o.status !== 'teslim edildi').concat(
                RECENT_ORDERS.filter(o => o.status === 'teslim edildi').slice(0, 1)
              ).slice(0, 4).map(o => (
                <div key={o.id} className="adm-quick-order">
                  <div>
                    <p className="adm-quick-order__id">{o.id}</p>
                    <p className="adm-quick-order__customer">{o.customer}</p>
                  </div>
                  <div className="adm-quick-order__right">
                    <p className="adm-quick-order__amount">{o.amount}</p>
                    <span className={`adm-status ${STATUS_COLORS[o.status]}`} style={{ fontSize: '0.6rem', marginTop: 3, display: 'inline-flex' }}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

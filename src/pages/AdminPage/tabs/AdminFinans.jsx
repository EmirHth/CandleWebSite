import { useState } from 'react'
import INITIAL_ORDERS from '../../../data/orders'

const PERIODS = ['Bu Hafta', 'Bu Ay', '3 Ay', '12 Ay']

const MOCK_MONTHLY = [
  { month: 'Mar\'25', revenue: 28400, tax: 5680, refund: 1200, orders: 184 },
  { month: 'Nis\'25', revenue: 32100, tax: 6420, refund: 890, orders: 208 },
  { month: 'May\'25', revenue: 35800, tax: 7160, refund: 1450, orders: 231 },
  { month: 'Haz\'25', revenue: 29600, tax: 5920, refund: 600, orders: 192 },
  { month: 'Tem\'25', revenue: 22300, tax: 4460, refund: 780, orders: 144 },
  { month: 'Ağu\'25', revenue: 19800, tax: 3960, refund: 430, orders: 128 },
  { month: 'Eyl\'25', revenue: 27500, tax: 5500, refund: 920, orders: 178 },
  { month: 'Eki\'25', revenue: 33200, tax: 6640, refund: 1100, orders: 215 },
  { month: 'Kas\'25', revenue: 41800, tax: 8360, refund: 1650, orders: 271 },
  { month: 'Ara\'25', revenue: 58600, tax: 11720, refund: 2200, orders: 380 },
  { month: 'Oca\'26', revenue: 44200, tax: 8840, refund: 1380, orders: 286 },
  { month: 'Şub\'26', revenue: 48290, tax: 9658, refund: 1740, orders: 312 },
]

const PAYMENT_BREAKDOWN = [
  { method: 'Kredi Kartı', count: 218, amount: 33642, percent: 70 },
  { method: 'Havale / EFT', count: 56, amount: 9658, percent: 20 },
  { method: 'Kapıda Ödeme', count: 38, amount: 4990, percent: 10 },
]

const INSTALLMENT_BREAKDOWN = [
  { plan: 'Peşin', count: 94, amount: 14520, percent: 30 },
  { plan: '3 Taksit', count: 62, amount: 9540, percent: 20 },
  { plan: '6 Taksit', count: 78, amount: 12018, percent: 25 },
  { plan: '9 Taksit', count: 47, amount: 7240, percent: 15 },
  { plan: '12 Taksit', count: 31, amount: 4780, percent: 10 },
]

const INITIAL_REFUNDS = [
  { id: 'REF-001', orderId: '#LYD-2026-0381', customer: 'Emir K.', amount: 289, method: 'Kart İadesi', status: 'beklemede', reason: 'Ürün hasarlı geldi', date: '22 Şub 2026', processedDate: null, note: '' },
  { id: 'REF-002', orderId: '#LYD-2026-0368', customer: 'Defne A.', amount: 478, method: 'Hediye Çeki', status: 'tamamlandı', reason: 'Fikir değişikliği', date: '15 Şub 2026', processedDate: '17 Şub 2026', note: '₺478 hediye çeki oluşturuldu' },
  { id: 'REF-003', orderId: '#LYD-2026-0354', customer: 'Tarık B.', amount: 956, method: 'Kart İadesi', status: 'tamamlandı', reason: 'Yanlış ürün gönderildi', date: '10 Şub 2026', processedDate: '12 Şub 2026', note: 'Banka işlem: TXN-XYZ-2348' },
  { id: 'REF-004', orderId: '#LYD-2026-0372', customer: 'Seda K.', amount: 319, method: 'Kart İadesi', status: 'reddedildi', reason: 'Geç iade talebi', date: '18 Şub 2026', processedDate: '19 Şub 2026', note: 'İade süresi aşılmış' },
]

const INITIAL_GIFT_VOUCHERS = [
  { id: 'GV-001', code: 'HEDIYE-A4B2', balance: 478, usedAmount: 0, recipient: 'Defne A.', createdAt: '17 Şub 2026', expiresAt: '17 Ağu 2026', active: true },
  { id: 'GV-002', code: 'HEDIYE-X9K1', balance: 200, usedAmount: 200, recipient: 'Ali R.', createdAt: '05 Oca 2026', expiresAt: '05 Tem 2026', active: false },
  { id: 'GV-003', code: 'HEDIYE-M3P8', balance: 150, usedAmount: 50, recipient: 'Ceren Y.', createdAt: '20 Şub 2026', expiresAt: '20 Ağu 2026', active: true },
]

const REFUND_METHODS = ['Kart İadesi', 'Havale', 'Hediye Çeki']

export default function AdminFinans() {
  const [period, setPeriod] = useState('Bu Ay')
  const [refunds, setRefunds] = useState(INITIAL_REFUNDS)
  const [giftVouchers, setGiftVouchers] = useState(INITIAL_GIFT_VOUCHERS)
  const [activeTab, setActiveTab] = useState('ozet')
  const [processRefundId, setProcessRefundId] = useState(null)
  const [processForm, setProcessForm] = useState({ method: 'Kart İadesi', note: '', status: 'tamamlandı' })
  const [newVoucherForm, setNewVoucherForm] = useState({ recipient: '', balance: '', code: '' })
  const [showVoucherForm, setShowVoucherForm] = useState(false)

  const current = MOCK_MONTHLY[MOCK_MONTHLY.length - 1]
  const prev = MOCK_MONTHLY[MOCK_MONTHLY.length - 2]
  const revenueChange = (((current.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)
  const refundTotal = refunds.filter(r => r.status === 'tamamlandı').reduce((s, r) => s + r.amount, 0)
  const netRevenue = current.revenue - refundTotal
  const vatAmount = current.tax

  const ordersFromData = INITIAL_ORDERS
  const cancelledTotal = ordersFromData.filter(o => o.status === 'iptal edildi').length

  const handleProcessRefund = (id) => {
    setRefunds(prev => prev.map(r =>
      r.id === id
        ? { ...r, status: processForm.status, method: processForm.method, processedDate: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }), note: processForm.note || r.note }
        : r
    ))
    setProcessRefundId(null)
  }

  const handleCreateVoucher = (e) => {
    e.preventDefault()
    const code = newVoucherForm.code || `HEDIYE-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    setGiftVouchers(prev => [{
      id: `GV-${Date.now()}`,
      code,
      balance: Number(newVoucherForm.balance),
      usedAmount: 0,
      recipient: newVoucherForm.recipient,
      createdAt: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiresAt: '—',
      active: true,
    }, ...prev])
    setNewVoucherForm({ recipient: '', balance: '', code: '' })
    setShowVoucherForm(false)
  }

  const TABS = [
    { id: 'ozet', label: 'Özet & KPI' },
    { id: 'odeme', label: 'Ödeme Dağılımı' },
    { id: 'iade', label: 'İade Yönetimi' },
    { id: 'hediye', label: 'Hediye Çekleri' },
    { id: 'rapor', label: 'Aylık Rapor' },
  ]

  const maxBar = Math.max(...MOCK_MONTHLY.map(m => m.revenue))

  return (
    <div className="adm-finans">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Finans</h1>
          <p className="adm-page-sub">Finansal raporlar, iadeler, hediye çekleri ve ödeme yönetimi</p>
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

      {/* KPI Kartlar */}
      <div className="adm-status-cards">
        {[
          { label: 'Brüt Gelir', val: `₺${current.revenue.toLocaleString('tr-TR')}`, sub: `${revenueChange > 0 ? '+' : ''}${revenueChange}% önceki aya göre`, color: 'var(--adm-gold)' },
          { label: 'Net Gelir (İade Sonrası)', val: `₺${netRevenue.toLocaleString('tr-TR')}`, sub: `${refundTotal > 0 ? `₺${refundTotal.toLocaleString('tr-TR')} iade düşüldü` : 'İade yok'}`, color: '#34d399' },
          { label: 'KDV (%20)', val: `₺${vatAmount.toLocaleString('tr-TR')}`, sub: `${current.orders} sipariş üzerinden`, color: '#60a5fa' },
          { label: 'İptal / İade', val: cancelledTotal, sub: `${refunds.filter(r => r.status === 'beklemede').length} bekleyen iade`, color: '#f87171' },
        ].map((k, i) => (
          <div key={i} className="adm-status-card">
            <div className="adm-status-card__top">
              <span className="adm-status-card__label">{k.label}</span>
            </div>
            <div className="adm-status-card__val" style={{ color: k.color }}>{k.val}</div>
            <div className="adm-status-card__sub">{k.sub}</div>
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

      {/* ─── ÖZET & KPI ─── */}
      {activeTab === 'ozet' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          {/* Vergi özeti */}
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Vergi Özeti (Şub 2026)</p>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Brüt Satış', val: `₺${current.revenue.toLocaleString('tr-TR')}` },
                { label: 'KDV Dahil Tutar (%20)', val: `₺${current.tax.toLocaleString('tr-TR')}`, highlight: true },
                { label: 'KDV Hariç Net', val: `₺${(current.revenue - current.tax).toLocaleString('tr-TR')}` },
                { label: 'İade Kesintisi', val: `-₺${refundTotal.toLocaleString('tr-TR')}`, color: '#f87171' },
                { label: 'Nihai Net Gelir', val: `₺${(current.revenue - current.tax - refundTotal).toLocaleString('tr-TR')}`, bold: true, color: 'var(--adm-gold)' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--adm-border)' : 'none' }}>
                  <span style={{ fontSize: '0.78rem', color: row.highlight ? 'var(--adm-text-2)' : 'var(--adm-text-3)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: row.bold ? 700 : 500, color: row.color || (row.highlight ? '#60a5fa' : 'var(--adm-text-2)') }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aylık KPI */}
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Önemli KPI'lar</p>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Dönüşüm Oranı', val: '3.2%', trend: '+0.4%', up: true },
                { label: 'Ortalama Sipariş Değeri', val: `₺${Math.round(current.revenue / current.orders).toLocaleString('tr-TR')}`, trend: '+₺12', up: true },
                { label: 'Müşteri Başına Gelir', val: '₺154', trend: '+8.1%', up: true },
                { label: 'İade Oranı', val: `${((refundTotal / current.revenue) * 100).toFixed(1)}%`, trend: '-0.3%', up: false },
                { label: 'Kargo Geliri', val: `₺${ordersFromData.reduce((s, o) => s + (o.shippingCost || 0), 0).toLocaleString('tr-TR')}`, trend: null },
              ].map((kpi, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--adm-border)' : 'none' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-3)' }}>{kpi.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--adm-text)' }}>{kpi.val}</span>
                    {kpi.trend && (
                      <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: kpi.up ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: kpi.up ? '#34d399' : '#f87171' }}>
                        {kpi.trend}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ÖDEME DAĞILIMI ─── */}
      {activeTab === 'odeme' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Ödeme Yöntemi Dağılımı</p>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Yöntem</th>
                    <th>Sipariş</th>
                    <th>Tutar</th>
                    <th>Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_BREAKDOWN.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500, color: 'var(--adm-text)' }}>{p.method}</td>
                      <td style={{ color: 'var(--adm-text-3)' }}>{p.count}</td>
                      <td><span className="adm-table-amount">₺{p.amount.toLocaleString('tr-TR')}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${p.percent}%`, background: 'var(--adm-gold)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', width: 30 }}>%{p.percent}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">Taksit Kırılımı</p>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Sipariş</th>
                    <th>Tutar</th>
                    <th>Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {INSTALLMENT_BREAKDOWN.map((ins, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500, color: 'var(--adm-text)' }}>{ins.plan}</td>
                      <td style={{ color: 'var(--adm-text-3)' }}>{ins.count}</td>
                      <td><span className="adm-table-amount">₺{ins.amount.toLocaleString('tr-TR')}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${ins.percent}%`, background: '#60a5fa', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)', width: 30 }}>%{ins.percent}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── İADE YÖNETİMİ ─── */}
      {activeTab === 'iade' && (
        <div style={{ marginTop: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">İade Talepleri</p>
              <p className="adm-card-sub">{refunds.filter(r => r.status === 'beklemede').length} bekleyen</p>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>İade No</th>
                    <th>Sipariş</th>
                    <th>Müşteri</th>
                    <th>Tutar</th>
                    <th>Sebep</th>
                    <th>Yöntem</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                    <th style={{ textAlign: 'right' }}>Aksiyon</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{r.id}</td>
                      <td style={{ fontSize: '0.76rem', color: '#60a5fa' }}>{r.orderId}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{r.customer}</td>
                      <td><span className="adm-table-amount">₺{r.amount.toLocaleString('tr-TR')}</span></td>
                      <td style={{ fontSize: '0.73rem', color: 'var(--adm-text-3)' }}>{r.reason}</td>
                      <td style={{ fontSize: '0.73rem', color: 'var(--adm-text-2)' }}>{r.method}</td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>{r.date}</td>
                      <td>
                        <span className={`adm-status ${r.status === 'tamamlandı' ? 'adm-status--delivered' : r.status === 'reddedildi' ? 'adm-status--cancelled' : 'adm-status--preparing'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'beklemede' && (
                          <div className="adm-row-actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="adm-action-btn" onClick={() => { setProcessRefundId(r.id); setProcessForm({ method: r.method, note: '', status: 'tamamlandı' }) }}>
                              İşle
                            </button>
                          </div>
                        )}
                        {r.note && r.status !== 'beklemede' && (
                          <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', textAlign: 'right', maxWidth: 120 }}>{r.note}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Process Refund Modal */}
          {processRefundId && (
            <div className="adm-modal-overlay" onClick={() => setProcessRefundId(null)}>
              <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
                <div className="adm-modal-header">
                  <h2>İadeyi İşle</h2>
                  <button className="adm-modal-close" onClick={() => setProcessRefundId(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginBottom: 5 }}>Sonuç</p>
                    <select value={processForm.status} onChange={e => setProcessForm(f => ({ ...f, status: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.8rem', outline: 'none' }}>
                      <option value="tamamlandı">Onayla — Tamamlandı</option>
                      <option value="reddedildi">Reddet</option>
                    </select>
                  </div>
                  {processForm.status === 'tamamlandı' && (
                    <div>
                      <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginBottom: 5 }}>İade Yöntemi</p>
                      <select value={processForm.method} onChange={e => setProcessForm(f => ({ ...f, method: e.target.value }))}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.8rem', outline: 'none' }}>
                        {REFUND_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)', marginBottom: 5 }}>Not (opsiyonel)</p>
                    <textarea value={processForm.note} onChange={e => setProcessForm(f => ({ ...f, note: e.target.value }))} placeholder="İşlem notu…"
                      style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.78rem', outline: 'none', resize: 'none', minHeight: 60, boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div className="adm-modal-footer">
                  <button className="adm-ghost-btn" onClick={() => setProcessRefundId(null)}>Vazgeç</button>
                  <button className={processForm.status === 'tamamlandı' ? 'adm-primary-btn' : 'adm-danger-btn'} onClick={() => handleProcessRefund(processRefundId)}>
                    {processForm.status === 'tamamlandı' ? 'Onayla' : 'Reddet'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── HEDİYE ÇEKLERİ ─── */}
      {activeTab === 'hediye' && (
        <div style={{ marginTop: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <p className="adm-card-title">Hediye Çekleri</p>
                <p className="adm-card-sub">{giftVouchers.filter(v => v.active).length} aktif çek</p>
              </div>
              <button className="adm-primary-btn" style={{ fontSize: '0.75rem' }} onClick={() => setShowVoucherForm(true)}>
                + Yeni Çek Oluştur
              </button>
            </div>

            {showVoucherForm && (
              <form onSubmit={handleCreateVoucher} style={{ padding: '14px 16px', borderBottom: '1px solid var(--adm-border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
                {[
                  { label: 'Alıcı', key: 'recipient', placeholder: 'Müşteri adı' },
                  { label: 'Tutar (₺)', key: 'balance', placeholder: '100', type: 'number' },
                  { label: 'Kod (opsiyonel)', key: 'code', placeholder: 'Otomatik oluşturulur' },
                ].map(f => (
                  <div key={f.key}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', marginBottom: 4 }}>{f.label}</p>
                    <input type={f.type || 'text'} required={f.key !== 'code'} value={newVoucherForm[f.key]} onChange={e => setNewVoucherForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '7px 10px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" className="adm-ghost-btn" style={{ fontSize: '0.72rem', padding: '7px 12px' }} onClick={() => setShowVoucherForm(false)}>İptal</button>
                  <button type="submit" className="adm-primary-btn" style={{ fontSize: '0.72rem', padding: '7px 12px' }}>Oluştur</button>
                </div>
              </form>
            )}

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>Alıcı</th>
                    <th>Bakiye</th>
                    <th>Kullanılan</th>
                    <th>Kalan</th>
                    <th>Oluşturma</th>
                    <th>Geçerlilik</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {giftVouchers.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: 'var(--adm-gold)' }}>{v.code}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{v.recipient}</td>
                      <td><span className="adm-table-amount">₺{v.balance.toLocaleString('tr-TR')}</span></td>
                      <td style={{ fontSize: '0.76rem', color: v.usedAmount > 0 ? '#f87171' : 'var(--adm-text-3)' }}>
                        {v.usedAmount > 0 ? `-₺${v.usedAmount}` : '—'}
                      </td>
                      <td style={{ fontWeight: 600, color: '#34d399', fontSize: '0.82rem' }}>
                        ₺{(v.balance - v.usedAmount).toLocaleString('tr-TR')}
                      </td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>{v.createdAt}</td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>{v.expiresAt}</td>
                      <td>
                        <span className={`adm-status ${v.active && v.usedAmount < v.balance ? 'adm-status--delivered' : 'adm-status--cancelled'}`}>
                          {v.usedAmount >= v.balance ? 'Tükendi' : v.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── AYLIK RAPOR ─── */}
      {activeTab === 'rapor' && (
        <div style={{ marginTop: 16 }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <p className="adm-card-title">12 Aylık Finansal Rapor</p>
              <p className="adm-card-sub">Gelir, KDV ve iade kırılımı</p>
            </div>
            {/* Bar chart */}
            <div style={{ padding: '20px 16px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
                {MOCK_MONTHLY.map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ position: 'relative', width: '100%', height: 100, display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{
                        width: '100%', borderRadius: '3px 3px 0 0',
                        height: `${(m.revenue / maxBar) * 100}%`,
                        background: i === MOCK_MONTHLY.length - 1
                          ? 'linear-gradient(180deg,rgba(240,174,50,0.9),rgba(210,140,50,0.7))'
                          : 'rgba(255,255,255,0.08)',
                        border: i === MOCK_MONTHLY.length - 1 ? '1px solid rgba(240,174,50,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        transition: 'height 0.3s',
                        position: 'relative',
                      }}>
                        {i === MOCK_MONTHLY.length - 1 && (
                          <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.55rem', color: 'var(--adm-gold)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                            ₺{(m.revenue/1000).toFixed(0)}k
                          </div>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.55rem', color: 'var(--adm-text-3)', textAlign: 'center' }}>{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table" style={{ fontSize: '0.75rem' }}>
                <thead>
                  <tr>
                    <th>Ay</th>
                    <th>Sipariş</th>
                    <th>Brüt Gelir</th>
                    <th>KDV</th>
                    <th>İade</th>
                    <th>Net Gelir</th>
                  </tr>
                </thead>
                <tbody>
                  {[...MOCK_MONTHLY].reverse().map((m, i) => (
                    <tr key={i} style={{ background: i === 0 ? 'rgba(240,174,50,0.04)' : undefined }}>
                      <td style={{ fontWeight: i === 0 ? 700 : 400, color: i === 0 ? 'var(--adm-gold)' : 'var(--adm-text)' }}>{m.month}</td>
                      <td style={{ color: 'var(--adm-text-3)' }}>{m.orders}</td>
                      <td><span className="adm-table-amount">₺{m.revenue.toLocaleString('tr-TR')}</span></td>
                      <td style={{ color: '#60a5fa' }}>₺{m.tax.toLocaleString('tr-TR')}</td>
                      <td style={{ color: '#f87171' }}>-₺{m.refund.toLocaleString('tr-TR')}</td>
                      <td style={{ fontWeight: 600, color: '#34d399' }}>₺{(m.revenue - m.tax - m.refund).toLocaleString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

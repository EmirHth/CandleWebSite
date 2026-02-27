import { useState } from 'react'

const TICKET_CATEGORIES = ['Sipariş', 'İade', 'Ürün', 'Kargo', 'Hesap', 'Teknik', 'Diğer']
const TICKET_PRIORITIES = ['Düşük', 'Normal', 'Yüksek', 'Acil']
const TICKET_STATUSES = ['Yeni', 'İnceleniyor', 'Bekliyor', 'Çözüldü', 'Kapatıldı']

const PRIORITY_COLORS = {
  'Düşük': { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
  'Normal': { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
  'Yüksek': { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
  'Acil': { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
}

const STATUS_COLORS = {
  'Yeni': 'adm-status--preparing',
  'İnceleniyor': 'adm-status--shipping',
  'Bekliyor': 'adm-status--return-req',
  'Çözüldü': 'adm-status--delivered',
  'Kapatıldı': 'adm-status--cancelled',
}

const INITIAL_TICKETS = [
  {
    id: 'TKT-0041',
    subject: 'Siparişim hâlâ gelmedi',
    customer: 'Zeynep Arslan',
    email: 'zeynep@ornek.com',
    category: 'Kargo',
    priority: 'Yüksek',
    status: 'İnceleniyor',
    orderId: '#LYD-2026-0390',
    createdAt: '27 Şub 2026 14:22',
    updatedAt: '27 Şub 2026 15:10',
    messages: [
      { from: 'customer', text: 'Merhaba, siparişimi 3 gün önce verdim ama kargo takibinde hâlâ harekete geçmedi. Yardımcı olabilir misiniz?', date: '27 Şub 2026 14:22' },
      { from: 'admin', text: 'Merhaba Zeynep Hanım, siparişinizi inceliyoruz. Kargo firmasıyla iletişime geçip durumu sizinle paylaşacağız.', date: '27 Şub 2026 15:10' },
    ],
  },
  {
    id: 'TKT-0040',
    subject: 'Ürün hasarlı geldi, iade istiyorum',
    customer: 'Emir K.',
    email: 'emir@laydora.com',
    category: 'İade',
    priority: 'Acil',
    status: 'İnceleniyor',
    orderId: '#LYD-2026-0381',
    createdAt: '22 Şub 2026 16:00',
    updatedAt: '22 Şub 2026 16:20',
    messages: [
      { from: 'customer', text: 'Aldığım mum hasarlı geldi, kutusu ezilmişti ve koku da dağılmıştı. Lütfen iade işlemimi başlatın.', date: '22 Şub 2026 16:00' },
      { from: 'admin', text: 'Üzgünüz, iade talebinizi sisteme girdik. En kısa sürede sizinle iletişime geçeceğiz.', date: '22 Şub 2026 16:20' },
    ],
  },
  {
    id: 'TKT-0039',
    subject: 'Şifremi unuttum',
    customer: 'Ayşe Toprak',
    email: 'ayse@ornek.com',
    category: 'Hesap',
    priority: 'Normal',
    status: 'Çözüldü',
    orderId: null,
    createdAt: '20 Şub 2026 09:30',
    updatedAt: '20 Şub 2026 10:05',
    messages: [
      { from: 'customer', text: 'Hesabıma giriş yapamıyorum, şifremi sıfırlamak istiyorum.', date: '20 Şub 2026 09:30' },
      { from: 'admin', text: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.', date: '20 Şub 2026 10:05' },
      { from: 'customer', text: 'Teşekkürler, sorun çözüldü!', date: '20 Şub 2026 10:22' },
    ],
  },
  {
    id: 'TKT-0038',
    subject: 'Ürün içeriği hakkında bilgi',
    customer: 'Burak Aydın',
    email: 'burak@ornek.com',
    category: 'Ürün',
    priority: 'Düşük',
    status: 'Kapatıldı',
    orderId: null,
    createdAt: '18 Şub 2026 13:45',
    updatedAt: '18 Şub 2026 15:30',
    messages: [
      { from: 'customer', text: 'Gece Mumu ürününün içinde ne tür malzemeler kullanılıyor? Alerjim var, emin olmak istiyorum.', date: '18 Şub 2026 13:45' },
      { from: 'admin', text: 'Gece Mumu %100 soya balmumu kullanılarak üretilmektedir. İçeriğinde sentetik boya veya parafin bulunmaz. Yine de alerji geçmişinizi doktorunuzla paylaşmanızı öneririz.', date: '18 Şub 2026 15:30' },
    ],
  },
  {
    id: 'TKT-0037',
    subject: 'Sipariş adresimi değiştirebilir miyim?',
    customer: 'Selin Tekin',
    email: 'selin@ornek.com',
    category: 'Sipariş',
    priority: 'Yüksek',
    status: 'Yeni',
    orderId: '#LYD-2026-0388',
    createdAt: '27 Şub 2026 11:10',
    updatedAt: '27 Şub 2026 11:10',
    messages: [
      { from: 'customer', text: 'Siparişimi az önce verdim ama yanlış adres girdim. Acilen değiştirebilir misiniz?', date: '27 Şub 2026 11:10' },
    ],
  },
]

const EMPTY_TICKET = {
  subject: '', customer: '', email: '', category: 'Sipariş', priority: 'Normal',
  status: 'Yeni', orderId: '', messages: [],
}

function now() {
  return new Date().toLocaleString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).replace(',', '')
}

export default function AdminDestek() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('tümü')
  const [priorityFilter, setPriorityFilter] = useState('tümü')
  const [replyText, setReplyText] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [newForm, setNewForm] = useState({ ...EMPTY_TICKET })
  const [showNewModal, setShowNewModal] = useState(false)

  const filtered = tickets.filter(t => {
    const q = searchQ.toLowerCase()
    const matchQ = !searchQ || t.subject.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'tümü' || t.status === statusFilter
    const matchPriority = priorityFilter === 'tümü' || t.priority === priorityFilter
    return matchQ && matchStatus && matchPriority
  })

  const openTicket = (ticket) => {
    setSelectedTicket(ticket)
    setReplyText('')
  }

  const sendReply = () => {
    if (!replyText.trim()) return
    const msg = { from: 'admin', text: replyText, date: now() }
    setTickets(prev => prev.map(t =>
      t.id === selectedTicket.id
        ? { ...t, messages: [...t.messages, msg], updatedAt: now(), status: t.status === 'Yeni' ? 'İnceleniyor' : t.status }
        : t
    ))
    setSelectedTicket(prev => ({
      ...prev,
      messages: [...prev.messages, msg],
      status: prev.status === 'Yeni' ? 'İnceleniyor' : prev.status,
    }))
    setReplyText('')
  }

  const updateTicketStatus = (id, newStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus, updatedAt: now() } : t))
    if (selectedTicket?.id === id) setSelectedTicket(prev => ({ ...prev, status: newStatus }))
  }

  const updateTicketPriority = (id, priority) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, priority, updatedAt: now() } : t))
    if (selectedTicket?.id === id) setSelectedTicket(prev => ({ ...prev, priority }))
  }

  const handleCreateTicket = (e) => {
    e.preventDefault()
    const ticket = {
      ...newForm,
      id: `TKT-${String(tickets.length + 1).padStart(4, '0')}`,
      createdAt: now(),
      updatedAt: now(),
      messages: newForm.messages.length === 0 ? [{ from: 'customer', text: '(Admin tarafından oluşturulan talep)', date: now() }] : newForm.messages,
    }
    setTickets(prev => [ticket, ...prev])
    setShowNewModal(false)
    setNewForm({ ...EMPTY_TICKET })
  }

  const countByStatus = (s) => s === 'tümü' ? tickets.length : tickets.filter(t => t.status === s).length
  const openCount = tickets.filter(t => !['Çözüldü', 'Kapatıldı'].includes(t.status)).length
  const urgentCount = tickets.filter(t => t.priority === 'Acil' && !['Çözüldü', 'Kapatıldı'].includes(t.status)).length

  const PrioBadge = ({ priority }) => {
    const c = PRIORITY_COLORS[priority] || {}
    return (
      <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4, color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
        {priority}
      </span>
    )
  }

  return (
    <div className="adm-destek">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Müşteri Destek</h1>
          <p className="adm-page-sub">Destek talepleri, müşteri iletişimi ve sorun yönetimi</p>
        </div>
        <div className="adm-page-actions">
          <button className="adm-primary-btn" onClick={() => setShowNewModal(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Yeni Talep
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="adm-mini-stats">
        {[
          { icon: '🎧', val: tickets.length, label: 'Toplam Talep', cls: 'adm-mini-stat__val--gold', bg: 'rgba(240,174,50,0.08)', border: 'rgba(240,174,50,0.15)' },
          { icon: '🔴', val: openCount, label: 'Açık Talep', cls: 'adm-mini-stat__val--red', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
          { icon: '🚨', val: urgentCount, label: 'Acil', cls: 'adm-mini-stat__val--red', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.1)' },
          { icon: '✅', val: tickets.filter(t => t.status === 'Çözüldü').length, label: 'Çözüldü', cls: 'adm-mini-stat__val--green', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)' },
        ].map((s, i) => (
          <div key={i} className="adm-mini-stat">
            <div className="adm-mini-stat__icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
            </div>
            <div className="adm-mini-stat__body">
              <span className={`adm-mini-stat__val ${s.cls}`}>{s.val}</span>
              <span className="adm-mini-stat__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-filters" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" className="adm-search adm-search--icon" placeholder="Talep ID, konu veya müşteri ara…"
            value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: 260 }} />
        </div>

        <div className="adm-tab-filters" style={{ margin: 0 }}>
          {['tümü', ...TICKET_STATUSES].map(s => (
            <button key={s} className={`adm-tab-filter ${statusFilter === s ? 'adm-tab-filter--active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== 'tümü' && <span className="adm-tab-count">{countByStatus(s)}</span>}
            </button>
          ))}
        </div>

        <div className="adm-filter-pills" style={{ marginLeft: 'auto' }}>
          {['tümü', ...TICKET_PRIORITIES].map(p => (
            <button key={p} className={`adm-pill ${priorityFilter === p ? 'adm-pill--active' : ''}`} onClick={() => setPriorityFilter(p)}>
              {p === 'tümü' ? 'Tüm Öncelikler' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="adm-card">
        <div className="adm-card-header">
          <p className="adm-card-title">Talep Listesi</p>
          <p className="adm-card-sub">{filtered.length} talep</p>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Konu</th>
                <th>Müşteri</th>
                <th>Kategori</th>
                <th>Öncelik</th>
                <th>Durum</th>
                <th>Son Güncelleme</th>
                <th style={{ textAlign: 'right' }}>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ticket => (
                <tr key={ticket.id} style={{ cursor: 'pointer' }} onClick={() => openTicket(ticket)}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{ticket.id}</span>
                  </td>
                  <td>
                    <div>
                      <p className="adm-product-name">{ticket.subject}</p>
                      {ticket.orderId && (
                        <p style={{ fontSize: '0.63rem', color: '#60a5fa', marginTop: 2 }}>{ticket.orderId}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)' }}>{ticket.customer}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)' }}>{ticket.email}</p>
                    </div>
                  </td>
                  <td>
                    <span className="adm-cat-tag">{ticket.category}</span>
                  </td>
                  <td>
                    <PrioBadge priority={ticket.priority} />
                  </td>
                  <td>
                    <span className={`adm-status ${STATUS_COLORS[ticket.status] || ''}`}>{ticket.status}</span>
                  </td>
                  <td style={{ fontSize: '0.68rem', color: 'var(--adm-text-3)' }}>{ticket.updatedAt}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="adm-row-actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="adm-action-btn" onClick={() => openTicket(ticket)}>Aç</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <div className="adm-empty">
                      <div className="adm-empty__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                      <p className="adm-empty__title">Talep bulunamadı</p>
                      <p className="adm-empty__sub">Filtre kriterlerini değiştirin.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Ticket Detail Modal ── */}
      {selectedTicket && (
        <div className="adm-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()} style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="adm-modal-header" style={{ flexShrink: 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--adm-text-3)' }}>{selectedTicket.id}</span>
                  <PrioBadge priority={selectedTicket.priority} />
                  <span className={`adm-status ${STATUS_COLORS[selectedTicket.status] || ''}`}>{selectedTicket.status}</span>
                </div>
                <h2 style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedTicket.subject}</h2>
              </div>
              <button className="adm-modal-close" onClick={() => setSelectedTicket(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Ticket info bar */}
            <div style={{ padding: '8px 22px', borderBottom: '1px solid var(--adm-border)', display: 'flex', gap: 20, flexShrink: 0, flexWrap: 'wrap' }}>
              {[
                { label: 'Müşteri', val: `${selectedTicket.customer} · ${selectedTicket.email}` },
                { label: 'Kategori', val: selectedTicket.category },
                { label: 'Oluşturma', val: selectedTicket.createdAt },
                ...(selectedTicket.orderId ? [{ label: 'Sipariş', val: selectedTicket.orderId, color: '#60a5fa' }] : []),
              ].map((f, i) => (
                <div key={i}>
                  <p style={{ fontSize: '0.58rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{f.label}</p>
                  <p style={{ fontSize: '0.74rem', color: f.color || 'var(--adm-text-2)' }}>{f.val}</p>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.58rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Öncelik</p>
                  <select value={selectedTicket.priority} onChange={e => updateTicketPriority(selectedTicket.id, e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, padding: '4px 8px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.75rem', outline: 'none' }}>
                    {TICKET_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <p style={{ fontSize: '0.58rem', color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Durum</p>
                  <select value={selectedTicket.status} onChange={e => updateTicketStatus(selectedTicket.id, e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--adm-border)', borderRadius: 6, padding: '4px 8px', color: 'var(--adm-text)', fontFamily: 'Jost,sans-serif', fontSize: '0.75rem', outline: 'none' }}>
                    {TICKET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedTicket.messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: msg.from === 'admin' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: msg.from === 'admin' ? 'rgba(240,174,50,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${msg.from === 'admin' ? 'rgba(240,174,50,0.25)' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.58rem', fontWeight: 700,
                    color: msg.from === 'admin' ? 'var(--adm-gold)' : 'var(--adm-text-3)',
                  }}>
                    {msg.from === 'admin' ? 'ADM' : selectedTicket.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {/* Bubble */}
                  <div style={{
                    maxWidth: '70%',
                    background: msg.from === 'admin' ? 'rgba(240,174,50,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${msg.from === 'admin' ? 'rgba(240,174,50,0.18)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: msg.from === 'admin' ? '12px 3px 12px 12px' : '3px 12px 12px 12px',
                    padding: '10px 14px',
                  }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--adm-text)', lineHeight: 1.55 }}>{msg.text}</p>
                    <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)', marginTop: 5, textAlign: msg.from === 'admin' ? 'right' : 'left' }}>{msg.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {!['Çözüldü', 'Kapatıldı'].includes(selectedTicket.status) && (
              <div style={{ padding: '12px 22px 16px', borderTop: '1px solid var(--adm-border)', flexShrink: 0 }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--adm-text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Yanıtı</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Müşteriye yanıt yazın…"
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.035)', border: '1px solid var(--adm-border)',
                      borderRadius: 10, padding: '10px 14px', color: 'var(--adm-text)',
                      fontFamily: 'Jost,sans-serif', fontSize: '0.82rem', outline: 'none', resize: 'none', minHeight: 72,
                    }}
                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) sendReply() }}
                  />
                  <button
                    className="adm-primary-btn"
                    style={{ padding: '10px 16px', alignSelf: 'flex-end', flexShrink: 0 }}
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>
                    </svg>
                    Gönder
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <p style={{ fontSize: '0.62rem', color: 'var(--adm-text-3)' }}>Ctrl+Enter ile gönder</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="adm-ghost-btn" style={{ fontSize: '0.68rem', padding: '3px 9px' }} onClick={() => updateTicketStatus(selectedTicket.id, 'Çözüldü')}>
                      ✓ Çözüldü İşaretle
                    </button>
                    <button className="adm-ghost-btn" style={{ fontSize: '0.68rem', padding: '3px 9px' }} onClick={() => updateTicketStatus(selectedTicket.id, 'Kapatıldı')}>
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}
            {['Çözüldü', 'Kapatıldı'].includes(selectedTicket.status) && (
              <div style={{ padding: '12px 22px', borderTop: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', fontStyle: 'italic' }}>
                  Bu talep {selectedTicket.status.toLowerCase()}. Yeniden açmak için durumu değiştirin.
                </span>
                <button className="adm-ghost-btn" style={{ fontSize: '0.72rem' }} onClick={() => updateTicketStatus(selectedTicket.id, 'İnceleniyor')}>
                  Yeniden Aç
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── New Ticket Modal ── */}
      {showNewModal && (
        <div className="adm-modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>Yeni Destek Talebi</h2>
              <button className="adm-modal-close" onClick={() => setShowNewModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form className="adm-modal-form" onSubmit={handleCreateTicket}>
              <div className="adm-form-grid">
                <div className="adm-form-field adm-form-field--full">
                  <label>Konu *</label>
                  <input type="text" required value={newForm.subject} onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))} placeholder="Talep konusu…" />
                </div>
                <div className="adm-form-field">
                  <label>Müşteri Adı *</label>
                  <input type="text" required value={newForm.customer} onChange={e => setNewForm(f => ({ ...f, customer: e.target.value }))} placeholder="Ad Soyad" />
                </div>
                <div className="adm-form-field">
                  <label>E-posta *</label>
                  <input type="email" required value={newForm.email} onChange={e => setNewForm(f => ({ ...f, email: e.target.value }))} placeholder="musteri@ornek.com" />
                </div>
                <div className="adm-form-field">
                  <label>Kategori</label>
                  <select value={newForm.category} onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}>
                    {TICKET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-field">
                  <label>Öncelik</label>
                  <select value={newForm.priority} onChange={e => setNewForm(f => ({ ...f, priority: e.target.value }))}>
                    {TICKET_PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="adm-form-field">
                  <label>İlgili Sipariş (opsiyonel)</label>
                  <input type="text" value={newForm.orderId} onChange={e => setNewForm(f => ({ ...f, orderId: e.target.value }))} placeholder="#LYD-2026-0000" />
                </div>
                <div className="adm-form-field adm-form-field--full">
                  <label>İlk Mesaj</label>
                  <textarea placeholder="Müşteri mesajı veya talep açıklaması…" style={{ minHeight: 88 }}
                    onChange={e => setNewForm(f => ({ ...f, messages: [{ from: 'customer', text: e.target.value, date: now() }] }))}
                  />
                </div>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-ghost-btn" onClick={() => setShowNewModal(false)}>İptal</button>
                <button type="submit" className="adm-primary-btn">Talep Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Export utilities — CSV (Excel) and printable HTML
 */

export function downloadCSV(rows, headers, filename) {
  const headerRow = headers.map(h => `"${h}"`).join(',')
  const dataRows = rows.map(row =>
    headers.map((_, i) => {
      const val = row[i] ?? ''
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }).join(',')
  )
  const csv = [headerRow, ...dataRows].join('\n')
  const BOM = '\uFEFF' // UTF-8 BOM for Excel Turkish chars
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function printTable({ title, subtitle, headers, rows, filename }) {
  const thead = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`
  const tbody = rows.map(row =>
    `<tr>${row.map(cell => `<td>${cell ?? '—'}</td>`).join('')}</tr>`
  ).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;600;700&family=Cormorant+Garamond:wght@600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Jost', sans-serif; color: #1a1a1a; padding: 32px; font-size: 13px; }
    .page-hd { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; letter-spacing: 0.08em; }
    .report-title { font-size: 1rem; font-weight: 700; text-align: right; }
    .report-sub { font-size: 0.75rem; opacity: 0.5; margin-top: 3px; text-align: right; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #1a1a1a; color: #fff; }
    th { padding: 9px 10px; text-align: left; font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; }
    td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; }
    tr:nth-child(even) { background: #fafafa; }
    .footer { margin-top: 24px; font-size: 0.72rem; color: #888; text-align: center; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="page-hd">
    <div>
      <div class="brand">LAYDORA</div>
      <div style="font-size:0.7rem;opacity:0.5;margin-top:4px">EL YAPIMI DOĞAL MUMLAR</div>
    </div>
    <div>
      <div class="report-title">${title}</div>
      <div class="report-sub">${subtitle || ''}</div>
    </div>
  </div>
  <table>
    <thead>${thead}</thead>
    <tbody>${tbody}</tbody>
  </table>
  <div class="footer">Laydora — laydora.com — Rapor tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`

  const w = window.open('', '_blank')
  if (w) {
    w.document.write(html)
    w.document.close()
  }
}

/**
 * Müşteri Aktivite Loglama
 * Loglar localStorage['laydora_logs'] içinde tutulur
 */

const LOGS_KEY = 'laydora_logs'
const MAX_LOGS = 500

export const LOG_TYPES = {
  VIEW_PRODUCT: 'view_product',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  PURCHASE: 'purchase',
  PAGE_VISIT: 'page_visit',
  LOGIN: 'login',
  REGISTER: 'register',
  PROMO_APPLIED: 'promo_applied',
}

export function logActivity(type, payload = {}, userId = null) {
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    const logs = raw ? JSON.parse(raw) : []

    const entry = {
      id: Date.now(),
      type,
      userId,
      timestamp: new Date().toISOString(),
      ...payload,
    }

    const updated = [entry, ...logs].slice(0, MAX_LOGS)
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated))
  } catch {
    // ignore storage errors
  }
}

export function getLogs(userId = null) {
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    const logs = raw ? JSON.parse(raw) : []
    if (userId !== null) return logs.filter(l => l.userId === userId)
    return logs
  } catch {
    return []
  }
}

export function clearLogs() {
  localStorage.removeItem(LOGS_KEY)
}

export const LOG_LABELS = {
  [LOG_TYPES.VIEW_PRODUCT]: 'Ürün Görüntüledi',
  [LOG_TYPES.ADD_TO_CART]: 'Sepete Ekledi',
  [LOG_TYPES.REMOVE_FROM_CART]: 'Sepetten Çıkardı',
  [LOG_TYPES.PURCHASE]: 'Satın Aldı',
  [LOG_TYPES.PAGE_VISIT]: 'Sayfa Ziyareti',
  [LOG_TYPES.LOGIN]: 'Giriş Yaptı',
  [LOG_TYPES.REGISTER]: 'Kayıt Oldu',
  [LOG_TYPES.PROMO_APPLIED]: 'Kupon Kullandı',
}

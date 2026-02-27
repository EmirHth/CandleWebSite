import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { logActivity, LOG_TYPES } from '../utils/activityLogger'

const CartContext = createContext(null)

const STORAGE_KEY = 'laydora_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [toast, setToast] = useState(null)
  // Navigate ref — set by useAuthGuard below
  const [_navigateFn, setNavigateFn] = useState(null)

  /* Persist to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToast({ message, id, type })
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2800)
  }, [])

  const addToCart = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id)
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        }
        return [...prev, { product, quantity }]
      })
      showToast(`${product.name} sepete eklendi`)
      try {
        const authRaw = localStorage.getItem('laydora_auth')
        const authUser = authRaw ? JSON.parse(authRaw) : null
        logActivity(LOG_TYPES.ADD_TO_CART, {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
        }, authUser?.id ?? null)
      } catch {}
    },
    [showToast]
  )

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        setNavigateFn,
      }}
    >
      {children}
      {toast && (
        <div key={toast.id} className={`cart-toast cart-toast--${toast.type}`}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toast.message}
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

/* ── Auth-guarded cart hook ── */
export function useAuthCart() {
  const cart = useCart()
  const { isAuthenticated } = (() => {
    try {
      // Dynamic import to avoid circular dependency
      // We read directly from localStorage auth state
      const raw = localStorage.getItem('laydora_auth')
      const user = raw ? JSON.parse(raw) : null
      return { isAuthenticated: !!user }
    } catch {
      return { isAuthenticated: false }
    }
  })()

  const guardedAddToCart = useCallback(
    (product, quantity = 1, navigate, currentPath) => {
      if (!isAuthenticated) {
        const redirectTo = currentPath || window.location.pathname
        navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`)
        return false
      }
      cart.addToCart(product, quantity)
      return true
    },
    [isAuthenticated, cart]
  )

  return { ...cart, guardedAddToCart, isAuthenticated }
}

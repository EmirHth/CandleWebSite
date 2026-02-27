import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'laydora_auth'
const USERS_STORAGE_KEY = 'laydora_users'

const SEED_USERS = [
  {
    id: 1,
    email: 'admin@laydora.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Laydora',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    email: 'emir@laydora.com',
    password: 'password123',
    role: 'user',
    firstName: 'Emir',
    lastName: 'K.',
    phone: '0532 xxx xx xx',
    createdAt: '2024-06-15T00:00:00.000Z',
    addresses: [
      {
        id: 1,
        title: 'Ev',
        fullName: 'Emir K.',
        phone: '0532 xxx xx xx',
        city: 'İstanbul',
        district: 'Kadıköy',
        address: 'Moda Cad. No:45/3',
        isDefault: true,
      },
      {
        id: 2,
        title: 'İş',
        fullName: 'Emir K.',
        phone: '0532 xxx xx xx',
        city: 'İstanbul',
        district: 'Beşiktaş',
        address: 'Bağdat Cad. No:12',
        isDefault: false,
      },
    ],
  },
]

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
    // Seed
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS))
    return SEED_USERS
  } catch {
    return SEED_USERS
  }
}

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveAuth(data) {
  try {
    if (data) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    else localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadAuth)

  useEffect(() => {
    saveAuth(user)
  }, [user])

  const login = useCallback((email, password) => {
    const users = loadUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { success: false, error: 'E-posta veya şifre hatalı.' }
    }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    return { success: true, user: safeUser }
  }, [])

  const register = useCallback((firstName, lastName, email, password) => {
    const users = loadUsers()
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' }
    }
    const newUser = {
      id: Date.now(),
      email,
      password,
      role: 'user',
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    }
    const updated = [...users, newUser]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated))
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    return { success: true, user: safeUser }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

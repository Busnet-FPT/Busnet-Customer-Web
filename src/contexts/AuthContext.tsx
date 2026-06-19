import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface AuthUser {
  _id: string
  username: string
  email: string
  fullName: string
  phone?: string | null
  gender?: string | null
  dob?: string | null
  role: string
  status: string
  profilePicture?: string | null
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_USER_KEY = 'user'
const STORAGE_TOKEN_KEY = 'token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN_KEY))

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_USER_KEY)
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY)
    }
  }, [token])

  const login = (userData: AuthUser, bearerToken: string) => {
    setUser(userData)
    setToken(bearerToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const value = useMemo(
    () => ({ user, token, login, logout, setUser }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

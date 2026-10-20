'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface Profile {
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    setProfile(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!user) return null

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="relative bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="hidden sm:block text-sm text-gray-500">{user.email}</span>
              <nav className="hidden md:flex items-center space-x-4" aria-label="Navegación del dashboard">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Inicio
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/dashboard/admin/noticias"
                      className={`text-sm font-medium ${pathname.startsWith('/dashboard/admin/noticias') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Noticias
                    </Link>
                    <Link
                      href="/dashboard/admin/eventos"
                      className={`text-sm font-medium ${pathname.startsWith('/dashboard/admin/eventos') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Eventos
                    </Link>
                  </>
                )}
              </nav>
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-controls="dashboard-mobile-menu"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div
            id="dashboard-mobile-menu"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-y-contain border-t bg-white px-4 py-3 shadow-lg touch-pan-y md:hidden"
            style={{
              maxHeight: 'calc(100dvh - 4rem)',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
            }}
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Navegación del dashboard">
              <Link href="/dashboard" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Inicio
              </Link>
              {isAdmin && (
                <>
                  <Link href="/dashboard/admin" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Panel de administración
                  </Link>
                  <Link href="/dashboard/miembros" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Miembros
                  </Link>
                  <Link href="/dashboard/admin/noticias" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Noticias
                  </Link>
                  <Link href="/dashboard/admin/eventos" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Eventos
                  </Link>
                  <Link href="/dashboard/admin/predicaciones" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Predicaciones
                  </Link>
                  <Link href="/dashboard/admin/estudios" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Estudios bíblicos
                  </Link>
                  <Link href="/dashboard/admin/devocionales" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Devocionales
                  </Link>
                  <Link href="/dashboard/admin/creencias" className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Creencias
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

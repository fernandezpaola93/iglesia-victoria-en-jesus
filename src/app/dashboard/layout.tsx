'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
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

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!user) return null

  const isAdmin = pathname.startsWith('/dashboard/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <nav className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Inicio
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    className="text-sm font-medium text-blue-600"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Cerrar sesión
                </button>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
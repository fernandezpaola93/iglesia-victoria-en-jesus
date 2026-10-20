'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Church, LogOut, User, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/oracion', label: 'Oración' },
  { href: '/contacto', label: 'Contacto' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut, loading, isAdmin } = useAuth()
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-primary-100' : 'bg-transparent'
    )}>
      <nav className="container-custom" aria-label="Navegación principal">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary-900 flex-shrink-0" aria-label="Ir al inicio">
            <Church className="h-8 w-8 text-accent-500" aria-hidden="true" />
            <span className="font-display font-semibold text-xl hidden sm:block">
              Victoria en Jesús
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-primary-700 hover:text-primary-900 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-3 md:gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-primary-700 hover:text-primary-900 hidden sm:inline-flex items-center gap-1">
                  <LayoutDashboard className="inline-block h-4 w-4" /> Panel
                </Link>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" />
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Iniciar sesión</Button>
                </Link>
                <Link href="/registro">
                  <Button variant="primary" size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - ALWAYS VISIBLE */}
          <button
            className="p-2 rounded-lg text-primary-700 hover:bg-primary-100 flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - ALWAYS AVAILABLE */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="absolute top-16 left-0 right-0 py-4 border-t border-primary-100 animate-slide-down bg-white max-h-[calc(100vh-4rem)] overflow-y-auto z-50">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-primary-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" /> Panel de control
                    </Link>
                    {isAdmin && (
                      <div className="flex flex-col gap-2">
                        <Link href="/dashboard/admin" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          <LayoutDashboard className="h-5 w-5" /> Admin
                        </Link>
                        <Link href="/dashboard/miembros" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Miembros
                        </Link>
                        <Link href="/dashboard/admin/noticias" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Noticias
                        </Link>
                        <Link href="/dashboard/admin/predicaciones" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Predicaciones
                        </Link>
                        <Link href="/dashboard/admin/estudios" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Estudios Bíblicos
                        </Link>
                        <Link href="/dashboard/admin/devocionales" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Devocionales
                        </Link>
                        <Link href="/dashboard/admin/creencias" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-3 rounded-lg hover:bg-primary-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Creencias
                        </Link>
                      </div>
                    )}
                    <Button variant="outline" className="w-full justify-start px-2 py-3" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start px-2 py-3">Iniciar sesión</Button>
                    </Link>
                    <Link href="/registro" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full justify-start px-2 py-3">Registrarse</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Church, LogOut, User, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/contacto', label: 'Contacto' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut, loading } = useAuth()

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 20)
    })
  }

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-primary-100' : 'bg-transparent'
    )}>
      <nav className="container-custom" aria-label="Navegación principal">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary-900" aria-label="Ir al inicio">
            <Church className="h-8 w-8 text-accent-500" aria-hidden="true" />
            <span className="font-display font-semibold text-xl hidden sm:block">
              Victoria en Jesús
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-primary-700 hover:text-primary-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-primary-700 hover:text-primary-900">
                  <LayoutDashboard className="inline-block h-4 w-4 mr-1" /> Panel
                </Link>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" />
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Iniciar sesión</Button>
                </Link>
                <Link href="/registro">
                  <Button variant="primary" size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-primary-700 hover:bg-primary-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-primary-100 animate-slide-down">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-primary-700 hover:text-primary-900 px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-primary-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 px-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" /> Panel de control
                    </Link>
                    <Button variant="outline" className="w-full justify-start" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">Iniciar sesión</Button>
                    </Link>
                    <Link href="/registro" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full justify-start">Registrarse</Button>
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
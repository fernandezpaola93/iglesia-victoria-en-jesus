'use client'

import { useState } from 'react'
import { signInWithEmail, signInWithOAuth } from '@/lib/supabase/mobile-auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

export function MobileLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signInWithEmail(email, password)
      if (error) {
        setError(error.message)
      }
    } catch (err: any) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOAuthLogin(provider: 'google' | 'apple') {
    setError('')
    setLoading(true)
    try {
      const { error } = await signInWithOAuth(provider)
      if (error) setError(error.message)
    } catch (err: any) {
      setError('Error al iniciar sesión con ' + provider)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-primary-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-900">Iniciar sesión</h1>
          <p className="text-primary-600 mt-2">Accede a tu cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenido de nuevo</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardBody className="p-8">
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-1">
                  Contraseña *
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Iniciar sesión
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-primary-500">O continúa con</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading}
                  className="w-full"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin('apple')}
                  disabled={loading}
                  className="w-full"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.17c-.98.95-2.08.54-2.69-.2-.72-.88-1.55-2.3-.5-3.61 1.47-1.82 1.17-3.44-.56-4.55-1.36-.87-3.2-1.02-4.41-.53-.97.39-1.65 1.29-1.83 2.33-.26 1.51 1 3.09 2.66 3.71-.26.1-.5.22-.76.32C6.84 18.79 5 17.55 5 15.52c0-1.34.66-2.66 1.85-3.48 1.1-.77 2.52-1.08 4.07-.97 1.86.14 3.39.87 4.3 2.18.72 1.03.92 2.32.51 3.47-.38 1.1-1.24 2.1-2.39 2.69-.59.3-1.26.5-1.9.6-.4 0-.8-.07-1.2-.14v.07c-.12.04-.27.11-.42.16-.68.23-1.42.2-1.92-.31a5.68 5.68 0 01-1.2-1.94c-.38-.82-.37-1.73-.07-2.56.25-.68.73-1.27 1.33-1.74.65-.5 1.4-.82 2.25-.93.74-.08 1.47.06 2.12.38.81.4 1.5.97 2.01 1.72.6 1.32.4 2.81-.64 3.89zM12 1.77c4.64 0 8.41 3.77 8.41 8.41 0 1.59-.46 3.1-1.29 4.38-.9 1.38-2.37 2.66-4.35 3.45-.12.05-.24.09-.37.13-.64.18-1.29.27-1.94.27-.65 0-1.3-.09-1.94-.27-.13-.04-.25-.08-.37-.13-1.98-.8-3.45-2.07-4.35-3.45C3.99 13.28 3.53 11.77 3.53 10.18 3.53 5.54 7.3 1.77 12 1.77z" />
                  </svg>
                  Apple
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-primary-600">
              ¿No tienes cuenta? Regístrate desde la web.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Church, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess('¡Bienvenido! Redirigiendo...')
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-primary-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-900 mb-6" aria-label="Inicio">
            <Church className="h-10 w-10 text-accent-500" aria-hidden="true" />
            <span className="font-display font-semibold text-2xl">Victoria en Jesús</span>
          </Link>
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
              <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700" role="alert">
                <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700" role="status">
                <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
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
                  name="password"
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

            <p className="mt-6 text-center text-sm text-primary-600">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-accent-600 hover:text-accent-700 font-medium">
                Regístrate
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  )
}

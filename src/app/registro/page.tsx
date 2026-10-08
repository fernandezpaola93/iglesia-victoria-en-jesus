'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Church, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Shield, Phone, Users, Calendar, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.')
      setLoading(false)
      setTimeout(() => router.push('/login'), 3000)
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
          <h1 className="font-display text-3xl font-bold text-primary-900">Crear cuenta</h1>
          <p className="text-primary-600 mt-2">Únete a nuestra comunidad digital</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Miembro</CardTitle>
            <CardDescription>
              Completa tus datos para acceder al directorio, ministerios y eventos.
            </CardDescription>
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

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <Label htmlFor="full_name">Nombre completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Juan Pérez García"
                    className="pl-10"
                    required
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+52 55 1234 5678"
                    className="pl-10"
                    autoComplete="tel"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className="pl-10 pr-10"
                    required
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-primary-500">Mínimo 8 caracteres</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="pl-10"
                    required
                    autoComplete="new-password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 rounded border-primary-300 text-accent-600 focus:ring-accent-500"
                />
                <Label htmlFor="terms" className="text-sm text-primary-600 cursor-pointer">
                  Acepto los <Link href="/terminos" className="text-accent-600 hover:underline">Términos de Uso</Link> y la <Link href="/privacidad" className="text-accent-600 hover:underline">Política de Privacidad</Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Crear mi cuenta
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-primary-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-accent-600 hover:text-accent-700 font-medium">
                Inicia sesión
              </Link>
            </p>
          </CardBody>
        </Card>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Users, title: 'Directorio', desc: 'Conecta con miembros' },
            { icon: Calendar, title: 'Eventos', desc: 'Inscripciones fáciles' },
            { icon: BookOpen, title: 'Ministerios', desc: 'Encuentra tu lugar' },
          ].map((benefit, index) => (
            <div key={index} className="p-4 rounded-xl bg-white border border-primary-100">
              <benefit.icon className="h-8 w-8 text-accent-500 mx-auto mb-2" aria-hidden="true" />
              <p className="font-medium text-primary-900 text-sm">{benefit.title}</p>
              <p className="text-primary-500 text-xs">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
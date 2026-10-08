import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null
  const today = new Date()
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function getMembershipStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Visitante': 'bg-gray-100 text-gray-800',
    'Miembro': 'bg-blue-100 text-blue-800',
    'Miembro activo': 'bg-green-100 text-green-800',
    'Miembro inactivo': 'bg-yellow-100 text-yellow-800',
    'Trasladado': 'bg-purple-100 text-purple-800',
    'Fallecido': 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getMinistryCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Alabanza': 'bg-purple-100 text-purple-800',
    'Enseñanza': 'bg-blue-100 text-blue-800',
    'Servicio': 'bg-green-100 text-green-800',
    'Evangelismo': 'bg-orange-100 text-orange-800',
    'Cuidado': 'bg-pink-100 text-pink-800',
    'Administración': 'bg-gray-100 text-gray-800',
    'Otro': 'bg-indigo-100 text-indigo-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    'Líder': 'bg-primary-100 text-primary-800',
    'Co-líder': 'bg-accent-100 text-accent-800',
    'Miembro': 'bg-blue-100 text-blue-800',
    'Voluntario': 'bg-green-100 text-green-800',
    'Aprendiz': 'bg-yellow-100 text-yellow-800',
    'Asistente': 'bg-purple-100 text-purple-800',
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}
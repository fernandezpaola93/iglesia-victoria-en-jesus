'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Users, Heart, Calendar, Target, TrendingUp, DollarSign, Clock, AlertCircle, Download } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatShortDate } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: string
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-500">{title}</p>
            <p className="font-display text-3xl font-bold text-primary-900 mt-1">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    visitorsThisMonth: 0,
    totalHouseholds: 0,
    activeMinistries: 0,
    upcomingBirthdays: 0,
  })
  const [recentMembers, setRecentMembers] = useState<any[]>([])
  const [recentHouseholds, setRecentHouseholds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [
        { count: totalMembers },
        { count: activeMembers },
        { count: totalHouseholds },
        { count: activeMinistries },
        { data: recentMembersData },
        { data: recentHouseholdsData },
      ] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('members').select('*', { count: 'exact', head: true }).in('membership_status', ['Miembro', 'Miembro activo']),
        supabase.from('households').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('ministries').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('members').select('id, first_name, last_name, email, membership_status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('households').select('id, name, address, city, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        visitorsThisMonth: 0, // TODO: implementar
        totalHouseholds: totalHouseholds || 0,
        activeMinistries: activeMinistries || 0,
        upcomingBirthdays: 0, // TODO: implementar
      })
      setRecentMembers(recentMembersData || [])
      setRecentHouseholds(recentHouseholdsData || [])
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[1,2,3,4,5,6].map(i => (
              <Card key={i}>
                <CardBody className="p-6">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-32 bg-gray-200 rounded" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Panel de Administración</h1>
          <p className="text-primary-600 mt-1">Resumen general de la congregación</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          <StatCard
            title="Total Miembros"
            value={stats.totalMembers}
            icon={<Users className="h-8 w-8" />}
            color="blue"
          />
          <StatCard
            title="Miembros Activos"
            value={stats.activeMembers}
            icon={<Heart className="h-8 w-8" />}
            color="green"
            trend={`${stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}%`}
          />
          <StatCard
            title="Visitantes (Mes)"
            value={stats.visitorsThisMonth}
            icon={<Users className="h-8 w-8" />}
            color="purple"
          />
          <StatCard
            title="Hogares Activos"
            value={stats.totalHouseholds}
            icon={<Heart className="h-8 w-8" />}
            color="orange"
          />
          <StatCard
            title="Ministerios Activos"
            value={stats.activeMinistries}
            icon={<Target className="h-8 w-8" />}
            color="indigo"
          />
          <StatCard
            title="Cumpleaños Próx."
            value={stats.upcomingBirthdays}
            icon={<Calendar className="h-8 w-8" />}
            color="pink"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-primary-900">Miembros Recientes</CardTitle>
            </CardHeader>
            <CardBody className="pt-0">
              {recentMembers.length === 0 ? (
                <p className="text-primary-500 text-center py-8">No hay miembros registrados</p>
              ) : (
                <div className="divide-y divide-primary-100">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-primary-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {member.first_name?.[0]}{member.last_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary-900 truncate">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-primary-500 truncate">{member.email || 'Sin email'}</p>
                      </div>
                      <Badge variant="status" value={member.membership_status} className="whitespace-nowrap">
                        {member.membership_status}
                      </Badge>
                      <span className="text-sm text-primary-500 whitespace-nowrap">
                        {formatShortDate(member.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-primary-900">Hogares Recientes</CardTitle>
            </CardHeader>
            <CardBody className="pt-0">
              {recentHouseholds.length === 0 ? (
                <p className="text-primary-500 text-center py-8">No hay hogares registrados</p>
              ) : (
                <div className="divide-y divide-primary-100">
                  {recentHouseholds.map((household) => (
                    <div key={household.id} className="flex items-center gap-4 p-4 hover:bg-primary-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary-900 truncate">{household.name}</p>
                        <p className="text-sm text-primary-500 truncate">
                          {household.address || 'Sin dirección'}
                          {household.city && `, ${household.city}`}
                        </p>
                      </div>
                      <span className="text-sm text-primary-500">{formatShortDate(household.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary-900">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardBody className="pt-0 grid gap-3 sm:grid-cols-2">
              <a href="/dashboard/miembros/nuevo" className="p-4 border border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600 group-hover:bg-primary-200 transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Registrar Miembro</p>
                    <p className="text-sm text-primary-500">Agregar nuevo feligrés</p>
                  </div>
                </div>
              </a>
              <a href="/dashboard/hogares/nuevo" className="p-4 border border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Registrar Hogar</p>
                    <p className="text-sm text-primary-500">Nueva familia</p>
                  </div>
                </div>
              </a>
              <a href="/dashboard/ministerios/nuevo" className="p-4 border border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Crear Ministerio</p>
                    <p className="text-sm text-primary-500">Nueva área de servicio</p>
                  </div>
                </div>
              </a>
              <a href="/dashboard/miembros" className="p-4 border border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors">
                    <Download className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Exportar Miembros</p>
                    <p className="text-sm text-primary-500">Descargar CSV completo</p>
                  </div>
                </div>
              </a>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar si es admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    let query = supabase
      .from('members')
      .select('*, households(name)')
      .order('last_name', { ascending: true })

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    if (status && status !== 'Todos') {
      query = query.eq('membership_status', status)
    }

    const { data: members, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (format === 'csv') {
      const headers = [
        'ID',
        'Nombres',
        'Apellidos',
        'Nombre preferido',
        'Género',
        'Fecha de nacimiento',
        'Estado civil',
        'Email',
        'Teléfono',
        'Teléfono secundario',
        'WhatsApp',
        'Dirección',
        'Ciudad',
        'Estado',
        'C.P.',
        'Fecha bautismo',
        'Lugar bautismo',
        'Fecha membresía',
        'Estado membresía',
        'Fecha decisión fe',
        'Notas espirituales',
        'Contacto emergencia nombre',
        'Contacto emergencia teléfono',
        'Contacto emergencia relación',
        'Alergías/Médico',
        'Tipo sangre',
        'Notas',
        'Facebook',
        'Instagram',
        'Hogar',
        'Fecha registro',
        'Activo'
      ]

      const rows = members.map(m => [
        m.id,
        m.first_name,
        m.last_name,
        m.preferred_name || '',
        m.gender || '',
        m.date_of_birth || '',
        m.marital_status || '',
        m.email || '',
        m.phone || '',
        m.phone_secondary || '',
        m.whatsapp_number || '',
        m.address || '',
        m.city || '',
        m.state || '',
        m.zip_code || '',
        m.baptism_date || '',
        m.baptism_location || '',
        m.membership_date || '',
        m.membership_status || '',
        m.salvation_date || '',
        m.salvation_notes || '',
        m.emergency_contact_name || '',
        m.emergency_contact_phone || '',
        m.emergency_contact_relationship || '',
        m.allergies_medical || '',
        m.blood_type || '',
        m.notes || '',
        m.facebook_url || '',
        m.instagram_url || '',
        m.household?.name || '',
        m.created_at,
        m.is_active ? 'Sí' : 'No'
      ])

      const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="miembros_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ data: members })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
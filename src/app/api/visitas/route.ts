import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // No-op for public insert route
          },
        },
      }
    )

    const body = await request.json()

    const payload = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      preferred_date: body.preferredDate || null,
      preferred_service: body.preferredService || null,
      guests: body.guests || null,
      kids_ages: body.kidsAges || null,
      notes: body.notes || null,
      status: 'pendiente',
    }

    const { data, error } = await supabase
      .from('visits')
      .insert(payload)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

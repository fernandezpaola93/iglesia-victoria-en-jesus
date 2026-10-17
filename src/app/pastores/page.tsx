'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardBody } from '@/components/ui/Card'

export default function PastoresPage() {
  const [pastores, setPastores] = useState<any[]>([])
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchPastores() {
      const { data } = await supabase
        .from('members')
        .select('*')
        .ilike('leadership_role', '%Pastor%')
      setPastores(data || [])
    }
    fetchPastores()
  }, [supabase])

  return (
    <div className="container-custom py-16">
      <h1 className="font-display text-4xl font-bold text-primary-900 mb-8">Nuestros Pastores</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pastores.map((pastor) => (
          <Card key={pastor.id}>
            <CardBody className="p-6 text-center">
              <Avatar src={pastor.profile_photo_url} alt={pastor.first_name} size="xl" className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold">{pastor.first_name} {pastor.last_name}</h2>
              <p className="text-accent-600">{pastor.leadership_role}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

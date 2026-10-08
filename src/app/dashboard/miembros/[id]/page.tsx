'use client'

import { useParams } from 'next/navigation'

export default function MiembroDetallePage() {
  const params = useParams()

  return (
    <div>
      <h1>Miembro: {params.id}</h1>
    </div>
  )
}
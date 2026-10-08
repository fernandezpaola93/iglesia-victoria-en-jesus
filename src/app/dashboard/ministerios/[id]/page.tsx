'use client'

import { useParams } from 'next/navigation'

export default function TestPage() {
  const params = useParams()
  return <div>Ministerio: {params.id}</div>
}
'use client'

import { useParams } from 'next/navigation'

export default function TestPage() {
  const params = useParams()
  return <div>Hogar: {params.id}</div>
}
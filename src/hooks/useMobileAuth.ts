'use client'

import { useState, useEffect } from 'react'
import { supabaseMobile } from '@/lib/supabase/mobile'
import { onAuthStateChange, getSession, signOut as mobileSignOut } from '@/lib/supabase/mobile-auth'

interface User {
  id: string
  email: string
  full_name?: string
  role?: string
}

export function useMobileAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initAuth()
    const subscription = onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function initAuth() {
    const session = await getSession()
    setSession(session)
    if (session?.user) {
      await fetchProfile(session.user.id)
    }
    setLoading(false)
  }

  async function fetchProfile(userId: string) {
    const { data } = await supabaseMobile
      .from('profiles')
      .select('full_name, role')
      .eq('id', userId)
      .single()
    if (data) setUser({ id: userId, email: session?.user?.email || '', ...data })
  }

  async function signOut() {
    await mobileSignOut()
    setUser(null)
    setSession(null)
  }

  return { user, session, loading, signOut }
}
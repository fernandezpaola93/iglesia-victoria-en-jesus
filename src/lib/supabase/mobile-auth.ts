import { Browser } from '@capacitor/browser'
import { App } from '@capacitor/app'
import { supabaseMobile } from './mobile'

export interface AuthResult {
  user: any
  session: any
  error: Error | null
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabaseMobile.auth.signInWithPassword({ email, password })
  return { user: data.user, session: data.session, error }
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabaseMobile.auth.signUp({ email, password })
  return { user: data.user, session: data.session, error }
}

export async function signInWithOAuth(provider: 'google' | 'apple'): Promise<AuthResult> {
  const { data, error } = await supabaseMobile.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'io.victoriaenjesus://auth-callback',
    },
  })

  if (data.url && !error) {
    await Browser.open({ url: data.url, presentationStyle: 'fullscreen' })
  }

  return { user: null, session: null, error }
}

export async function signOut(): Promise<{ error: Error | null }> {
  const { error } = await supabaseMobile.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session } } = await supabaseMobile.auth.getSession()
  return session
}

export async function getUser() {
  const { data: { user } } = await supabaseMobile.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const { data: { subscription } } = supabaseMobile.auth.onAuthStateChange(callback)
  return subscription
}

export async function handleDeepLink(url: string) {
  const { data, error } = await supabaseMobile.auth.exchangeCodeForSession(url)
  return { data, error }
}

App.addListener('appUrlOpen', async ({ url }) => {
  if (url.startsWith('io.victoriaenjesus://auth-callback')) {
    await handleDeepLink(url)
  }
})
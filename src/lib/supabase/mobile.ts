import { createClient } from '@supabase/supabase-js'
import { Preferences } from '@capacitor/preferences'

export const supabaseMobile = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: false,
      storage: {
        getItem: async (key: string) => {
          const { value } = await Preferences.get({ key })
          return value
        },
        setItem: async (key: string, value: string) => {
          await Preferences.set({ key, value })
        },
        removeItem: async (key: string) => {
          await Preferences.remove({ key })
        },
      },
    },
  }
)
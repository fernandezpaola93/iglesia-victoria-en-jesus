import type { SupabaseClient, User } from '@supabase/supabase-js'

type Client = SupabaseClient<any, 'public', any>

function capitalize(raw: string): string {
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
}

function splitName(raw: string): { first_name: string; last_name: string } {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first_name: 'Usuario', last_name: 'Admin' }
  if (parts.length === 1) return { first_name: capitalize(parts[0]), last_name: 'Admin' }
  return {
    first_name: capitalize(parts[0]),
    last_name: parts.slice(1).map(capitalize).join(' '),
  }
}

/**
 * Resuelve el id de miembro (public.members.id) que corresponde al usuario
 * autenticado, porque las columnas news.author_id y sermons.author_id
 * referencian public.members(id) y no auth.users(id).
 *
 * Orden de busqueda:
 *   1. Miembro vinculado con public.members.user_id = auth.uid()
 *      (vinculo canonico, el que crea add-members-user-id.sql).
 *   2. Miembro que ya existe con el mismo id que auth.uid().
 *   3. Miembro que ya existe con el mismo correo.
 *   4. Se crea el miembro con id = auth.uid() para no romper la FK.
 *      El trigger trg_link_member_to_user se encarga de mantener user_id.
 *
 * Devuelve null si no se pudo obtener/crear el miembro; en ese caso la
 * columna author_id (nullable) se envia como null.
 */
export async function resolveAuthorMemberId(supabase: Client, user: User): Promise<string | null> {
  // 1) Vinculo canonico por user_id.
  //    Si la columna user_id todavia no existe (migracion no aplicada),
  //    la consulta falla y se continua con los siguientes metodos.
  const { data: byUserId } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (byUserId?.id) return byUserId.id

  // 2) Miembro con el mismo id que auth.uid()
  const { data: byId } = await supabase
    .from('members')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (byId?.id) return byId.id

  // 3) Miembro con el mismo correo
  if (user.email) {
    const { data: byEmail } = await supabase
      .from('members')
      .select('id')
      .eq('email', user.email)
      .maybeSingle()

    if (byEmail?.id) return byEmail.id
  }

  // 4) Crear el miembro con id = auth.uid()
  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Usuario Admin'
  const { first_name, last_name } = splitName(String(displayName))

  const { data: created, error } = await supabase
    .from('members')
    .insert({
      id: user.id,
      first_name,
      last_name,
      email: user.email ?? null,
      membership_status: 'Miembro activo',
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) {
    console.error('No se pudo crear el registro de miembro para el autor:', error.message)
    return null
  }

  return created?.id ?? null
}

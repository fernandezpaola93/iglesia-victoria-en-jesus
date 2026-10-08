export interface Household {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  phone: string | null
  email: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  household_id: string | null
  first_name: string
  last_name: string
  middle_name: string | null
  preferred_name: string | null
  gender: 'M' | 'F' | 'Otro' | 'Prefiero no decir' | null
  date_of_birth: string | null
  marital_status: 'Soltero' | 'Casado' | 'Divorciado' | 'Viudo' | 'Unión libre' | 'Separado' | null
  email: string | null
  phone: string | null
  phone_secondary: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  baptism_date: string | null
  baptism_location: string | null
  membership_date: string | null
  membership_status: 'Visitante' | 'Miembro' | 'Miembro activo' | 'Miembro inactivo' | 'Trasladado' | 'Fallecido'
  salvation_date: string | null
  salvation_notes: string | null
  profile_photo_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  whatsapp_number: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  allergies_medical: string | null
  blood_type: string | null
  notes: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  household?: Household
}

export interface Ministry {
  id: string
  name: string
  description: string | null
  category: 'Alabanza' | 'Enseñanza' | 'Servicio' | 'Evangelismo' | 'Cuidado' | 'Administración' | 'Otro'
  leader_id: string | null
  meeting_day: string | null
  meeting_time: string | null
  meeting_location: string | null
  is_active: boolean
  requires_background_check: boolean
  created_at: string
  updated_at: string
  leader?: Member
}

export interface MemberMinistry {
  id: string
  member_id: string
  ministry_id: string
  role: 'Líder' | 'Co-líder' | 'Miembro' | 'Voluntario' | 'Aprendiz' | 'Asistente'
  start_date: string
  end_date: string | null
  notes: string | null
  created_at: string
  member?: Member
  ministry?: Ministry
}

export interface SpiritualMilestone {
  id: string
  member_id: string
  milestone_type: 'Salvación' | 'Bautismo' | 'Membresía' | 'Primera Comunión' | 'Confirmación' | 'Matrimonio' | 'Dedicación de hijos' | 'Llamado al ministerio' | 'Ordenación' | 'Otro'
  date: string
  location: string | null
  officiant: string | null
  witness_1: string | null
  witness_2: string | null
  certificate_number: string | null
  certificate_url: string | null
  notes: string | null
  created_at: string
  member?: Member
}

export interface PastoralNote {
  id: string
  member_id: string
  author_id: string
  note_type: 'Consejería' | 'Visita' | 'Oración' | 'Seguimiento' | 'Disciplina' | 'General'
  title: string
  content: string
  is_confidential: boolean
  follow_up_date: string | null
  follow_up_completed: boolean
  created_at: string
  updated_at: string
  member?: Member
  author?: Member
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_type: 'Culto' | 'Estudio bíblico' | 'Conferencia' | 'Retiro' | 'Evento social' | 'Capacitación' | 'Otro'
  start_datetime: string
  end_datetime: string | null
  location: string | null
  max_capacity: number | null
  requires_registration: boolean
  ministry_id: string | null
  is_recurring: boolean
  recurrence_pattern: Record<string, unknown> | null
  is_active: boolean
  created_at: string
  updated_at: string
  ministry?: Ministry
}

export type MembershipStatus = Member['membership_status']
export type MinistryRole = MemberMinistry['role']
export type MilestoneType = SpiritualMilestone['milestone_type']
export type NoteType = PastoralNote['note_type']
export type EventType = Event['event_type']
export type MinistryCategory = Ministry['category']
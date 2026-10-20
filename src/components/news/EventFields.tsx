'use client'

import { CalendarDays, MapPin } from 'lucide-react'
import { Input, Select, Checkbox } from '@/components/ui'
import { EVENT_TYPES, type NewsEventForm } from '@/lib/events'

interface EventFieldsProps {
  value: NewsEventForm
  onChange: (value: NewsEventForm) => void
}

export function EventFields({ value, onChange }: EventFieldsProps) {
  const set = (patch: Partial<NewsEventForm>) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          name="is_event"
          checked={value.is_event}
          onChange={(e) => set({ is_event: (e.target as HTMLInputElement).checked })}
          className="mt-0.5"
        />
        <span>
          <span className="block text-sm font-medium text-primary-900">
            Publicar también como evento
          </span>
          <span className="block text-xs text-primary-600 mt-0.5">
            La noticia aparecerá en la página pública de Eventos. Al desmarcarlo se
            elimina el evento asociado.
          </span>
        </span>
      </label>

      {value.is_event && (
        <div className="space-y-4 pt-2 border-t border-amber-200">
          <div>
            <label htmlFor="event_type" className="block text-sm font-medium text-primary-700 mb-1">
              Tipo de evento *
            </label>
            <Select
              id="event_type"
              name="event_type"
              value={value.event_type}
              onChange={(e) => set({ event_type: e.target.value })}
              required
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start_datetime" className="block text-sm font-medium text-primary-700 mb-1">
                Fecha y hora de inicio *
              </label>
              <Input
                id="start_datetime"
                name="start_datetime"
                type="datetime-local"
                value={value.start_datetime}
                onChange={(e) => set({ start_datetime: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="end_datetime" className="block text-sm font-medium text-primary-700 mb-1">
                Fecha y hora de fin
              </label>
              <Input
                id="end_datetime"
                name="end_datetime"
                type="datetime-local"
                value={value.end_datetime}
                onChange={(e) => set({ end_datetime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-primary-700 mb-1">
              Lugar
            </label>
            <Input
              id="location"
              name="location"
              value={value.location}
              onChange={(e) => set({ location: e.target.value })}
              placeholder="Santuario Principal, Centro de Convenciones..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              name="requires_registration"
              checked={value.requires_registration}
              onChange={(e) => set({ requires_registration: (e.target as HTMLInputElement).checked })}
            />
            <span className="text-sm text-primary-700">Requiere inscripción</span>
          </label>

          <p className="text-xs text-primary-500 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            El título, la descripción y la imagen se toman de la noticia.
            <MapPin className="h-3.5 w-3.5 ml-2" />
            El lugar es el campo de arriba.
          </p>
        </div>
      )}
    </div>
  )
}

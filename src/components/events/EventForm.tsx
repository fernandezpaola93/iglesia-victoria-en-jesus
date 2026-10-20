'use client'

import { Input, Select, Textarea, Checkbox } from '@/components/ui'
import {
  EVENT_TYPES,
  RECURRENCE_FREQUENCIES,
  type EventFormState,
} from '@/lib/events'

interface EventFormProps {
  value: EventFormState
  onChange: (value: EventFormState) => void
  ministries?: { id: string; name: string }[]
}

export function EventForm({ value, onChange }: EventFormProps) {
  const set = (patch: Partial<EventFormState>) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-primary-700 mb-1">
          Título del evento *
        </label>
        <Input
          id="title"
          name="title"
          value={value.title}
          onChange={(e) => set({ title: e.target.value })}
          required
          placeholder="Conferencia de jóvenes"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-primary-700 mb-1">
          Descripción
        </label>
        <Textarea
          id="description"
          name="description"
          value={value.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={3}
          placeholder="Breve descripción que se muestra en la tarjeta del evento..."
          className="w-full"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-primary-700 mb-1">
            Lugar
          </label>
          <Input
            id="location"
            name="location"
            value={value.location}
            onChange={(e) => set({ location: e.target.value })}
            placeholder="Santuario Principal"
            className="w-full"
          />
        </div>
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
            className="w-full"
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
            className="w-full"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="max_capacity" className="block text-sm font-medium text-primary-700 mb-1">
            Capacidad máxima
          </label>
          <Input
            id="max_capacity"
            name="max_capacity"
            type="number"
            min={0}
            value={value.max_capacity}
            onChange={(e) => set({ max_capacity: e.target.value })}
            placeholder="Sin límite"
            className="w-full"
          />
        </div>

        {value.is_recurring && (
          <div>
            <label htmlFor="recurrence_frequency" className="block text-sm font-medium text-primary-700 mb-1">
              Se repite
            </label>
            <Select
              id="recurrence_frequency"
              name="recurrence_frequency"
              value={value.recurrence_frequency}
              onChange={(e) => set({ recurrence_frequency: e.target.value })}
            >
              {RECURRENCE_FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-3 p-4 bg-primary-50 border border-primary-100 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            name="requires_registration"
            checked={value.requires_registration}
            onChange={(e) => set({ requires_registration: (e.target as HTMLInputElement).checked })}
          />
          <span className="text-sm text-primary-700">Requiere inscripción</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            name="is_recurring"
            checked={value.is_recurring}
            onChange={(e) => set({ is_recurring: (e.target as HTMLInputElement).checked })}
          />
          <span className="text-sm text-primary-700">Es un evento recurrente</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            name="is_active"
            checked={value.is_active}
            onChange={(e) => set({ is_active: (e.target as HTMLInputElement).checked })}
          />
          <span className="text-sm text-primary-700">
            Visible en el sitio (se publica en /eventos)
          </span>
        </label>
      </div>
    </div>
  )
}

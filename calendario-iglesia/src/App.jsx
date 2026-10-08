import { useState } from 'react'
import './App.css'

const eventos = [
  {
    dia: 'Domingos',
    icono: '☀️',
    clase: 'domingo',
    actividades: [
      { hora: '10:00 - 12:00', nombre: 'Culto Dominical', tipo: 'Servicio Principal' }
    ]
  },
  {
    dia: 'Martes',
    icono: '🙏',
    clase: 'martes',
    actividades: [
      { hora: '18:00 - 19:00', nombre: 'Oración', tipo: 'Reunión de Oración' }
    ]
  },
  {
    dia: 'Sábados',
    icono: '🎵',
    clase: 'sabado',
    actividades: [
      { hora: '10:00 - 12:00', nombre: 'Culto Juvenil', tipo: 'Jóvenes' }
    ]
  }
]

function descargarICS() {
  const ahora = new Date()
  const dtstamp = ahora.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  function proximoDia(diaSemana) {
    const d = new Date()
    const diff = (diaSemana - d.getDay() + 7) % 7
    d.setDate(d.getDate() + (diff === 0 ? 7 : diff))
    return d.toISOString().split('T')[0].replace(/-/g, '')
  }

  const datosICS = [
    { dia: 'SU', nombre: 'Culto Dominical', inicio: '100000', fin: '120000', color: '#e74c3c' },
    { dia: 'TU', nombre: 'Oración', inicio: '180000', fin: '190000', color: '#3498db' },
    { dia: 'SA', nombre: 'Culto Juvenil', inicio: '100000', fin: '120000', color: '#27ae60' }
  ]

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Iglesia//Calendario//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Actividades de la Iglesia',
    'X-WR-TIMEZONE:America/Mexico_City'
  ]

  datosICS.forEach((evt, i) => {
    const fecha = proximoDia({ SU: 0, TU: 2, SA: 6 }[evt.dia])
    const uid = `evento-${i}-${Date.now()}@iglesia.local`
    ics.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=America/Mexico_City:${fecha}T${evt.inicio}`,
      `DTEND;TZID=America/Mexico_City:${fecha}T${evt.fin}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${evt.dia}`,
      `SUMMARY:${evt.nombre}`,
      `DESCRIPTION:Actividad recurrente semanal`,
      `COLOR:${evt.color}`,
      'END:VEVENT'
    )
  })

  ics.push('END:VCALENDAR')

  const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'calendario-iglesia.ics'
  a.click()
  URL.revokeObjectURL(url)
}

function App() {
  return (
    <div className="container">
      <header>
        <h1>📅 Calendario de Actividades</h1>
        <p className="subtitle">Horarios semanales de la iglesia</p>
      </header>

      <div className="calendar">
        {eventos.map((evento) => (
          <article key={evento.dia} className={`day-card ${evento.clase}`}>
            <div className="day-header">
              <div className="day-icon">{evento.icono}</div>
              <h2 className="day-name">{evento.dia}</h2>
            </div>
            {evento.actividades.map((act, idx) => (
              <div key={idx} className="event">
                <span className="event-time">{act.hora}</span>
                <span className="event-name">{act.nombre}</span>
                <span className="event-type">{act.tipo}</span>
              </div>
            ))}
          </article>
        ))}
      </div>

      <div className="add-calendar">
        <button className="btn" onClick={descargarICS}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Añadir a mi calendario (.ics)
        </button>
      </div>

      <footer>
        <p>Generado para la comunidad • Horarios recurrentes semanales</p>
      </footer>
    </div>
  )
}

export default App
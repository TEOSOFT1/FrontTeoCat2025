"use client"

import { useState, useEffect } from "react"
import { Clock, AlertTriangle, ChevronRight, Info } from "lucide-react"

export const TimeSlotsComponent = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSelect,
  selectedDate,
  citasAgendadas,
  onNextDayRequest,
  onCitaClick,
}) => {
  const [use24HourFormat, setUse24HourFormat] = useState(false)
  const [horariosOcupados, setHorariosOcupados] = useState([])
  const [citasPorHorario, setCitasPorHorario] = useState({})
  const [todosOcupados, setTodosOcupados] = useState(false)

  // Actualizar horarios ocupados cuando cambian las citas o la fecha
  useEffect(() => {
    if (citasAgendadas && citasAgendadas.length > 0 && selectedDate) {
      // Filtrar citas para la fecha seleccionada
      const fechaSeleccionada = selectedDate.toISOString().split("T")[0]
      const citasDelDia = citasAgendadas.filter((cita) => cita.fecha === fechaSeleccionada)

      // Extraer horarios ocupados
      const horarios = citasDelDia.map((cita) => cita.hora)
      setHorariosOcupados(horarios)

      // Crear un mapa de citas por horario
      const citasMap = {}
      citasDelDia.forEach((cita) => {
        citasMap[cita.hora] = cita
      })
      setCitasPorHorario(citasMap)

      // Verificar si todos los horarios están ocupados
      if (timeSlots.length > 0 && horarios.length >= timeSlots.length) {
        const disponibles = timeSlots.filter((slot) => !horarios.includes(slot))
        setTodosOcupados(disponibles.length === 0)
      } else {
        setTodosOcupados(false)
      }
    } else {
      setHorariosOcupados([])
      setCitasPorHorario({})
      setTodosOcupados(false)
    }
  }, [citasAgendadas, selectedDate, timeSlots])

  // Función para convertir formato de 24h a 12h
  const formatTime = (time) => {
    if (use24HourFormat) return time

    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 || 12
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Cambiar formato de hora
  const toggleTimeFormat = () => {
    setUse24HourFormat(!use24HourFormat)
  }

  // Verificar si un horario está ocupado
  const isTimeSlotOcupado = (timeSlot) => {
    return horariosOcupados.includes(timeSlot)
  }

  // Manejar solicitud para ver el día siguiente
  const handleNextDay = () => {
    if (onNextDayRequest) {
      onNextDayRequest()
    }
  }

  // Manejar clic en un horario ocupado
  const handleOcupadoClick = (timeSlot) => {
    if (onCitaClick && citasPorHorario[timeSlot]) {
      onCitaClick(citasPorHorario[timeSlot])
    }
  }

  // Verificar si un horario está dentro del horario de almuerzo
  const isLunchTime = (timeSlot) => {
    const [hour] = timeSlot.split(":").map(Number)
    return hour === 13 // 1:00 PM - 2:00 PM
  }

  return (
    <div className="time-slots-container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="time-slots-title mb-0">Horarios disponibles</h4>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="timeFormatSwitch"
            checked={use24HourFormat}
            onChange={toggleTimeFormat}
          />
          <label className="form-check-label" htmlFor="timeFormatSwitch">
            <Clock size={14} className="me-1" />
            {use24HourFormat ? "24h" : "12h"}
          </label>
        </div>
      </div>

      {todosOcupados ? (
        <div className="no-slots-available">
          <AlertTriangle size={20} className="text-warning mb-2" />
          <p className="mb-2">Todos los horarios para esta fecha están ocupados.</p>
          <button className="btn btn-sm btn-primary d-flex align-items-center mx-auto" onClick={handleNextDay}>
            Ver día siguiente <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="time-slots-grid">
          {timeSlots.length > 0 ? (
            timeSlots.map((timeSlot) => {
              const ocupado = isTimeSlotOcupado(timeSlot)
              const lunchTime = isLunchTime(timeSlot)
              return (
                <div
                  key={timeSlot}
                  className={`time-slot ${timeSlot === selectedTimeSlot ? "selected" : ""} 
                              ${ocupado ? "ocupado" : ""} 
                              ${lunchTime ? "lunch-time" : ""}`}
                  onClick={() => {
                    if (ocupado) {
                      handleOcupadoClick(timeSlot)
                    } else if (!lunchTime) {
                      onTimeSelect(timeSlot)
                    }
                  }}
                  title={lunchTime ? "Horario de almuerzo" : ""}
                >
                  {formatTime(timeSlot)}
                  {ocupado && (
                    <div className="ocupado-badge">
                      <Info size={12} className="me-1" />
                      Ocupado
                    </div>
                  )}
                  {lunchTime && <small className="lunch-badge">Almuerzo</small>}
                </div>
              )
            })
          ) : (
            <div className="no-slots-message">No hay horarios disponibles para esta fecha.</div>
          )}
        </div>
      )}
    </div>
  )
}


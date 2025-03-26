"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const CalendarComponent = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Update current month when selected date changes
  useEffect(() => {
    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  }, [selectedDate])

  // Manejador para cambiar al mes anterior
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Manejador para cambiar al mes siguiente
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Manejador para seleccionar una fecha
  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onDateSelect(newDate)
  }

  // Generar el calendario
  const renderCalendar = () => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]

    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

    // Primer día del mes
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    // Último día del mes
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    let firstDayOfWeek = firstDay.getDay() - 1
    if (firstDayOfWeek === -1) firstDayOfWeek = 6 // Si es domingo (0), convertir a 6 para nuestro calendario que empieza en lunes

    // Número de días en el mes
    const daysInMonth = lastDay.getDate()

    // Crear array para el calendario
    const calendarDays = []

    // Añadir días del mes anterior para completar la primera semana
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthLastDay - i,
        month: currentMonth.getMonth() - 1,
        year: currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear(),
        isCurrentMonth: false,
      })
    }

    // Añadir días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        month: currentMonth.getMonth(),
        year: currentMonth.getFullYear(),
        isCurrentMonth: true,
      })
    }

    // Añadir días del mes siguiente para completar la última semana
    let lastDayOfWeek = lastDay.getDay() - 1
    if (lastDayOfWeek === -1) lastDayOfWeek = 6 // Si es domingo (0), convertir a 6

    const daysToAdd = 6 - lastDayOfWeek
    for (let i = 1; i <= daysToAdd; i++) {
      calendarDays.push({
        day: i,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear(),
        isCurrentMonth: false,
      })
    }

    // Verificar si un día es hoy
    const isToday = (day, month, year) => {
      const today = new Date()
      return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    }

    // Verificar si un día es el seleccionado
    const isSelected = (day, month, year) => {
      return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()
    }

    // Verificar si un día está en el pasado
    const isPastDay = (day, month, year) => {
      const today = new Date()
      const checkDate = new Date(year, month, day)
      return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="btn btn-sm btn-outline-secondary" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>
          <h3>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button className="btn btn-sm btn-outline-secondary" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="calendar-grid">
          {weekDays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            const isSelectedDay = isSelected(day.day, day.month, day.year)
            const isTodayDay = isToday(day.day, day.month, day.year)
            const isPast = isPastDay(day.day, day.month, day.year)

            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? "other-month" : ""} 
                             ${isSelectedDay ? "selected" : ""} 
                             ${isTodayDay ? "today" : ""} 
                             ${isPast ? "past" : ""}`}
                onClick={() => !isPast && handleDateSelect(day.day)}
              >
                <span className="day-number">{day.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return renderCalendar()
}


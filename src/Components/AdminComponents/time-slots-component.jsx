"use client"

export const TimeSlotsComponent = ({ timeSlots, selectedTimeSlot, onTimeSelect }) => {
  return (
    <div className="time-slots-container">
      <h4 className="time-slots-title">Horarios disponibles</h4>
      <div className="time-slots-grid">
        {timeSlots.length > 0 ? (
          timeSlots.map((timeSlot) => (
            <div
              key={timeSlot}
              className={`time-slot ${timeSlot === selectedTimeSlot ? "selected" : ""}`}
              onClick={() => onTimeSelect(timeSlot)}
            >
              {timeSlot}
            </div>
          ))
        ) : (
          <div className="no-slots-message">No hay horarios disponibles para esta fecha.</div>
        )}
      </div>
    </div>
  )
}


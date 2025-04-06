"use client"

import { Button } from "react-bootstrap"

const TimeSlots = ({ availableTimes, selectedTime, setSelectedTime }) => {
  return (
    <div>
      <h5 className="mb-3">Horarios Disponibles</h5>
      {availableTimes.length === 0 ? (
        <div className="alert alert-warning">No hay horarios disponibles para la fecha seleccionada.</div>
      ) : (
        <div className="time-slots-container">
          {availableTimes.map((time, index) => (
            <Button
              key={index}
              variant={selectedTime === time ? "success" : "outline-secondary"}
              className="time-slot-btn me-2 mb-2"
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimeSlots


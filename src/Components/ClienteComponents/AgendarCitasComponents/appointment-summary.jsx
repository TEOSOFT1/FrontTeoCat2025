"use client"

import { Card, ListGroup, Button, Form } from "react-bootstrap"
import { Link } from "react-router-dom"

const AppointmentSummary = ({
  selectedDate,
  selectedTime,
  selectedServices,
  removeService,
  calculateTotal,
  calculateDuration,
  formatDuration,
  currentStep,
}) => {
  return (
    <div className="appointment-summary sticky-top" style={{ top: "90px" }}>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <h4 className="mb-0">Resumen de la Cita</h4>
        </Card.Header>
        <Card.Body>
          <div className="appointment-date-time mb-4">
            <h5 className="mb-3">Fecha y Hora</h5>
            {selectedDate && selectedTime ? (
              <div>
                <p className="mb-1">
                  <i className="bi bi-calendar-event me-2" style={{ color: "#7ab51d" }}></i>
                  {selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="mb-0">
                  <i className="bi bi-clock me-2" style={{ color: "#7ab51d" }}></i>
                  {selectedTime} hrs
                </p>
              </div>
            ) : (
              <p className="text-muted">Selecciona fecha y hora para tu cita</p>
            )}
          </div>

          <div className="selected-services mb-4">
            <h5 className="mb-3">Servicios Seleccionados</h5>
            {selectedServices.length === 0 ? (
              <p className="text-muted">No has seleccionado ningún servicio</p>
            ) : (
              <ListGroup variant="flush" className="selected-services-list">
                {selectedServices.map((service) => (
                  <ListGroup.Item key={service.id} className="px-0 py-2 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{service.name}</h6>
                        <p className="mb-0 small text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {service.duration} min
                        </p>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <span className="service-price">${service.price.toLocaleString()}</span>
                        {currentStep === 2 && (
                          <Button variant="link" className="p-0 text-danger" onClick={() => removeService(service.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

          <div className="appointment-summary-details mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span>Duración total:</span>
              <span className="fw-bold">
                {selectedServices.length > 0 ? formatDuration(calculateDuration()) : "0 minutos"}
              </span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Total:</span>
              <span className="fw-bold fs-5" style={{ color: "#7ab51d" }}>
                ${calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          <div className="appointment-notes mb-4">
            <Form.Group controlId="appointmentNotes">
              <Form.Label>Notas adicionales</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Información adicional que debamos saber..." />
            </Form.Group>
          </div>

          <div className="appointment-policies mt-3">
            <p className="small text-muted mb-0">
              Al confirmar, aceptas nuestras <Link to="/terminos">políticas de cancelación</Link> y{" "}
              <Link to="/privacidad">términos de servicio</Link>.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AppointmentSummary


"use client"

import { Card, Button } from "react-bootstrap"

const ServiceCard = ({ service, addService, isSelected }) => {
  return (
    <Card className={`service-card h-100 border ${isSelected ? "selected" : ""}`}>
      <div className="service-card-img-container">
        <Card.Img variant="top" src={service.image} alt={service.name} className="service-card-img" />
        {isSelected && (
          <div className="service-selected-badge">
            <i className="bi bi-check-circle-fill"></i>
          </div>
        )}
      </div>
      <Card.Body>
        <Card.Title className="service-card-title">{service.name}</Card.Title>
        <Card.Text className="service-card-description">{service.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div className="service-card-details">
            <p className="service-card-price mb-0">${service.price.toLocaleString()}</p>
            <p className="service-card-duration mb-0">
              <i className="bi bi-clock me-1"></i>
              {service.duration} min
            </p>
          </div>
          <Button
            variant={isSelected ? "outline-success" : "success"}
            onClick={() => addService(service)}
            className="service-card-btn"
            disabled={isSelected}
          >
            {isSelected ? (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Agregado
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-1"></i>
                Agregar
              </>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ServiceCard


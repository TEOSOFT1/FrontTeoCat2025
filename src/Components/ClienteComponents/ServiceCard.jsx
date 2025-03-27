"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, Button } from "react-bootstrap"
import "./ServiceCard.scss"

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="service-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="service-card h-100 border-0 shadow-sm">
        <div className="card-img-container">
          <Card.Img
            variant="top"
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className={`service-image ${isHovered ? "zoomed" : ""}`}
          />
          <div className="service-overlay">
            <h3 className="service-name">{service.name}</h3>
          </div>
        </div>

        <Card.Body>
          <Card.Text className="service-description">{service.description}</Card.Text>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="service-price">Desde ${service.price.toLocaleString()}</span>

            <div className="service-button-container">
              <Button as={Link} to={`/agendar-cita?servicio=${service.id}`} variant="brown">
                Agendar
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ServiceCard


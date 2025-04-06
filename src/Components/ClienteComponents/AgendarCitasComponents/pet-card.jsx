"use client"

import { Card, Badge } from "react-bootstrap"

const PetCard = ({ pet, isSelected, onClick }) => {
  return (
    <Card className={`pet-card ${isSelected ? "selected" : ""}`} onClick={onClick}>
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="pet-avatar me-3">
            {pet.imagen ? (
              <img src={pet.imagen || "/placeholder.svg"} alt={pet.nombre} className="pet-image" />
            ) : (
              <i className={`bi ${pet.especie === "Perro" ? "bi-emoji-smile" : "bi-emoji-smile-upside-down"} fs-1`}></i>
            )}
          </div>
          <div>
            <h5 className="mb-1">{pet.nombre}</h5>
            <p className="mb-1">
              {pet.raza} • {pet.edad} años
            </p>
            <Badge bg={pet.tamaño === "Pequeño" ? "info" : "primary"}>{pet.tamaño}</Badge>
          </div>
          {isSelected && (
            <div className="pet-selected-check ms-auto">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default PetCard


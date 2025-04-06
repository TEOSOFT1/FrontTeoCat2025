"use client"

import { useState } from "react"
import { Card, Row, Col, Badge, Button, Modal, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import "./ProfileReviews.scss"

const ProfileReviews = ({ reviews, updateReviews }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: "",
  })

  // Manejar edición de reseña
  const handleEditClick = (review) => {
    setEditingReview(review)
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    })
    setShowEditModal(true)
  }

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    })
  }

  // Guardar cambios en la reseña
  const handleSaveReview = (e) => {
    e.preventDefault()

    if (!editForm.comment.trim()) {
      toast.error("Por favor escribe un comentario")
      return
    }

    // Actualizar la reseña
    const updatedReviews = reviews.map((review) => {
      if (review.id === editingReview.id) {
        return {
          ...review,
          rating: editForm.rating,
          comment: editForm.comment,
          date: new Date().toISOString().split("T")[0], // Actualizar la fecha
        }
      }
      return review
    })

    updateReviews(updatedReviews)
    setShowEditModal(false)
    toast.success("Reseña actualizada correctamente")
  }

  // Eliminar reseña
  const handleDeleteReview = (reviewId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
      const updatedReviews = reviews.filter((review) => review.id !== reviewId)
      updateReviews(updatedReviews)
      toast.success("Reseña eliminada correctamente")
    }
  }

  return (
    <>
      <Card className="border-0 shadow">
        <Card.Header className="profile-card-header">
          <h4 className="mb-0">Mis Reseñas</h4>
        </Card.Header>
        <Card.Body>
          {reviews.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-star fs-1 mb-3" style={{ color: "#7ab51d" }}></i>
              <h5>No has escrito reseñas aún</h5>
              <p className="mb-4">¡Comparte tu opinión sobre nuestros productos y servicios!</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/catalogo" className="btn btn-success">
                  Ver Productos
                </Link>
                <Link to="/servicios" className="btn btn-brown">
                  Ver Servicios
                </Link>
              </div>
            </div>
          ) : (
            <Row className="g-4">
              {reviews.map((review) => (
                <Col md={6} key={review.id}>
                  <Card className="review-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <Badge bg={review.type === "product" ? "success" : "info"} className="review-type-badge mb-2">
                            {review.type === "product" ? "Producto" : "Servicio"}
                          </Badge>
                          <h5 className="review-item-name">{review.itemName}</h5>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`bi ${i < review.rating ? "bi-star-fill" : "bi-star"} text-warning`}
                            ></i>
                          ))}
                        </div>
                      </div>

                      <div className="review-content mb-3">{review.comment}</div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="review-date text-muted">{review.date}</span>
                        <div className="review-actions">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditClick(review)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReview(review.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                    <div className="review-image-container">
                      <img src={review.image || "/placeholder.svg"} alt={review.itemName} className="review-image" />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Modal para editar reseña */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Reseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingReview && (
            <Form onSubmit={handleSaveReview}>
              <div className="mb-3">
                <h5>{editingReview.itemName}</h5>
                <Badge bg={editingReview.type === "product" ? "success" : "info"} className="review-type-badge">
                  {editingReview.type === "product" ? "Producto" : "Servicio"}
                </Badge>
              </div>

              <Form.Group className="mb-3" controlId="editRating">
                <Form.Label>Tu valoración *</Form.Label>
                <div className="d-flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="me-2">
                      <Form.Check
                        type="radio"
                        id={`star-${star}`}
                        name="rating"
                        value={star}
                        checked={editForm.rating === star}
                        onChange={handleFormChange}
                        label={
                          <i
                            className={`bi ${star <= editForm.rating ? "bi-star-fill" : "bi-star"} text-warning fs-4`}
                          ></i>
                        }
                      />
                    </div>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editComment">
                <Form.Label>Tu reseña *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="comment"
                  value={editForm.comment}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button variant="success" type="submit">
                  Guardar Cambios
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ProfileReviews


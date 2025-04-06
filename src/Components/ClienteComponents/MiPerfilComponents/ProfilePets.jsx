"use client"

import { useState, useRef } from "react"
import { Card, Button, Row, Col, Alert, Badge, Modal, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import "./ProfilePets.scss"

const ProfilePets = ({ pets, updatePets }) => {
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  // Estado para el modal de nueva mascota
  const [showPetModal, setShowPetModal] = useState(false)

  // Estado para el formulario de nueva mascota
  const [newPetForm, setNewPetForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    tamaño: "Pequeño",
    fechaNacimiento: "",
    foto: null,
    fotoPreview: "",
  })

  // Estado para el modal de editar mascota
  const [showEditPetModal, setShowEditPetModal] = useState(false)

  // Estado para la mascota que se está editando
  const [editingPet, setEditingPet] = useState(null)

  // Estado para mostrar detalles de mascota
  const [showPetDetails, setShowPetDetails] = useState(false)

  // Estado para la mascota seleccionada para ver detalles
  const [selectedPet, setSelectedPet] = useState(null)

  // Manejar cambios en el formulario de nueva mascota
  const handleNewPetChange = (e) => {
    const { name, value } = e.target
    setNewPetForm({
      ...newPetForm,
      [name]: value,
    })
  }

  // Manejar cambio de archivo para la foto de la mascota
  const handlePetPhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const filePreview = URL.createObjectURL(file)
      setNewPetForm({
        ...newPetForm,
        foto: file,
        fotoPreview: filePreview,
      })
    }
  }

  // Manejar cambio de archivo para editar la foto de la mascota
  const handleEditPetPhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const filePreview = URL.createObjectURL(file)
      setEditingPet({
        ...editingPet,
        foto: file,
        fotoPreview: filePreview,
      })
    }
  }

  // Manejar cambios en el formulario de editar mascota
  const handleEditPetChange = (e) => {
    const { name, value } = e.target
    setEditingPet({
      ...editingPet,
      [name]: value,
    })
  }

  // Agregar nueva mascota
  const handleAddPet = (e) => {
    e.preventDefault()

    // Validar formulario
    if (
      !newPetForm.nombre ||
      !newPetForm.especie ||
      !newPetForm.raza ||
      !newPetForm.tamaño ||
      !newPetForm.fechaNacimiento
    ) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    // Crear nueva mascota con la imagen (en producción, habría que subir la imagen)
    const newPet = {
      id: pets.length + 1,
      idCliente: 1, // Asumimos que el ID del cliente es 1
      nombre: newPetForm.nombre,
      especie: newPetForm.especie,
      raza: newPetForm.raza,
      tamaño: newPetForm.tamaño,
      fechaNacimiento: newPetForm.fechaNacimiento,
      image:
        newPetForm.fotoPreview ||
        (newPetForm.especie === "Perro"
          ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300"
          : "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300"),
    }

    // Agregar a la lista de mascotas
    updatePets([...pets, newPet])

    // Cerrar modal y resetear formulario
    setShowPetModal(false)
    setNewPetForm({
      nombre: "",
      especie: "",
      raza: "",
      tamaño: "Pequeño",
      fechaNacimiento: "",
      foto: null,
      fotoPreview: "",
    })

    toast.success("Mascota agregada correctamente")
  }

  // Abrir modal para editar mascota
  const handleEditPetClick = (pet) => {
    const petToEdit = { ...pet, foto: null, fotoPreview: pet.image || "" }
    setEditingPet(petToEdit)
    setShowEditPetModal(true)
  }

  // Abrir modal para ver detalles de mascota
  const handleViewPetDetails = (pet) => {
    setSelectedPet({ ...pet })
    setShowPetDetails(true)
  }

  // Guardar cambios de mascota
  const handleSavePet = (e) => {
    e.preventDefault()

    // Validar formulario
    if (
      !editingPet.nombre ||
      !editingPet.especie ||
      !editingPet.raza ||
      !editingPet.tamaño ||
      !editingPet.fechaNacimiento
    ) {
      toast.error("Por favor completa todos los campos")
      return
    }

    // Actualizar mascota en la lista
    const updatedPets = pets.map((pet) => {
      if (pet.id === editingPet.id) {
        // Si hay una nueva foto, usar su preview; de lo contrario, mantener la existente
        const updatedImage = editingPet.fotoPreview || pet.image
        return {
          ...editingPet,
          image: updatedImage,
        }
      }
      return pet
    })

    updatePets(updatedPets)

    // Cerrar modal
    setShowEditPetModal(false)
    setEditingPet(null)

    toast.success("Mascota actualizada correctamente")
  }

  // Eliminar mascota
  const handleDeletePet = (petId) => {
    // Confirmar eliminación
    if (window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      const updatedPets = pets.filter((pet) => pet.id !== petId)
      updatePets(updatedPets)
      toast.success("Mascota eliminada correctamente")
    }
  }

  return (
    <>
      <Card className="border-0 shadow">
        <Card.Header className="profile-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Mis Mascotas</h4>
            <Button variant="success" size="sm" onClick={() => setShowPetModal(true)}>
              <i className="bi bi-plus-circle me-1"></i> Añadir Mascota
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {pets.length === 0 ? (
            <Alert variant="info">
              <div className="text-center py-4">
                <i className="bi bi-emoji-smile fs-1 mb-3"></i>
                <h5>No tienes mascotas registradas</h5>
                <p className="mb-3">Registra a tus compañeros peludos para gestionar mejor sus citas y servicios.</p>
                <Button variant="success" onClick={() => setShowPetModal(true)}>
                  <i className="bi bi-plus-circle me-1"></i> Añadir Mascota
                </Button>
              </div>
            </Alert>
          ) : (
            <Row className="g-4">
              {pets.map((pet) => (
                <Col md={6} key={pet.id}>
                  <Card className="pet-card h-100">
                    <Row className="g-0">
                      <Col xs={4}>
                        <div className="pet-image-container">
                          <img src={pet.image || "/placeholder.svg"} alt={pet.nombre} className="pet-image" />
                        </div>
                      </Col>
                      <Col xs={8}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <Card.Title className="pet-name">{pet.nombre}</Card.Title>
                            <Badge bg={pet.especie === "Perro" ? "success" : "info"} className="pet-badge">
                              {pet.especie}
                            </Badge>
                          </div>
                          <Card.Text as="div" className="pet-details">
                            <p className="mb-1">
                              <strong>Raza:</strong> {pet.raza}
                            </p>
                            <p className="mb-1">
                              <strong>Tamaño:</strong> {pet.tamaño}
                            </p>
                            <p className="mb-3">
                              <strong>Nacimiento:</strong> {new Date(pet.fechaNacimiento).toLocaleDateString()}
                            </p>
                            <div className="pet-actions">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleViewPetDetails(pet)}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEditPetClick(pet)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDeletePet(pet.id)}>
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Modal para agregar mascota */}
      <Modal show={showPetModal} onHide={() => setShowPetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPet}>
            <Form.Group className="mb-3" controlId="petNombre">
              <Form.Label>Nombre de la mascota *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                name="nombre"
                value={newPetForm.nombre}
                onChange={handleNewPetChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petEspecie">
              <Form.Label>Especie *</Form.Label>
              <Form.Select name="especie" value={newPetForm.especie} onChange={handleNewPetChange} required>
                <option value="">Seleccionar...</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="petRaza">
              <Form.Label>Raza *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Raza"
                name="raza"
                value={newPetForm.raza}
                onChange={handleNewPetChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petTamaño">
              <Form.Label>Tamaño *</Form.Label>
              <Form.Select name="tamaño" value={newPetForm.tamaño} onChange={handleNewPetChange} required>
                <option value="Pequeño">Pequeño</option>
                <option value="Grande">Grande</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="petFechaNacimiento">
              <Form.Label>Fecha de nacimiento *</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={newPetForm.fechaNacimiento}
                onChange={handleNewPetChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petFoto">
              <Form.Label>Foto</Form.Label>
              <div className="d-flex align-items-center">
                <Button variant="outline-secondary" onClick={() => fileInputRef.current.click()} className="me-2">
                  <i className="bi bi-upload me-1"></i> Subir imagen
                </Button>
                <Form.Control
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePetPhotoChange}
                  style={{ display: "none" }}
                />
                <span className="small text-muted">
                  {newPetForm.foto ? newPetForm.foto.name : "No se ha seleccionado archivo"}
                </span>
              </div>
              {newPetForm.fotoPreview && (
                <div className="mt-2">
                  <img
                    src={newPetForm.fotoPreview || "/placeholder.svg"}
                    alt="Vista previa"
                    className="img-thumbnail"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
              <Form.Text className="text-muted">Sube una foto de tu mascota (opcional)</Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowPetModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar mascota */}
      <Modal show={showEditPetModal} onHide={() => setShowEditPetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingPet && (
            <Form onSubmit={handleSavePet}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="editPetId">
                    <Form.Label>ID Mascota</Form.Label>
                    <Form.Control type="text" value={editingPet.id} disabled className="bg-light" />
                    <Form.Text className="text-muted">El ID no se puede modificar</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="editPetIdCliente">
                    <Form.Label>ID Cliente</Form.Label>
                    <Form.Control type="text" value={editingPet.idCliente} disabled className="bg-light" />
                    <Form.Text className="text-muted">El ID del cliente no se puede modificar</Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="editPetNombre">
                <Form.Label>Nombre de la mascota *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  name="nombre"
                  value={editingPet.nombre}
                  onChange={handleEditPetChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetEspecie">
                <Form.Label>Especie *</Form.Label>
                <Form.Select name="especie" value={editingPet.especie} onChange={handleEditPetChange} required>
                  <option value="">Seleccionar...</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Otro">Otro</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetRaza">
                <Form.Label>Raza *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Raza"
                  name="raza"
                  value={editingPet.raza}
                  onChange={handleEditPetChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetTamaño">
                <Form.Label>Tamaño *</Form.Label>
                <Form.Select name="tamaño" value={editingPet.tamaño} onChange={handleEditPetChange} required>
                  <option value="Pequeño">Pequeño</option>
                  <option value="Grande">Grande</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetFechaNacimiento">
                <Form.Label>Fecha de nacimiento *</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={editingPet.fechaNacimiento}
                  onChange={handleEditPetChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetFoto">
                <Form.Label>Foto</Form.Label>
                <div className="d-flex align-items-center">
                  <Button variant="outline-secondary" onClick={() => editFileInputRef.current.click()} className="me-2">
                    <i className="bi bi-upload me-1"></i> Cambiar imagen
                  </Button>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    ref={editFileInputRef}
                    onChange={handleEditPetPhotoChange}
                    style={{ display: "none" }}
                  />
                  <span className="small text-muted">
                    {editingPet.foto ? editingPet.foto.name : "Mantener imagen actual"}
                  </span>
                </div>
                {editingPet.fotoPreview && (
                  <div className="mt-2">
                    <img
                      src={editingPet.fotoPreview || "/placeholder.svg"}
                      alt="Vista previa"
                      className="img-thumbnail"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowEditPetModal(false)}>
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

      {/* Modal para ver detalles de mascota */}
      <Modal show={showPetDetails} onHide={() => setShowPetDetails(false)} centered className="pet-details-modal">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de {selectedPet?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPet && (
            <div className="pet-details-container">
              <Row>
                <Col md={5}>
                  <div className="pet-detail-image-container">
                    <img
                      src={selectedPet.image || "/placeholder.svg"}
                      alt={selectedPet.nombre}
                      className="pet-detail-image"
                    />
                  </div>
                </Col>
                <Col md={7}>
                  <div className="pet-detail-info">
                    <h4 className="pet-detail-name">{selectedPet.nombre}</h4>
                    <Badge bg={selectedPet.especie === "Perro" ? "success" : "info"} className="pet-detail-badge mb-3">
                      {selectedPet.especie}
                    </Badge>

                    <div className="pet-detail-data">
                      <div className="pet-detail-item">
                        <span className="pet-detail-label">ID Mascota:</span>
                        <span className="pet-detail-value">{selectedPet.id}</span>
                      </div>
                      <div className="pet-detail-item">
                        <span className="pet-detail-label">Raza:</span>
                        <span className="pet-detail-value">{selectedPet.raza}</span>
                      </div>
                      <div className="pet-detail-item">
                        <span className="pet-detail-label">Tamaño:</span>
                        <span className="pet-detail-value">{selectedPet.tamaño}</span>
                      </div>
                      <div className="pet-detail-item">
                        <span className="pet-detail-label">Fecha de Nacimiento:</span>
                        <span className="pet-detail-value">
                          {new Date(selectedPet.fechaNacimiento).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-success"
            className="me-2"
            onClick={() => {
              setShowPetDetails(false)
              handleEditPetClick(selectedPet)
            }}
          >
            <i className="bi bi-pencil me-1"></i> Editar
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              setShowPetDetails(false)
              handleDeletePet(selectedPet.id)
            }}
          >
            <i className="bi bi-trash me-1"></i> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProfilePets


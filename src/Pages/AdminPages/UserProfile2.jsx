"use client"

import { useState, useRef } from "react"
import { 
  FiUser, 
  FiEdit2, 
  FiPhone, 
  FiMapPin, 
  FiFileText, 
  FiLock, 
  FiSave, 
  FiX, 
  FiCheck,
  FiCamera,
  FiUpload
} from "react-icons/fi"

const UserProfile2 = () => {
  const fileInputRef = useRef(null)
  
  // Estado inicial del usuario
  const [userData, setUserData] = useState({
    nombre: "Tatiana",
    apellido: "Duque",
    telefono: "3001234567",
    direccion: "Calle 123 #45-67, Medellín",
    documento: "1098765432",
    passwordOld: "",
    passwordNew: "",
    passwordConfirm: "",
    profileImage: "/placeholder.svg?height=200&width=200" // Imagen por defecto
  })

  // Estado para controlar qué campos están en modo edición
  const [editMode, setEditMode] = useState({
    nombre: false,
    apellido: false,
    telefono: false,
    direccion: false,
    password: false,
    profileImage: false
  })

  // Estado para mensajes de validación
  const [validation, setValidation] = useState({
    passwordOld: "",
    passwordNew: "",
    passwordConfirm: ""
  })

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validación de contraseñas
    if (name === "passwordNew" || name === "passwordConfirm") {
      validatePasswords(name, value)
    }
  }

  // Validación de contraseñas
  const validatePasswords = (field, value) => {
    let newValidation = { ...validation }

    if (field === "passwordNew") {
      if (value.length > 0 && value.length < 6) {
        newValidation.passwordNew = "La contraseña debe tener al menos 6 caracteres"
      } else {
        newValidation.passwordNew = ""
      }

      if (userData.passwordConfirm && value !== userData.passwordConfirm) {
        newValidation.passwordConfirm = "Las contraseñas no coinciden"
      } else if (userData.passwordConfirm) {
        newValidation.passwordConfirm = ""
      }
    }

    if (field === "passwordConfirm") {
      if (value !== userData.passwordNew) {
        newValidation.passwordConfirm = "Las contraseñas no coinciden"
      } else {
        newValidation.passwordConfirm = ""
      }
    }

    setValidation(newValidation)
  }

  // Activa el modo edición para un campo específico
  const toggleEditMode = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }))

    // Si estamos cancelando la edición de contraseña, limpiamos los campos
    if (field === "password" && editMode.password) {
      setUserData(prev => ({
        ...prev,
        passwordOld: "",
        passwordNew: "",
        passwordConfirm: ""
      }))
      setValidation({
        passwordOld: "",
        passwordNew: "",
        passwordConfirm: ""
      })
    }
  }

  // Maneja la selección de imagen de perfil
  const handleImageClick = () => {
    if (editMode.profileImage) {
      fileInputRef.current.click()
    }
  }

  // Maneja el cambio de imagen de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // En una implementación real, aquí subirías la imagen a un servidor
      // Por ahora, solo creamos una URL temporal
      const imageUrl = URL.createObjectURL(file)
      setUserData(prev => ({
        ...prev,
        profileImage: imageUrl
      }))
    }
  }

  // Guarda los cambios del perfil
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Datos actualizados:", userData)
    
    // Desactivamos todos los modos de edición
    setEditMode({
      nombre: false,
      apellido: false,
      telefono: false,
      direccion: false,
      password: false,
      profileImage: false
    })

    // Limpiamos los campos de contraseña
    setUserData(prev => ({
      ...prev,
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: ""
    }))

    // Mostraríamos un mensaje de éxito (usando react-toastify en una implementación real)
    alert("Perfil actualizado correctamente")
  }

  // Cancela todos los cambios
  const handleCancel = () => {
    // Recargar los datos originales (en una implementación real se obtendrían del servidor)
    setUserData({
      nombre: "Tatiana",
      apellido: "Duque",
      telefono: "3001234567",
      direccion: "Calle 123 #45-67, Medellín",
      documento: "1098765432",
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: "",
      profileImage: "/placeholder.svg?height=200&width=200"
    })
    
    // Desactivamos todos los modos de edición
    setEditMode({
      nombre: false,
      apellido: false,
      telefono: false,
      direccion: false,
      password: false,
      profileImage: false
    })

    setValidation({
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: ""
    })
  }

  return (
    <div className="profile-container">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h4 className="card-title mb-0">
            <FiUser className="me-2" />
            Mi Perfil
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Sección de imagen de perfil */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="profile-image-container text-center">
                  <div 
                    className={`profile-image-wrapper ${editMode.profileImage ? 'editable' : ''}`}
                    onClick={handleImageClick}
                  >
                    <img 
                      src={userData.profileImage || "/placeholder.svg"} 
                      alt="Foto de perfil" 
                      className="profile-image img-fluid rounded-circle"
                    />
                    {editMode.profileImage && (
                      <div className="image-overlay">
                        <FiCamera size={24} />
                        <div className="mt-2 small">Click para cambiar</div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    className={`btn btn-sm mt-2 ${editMode.profileImage ? 'btn-success' : 'btn-outline-primary'}`}
                    onClick={() => toggleEditMode("profileImage")}
                  >
                    {editMode.profileImage ? (
                      <>
                        <FiCheck className="me-1" /> Listo
                      </>
                    ) : (
                      <>
                        <FiUpload className="me-1" /> Cambiar foto
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="col-md-9">
                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-md-6">
                    <div className="profile-field">
                      <label className="form-label">Nombre</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FiUser />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          value={userData.nombre}
                          onChange={handleChange}
                          disabled={!editMode.nombre}
                        />
                        <button
                          type="button"
                          className={`btn ${editMode.nombre ? 'btn-success' : 'btn-outline-primary'}`}
                          onClick={() => toggleEditMode("nombre")}
                          title={editMode.nombre ? "Guardar" : "Editar"}
                        >
                          {editMode.nombre ? <FiCheck /> : <FiEdit2 />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Apellido */}
                  <div className="col-md-6">
                    <div className="profile-field">
                      <label className="form-label">Apellido</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FiUser />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="apellido"
                          value={userData.apellido}
                          onChange={handleChange}
                          disabled={!editMode.apellido}
                        />
                        <button
                          type="button"
                          className={`btn ${editMode.apellido ? 'btn-success' : 'btn-outline-primary'}`}
                          onClick={() => toggleEditMode("apellido")}
                          title={editMode.apellido ? "Guardar" : "Editar"}
                        >
                          {editMode.apellido ? <FiCheck /> : <FiEdit2 />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="col-md-6">
                    <div className="profile-field">
                      <label className="form-label">Teléfono</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FiPhone />
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          name="telefono"
                          value={userData.telefono}
                          onChange={handleChange}
                          disabled={!editMode.telefono}
                        />
                        <button
                          type="button"
                          className={`btn ${editMode.telefono ? 'btn-success' : 'btn-outline-primary'}`}
                          onClick={() => toggleEditMode("telefono")}
                          title={editMode.telefono ? "Guardar" : "Editar"}
                        >
                          {editMode.telefono ? <FiCheck /> : <FiEdit2 />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Documento (No editable) */}
                  <div className="col-md-6">
                    <div className="profile-field">
                      <label className="form-label">Documento</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FiFileText />
                        </span>
                        <input
                          type="text"
                          className="form-control bg-light"
                          name="documento"
                          value={userData.documento}
                          disabled
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          disabled
                          title="No editable"
                        >
                          <FiLock />
                        </button>
                      </div>
                      <small className="text-muted">El documento no es editable</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="profile-field">
                  <label className="form-label">Dirección</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiMapPin />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="direccion"
                      value={userData.direccion}
                      onChange={handleChange}
                      disabled={!editMode.direccion}
                    />
                    <button
                      type="button"
                      className={`btn ${editMode.direccion ? 'btn-success' : 'btn-outline-primary'}`}
                      onClick={() => toggleEditMode("direccion")}
                      title={editMode.direccion ? "Guardar" : "Editar"}
                    >
                      {editMode.direccion ? <FiCheck /> : <FiEdit2 />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Contraseña */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="password-section">
                  <div className="d-flex align-items-center mb-3">
                    <h5 className="mb-0">Cambiar Contraseña</h5>
                    <button
                      type="button"
                      className={`btn btn-sm ms-3 ${editMode.password ? 'btn-danger' : 'btn-outline-primary'}`}
                      onClick={() => toggleEditMode("password")}
                    >
                      {editMode.password ? (
                        <>
                          <FiX className="me-1" /> Cancelar
                        </>
                      ) : (
                        <>
                          <FiEdit2 className="me-1" /> Editar
                        </>
                      )}
                    </button>
                  </div>

                  {editMode.password && (
                    <div className="row g-3">
                      {/* Contraseña Antigua */}
                      <div className="col-md-4">
                        <div className="profile-field">
                          <label className="form-label">Contraseña Actual</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FiLock />
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              name="passwordOld"
                              value={userData.passwordOld}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          {validation.passwordOld && (
                            <div className="text-danger small mt-1">{validation.passwordOld}</div>
                          )}
                        </div>
                      </div>

                      {/* Nueva Contraseña */}
                      <div className="col-md-4">
                        <div className="profile-field">
                          <label className="form-label">Nueva Contraseña</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FiLock />
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              name="passwordNew"
                              value={userData.passwordNew}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          {validation.passwordNew && (
                            <div className="text-danger small mt-1">{validation.passwordNew}</div>
                          )}
                        </div>
                      </div>

                      {/* Confirmar Contraseña */}
                      <div className="col-md-4">
                        <div className="profile-field">
                          <label className="form-label">Confirmar Contraseña</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FiLock />
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              name="passwordConfirm"
                              value={userData.passwordConfirm}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          {validation.passwordConfirm && (
                            <div className="text-danger small mt-1">{validation.passwordConfirm}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
              >
                <FiX className="me-1" /> Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <FiSave className="me-1" /> Actualizar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserProfile2
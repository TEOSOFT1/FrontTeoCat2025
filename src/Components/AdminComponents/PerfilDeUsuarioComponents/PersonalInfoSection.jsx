"use client"

import { FiUser, FiPhone, FiMapPin, FiFileText, FiLock, FiCheck, FiEdit2 } from "react-icons/fi"

/**
 * Componente para la sección de información personal
 */
const PersonalInfoSection = ({ userData, editMode, handleChange, toggleEditMode }) => {
  return (
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
                className={`btn ${editMode.nombre ? "btn-success" : "btn-outline-primary"}`}
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
                className={`btn ${editMode.apellido ? "btn-success" : "btn-outline-primary"}`}
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
                className={`btn ${editMode.telefono ? "btn-success" : "btn-outline-primary"}`}
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
              <button type="button" className="btn btn-outline-secondary" disabled title="No editable">
                <FiLock />
              </button>
            </div>
            <small className="text-muted">El documento no es editable</small>
          </div>
        </div>

        {/* Dirección */}
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
                className={`btn ${editMode.direccion ? "btn-success" : "btn-outline-primary"}`}
                onClick={() => toggleEditMode("direccion")}
                title={editMode.direccion ? "Guardar" : "Editar"}
              >
                {editMode.direccion ? <FiCheck /> : <FiEdit2 />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoSection


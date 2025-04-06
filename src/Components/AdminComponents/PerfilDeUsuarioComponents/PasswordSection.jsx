"use client"

import { FiEdit2, FiX, FiLock } from "react-icons/fi"

/**
 * Componente para la sección de cambio de contraseña
 */
const PasswordSection = ({ userData, editMode, validation, handleChange, toggleEditMode }) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="password-section">
          <div className="d-flex align-items-center mb-3">
            <h5 className="mb-0">Cambiar Contraseña</h5>
            <button
              type="button"
              className={`btn btn-sm ms-3 ${editMode.password ? "btn-danger" : "btn-outline-primary"}`}
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
                  {validation.passwordOld && <div className="text-danger small mt-1">{validation.passwordOld}</div>}
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
                  {validation.passwordNew && <div className="text-danger small mt-1">{validation.passwordNew}</div>}
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
  )
}

export default PasswordSection


"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi"
import "../Styles/NuevaContra.css"

const NuevaContra = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validación básica
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    // Simulación de cambio de contraseña
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)

      // Redirigir al login después de un breve retraso
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="nueva-contra-page">
      <div className="auth-background"></div>
      <div className="auth-overlay"></div>

      <div className="nueva-contra-container">
        <div className="card nueva-contra-card">
          <div className="card-body p-0">
            <div className="row g-0 h-100">
              <div className="col-md-5 brand-side">
                <div className="brand-content">
                  <div className="logo-container">
                    <img src="./src/assets/Logo2.jpg" alt="TeoCat Logo" className="logo-image" />
                  </div>
                  <h1 className="brand-name">TeoCat</h1>
                  <p className="tagline">Productos y servicios premium para tus mascotas</p>
                  <div className="brand-decoration">
                    <div className="decoration-circle"></div>
                    <div className="decoration-circle"></div>
                    <div className="decoration-circle"></div>
                  </div>
                </div>
              </div>

              <div className="col-md-7 form-side">
                <div className="form-container">
                  <h2 className="form-title">Crear nueva contraseña</h2>
                  <p className="form-subtitle">Ingresa y confirma tu nueva contraseña</p>

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                  )}

                  {success ? (
                    <div className="success-container">
                      <div className="success-icon">
                        <FiCheck className="check-icon" />
                      </div>
                      <h4>¡Contraseña actualizada!</h4>
                      <p>Tu contraseña ha sido actualizada correctamente.</p>
                      <p>Serás redirigido a la página de inicio de sesión en unos segundos...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="nueva-contra-form">
                      <div className="form-group mb-4">
                        <label htmlFor="password" className="form-label">
                          Nueva contraseña
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text">
                            <FiLock className="icon" />
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Ingresa tu nueva contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FiEyeOff className="icon" /> : <FiEye className="icon" />}
                          </button>
                        </div>
                        <div className="password-strength mt-2">
                          <small
                            className={`strength-text ${formData.password.length >= 6 ? "text-success" : "text-muted"}`}
                          >
                            <i
                              className={`bi ${formData.password.length >= 6 ? "bi-check-circle-fill" : "bi-circle"} me-1`}
                            ></i>
                            Mínimo 6 caracteres
                          </small>
                        </div>
                      </div>

                      <div className="form-group mb-4">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirmar contraseña
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text">
                            <FiLock className="icon" />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirma tu nueva contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <FiEyeOff className="icon" /> : <FiEye className="icon" />}
                          </button>
                        </div>
                        <div className="password-match mt-2">
                          <small
                            className={`match-text ${formData.confirmPassword && formData.password === formData.confirmPassword ? "text-success" : "text-muted"}`}
                          >
                            <i
                              className={`bi ${formData.confirmPassword && formData.password === formData.confirmPassword ? "bi-check-circle-fill" : "bi-circle"} me-1`}
                            ></i>
                            Las contraseñas coinciden
                          </small>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary btn-lg w-100 mb-4" disabled={loading}>
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Procesando...
                          </>
                        ) : (
                          "Guardar Nueva Contraseña"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-footer">
        <p>&copy; {new Date().getFullYear()} TeoCat. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}

export default NuevaContra


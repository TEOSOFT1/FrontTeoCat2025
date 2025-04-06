"use client"

import { Link } from "react-router-dom"
import { Card, Nav } from "react-bootstrap"
import "./ProfileSidebar.scss"

const ProfileSidebar = ({ user, activeTab, setActiveTab }) => {
  return (
    <Card className="profile-sidebar border-0 shadow">
      <Card.Body className="p-0">
        <div className="profile-header text-center p-4">
          <div className="profile-image-container mb-3">
            <img src={user.profileImage || "/placeholder.svg"} alt={user.nombre} className="profile-image" />
            <div className="profile-image-overlay">
              <i className="bi bi-camera"></i>
            </div>
          </div>
          <h4 className="profile-name">
            {user.nombre} {user.apellido}
          </h4>
          <p className="profile-email mb-0">{user.correo}</p>
        </div>

        <Nav className="profile-nav flex-column">
          <Nav.Link
            as="button"
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <i className="bi bi-person nav-icon"></i>
            Mi Perfil
          </Nav.Link>
          <Nav.Link as="button" className={activeTab === "pets" ? "active" : ""} onClick={() => setActiveTab("pets")}>
            <i className="bi bi-heart nav-icon"></i>
            Mis Mascotas
          </Nav.Link>
          <Nav.Link
            as="button"
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bi bi-box-seam nav-icon"></i>
            Mis Pedidos
          </Nav.Link>
          <Nav.Link
            as="button"
            className={activeTab === "appointments" ? "active" : ""}
            onClick={() => setActiveTab("appointments")}
          >
            <i className="bi bi-calendar-check nav-icon"></i>
            Mis Citas
          </Nav.Link>
          <Nav.Link
            as="button"
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            <i className="bi bi-star nav-icon"></i>
            Mis Reseñas
          </Nav.Link>
          <Nav.Link
            as="button"
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            <i className="bi bi-shield-lock nav-icon"></i>
            Cambiar Contraseña
          </Nav.Link>
          <Nav.Link as={Link} to="/login" className="text-danger" onClick={() => localStorage.removeItem("token")}>
            <i className="bi bi-box-arrow-right nav-icon"></i>
            Cerrar Sesión
          </Nav.Link>
        </Nav>
      </Card.Body>
    </Card>
  )
}

export default ProfileSidebar


import "../../Styles/AdminStyles/Footer.css"
import PropTypes from "prop-types" // Para validar props (opcional)

const Footer = ({ logoText = "Teo", tagline = "Productos y servicios para mascotas", location = "Medellín, Colombia" }) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" aria-label="Pie de página">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Columna izquierda: Logo y eslogan */}
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <div className="footer-logo">
              <span className="logo-text">
                {logoText}<span className="text-success">/Cat</span>
              </span>
            </div>
            <p className="footer-tagline">{tagline}</p>
          </div>

          {/* Columna derecha: Derechos de autor y ubicación */}
          <div className="col-md-6 text-center text-md-end">
            <p className="footer-copyright">&copy; {currentYear} {logoText}/Cat. Todos los derechos reservados.</p>
            <p className="footer-location">{location}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Validación de props (opcional)
Footer.propTypes = {
  logoText: PropTypes.string,
  tagline: PropTypes.string,
  location: PropTypes.string,
}

export default Footer
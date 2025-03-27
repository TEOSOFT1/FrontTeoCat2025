import { Link } from "react-router-dom"

const SobreNosotrosPage = () => {
  return (
    <div className="container py-5 mt-5">
      {/* Banner de Sobre Nosotros */}
      <div className="position-relative mb-5 rounded overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1920"
          alt="Sobre Nosotros"
          className="w-100"
          style={{ height: "300px", objectFit: "cover", filter: "brightness(0.7)" }}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold">Sobre Nosotros</h1>
          <p className="lead">Conoce la historia de Teo/Cat</p>
        </div>
      </div>

      {/* Historia */}
      <div className="row mb-5 align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h2 style={{ color: "#5a3921" }}>Nuestra Historia</h2>
          <p>
            Teo/Cat nació en 2018 en Medellín, Colombia, como un pequeño negocio familiar impulsado por el amor a las
            mascotas. Fundada por los hermanos Alejandro y Carolina Martínez, quienes compartían la pasión por los
            animales y la visión de crear un espacio donde las mascotas y sus dueños pudieran encontrar todo lo
            necesario para su bienestar.
          </p>
          <p>
            Lo que comenzó como una pequeña tienda con productos básicos, rápidamente se transformó en un centro
            integral para mascotas, añadiendo servicios de peluquería, veterinaria y adiestramiento. El nombre "Teo/Cat"
            surgió de la combinación de los nombres de las mascotas de los fundadores: Teo, un labrador juguetón, y Cat,
            una gata siamés con personalidad única.
          </p>
          <p>
            Hoy, Teo/Cat se ha convertido en un referente en Medellín para todos los amantes de las mascotas,
            manteniendo siempre su esencia familiar y el compromiso con el bienestar animal.
          </p>
        </div>
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1593620659530-7f98c53de278?q=80&w=1000"
            alt="Historia de Teo/Cat"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      {/* Misión, Visión y Valores */}
      <div className="row mb-5">
        <div className="col-md-4 mb-4 mb-md-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-bullseye fs-1" style={{ color: "#7ab51d" }}></i>
              </div>
              <h3 style={{ color: "#5a3921" }}>Misión</h3>
              <p>
                Proporcionar productos y servicios de alta calidad para mascotas, contribuyendo a su bienestar y
                felicidad, mientras creamos una comunidad de dueños responsables y comprometidos con el cuidado animal.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4 mb-md-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-eye fs-1" style={{ color: "#7ab51d" }}></i>
              </div>
              <h3 style={{ color: "#5a3921" }}>Visión</h3>
              <p>
                Ser reconocidos como la empresa líder en el cuidado integral de mascotas en Colombia, expandiendo
                nuestra presencia a nivel nacional y siendo referentes en innovación, calidad y servicio.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-heart fs-1" style={{ color: "#7ab51d" }}></i>
              </div>
              <h3 style={{ color: "#5a3921" }}>Valores</h3>
              <ul className="list-unstyled text-start">
                <li>
                  <i className="bi bi-check-circle-fill me-2" style={{ color: "#7ab51d" }}></i> Amor por los animales
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2" style={{ color: "#7ab51d" }}></i> Compromiso con la
                  calidad
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2" style={{ color: "#7ab51d" }}></i> Responsabilidad social
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2" style={{ color: "#7ab51d" }}></i> Innovación constante
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2" style={{ color: "#7ab51d" }}></i> Atención personalizada
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Nuestro Equipo */}
      <div className="mb-5">
        <h2 className="text-center mb-5" style={{ color: "#5a3921" }}>
          Nuestro Equipo
        </h2>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle overflow-hidden mx-auto mb-3"
                  style={{ width: "150px", height: "150px" }}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Alejandro Martínez"
                    className="img-fluid"
                  />
                </div>
                <h4 style={{ color: "#5a3921" }}>Alejandro Martínez</h4>
                <p className="text-muted">Co-Fundador & Director</p>
                <p>Veterinario apasionado por el bienestar animal con más de 10 años de experiencia.</p>
                <div className="d-flex justify-content-center gap-2">
                  <a href="#" className="text-muted">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle overflow-hidden mx-auto mb-3"
                  style={{ width: "150px", height: "150px" }}
                >
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Carolina Martínez"
                    className="img-fluid"
                  />
                </div>
                <h4 style={{ color: "#5a3921" }}>Carolina Martínez</h4>
                <p className="text-muted">Co-Fundadora & Gerente</p>
                <p>Administradora de empresas con especialización en marketing y atención al cliente.</p>
                <div className="d-flex justify-content-center gap-2">
                  <a href="#" className="text-muted">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle overflow-hidden mx-auto mb-3"
                  style={{ width: "150px", height: "150px" }}
                >
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Laura Gómez" className="img-fluid" />
                </div>
                <h4 style={{ color: "#5a3921" }}>Laura Gómez</h4>
                <p className="text-muted">Veterinaria Principal</p>
                <p>Especialista en medicina preventiva y nutrición animal con enfoque holístico.</p>
                <div className="d-flex justify-content-center gap-2">
                  <a href="#" className="text-muted">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle overflow-hidden mx-auto mb-3"
                  style={{ width: "150px", height: "150px" }}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="Carlos Restrepo"
                    className="img-fluid"
                  />
                </div>
                <h4 style={{ color: "#5a3921" }}>Carlos Restrepo</h4>
                <p className="text-muted">Jefe de Peluquería</p>
                <p>Estilista canino certificado con más de 8 años de experiencia en razas de todo tipo.</p>
                <div className="d-flex justify-content-center gap-2">
                  <a href="#" className="text-muted">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="bi bi-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nuestras Instalaciones */}
      <div className="mb-5">
        <h2 className="text-center mb-5" style={{ color: "#5a3921" }}>
          Nuestras Instalaciones
        </h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <img
                src="https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=500"
                alt="Tienda"
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h4 style={{ color: "#5a3921" }}>Tienda</h4>
                <p>
                  Nuestra tienda cuenta con más de 500 productos seleccionados cuidadosamente para satisfacer todas las
                  necesidades de tu mascota.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <img
                src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=500"
                alt="Clínica Veterinaria"
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h4 style={{ color: "#5a3921" }}>Clínica Veterinaria</h4>
                <p>
                  Equipada con tecnología de punta para ofrecer diagnósticos precisos y tratamientos efectivos para tu
                  mascota.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500"
                alt="Sala de Peluquería"
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h4 style={{ color: "#5a3921" }}>Sala de Peluquería</h4>
                <p>
                  Espacio diseñado para que tu mascota se sienta cómoda mientras recibe los mejores cuidados estéticos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios */}
      <div className="mb-5">
        <h2 className="text-center mb-5" style={{ color: "#5a3921" }}>
          Lo que dicen nuestros clientes
        </h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className="card-text">
                  "Desde que descubrí Teo/Cat, mi perro Max está más feliz y saludable. El personal es increíblemente
                  amable y profesional."
                </p>
                <div className="d-flex align-items-center mt-3">
                  <div className="rounded-circle overflow-hidden me-3" style={{ width: "50px", height: "50px" }}>
                    <img
                      src="https://randomuser.me/api/portraits/women/12.jpg"
                      alt="Cliente"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ color: "#5a3921" }}>
                      Carolina Ramírez
                    </h6>
                    <small className="text-muted">Cliente desde 2021</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className="card-text">
                  "La atención veterinaria es excelente. Diagnosticaron rápidamente a mi gata y el tratamiento fue
                  efectivo. Ahora compramos todos sus productos aquí."
                </p>
                <div className="d-flex align-items-center mt-3">
                  <div className="rounded-circle overflow-hidden me-3" style={{ width: "50px", height: "50px" }}>
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Cliente"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ color: "#5a3921" }}>
                      Andrés Gómez
                    </h6>
                    <small className="text-muted">Cliente desde 2022</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-half text-warning"></i>
                </div>
                <p className="card-text">
                  "Los servicios de peluquería son los mejores de la ciudad. Mi perrita siempre queda hermosa y se nota
                  que la tratan con mucho cariño."
                </p>
                <div className="d-flex align-items-center mt-3">
                  <div className="rounded-circle overflow-hidden me-3" style={{ width: "50px", height: "50px" }}>
                    <img
                      src="https://randomuser.me/api/portraits/women/65.jpg"
                      alt="Cliente"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ color: "#5a3921" }}>
                      Valentina Mejía
                    </h6>
                    <small className="text-muted">Cliente desde 2020</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Llamado a la acción */}
      <div className="text-center py-5 px-4 rounded" style={{ backgroundColor: "#5a3921", color: "white" }}>
        <h2 className="mb-3" style={{ color: "#7ab51d" }}>
          ¡Visítanos y conoce Teo/Cat!
        </h2>
        <p className="lead mb-4">
          Estamos ubicados en el corazón de Medellín, listos para atenderte a ti y a tu mascota.
        </p>
        <Link to="/catalogo" className="btn btn-lg me-2" style={{ backgroundColor: "#7ab51d", color: "white" }}>
          Ver Productos
        </Link>
        <Link to="/servicios" className="btn btn-lg" style={{ backgroundColor: "white", color: "#5a3921" }}>
          Conocer Servicios
        </Link>
      </div>
    </div>
  )
}

export default SobreNosotrosPage


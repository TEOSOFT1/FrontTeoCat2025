"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Package, Calendar, RefreshCw, Search, Star, FileText } from "lucide-react"
import NotificationCard from "../../../Components/AdminComponents/NotificacionesComponents/NotificationCard"
import NotificationRow from "../../../Components/AdminComponents/NotificacionesComponents/NotificationRow"
import ReviewNotificationCard from "../../../Components/AdminComponents/NotificacionesComponents/ReviewNotificationCard"
import ReviewNotificationRow from "../../../Components/AdminComponents/NotificacionesComponents/ReviewNotificationRow"
import PaymentReceiptCard from "../../../Components/AdminComponents/NotificacionesComponents/PaymentReceiptCard"
import PaymentReceiptRow from "../../../Components/AdminComponents/NotificacionesComponents/PaymentReceiptRow"
import CitasNotificationCard from "../../../Components/AdminComponents/NotificacionesComponents/CitasNotificationCard"
import CitasNotificationRow from "../../../Components/AdminComponents/NotificacionesComponents/CitasNotificationRow"
import "../../../Styles/AdminStyles/Notificaciones.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de notificaciones
 * Muestra un catálogo visual de productos con alertas sobre stock bajo, fechas de vencimiento,
 * reseñas de productos/servicios, comprobantes de pago y citas
 * Permite marcar notificaciones como vistas o resueltas
 */
const Notificaciones = () => {
  // Estados para las notificaciones
  const [notificaciones, setNotificaciones] = useState([])
  const [filteredNotificaciones, setFilteredNotificaciones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado para el filtro activo
  const [filtroActivo, setFiltroActivo] = useState("todas")

  // Estado para el tipo de notificación activo
  const [tipoActivo, setTipoActivo] = useState("todas")

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para la vista (grid o lista)
  const [viewMode, setViewMode] = useState("grid")

  // Referencias para las notificaciones toast
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener notificaciones
   */
  useEffect(() => {
    const fetchNotificaciones = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Aquí se implementaría la llamada real a la API
        // Por ahora, simulamos datos de ejemplo
        const response = await simulateFetchNotificaciones()

        // Validar la estructura de los datos recibidos
        if (!Array.isArray(response)) {
          throw new Error("Los datos recibidos no tienen el formato esperado")
        }

        // Validar cada notificación
        const validatedNotificaciones = response.filter((notif) => {
          // Validar campos obligatorios
          if (!notif.id || !notif.tipo || !notif.estado || !notif.fechaCreacion) {
            console.warn("Notificación con campos obligatorios faltantes:", notif)
            return false
          }

          // Validar tipos permitidos
          const tiposValidos = ["stock", "vencimiento", "reseña", "comprobante", "cita"]
          if (!tiposValidos.includes(notif.tipo)) {
            console.warn("Notificación con tipo no válido:", notif)
            return false
          }

          // Validar estados permitidos
          const estadosValidos = ["pendiente", "vista", "resuelta", "aprobado", "rechazado"]
          if (!estadosValidos.includes(notif.estado)) {
            console.warn("Notificación con estado no válido:", notif)
            return false
          }

          // Validar prioridades permitidas
          const prioridadesValidas = ["baja", "media", "alta", "critica"]
          if (!prioridadesValidas.includes(notif.prioridad)) {
            console.warn("Notificación con prioridad no válida:", notif)
            return false
          }

          return true
        })

        setNotificaciones(validatedNotificaciones)
        setFilteredNotificaciones(validatedNotificaciones)
      } catch (err) {
        console.error("Error al cargar notificaciones:", err)
        setError("Error al cargar las notificaciones. Por favor, intente nuevamente.")
      } finally {
        setIsLoading(false)
      }

      // Iniciar animación de fondo
      initParticlesBackground()
    }

    fetchNotificaciones()
  }, [])

  /**
   * Función para simular la obtención de datos
   * @returns {Promise<Array>} Promesa con los datos simulados
   */
  const simulateFetchNotificaciones = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          // Aquí irían los datos de ejemplo
          // Estos datos se reemplazarían por la respuesta real de la API
        ])
      }, 1000)
    })
  }

  /**
   * Función para inicializar el fondo animado con partículas
   */
  const initParticlesBackground = () => {
    // Esta función simula la inicialización de un fondo de partículas
    // En una implementación real, aquí se inicializaría una librería como particles.js
    console.log("Fondo de partículas inicializado")
  }

  /**
   * Efecto para aplicar filtros cuando cambian
   */
  useEffect(() => {
    if (notificaciones.length === 0) {
      setFilteredNotificaciones([])
      return
    }

    let resultado = [...notificaciones]

    // Filtrar por estado
    if (filtroActivo !== "todas") {
      resultado = resultado.filter((notif) => notif.estado === filtroActivo)
    }

    // Filtrar por tipo
    if (tipoActivo !== "todas") {
      resultado = resultado.filter((notif) => notif.tipo === tipoActivo)
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      resultado = resultado.filter(
        (notif) =>
          notif.producto?.nombre?.toLowerCase().includes(term) ||
          false ||
          notif.mensaje?.toLowerCase().includes(term) ||
          false ||
          notif.cliente?.nombre?.toLowerCase().includes(term) ||
          false ||
          notif.cliente?.documento?.toLowerCase().includes(term) ||
          false ||
          notif.comentario?.toLowerCase().includes(term) ||
          false ||
          notif.numeroPedido?.toString().includes(term) ||
          false ||
          notif.mascotas?.some((mascota) => mascota.nombre.toLowerCase().includes(term)) ||
          false ||
          notif.servicios?.some((servicio) => servicio.nombre.toLowerCase().includes(term)) ||
          false,
      )
    }

    setFilteredNotificaciones(resultado)
  }, [filtroActivo, tipoActivo, searchTerm, notificaciones])

  /**
   * Manejador para cambiar el estado de una notificación
   * @param {number} id - ID de la notificación
   * @param {string} nuevoEstado - Nuevo estado a aplicar
   * @param {string} [notasAdicionales] - Notas adicionales (para rechazos)
   */
  const cambiarEstadoNotificacion = async (id, nuevoEstado, notasAdicionales = "") => {
    try {
      // Validar el nuevo estado
      const estadosValidos = ["pendiente", "vista", "resuelta", "aprobado", "rechazado"]
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado no válido: ${nuevoEstado}`)
      }

      // Validar que la notificación existe
      const notificacion = notificaciones.find((n) => n.id === id)
      if (!notificacion) {
        throw new Error(`Notificación no encontrada: ${id}`)
      }

      // Validar transiciones de estado permitidas
      if (nuevoEstado === "aprobado" || nuevoEstado === "rechazado") {
        if (notificacion.tipo !== "comprobante") {
          throw new Error(`El estado ${nuevoEstado} solo es válido para comprobantes`)
        }
      }

      // Si es rechazo, validar que hay notas adicionales
      if (nuevoEstado === "rechazado" && !notasAdicionales.trim()) {
        throw new Error("Se requiere un motivo para rechazar el comprobante")
      }

      // Aquí iría la llamada a la API para actualizar el estado
      // Por ahora, actualizamos el estado local

      const updatedNotificaciones = notificaciones.map((notif) => {
        if (notif.id === id) {
          return {
            ...notif,
            estado: nuevoEstado,
            ...(notasAdicionales ? { notasAdicionales } : {}),
          }
        }
        return notif
      })

      setNotificaciones(updatedNotificaciones)

      // Mostrar notificación de éxito
      mostrarNotificacionExito(id, nuevoEstado)
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error(
        <div>
          <strong>Error</strong>
          <p>{error.message || "No se pudo actualizar el estado de la notificación"}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
        },
      )
    }
  }

  /**
   * Función para mostrar notificación de éxito al cambiar estado
   * @param {number} id - ID de la notificación
   * @param {string} nuevoEstado - Nuevo estado aplicado
   */
  const mostrarNotificacionExito = (id, nuevoEstado) => {
    const notif = notificaciones.find((n) => n.id === id)
    if (!notif) return

    let mensaje = ""
    let icono = "✅"

    if (notif.tipo === "reseña") {
      mensaje = `La reseña para "${notif.producto.nombre}" ha sido marcada como "${nuevoEstado}".`
    } else if (notif.tipo === "comprobante") {
      if (nuevoEstado === "aprobado") {
        mensaje = `El comprobante de pago #${notif.numeroPedido} ha sido aprobado.`
      } else if (nuevoEstado === "rechazado") {
        mensaje = `El comprobante de pago #${notif.numeroPedido} ha sido rechazado.`
        icono = "❌"
      }
    } else if (notif.tipo === "cita") {
      mensaje = `La notificación de cita para el cliente "${notif.cliente.nombre}" ha sido marcada como "${nuevoEstado}".`
    } else {
      mensaje = `La notificación para "${notif.producto.nombre}" ha sido marcada como "${nuevoEstado}".`
    }

    if (toastIds.current[id]) {
      toast.dismiss(toastIds.current[id])
    }

    toastIds.current[id] = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>{mensaje}</p>
      </div>,
      {
        icon: icono,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    )
  }

  /**
   * Manejador para cambiar el filtro activo
   * @param {string} filtro - Filtro a aplicar
   */
  const cambiarFiltro = (filtro) => {
    setFiltroActivo(filtro)
  }

  /**
   * Manejador para cambiar el tipo activo
   * @param {string} tipo - Tipo a filtrar
   */
  const cambiarTipo = (tipo) => {
    setTipoActivo(tipo)
  }

  /**
   * Función para obtener el conteo de notificaciones por estado
   * @param {string} estado - Estado a contar
   * @returns {number} Cantidad de notificaciones
   */
  const contarNotificaciones = (estado) => {
    if (estado === "todas") {
      return notificaciones.length
    }
    return notificaciones.filter((notif) => notif.estado === estado).length
  }

  /**
   * Función para obtener el conteo de notificaciones por tipo
   * @param {string} tipo - Tipo a contar
   * @returns {number} Cantidad de notificaciones
   */
  const contarTipoNotificaciones = (tipo) => {
    if (tipo === "todas") {
      return notificaciones.length
    }
    return notificaciones.filter((notif) => notif.tipo === tipo).length
  }

  /**
   * Función para refrescar las notificaciones
   * Simula una recarga de datos
   */
  const refrescarNotificaciones = async () => {
    toast.info(
      <div>
        <strong>Actualizando</strong>
        <p>Buscando nuevas notificaciones...</p>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
      },
    )

    setIsLoading(true)

    try {
      // Aquí iría la llamada a la API para recargar datos
      const response = await simulateFetchNotificaciones()

      // Validar y actualizar los datos
      if (!Array.isArray(response)) {
        throw new Error("Los datos recibidos no tienen el formato esperado")
      }

      setNotificaciones(response)

      toast.success(
        <div>
          <strong>Actualización completada</strong>
          <p>Las notificaciones han sido actualizadas.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 2000,
        },
      )
    } catch (error) {
      console.error("Error al refrescar notificaciones:", error)
      toast.error(
        <div>
          <strong>Error</strong>
          <p>No se pudieron actualizar las notificaciones.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
        },
      )
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Función para cambiar el modo de visualización
   * @param {string} mode - Modo de visualización (grid o lista)
   */
  const changeViewMode = (mode) => {
    setViewMode(mode)
  }

  /**
   * Función para manejar cambios en el campo de búsqueda
   * @param {Event} e - Evento del input
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  /**
   * Función para renderizar la notificación según su tipo
   * @param {Object} notificacion - Objeto de notificación
   * @returns {JSX.Element} Componente de notificación
   */
  const renderNotificacion = (notificacion) => {
    if (!notificacion || typeof notificacion !== "object") {
      console.error("Notificación inválida:", notificacion)
      return null
    }

    if (viewMode === "grid") {
      // Vista de cuadrícula
      switch (notificacion.tipo) {
        case "reseña":
          return (
            <ReviewNotificationCard
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        case "comprobante":
          return (
            <PaymentReceiptCard
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        case "cita":
          return (
            <CitasNotificationCard
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        case "stock":
        case "vencimiento":
          return (
            <NotificationCard
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        default:
          console.warn("Tipo de notificación desconocido:", notificacion.tipo)
          return null
      }
    } else {
      // Vista de lista
      switch (notificacion.tipo) {
        case "reseña":
          return (
            <ReviewNotificationRow
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        case "comprobante":
          return (
            <PaymentReceiptRow
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        case "cita":
          return (
            <CitasNotificationRow
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        case "stock":
        case "vencimiento":
          return (
            <NotificationRow
              key={notificacion.id}
              notificacion={notificacion}
              onChangeStatus={cambiarEstadoNotificacion}
            />
          )
        default:
          console.warn("Tipo de notificación desconocido:", notificacion.tipo)
          return null
      }
    }
  }

  return (
    <div className="notificaciones-container">
      <div className="particles-bg"></div>

      <div className="content-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">
            <Bell className="me-2" />
            Notificaciones
          </h2>
          <button
            className="btn btn-primary d-flex align-items-center refresh-btn"
            onClick={refrescarNotificaciones}
            disabled={isLoading}
          >
            <RefreshCw size={18} className={`me-1 ${isLoading ? "spin-animation" : ""}`} />
            {isLoading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* Barra de filtros mejorada */}
        <div className="filters-bar">
          {/* Barra de búsqueda primero */}
          <div className="filters-group search-group">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos, clientes, pedidos..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="filters-container">
            {/* Filtros de estado */}
            <div className="filter-section">
              <div className="filters-group">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "todas" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("todas")}
                  >
                    Todas ({contarNotificaciones("todas")})
                  </button>
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "pendiente" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("pendiente")}
                  >
                    Pendientes ({contarNotificaciones("pendiente")})
                  </button>
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "vista" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("vista")}
                  >
                    Vistas ({contarNotificaciones("vista")})
                  </button>
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "resuelta" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("resuelta")}
                  >
                    Resueltas ({contarNotificaciones("resuelta")})
                  </button>
                </div>
              </div>
            </div>

            {/* Filtros de tipo */}
            <div className="filter-section">
              <div className="filters-group">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "todas" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("todas")}
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "stock" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("stock")}
                  >
                    <Package size={16} className="me-1" />
                    Stock
                  </button>
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "vencimiento" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("vencimiento")}
                  >
                    <Calendar size={16} className="me-1" />
                    Vencimiento
                  </button>
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "reseña" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("reseña")}
                  >
                    <Star size={16} className="me-1" />
                    Reseñas
                  </button>
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "comprobante" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("comprobante")}
                  >
                    <FileText size={16} className="me-1" />
                    Comprobantes
                  </button>
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "cita" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("cita")}
                  >
                    <Calendar size={16} className="me-1" />
                    Citas
                  </button>
                </div>
              </div>
            </div>

            {/* Selector de vista */}
            <div className="filter-section" style={{ flex: "0 0 auto", minWidth: "auto" }}>
              <div className="filters-group view-mode-group">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => changeViewMode("grid")}
                  >
                    <i className="bi bi-grid"></i>
                    Cuadrícula
                  </button>
                  <button
                    type="button"
                    className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => changeViewMode("list")}
                  >
                    <i className="bi bi-list"></i>
                    Lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando notificaciones...</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && !isLoading && (
          <div className="alert alert-danger mt-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <h5 className="mb-1">Error</h5>
                <p className="mb-0">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de notificaciones */}
        {!isLoading && !error && (
          <>
            {filteredNotificaciones.length > 0 ? (
              <div className={`products-container ${viewMode === "grid" ? "grid-view" : "list-view"}`}>
                {filteredNotificaciones.map((notificacion) => renderNotificacion(notificacion))}
              </div>
            ) : (
              <div className="alert alert-info mt-4">
                <div className="d-flex align-items-center">
                  <Bell size={24} className="me-3" />
                  <div>
                    <h5 className="mb-1">No hay notificaciones</h5>
                    <p className="mb-0">No se encontraron notificaciones con los filtros seleccionados.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
    </div>
  )
}

export default Notificaciones


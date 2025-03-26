"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { AlertTriangle, Calendar, Clock, User, Scissors } from "lucide-react"
import "../../Styles/AdminStyles/AgendarCitas.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de citas
 * Permite visualizar, crear, editar y cancelar citas
 */
const AgendarCitas = () => {
  const navigate = useNavigate()

  // Estado para las citas
  const [citas, setCitas] = useState([])

  // Estado para clientes y servicios
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState([])

  // Estado para el modal de cita
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Ver Detalles de la Cita")
  const [currentCita, setCurrentCita] = useState(null)

  // Estado para el modal de confirmación de cancelación
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [citaToCancel, setCitaToCancel] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Función para formatear números con separadores de miles
   * @param {number} number - Número a formatear
   * @returns {string} Número formateado con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  /**
   * Función para formatear duración en minutos a formato legible
   * @param {number} minutos - Duración en minutos
   * @returns {string} Duración formateada (ej: "1 h 30 min")
   */
  const formatDuracion = (minutos) => {
    if (minutos < 60) {
      return `${minutos} min`
    } else {
      const horas = Math.floor(minutos / 60)
      const min = minutos % 60
      return min > 0 ? `${horas} h ${min} min` : `${horas} h`
    }
  }

  // Definición de columnas para la tabla
  const columns = [
    { field: "cliente.nombre", header: "Cliente" },
    { field: "fecha", header: "Fecha" },
    { field: "hora", header: "Hora" },
    { field: "servicio.nombre", header: "Servicio" },
    {
      field: "servicio.precio",
      header: "Precio",
      render: (row) => `$${formatNumber(row.servicio.precio)}`,
    },
    {
      field: "estado",
      header: "Estado",
      render: (row) => (
        <span
          className={`badge ${
            row.estado === "Programada"
              ? "bg-warning"
              : row.estado === "Confirmada"
                ? "bg-primary"
                : row.estado === "Completada"
                  ? "bg-success"
                  : "bg-danger"
          }`}
        >
          {row.estado}
        </span>
      ),
    },
    {
      field: "acciones",
      header: "Acciones",
      render: (row) => (
        <TableActions
          actions={["view", "edit", row.estado !== "Cancelada" ? "cancel" : null]}
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onCancel={handleCancel}
          customLabels={{
            cancel: "Cancelar cita",
          }}
        />
      ),
    },
  ]

  /**
   * Manejador para ver detalles de una cita
   * @param {Object} cita - Objeto de cita a visualizar
   */
  const handleView = (cita) => {
    setCurrentCita(cita)
    setModalTitle("Ver Detalles de la Cita")
    setShowModal(true)
  }

  /**
   * Manejador para editar una cita
   * Redirige a la vista de NuevaCita con el ID de la cita a editar
   * @param {Object} cita - Objeto de cita a editar
   */
  const handleEdit = (cita) => {
    // Redirigir a la vista de edición
    navigate(`/servicios/NuevaCita?id=${cita.id}`)
  }

  /**
   * Manejador para iniciar el proceso de cancelación de una cita
   * @param {Object} cita - Objeto de cita a cancelar
   */
  const handleCancel = (cita) => {
    // Solo permitir cancelar citas que no estén ya canceladas
    if (cita.estado === "Cancelada") {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Esta cita ya está cancelada.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    setCitaToCancel(cita)
    setShowCancelConfirm(true)
  }

  /**
   * Función para confirmar la cancelación de la cita
   * Actualiza el estado de la cita a "Cancelada"
   */
  const confirmCancel = () => {
    if (citaToCancel) {
      const updatedCitas = citas.map((c) => {
        if (c.id === citaToCancel.id) {
          return {
            ...c,
            estado: "Cancelada",
          }
        }
        return c
      })

      setCitas(updatedCitas)

      // Añadir notificación
      if (toastIds.current.cancel) {
        toast.dismiss(toastIds.current.cancel)
      }

      toastIds.current.cancel = toast.info(
        <div>
          <strong>Cita cancelada</strong>
          <p>La cita ha sido cancelada correctamente.</p>
        </div>,
        {
          icon: "🚫",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    }
    setShowCancelConfirm(false)
    setCitaToCancel(null)
  }

  /**
   * Función para cancelar el proceso de cancelación de cita
   */
  const cancelCancel = () => {
    setShowCancelConfirm(false)
    setCitaToCancel(null)
  }

  /**
   * Manejador para cerrar el modal de detalles
   */
  const handleCloseDetallesModal = () => {
    setShowModal(false)
    setCurrentCita(null)
  }

  /**
   * Manejador para redirigir a la vista de agendar cita
   */
  const handleAddCita = () => {
    navigate("/servicios/NuevaCita")
  }

  /**
   * Efecto para inicializar el modal de Bootstrap
   */
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("detallesCitaModal")

    if (showModal && modalElement) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
    }

    // Evento para cuando el modal se cierra con el botón X o haciendo clic fuera
    const handleHidden = () => {
      setShowModal(false)
      setCurrentCita(null)

      // Asegurarse de que se elimine cualquier backdrop residual
      const backdrop = document.querySelector(".modal-backdrop")
      if (backdrop) {
        backdrop.remove()
      }
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }

    modalElement?.addEventListener("hidden.bs.modal", handleHidden)

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden)
      if (modalInstance) {
        modalInstance.hide()
      }

      // Asegurarse de que se elimine cualquier backdrop residual al desmontar
      const backdrop = document.querySelector(".modal-backdrop")
      if (backdrop) {
        backdrop.remove()
      }
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [showModal])

  /**
   * Efecto para cargar los datos iniciales
   * Aquí se implementarán las llamadas a la API con Axios
   */
  useEffect(() => {
    // TODO: Implementar llamadas a la API para obtener citas, clientes y servicios
    // Ejemplo:
    // const fetchData = async () => {
    //   try {
    //     const citasResponse = await axios.get('/api/citas');
    //     setCitas(citasResponse.data);
    //
    //     const clientesResponse = await axios.get('/api/clientes');
    //     setClientes(clientesResponse.data);
    //
    //     const serviciosResponse = await axios.get('/api/servicios');
    //     setServicios(serviciosResponse.data);
    //   } catch (error) {
    //     console.error('Error al cargar datos:', error);
    //     toast.error('Error al cargar los datos');
    //   }
    // };
    //
    // fetchData();
  }, [])

  return (
    <div className="citas-container">
      <h2 className="mb-4">Gestión de Citas</h2>

      <DataTable
        columns={columns}
        data={citas}
        onAdd={handleAddCita}
        addButtonLabel="Agendar Cita"
        searchPlaceholder="Buscar citas..."
      />

      {/* Modal de confirmación para cancelar cita */}
      {showCancelConfirm && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${showCancelConfirm ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirmar cancelación</h5>
              <button type="button" className="btn-close btn-close-white" onClick={cancelCancel}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center">
                <AlertTriangle size={24} className="text-danger me-3" />
                <p className="mb-0">
                  ¿Está seguro de cancelar la cita para {citaToCancel?.cliente.nombre} el día {citaToCancel?.fecha} a
                  las {citaToCancel?.hora}?
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelCancel}>
                No, mantener
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmCancel}>
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Ver Detalles de la Cita */}
      <div
        className="modal fade"
        id="detallesCitaModal"
        tabIndex="-1"
        aria-labelledby="detallesCitaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="detallesCitaModalLabel">
                {modalTitle}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseDetallesModal}
              ></button>
            </div>
            <div className="modal-body">
              {currentCita && (
                <div className="cita-details">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="detail-group">
                        <label className="detail-label">Cliente:</label>
                        <div className="detail-value">
                          <User size={18} className="me-2 text-primary" />
                          {currentCita.cliente.nombre}
                        </div>
                      </div>
                      <div className="detail-group">
                        <label className="detail-label">Teléfono:</label>
                        <div className="detail-value">{currentCita.cliente.telefono}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-group">
                        <label className="detail-label">Fecha:</label>
                        <div className="detail-value">
                          <Calendar size={18} className="me-2 text-primary" />
                          {currentCita.fecha}
                        </div>
                      </div>
                      <div className="detail-group">
                        <label className="detail-label">Hora:</label>
                        <div className="detail-value">
                          <Clock size={18} className="me-2 text-primary" />
                          {currentCita.hora}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="detail-group">
                        <label className="detail-label">Servicio:</label>
                        <div className="detail-value">
                          <Scissors size={18} className="me-2 text-primary" />
                          {currentCita.servicio.nombre}
                        </div>
                      </div>
                      <div className="detail-group">
                        <label className="detail-label">Duración:</label>
                        <div className="detail-value">{formatDuracion(currentCita.servicio.duracion)}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-group">
                        <label className="detail-label">Precio:</label>
                        <div className="detail-value">${formatNumber(currentCita.servicio.precio)}</div>
                      </div>
                      <div className="detail-group">
                        <label className="detail-label">Estado:</label>
                        <div className="detail-value">
                          <span
                            className={`badge ${
                              currentCita.estado === "Programada"
                                ? "bg-warning"
                                : currentCita.estado === "Confirmada"
                                  ? "bg-primary"
                                  : currentCita.estado === "Completada"
                                    ? "bg-success"
                                    : "bg-danger"
                            }`}
                          >
                            {currentCita.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {currentCita.notas && (
                    <div className="row">
                      <div className="col-12">
                        <div className="detail-group">
                          <label className="detail-label">Notas:</label>
                          <div className="detail-value notes">{currentCita.notas}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseDetallesModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
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

export default AgendarCitas


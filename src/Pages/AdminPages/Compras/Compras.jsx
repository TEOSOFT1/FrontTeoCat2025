"use client"

import { useEffect } from "react"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import { AlertTriangle, FileText } from "lucide-react"
import Select from "react-select"
import "../../../Styles/AdminStyles/Compras.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de compras
 * Permite visualizar, registrar, editar y cancelar compras de productos
 */
const Compras = () => {
  const navigate = useNavigate()

  // Estado para las compras
  const [compras, setCompras] = useState([])

  // Estado para indicar carga de datos
  const [isLoading, setIsLoading] = useState(false)

  // Estado para manejar errores
  const [error, setError] = useState(null)

  // Estado para los productos disponibles (para el modal de detalles)
  const [productos, setProductos] = useState([])

  // Estado para los proveedores disponibles (para el modal de detalles)
  const [proveedores, setProveedores] = useState([])

  // Estado para el modal de confirmación de cancelación
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [compraToCancel, setCompraToCancel] = useState(null)

  // Estado para el modal de detalles
  const [showDetallesModal, setShowDetallesModal] = useState(false)
  const [compraSeleccionada, setCompraSeleccionada] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener compras, productos y proveedores
   */
  useEffect(() => {
    const fetchData = async () => {
      setError(null)

      try {
        // Aquí se implementaría la carga de datos desde la API
        setCompras([])
        setProductos([])
        setProveedores([])
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setError("Error al cargar los datos. Por favor, intente nuevamente.")
      }
    }

    fetchData()
  }, [])

  /**
   * Función para formatear números con separadores de miles
   * @param {number} number - Número a formatear
   * @returns {string} Número formateado con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  /**
   * Función para formatear fechas
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada en formato local
   */
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Definición de columnas para la tabla principal
  const columns = [
    { field: "codigoFactura", header: "Código Factura" },
    { field: "representante", header: "Proveedor" },
    {
      field: "fechaCompra",
      header: "Fecha de Compra",
      render: (row) => formatDate(row.fechaCompra),
    },
    {
      field: "montoTotal",
      header: "Monto Total",
      render: (row) => `$${formatNumber(row.montoTotal)}`,
    },
    {
      field: "totalIVA",
      header: "Total IVA",
      render: (row) => `$${formatNumber(row.totalIVA)}`,
    },
    {
      field: "montoTotalConIVA",
      header: "Monto Total con IVA",
      render: (row) => `$${formatNumber(row.montoTotalConIVA)}`,
    },
    {
      field: "estado",
      header: "Estado",
      render: (row) => (
        <span className={`badge ${row.estado === "Efectiva" ? "bg-success" : "bg-danger"}`}>{row.estado}</span>
      ),
    },
    {
      field: "acciones",
      header: "Acciones",
      render: (row) => (
        <TableActions
          actions={["view", "edit", row.estado === "Efectiva" ? "cancel" : null]}
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onCancel={handleCancel}
          customLabels={{
            cancel: "Cancelar Compra",
          }}
        />
      ),
    },
  ]

  /**
   * Manejador para ver detalles de una compra
   * @param {Object} compra - Objeto de compra a visualizar
   */
  const handleView = (compra) => {
    setCompraSeleccionada(compra)
    setShowDetallesModal(true)
  }

  /**
   * Manejador para editar una compra
   * Redirige a la vista de edición con el ID de la compra
   * @param {Object} compra - Objeto de compra a editar
   */
  const handleEdit = (compra) => {
    // Solo permitir editar compras efectivas
    if (compra.estado === "Cancelada") {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>No se puede editar una compra cancelada.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    // Verificar si la compra es reciente (menos de 24 horas)
    const fechaCompra = new Date(compra.fechaCompra)
    const ahora = new Date()
    const diferenciaTiempo = ahora - fechaCompra
    const diferenciaHoras = diferenciaTiempo / (1000 * 60 * 60)

    if (diferenciaHoras > 24) {
      toast.warning(
        <div>
          <strong>Advertencia</strong>
          <p>Esta compra tiene más de 24 horas. Los cambios podrían afectar al inventario y reportes.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    }

    // Redirigir a la vista de edición (por ahora usamos la misma vista de registro)
    navigate(`/compras/registrar-compra?id=${compra.id}`)
  }

  /**
   * Manejador para iniciar el proceso de cancelación de una compra
   * @param {Object} compra - Objeto de compra a cancelar
   */
  const handleCancel = (compra) => {
    // Solo permitir cancelar compras efectivas
    if (compra.estado === "Cancelada") {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Esta compra ya está cancelada.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    // Verificar si la compra es reciente (menos de 24 horas)
    const fechaCompra = new Date(compra.fechaCompra)
    const ahora = new Date()
    const diferenciaTiempo = ahora - fechaCompra
    const diferenciaHoras = diferenciaTiempo / (1000 * 60 * 60)

    if (diferenciaHoras > 24) {
      toast.warning(
        <div>
          <strong>Advertencia</strong>
          <p>Esta compra tiene más de 24 horas. Su cancelación afectará al inventario y reportes.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    }

    setCompraToCancel(compra)
    setShowCancelConfirm(true)
  }

  /**
   * Función para confirmar la cancelación de la compra
   */
  const confirmCancel = () => {
    if (compraToCancel) {
      // Aquí se implementaría la llamada a la API para cancelar la compra
      // Por ahora, actualizamos el estado local

      try {
        const updatedCompras = compras.map((c) => {
          if (c.id === compraToCancel.id) {
            return {
              ...c,
              estado: "Cancelada",
            }
          }
          return c
        })

        setCompras(updatedCompras)

        // Añadir notificación
        if (toastIds.current.cancel) {
          toast.dismiss(toastIds.current.cancel)
        }

        toastIds.current.cancel = toast.info(
          <div>
            <strong>Compra cancelada</strong>
            <p>La compra con código "{compraToCancel.codigoFactura}" ha sido cancelada correctamente.</p>
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
      } catch (error) {
        console.error("Error al cancelar la compra:", error)
        toast.error(
          <div>
            <strong>Error</strong>
            <p>No se pudo cancelar la compra. Por favor, intente nuevamente.</p>
          </div>,
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          },
        )
      }
    }
    setShowCancelConfirm(false)
    setCompraToCancel(null)
  }

  /**
   * Función para cancelar el proceso de cancelación
   */
  const cancelCancel = () => {
    setShowCancelConfirm(false)
    setCompraToCancel(null)
  }

  /**
   * Manejador para cerrar el modal de detalles
   */
  const handleCloseDetallesModal = () => {
    setShowDetallesModal(false)
    setCompraSeleccionada(null)
  }

  /**
   * Manejador para redirigir a la vista de registrar compra
   */
  const handleAddCompra = () => {
    navigate("/compras/registrar-compra")
  }

  /**
   * Efecto para inicializar el modal de Bootstrap
   */
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("detallesCompraModal")

    if (showDetallesModal && modalElement) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
    }

    // Evento para cuando el modal se cierra con el botón X o haciendo clic fuera
    const handleHidden = () => {
      setShowDetallesModal(false)
      setCompraSeleccionada(null)
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
  }, [showDetallesModal])

  // Definición de columnas para la tabla de productos en el modal de detalles
  const productosColumns = [
    { field: "codigoBarras", header: "Código de Barras" },
    { field: "nombre", header: "Nombre del Producto" },
    { field: "cantidad", header: "Cantidad" },
    {
      field: "precioUnitario",
      header: "Precio Unitario",
      render: (row) => `$${formatNumber(row.precioUnitario)}`,
    },
    {
      field: "iva",
      header: "IVA",
      render: (row) => `${row.iva}%`,
    },
    {
      field: "subtotal",
      header: "Subtotal",
      render: (row) => `$${formatNumber(row.subtotal)}`,
    },
    {
      field: "totalConIVA",
      header: "Total con IVA",
      render: (row) => `$${formatNumber(row.totalConIVA)}`,
    },
  ]

  // Opciones para el select de proveedores (para el modal de detalles)
  const proveedoresOptions = proveedores.map((proveedor) => ({
    value: proveedor,
    label: `${proveedor.representante} - ${proveedor.documento}`,
  }))

  return (
    <div className="compras-container">
      <h2 className="mb-4">Gestión de Compras</h2>

      {/* Estado de carga */}
      {error ? (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={compras}
          onAdd={handleAddCompra}
          addButtonLabel="Registrar Compra"
          searchPlaceholder="Buscar compras..."
          emptyMessage="No se encontraron compras"
        />
      )}

      {/* Modal de confirmación para cancelar compra */}
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
                <p className="mb-0">¿Está seguro de cancelar la compra con código "{compraToCancel?.codigoFactura}"?</p>
              </div>
              <div className="alert alert-warning mt-3">
                <small>
                  <strong>Importante:</strong> Al cancelar esta compra, se revertirán los cambios en el inventario. Esta
                  acción no se puede deshacer.
                </small>
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

      {/* Modal para Ver Detalles de la Compra */}
      <div
        className="modal fade"
        id="detallesCompraModal"
        tabIndex="-1"
        aria-labelledby="detallesCompraModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="detallesCompraModalLabel">
                Ver Detalles de la Compra
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
              {compraSeleccionada && (
                <form className="compra-form">
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="codigoFactura" className="form-label">
                        Código de Factura
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="codigoFactura"
                        value={compraSeleccionada.codigoFactura}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="proveedor" className="form-label">
                        Proveedor
                      </label>
                      <Select
                        id="proveedor"
                        value={proveedoresOptions.find((option) => option.value.id === compraSeleccionada.proveedor.id)}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="fechaCompra" className="form-label">
                        Fecha de Compra
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaCompra"
                        value={compraSeleccionada.fechaCompra}
                        readOnly
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h5 className="mb-3">Productos</h5>

                  <div className="table-responsive mt-4">
                    <table className="table table-striped table-bordered">
                      <thead className="table-primary">
                        <tr>
                          {productosColumns.map((column) => (
                            <th key={column.field}>{column.header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {compraSeleccionada.productos.length > 0 ? (
                          compraSeleccionada.productos.map((producto, index) => (
                            <tr key={`${producto.id}-${index}`}>
                              {productosColumns.map((column) => (
                                <td key={`${producto.id}-${column.field}`}>
                                  {column.render ? column.render(producto) : producto[column.field]}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={productosColumns.length} className="text-center py-3">
                              No hay productos
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header bg-light">
                          <h5 className="mb-0 d-flex align-items-center">
                            <FileText size={18} className="me-2" />
                            Resumen de la Compra
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <strong>Monto Total:</strong>
                            <span>${formatNumber(compraSeleccionada.montoTotal)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <strong>Total IVA:</strong>
                            <span>${formatNumber(compraSeleccionada.totalIVA)}</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between">
                            <strong>Monto Total con IVA:</strong>
                            <span className="text-primary fw-bold">
                              ${formatNumber(compraSeleccionada.montoTotalConIVA)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Estado de la Compra</h5>
                        </div>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>Estado:</strong>
                            <span
                              className={`badge ${compraSeleccionada.estado === "Efectiva" ? "bg-success" : "bg-danger"}`}
                            >
                              {compraSeleccionada.estado}
                            </span>
                          </div>
                          {compraSeleccionada.estado === "Cancelada" && (
                            <div className="alert alert-secondary mt-3 mb-0">
                              <small>Esta compra fue cancelada y no afecta al inventario actual.</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
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

export default Compras


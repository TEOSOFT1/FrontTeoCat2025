"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import { AlertTriangle, FileText, User } from "lucide-react"
import "../../../Styles/AdminStyles/Ventas.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

const Ventas = () => {
  const navigate = useNavigate()

  // Estado para las ventas
  const [ventas, setVentas] = useState([])

  // Estado para el modal de confirmación de anulación
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [ventaToCancel, setVentaToCancel] = useState(null)

  // Estado para el modal de detalles
  const [showDetallesModal, setShowDetallesModal] = useState(false)
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Función para formatear números con separadores de miles
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Definición de columnas para la tabla principal
  const columns = [
    { field: "cliente.nombre", header: "Cliente" },
    {
      field: "fechaVenta",
      header: "Fecha de Venta",
      render: (row) => formatDate(row.fechaVenta),
    },
    {
      field: "subtotal",
      header: "Subtotal",
      render: (row) => `$${formatNumber(row.subtotal)}`,
    },
    {
      field: "totalIVA",
      header: "IVA",
      render: (row) => `$${formatNumber(row.totalIVA)}`,
    },
    {
      field: "total",
      header: "Total",
      render: (row) => `$${formatNumber(row.total)}`,
    },
    {
      field: "estado",
      header: "Estado",
      render: (row) => (
        <span className={`badge ${row.estado === "Completada" ? "bg-success" : "bg-danger"}`}>{row.estado}</span>
      ),
    },
    {
      field: "acciones",
      header: "Acciones",
      render: (row) => (
        <TableActions
          actions={[
            "view",
            "print",
            row.estado === "Completada" ? "return" : null,
            row.estado === "Completada" ? "cancel" : null,
          ]}
          row={row}
          onView={handleView}
          onPrint={handlePrint}
          onReturn={handleReturn}
          onCancel={handleCancel}
          customLabels={{
            cancel: "Anular venta",
            return: "Hacer devolución",
          }}
        />
      ),
    },
  ]

  // Manejadores de eventos para las acciones
  const handleView = (venta) => {
    setVentaSeleccionada(venta)
    setShowDetallesModal(true)
  }

  const handlePrint = (venta) => {
    toast.info(
      <div>
        <strong>Imprimiendo factura</strong>
        <p>Preparando la impresión de la factura {venta.codigoFactura}...</p>
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
  }

  const handleReturn = (venta) => {
    // Solo permitir devoluciones de ventas completadas
    if (venta.estado !== "Completada") {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>No se puede hacer devolución de una venta anulada.</p>
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

    // Redirigir a la vista de devolución
    navigate(`/ventas/devolucion?id=${venta.id}`)
  }

  const handleCancel = (venta) => {
    // Solo permitir anular ventas completadas
    if (venta.estado !== "Completada") {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Esta venta ya está anulada.</p>
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

    setVentaToCancel(venta)
    setShowCancelConfirm(true)
  }

  // Función para confirmar la anulación de la venta
  const confirmCancel = () => {
    if (ventaToCancel) {
      const updatedVentas = ventas.map((v) => {
        if (v.id === ventaToCancel.id) {
          return {
            ...v,
            estado: "Anulada",
          }
        }
        return v
      })

      setVentas(updatedVentas)

      // Añadir notificación
      if (toastIds.current.cancel) {
        toast.dismiss(toastIds.current.cancel)
      }

      toastIds.current.cancel = toast.info(
        <div>
          <strong>Venta anulada</strong>
          <p>La venta con código "{ventaToCancel.codigoFactura}" ha sido anulada correctamente.</p>
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
    setVentaToCancel(null)
  }

  // Función para cancelar la anulación
  const cancelCancel = () => {
    setShowCancelConfirm(false)
    setVentaToCancel(null)
  }

  // Manejador para cerrar el modal de detalles
  const handleCloseDetallesModal = () => {
    setShowDetallesModal(false)
    setVentaSeleccionada(null)
  }

  // Manejador para redirigir a la vista de registrar venta
  const handleAddVenta = () => {
    navigate("/ventas/registrar-venta")
  }

  // Inicializar Bootstrap modal para detalles
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("detallesVentaModal")

    if (showDetallesModal && modalElement) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
    }

    // Evento para cuando el modal se cierra con el botón X o haciendo clic fuera
    const handleHidden = () => {
      setShowDetallesModal(false)
      setVentaSeleccionada(null)
    }

    modalElement?.addEventListener("hidden.bs.modal", handleHidden)

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden)
      if (modalInstance) {
        modalInstance.hide()
      }
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

  return (
    <div className="ventas-container">
      <h2 className="mb-4">Gestión de Ventas</h2>

      <DataTable
        columns={columns}
        data={ventas}
        onAdd={handleAddVenta}
        addButtonLabel="Registrar Venta"
        searchPlaceholder="Buscar ventas..."
      />

      {/* Modal de confirmación para anular venta */}
      {showCancelConfirm && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${showCancelConfirm ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirmar anulación</h5>
              <button type="button" className="btn-close btn-close-white" onClick={cancelCancel}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center">
                <AlertTriangle size={24} className="text-danger me-3" />
                <p className="mb-0">¿Está seguro de anular la venta con código "{ventaToCancel?.codigoFactura}"?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelCancel}>
                No, mantener
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmCancel}>
                Sí, anular
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Ver Detalles de la Venta */}
      <div
        className="modal fade"
        id="detallesVentaModal"
        tabIndex="-1"
        aria-labelledby="detallesVentaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="detallesVentaModalLabel">
                Ver Detalles de la Venta
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
              {ventaSeleccionada && (
                <form className="venta-form">
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label htmlFor="codigoFactura" className="form-label">
                        Código de Factura
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="codigoFactura"
                        value={ventaSeleccionada.codigoFactura}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="cliente" className="form-label">
                        Cliente
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cliente"
                        value={`${ventaSeleccionada.cliente.nombre} - ${ventaSeleccionada.cliente.documento}`}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="fechaVenta" className="form-label">
                        Fecha de Venta
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaVenta"
                        value={ventaSeleccionada.fechaVenta}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="idVendedor" className="form-label">
                        ID Vendedor
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="idVendedor"
                          value={ventaSeleccionada.idVendedor || "No disponible"}
                          readOnly
                        />
                      </div>
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
                        {ventaSeleccionada.productos.length > 0 ? (
                          ventaSeleccionada.productos.map((producto, index) => (
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
                            Resumen de la Venta
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <strong>Subtotal:</strong>
                            <span>${formatNumber(ventaSeleccionada.subtotal)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <strong>Total IVA:</strong>
                            <span>${formatNumber(ventaSeleccionada.totalIVA)}</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between">
                            <strong>Total:</strong>
                            <span className="text-primary fw-bold">${formatNumber(ventaSeleccionada.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Estado de la Venta</h5>
                        </div>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>Estado:</strong>
                            <span
                              className={`badge ${ventaSeleccionada.estado === "Completada" ? "bg-success" : "bg-danger"}`}
                            >
                              {ventaSeleccionada.estado}
                            </span>
                          </div>
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

export default Ventas


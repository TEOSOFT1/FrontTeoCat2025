"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import DeleteConfirmModal from "../../../Components/AdminComponents/ProductosComponents/DeleteConfirmModal"
import "../../../Styles/AdminStyles/Productos.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
// Importar useNavigate para la redirección
import { useNavigate } from "react-router-dom"

/**
 * Componente para la gestión de productos
 * Permite crear, ver, editar, activar/desactivar y eliminar productos
 */
const Productos = () => {
  // Estado para los productos
  const [productos, setProductos] = useState([])

  // Hook para navegación
  const navigate = useNavigate()

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Ver Detalles del Producto")
  const [currentProduct, setCurrentProduct] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    fotoUrl: "",
    fotoPreview: null,
    stock: "",
    precio: "",
    iva: "19",
    codigoBarras: "",
    referencia: "",
    fechaVencimiento: "",
    noVence: false,
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Función para formatear números con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "categoria", header: "Categoría" },
    {
      field: "precio",
      header: "Precio",
      render: (row) => `$${formatNumber(row.precio)}`,
    },
    { field: "stock", header: "Stock" },
    {
      field: "estado",
      header: "Estado",
      render: (row) => (
        <span className={`badge ${row.estado === "Activo" ? "bg-success" : "bg-danger"}`}>{row.estado}</span>
      ),
    },
    {
      field: "acciones",
      header: "Acciones",
      render: (row) => (
        <TableActions
          actions={["view", "edit", "toggleStatus", "delete"]}
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      ),
    },
  ]

  /**
   * Manejador para ver detalles de un producto
   */
  const handleView = (product) => {
    setCurrentProduct(product)
    setModalTitle("Ver Detalles del Producto")

    // Cargar datos del producto en el formulario
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      categoria: product.categoria,
      fotoUrl: product.foto,
      fotoPreview: product.foto,
      stock: product.stock.toString(),
      precio: product.precio.toString(),
      iva: product.iva.toString(),
      codigoBarras: product.codigoBarras,
      referencia: product.referencia || "",
      fechaVencimiento: product.fechaVencimiento || "",
      noVence: product.noVence,
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar un producto
   */
  const handleEdit = (product) => {
    // Redirigir a la página de edición de producto
    navigate(`/inventario/registrar-producto?id=${product.id}`)
  }

  /**
   * Manejador para cambiar el estado de un producto
   */
  const handleToggleStatus = (product) => {
    // Cambiar el estado del producto
    const updatedProducts = productos.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          estado: p.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return p
    })

    setProductos(updatedProducts)

    // Añadir notificación
    const newStatus = product.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El producto "{product.nombre}" ahora está {newStatus}.
        </p>
      </div>,
      {
        icon: "🔄",
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
   * Manejador para iniciar el proceso de eliminación
   */
  const handleDelete = (product) => {
    setProductToDelete(product)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación
   */
  const confirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = productos.filter((p) => p.id !== productToDelete.id)
      setProductos(updatedProducts)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Producto eliminado</strong>
          <p>El producto "{productToDelete.nombre}" ha sido eliminado correctamente.</p>
        </div>,
        {
          icon: "🗑️",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    }
    setShowDeleteConfirm(false)
    setProductToDelete(null)
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setProductToDelete(null)
  }

  /**
   * Manejador para abrir el modal de agregar producto
   */
  const handleAddProduct = () => {
    navigate("/inventario/registrar-producto")
  }

  /**
   * Manejador para cerrar el modal
   */
  const handleCloseModal = () => {
    setShowModal(false)
  }

  /**
   * Efecto para inicializar el modal de Bootstrap
   */
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("productModal")

    if (showModal) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
    } else {
      if (modalElement && modalElement.classList.contains("show")) {
        import("bootstrap").then((bootstrap) => {
          modalInstance = bootstrap.Modal.getInstance(modalElement)
          if (modalInstance) {
            modalInstance.hide()
          }
        })
      }
    }

    const handleHidden = () => {
      setShowModal(false)
    }

    modalElement?.addEventListener("hidden.bs.modal", handleHidden)

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden)
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

  return (
    <div className="productos-container">
      <h2 className="mb-4">Gestión de Productos</h2>

      <DataTable
        columns={columns}
        data={productos}
        onAdd={handleAddProduct}
        addButtonLabel="Agregar Producto"
        searchPlaceholder="Buscar productos..."
      />

      {/* Modal para Ver Detalles del Producto */}
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="productModalLabel">
                {modalTitle}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              {/* Aquí iría el contenido para ver detalles del producto */}
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Nombre:</strong> {formData.nombre}
                  </p>
                  <p>
                    <strong>Categoría:</strong> {formData.categoria}
                  </p>
                  <p>
                    <strong>Precio:</strong> ${formatNumber(formData.precio)}
                  </p>
                  <p>
                    <strong>Stock:</strong> {formData.stock}
                  </p>
                  <p>
                    <strong>IVA:</strong> {formData.iva}%
                  </p>
                </div>
                <div className="col-md-6">
                  {formData.fotoPreview && (
                    <img
                      src={formData.fotoPreview || "/placeholder.svg"}
                      alt={formData.nombre}
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px" }}
                    />
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <p>
                    <strong>Descripción:</strong>
                  </p>
                  <p>{formData.descripcion || "Sin descripción"}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        item={productToDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        itemType="producto"
      />

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

export default Productos


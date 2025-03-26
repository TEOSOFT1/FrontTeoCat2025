"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import ProductForm from "../../components/AdminComponents/ProductForm"
import DeleteConfirmModal from "../../components/AdminComponents/DeleteConfirmModal"
import "../../Styles/AdminStyles/Productos.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de productos
 * Permite crear, ver, editar, activar/desactivar y eliminar productos
 */
const Productos = () => {
  // Estado para los productos
  const [productos, setProductos] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Producto")
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
    setCurrentProduct(product)
    setModalTitle("Editar Producto")

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
    setCurrentProduct(null)
    setModalTitle("Agregar Producto")

    // Resetear el formulario
    setFormData({
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

    setShowModal(true)
  }

  /**
   * Manejador para cerrar el modal
   */
  const handleCloseModal = () => {
    setShowModal(false)
  }

  /**
   * Manejador para guardar el producto
   */
  const handleSaveProduct = () => {
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.categoria || !formData.stock || !formData.precio) {
      // Notificación de error
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, complete todos los campos obligatorios.</p>
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

    // Validar que stock y precio sean números válidos
    if (isNaN(Number.parseFloat(formData.stock)) || isNaN(Number.parseFloat(formData.precio))) {
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>El stock y el precio deben ser valores numéricos válidos.</p>
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

    // Validar fecha de vencimiento si el producto vence
    if (!formData.noVence && !formData.fechaVencimiento) {
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, ingrese una fecha de vencimiento o marque la opción "No vence".</p>
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

    // Preparar los datos del producto
    const productData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      foto: formData.fotoUrl || "/placeholder.jpg",
      stock: Number.parseInt(formData.stock),
      precio: Number.parseFloat(formData.precio),
      iva: formData.iva,
      codigoBarras: formData.codigoBarras,
      referencia: formData.referencia,
      fechaVencimiento: formData.noVence ? null : formData.fechaVencimiento,
      noVence: formData.noVence,
    }

    if (currentProduct) {
      // Actualizar producto existente
      const updatedProducts = productos.map((p) => {
        if (p.id === currentProduct.id) {
          return {
            ...p,
            ...productData,
          }
        }
        return p
      })

      setProductos(updatedProducts)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Producto actualizado</strong>
          <p>El producto "{formData.nombre}" ha sido actualizado correctamente.</p>
        </div>,
        {
          icon: "✏️",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    } else {
      // Crear nuevo producto
      const newProduct = {
        id: Date.now(),
        ...productData,
        estado: "Activo",
      }

      setProductos([...productos, newProduct])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Producto creado</strong>
          <p>El producto "{formData.nombre}" ha sido creado correctamente.</p>
        </div>,
        {
          icon: "✅",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    }

    // Cerrar el modal
    handleCloseModal()
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

      {/* Modal para Agregar/Editar/Ver Producto */}
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
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                modalTitle={modalTitle}
                handleSaveProduct={handleSaveProduct}
                handleCloseModal={handleCloseModal}
              />
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


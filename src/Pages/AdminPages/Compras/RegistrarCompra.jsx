"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Save, ArrowLeft, Trash2, Plus, FileText, AlertTriangle } from "lucide-react"
import Select from "react-select"
import "../../../Styles/AdminStyles/RegistrarCompra.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para registrar compras de productos
 * Permite seleccionar proveedor, agregar productos y registrar la compra
 */
const RegistrarCompra = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Obtener el ID de la compra de los parámetros de la URL (para edición)
  const params = new URLSearchParams(location.search)
  const compraId = params.get("id")
  const isEditing = !!compraId

  // Estado para los productos disponibles
  const [productos, setProductos] = useState([])

  // Estado para los proveedores disponibles
  const [proveedores, setProveedores] = useState([])

  // Estado para indicar carga de datos
  const [isLoading, setIsLoading] = useState(false)

  // Estado para manejar errores
  const [error, setError] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigoFactura: "",
    proveedor: null,
    fechaCompra: new Date().toISOString().split("T")[0],
    productosAgregados: [],
    productoSeleccionado: null,
    cantidad: 1,
  })

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    proveedor: "",
    fechaCompra: "",
    productoSeleccionado: "",
    cantidad: "",
    productosAgregados: "",
  })

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Función para generar un código de factura único
   * @returns {string} Código de factura generado
   */
  const generateInvoiceCode = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `COMP-${year}-${randomNum}`
  }

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API con Axios
   */
  useEffect(() => {
    const fetchData = async () => {
      setError(null)

      try {
        // Aquí se implementaría la carga de datos desde la API
        // Si es una nueva compra, inicializar con valores por defecto
        if (!isEditing) {
          setFormData({
            codigoFactura: generateInvoiceCode(),
            proveedor: null,
            fechaCompra: new Date().toISOString().split("T")[0],
            productosAgregados: [],
            productoSeleccionado: null,
            cantidad: 1,
          })
        }

        setProductos([])
        setProveedores([])
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setError("Error al cargar los datos. Por favor, intente nuevamente.")
      }
    }

    fetchData()
  }, [isEditing, compraId])

  /**
   * Función para formatear números con separadores de miles
   * @param {number} number - Número a formatear
   * @returns {string} Número formateado con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  /**
   * Manejador para cambios en los inputs del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar el error específico
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  /**
   * Manejador para seleccionar un producto
   * @param {Object} selectedOption - Opción seleccionada del select
   */
  const handleSelectProduct = (selectedOption) => {
    setFormData({
      ...formData,
      productoSeleccionado: selectedOption ? selectedOption.value : null,
    })

    // Limpiar el error específico
    if (formErrors.productoSeleccionado) {
      setFormErrors({
        ...formErrors,
        productoSeleccionado: "",
      })
    }
  }

  /**
   * Manejador para seleccionar un proveedor
   * @param {Object} selectedOption - Opción seleccionada del select
   */
  const handleSelectProveedor = (selectedOption) => {
    setFormData({
      ...formData,
      proveedor: selectedOption ? selectedOption.value : null,
    })

    // Limpiar el error específico
    if (formErrors.proveedor) {
      setFormErrors({
        ...formErrors,
        proveedor: "",
      })
    }
  }

  /**
   * Validar el formulario de producto antes de agregarlo
   * @returns {boolean} True si el formulario es válido, false en caso contrario
   */
  const validateProductForm = () => {
    let isValid = true
    const errors = { ...formErrors }

    // Validar selección de producto
    if (!formData.productoSeleccionado) {
      errors.productoSeleccionado = "Por favor, seleccione un producto"
      isValid = false
    }

    // Validar cantidad
    if (!formData.cantidad || formData.cantidad <= 0) {
      errors.cantidad = "Por favor, ingrese una cantidad válida"
      isValid = false
    } else if (!Number.isInteger(Number(formData.cantidad))) {
      errors.cantidad = "La cantidad debe ser un número entero"
      isValid = false
    } else if (Number(formData.cantidad) > 1000) {
      errors.cantidad = "La cantidad no puede ser mayor a 1000 unidades"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para agregar un producto a la lista
   * Valida los datos y agrega el producto a la lista de productos de la compra
   */
  const handleAddProduct = () => {
    // Validar el formulario
    if (!validateProductForm()) {
      return
    }

    const { productoSeleccionado, cantidad } = formData

    // Verificar si el producto ya está en la lista
    const productoExistente = formData.productosAgregados.findIndex((p) => p.id === productoSeleccionado.id)

    const nuevosProductos = [...formData.productosAgregados]

    if (productoExistente !== -1) {
      // Actualizar cantidad si el producto ya existe
      const nuevaCantidad = Number.parseInt(nuevosProductos[productoExistente].cantidad) + Number.parseInt(cantidad)

      // Validar que la cantidad total no exceda el límite
      if (nuevaCantidad > 1000) {
        toast.error(
          <div>
            <strong>Error</strong>
            <p>La cantidad total para este producto no puede exceder 1000 unidades.</p>
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

      nuevosProductos[productoExistente] = {
        ...nuevosProductos[productoExistente],
        cantidad: nuevaCantidad,
      }

      // Recalcular subtotal y total con IVA
      nuevosProductos[productoExistente].subtotal =
        nuevosProductos[productoExistente].cantidad * nuevosProductos[productoExistente].precioUnitario

      nuevosProductos[productoExistente].totalConIVA =
        nuevosProductos[productoExistente].subtotal * (1 + nuevosProductos[productoExistente].iva / 100)
    } else {
      // Agregar nuevo producto
      const subtotal = Number.parseInt(cantidad) * productoSeleccionado.precioUnitario
      const totalConIVA = subtotal * (1 + productoSeleccionado.iva / 100)

      nuevosProductos.push({
        id: productoSeleccionado.id,
        codigoBarras: productoSeleccionado.codigoBarras,
        nombre: productoSeleccionado.nombre,
        cantidad: Number.parseInt(cantidad),
        precioUnitario: productoSeleccionado.precioUnitario,
        iva: productoSeleccionado.iva,
        subtotal: subtotal,
        totalConIVA: totalConIVA,
      })
    }

    // Actualizar el estado
    setFormData({
      ...formData,
      productosAgregados: nuevosProductos,
      productoSeleccionado: null,
      cantidad: 1,
    })

    // Limpiar el error de productos agregados si existía
    if (formErrors.productosAgregados) {
      setFormErrors({
        ...formErrors,
        productosAgregados: "",
      })
    }

    // Notificación de éxito
    toast.success(
      <div>
        <strong>Producto agregado</strong>
        <p>El producto ha sido agregado a la lista.</p>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    )
  }

  /**
   * Manejador para eliminar un producto de la lista
   * @param {number} index - Índice del producto a eliminar
   */
  const handleRemoveProduct = (index) => {
    const nuevosProductos = [...formData.productosAgregados]
    nuevosProductos.splice(index, 1)

    setFormData({
      ...formData,
      productosAgregados: nuevosProductos,
    })

    // Notificación
    toast.info(
      <div>
        <strong>Producto eliminado</strong>
        <p>El producto ha sido eliminado de la lista.</p>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    )
  }

  /**
   * Función para calcular los totales de la compra
   * @returns {Object} Objeto con montoTotal, totalIVA y montoTotalConIVA
   */
  const calcularTotales = () => {
    const productos = formData.productosAgregados

    const montoTotal = productos.reduce((total, producto) => total + producto.subtotal, 0)
    const totalIVA = productos.reduce((total, producto) => {
      return total + producto.subtotal * (producto.iva / 100)
    }, 0)
    const montoTotalConIVA = montoTotal + totalIVA

    return {
      montoTotal,
      totalIVA,
      montoTotalConIVA,
    }
  }

  /**
   * Validar el formulario completo antes de guardar
   * @returns {boolean} True si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    let isValid = true
    const errors = { ...formErrors }

    // Validar proveedor
    if (!formData.proveedor) {
      errors.proveedor = "Por favor, seleccione un proveedor"
      isValid = false
    }

    // Validar fecha de compra
    if (!formData.fechaCompra) {
      errors.fechaCompra = "Por favor, seleccione una fecha de compra"
      isValid = false
    } else {
      const fechaCompra = new Date(formData.fechaCompra)
      const hoy = new Date()
      hoy.setHours(23, 59, 59, 999) // Fin del día actual

      if (fechaCompra > hoy) {
        errors.fechaCompra = "La fecha de compra no puede ser futura"
        isValid = false
      }

      // Validar que la fecha no sea muy antigua (más de 1 año)
      const unAnioAtras = new Date()
      unAnioAtras.setFullYear(unAnioAtras.getFullYear() - 1)

      if (fechaCompra < unAnioAtras) {
        errors.fechaCompra = "La fecha de compra no puede ser mayor a un año"
        isValid = false
      }
    }

    // Validar que haya productos agregados
    if (formData.productosAgregados.length === 0) {
      errors.productosAgregados = "Por favor, agregue al menos un producto a la compra"
      isValid = false
    }

    // Validar monto total (para evitar errores de entrada)
    const { montoTotalConIVA } = calcularTotales()
    if (montoTotalConIVA > 100000000) {
      // 100 millones
      toast.error(
        <div>
          <strong>Error</strong>
          <p>El monto total de la compra es demasiado alto. Por favor, verifique las cantidades y precios.</p>
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
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar la compra
   * Valida los datos y envía la información para registrar la compra
   */
  const handleSaveCompra = () => {
    // Validar el formulario
    if (!validateForm()) {
      // Mostrar notificación de error general
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, corrija los errores en el formulario.</p>
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

    // Calcular totales
    const { montoTotal, totalIVA, montoTotalConIVA } = calcularTotales()

    // Preparar datos para guardar
    const compraData = {
      id: isEditing ? Number(compraId) : Date.now(),
      codigoFactura: formData.codigoFactura,
      representante: formData.proveedor.representante,
      proveedor: formData.proveedor,
      fechaCompra: formData.fechaCompra,
      montoTotal: montoTotal,
      totalIVA: totalIVA,
      montoTotalConIVA: montoTotalConIVA,
      productos: [...formData.productosAgregados],
      estado: "Efectiva",
    }

    // Aquí se implementaría el envío de datos a la API
    try {
      // Simular envío de datos
      console.log("Datos de la compra a guardar:", compraData)

      // Mostrar notificación de éxito
      toast.success(
        <div>
          <strong>{isEditing ? "Compra actualizada" : "Compra registrada"}</strong>
          <p>
            La compra con código "{formData.codigoFactura}" ha sido {isEditing ? "actualizada" : "registrada"}{" "}
            correctamente.
          </p>
        </div>,
        {
          icon: "✅",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            // Redirigir a la lista de compras después de que se cierre la notificación
            navigate("/compras/compras")
          },
        },
      )
    } catch (error) {
      console.error("Error al guardar la compra:", error)
      toast.error(
        <div>
          <strong>Error</strong>
          <p>No se pudo {isEditing ? "actualizar" : "registrar"} la compra. Por favor, intente nuevamente.</p>
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

  /**
   * Manejador para cancelar y volver a la lista de compras
   */
  const handleCancel = () => {
    navigate("/compras/compras")
  }

  // Definición de columnas para la tabla de productos agregados
  const productosAgregadosColumns = [
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
    {
      field: "acciones",
      header: "Acciones",
      render: (row, index) => (
        <button className="btn btn-sm btn-danger" onClick={() => handleRemoveProduct(index)}>
          <Trash2 size={16} />
        </button>
      ),
    },
  ]

  // Opciones para el select de productos
  const productosOptions = productos.map((producto) => ({
    value: producto,
    label: `${producto.nombre} - ${producto.codigoBarras} - $${formatNumber(producto.precioUnitario)}`,
  }))

  // Opciones para el select de proveedores
  const proveedoresOptions = proveedores.map((proveedor) => ({
    value: proveedor,
    label: `${proveedor.representante} - ${proveedor.documento}`,
  }))

  // Estilos personalizados para react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : null,
      "&:hover": {
        borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#0d6efd" : state.isFocused ? "#f8f9fa" : null,
      color: state.isSelected ? "white" : "black",
    }),
  }

  return (
    <div className="registrar-compra-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? "Editar Compra" : "Registrar Compra"}</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Compras
        </button>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
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
                    name="codigoFactura"
                    value={formData.codigoFactura}
                    readOnly
                  />
                  <small className="form-text text-muted">Generado automáticamente</small>
                </div>
                <div className="col-md-4">
                  <label htmlFor="proveedor" className="form-label">
                    Proveedor <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="proveedor"
                    name="proveedor"
                    options={proveedoresOptions}
                    value={
                      formData.proveedor
                        ? proveedoresOptions.find((option) => option.value.id === formData.proveedor.id)
                        : null
                    }
                    onChange={handleSelectProveedor}
                    placeholder="Seleccione un proveedor..."
                    styles={customSelectStyles}
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No se encontraron proveedores"}
                    className={formErrors.proveedor ? "is-invalid" : ""}
                  />
                  {formErrors.proveedor && <div className="invalid-feedback d-block">{formErrors.proveedor}</div>}
                </div>
                <div className="col-md-4">
                  <label htmlFor="fechaCompra" className="form-label">
                    Fecha de Compra <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${formErrors.fechaCompra ? "is-invalid" : ""}`}
                    id="fechaCompra"
                    name="fechaCompra"
                    value={formData.fechaCompra}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {formErrors.fechaCompra && <div className="invalid-feedback">{formErrors.fechaCompra}</div>}
                  <small className="form-text text-muted">No puede ser una fecha futura</small>
                </div>
              </div>

              <hr className="my-4" />

              <h5 className="mb-3">Agregar Productos</h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="producto" className="form-label">
                    Producto <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="producto"
                    name="producto"
                    options={productosOptions}
                    value={
                      formData.productoSeleccionado
                        ? productosOptions.find((option) => option.value.id === formData.productoSeleccionado.id)
                        : null
                    }
                    onChange={handleSelectProduct}
                    placeholder="Seleccione un producto..."
                    styles={customSelectStyles}
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No se encontraron productos"}
                    className={formErrors.productoSeleccionado ? "is-invalid" : ""}
                  />
                  {formErrors.productoSeleccionado && (
                    <div className="invalid-feedback d-block">{formErrors.productoSeleccionado}</div>
                  )}
                </div>
                <div className="col-md-2">
                  <label htmlFor="cantidad" className="form-label">
                    Cantidad <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.cantidad ? "is-invalid" : ""}`}
                    id="cantidad"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    min="1"
                    max="1000"
                    disabled={!formData.productoSeleccionado}
                  />
                  {formErrors.cantidad && <div className="invalid-feedback">{formErrors.cantidad}</div>}
                  <small className="form-text text-muted">Máximo 1000 unidades</small>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-success ms-auto"
                    onClick={handleAddProduct}
                    disabled={!formData.productoSeleccionado}
                  >
                    <Plus size={18} className="me-1" />
                    Agregar
                  </button>
                </div>
              </div>

              {formErrors.productosAgregados && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <AlertTriangle size={18} className="me-2" />
                  {formErrors.productosAgregados}
                </div>
              )}

              <div className="table-responsive mt-4">
                <table className="table table-striped table-bordered">
                  <thead className="table-primary">
                    <tr>
                      {productosAgregadosColumns.map((column) => (
                        <th key={column.field}>{column.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.productosAgregados.length > 0 ? (
                      formData.productosAgregados.map((producto, index) => (
                        <tr key={`${producto.id}-${index}`}>
                          {productosAgregadosColumns.map((column) => (
                            <td key={`${producto.id}-${column.field}`}>
                              {column.render ? column.render(producto, index) : producto[column.field]}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={productosAgregadosColumns.length} className="text-center py-3">
                          No hay productos agregados
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
                        <span>${formatNumber(calcularTotales().montoTotal)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Total IVA:</strong>
                        <span>${formatNumber(calcularTotales().totalIVA)}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Monto Total con IVA:</strong>
                        <span className="text-primary fw-bold">
                          ${formatNumber(calcularTotales().montoTotalConIVA)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveCompra}>
                  <Save size={18} className="me-1" />
                  {isEditing ? "Actualizar Compra" : "Registrar Compra"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default RegistrarCompra


"use client"

import { useState, useEffect } from "react"
import { Save, Trash2, FileText, Plus } from "lucide-react"
import Select from "react-select"
import "../../Styles/AdminStyles/CompraFormulario.css"
import { toast } from "react-toastify"

const CompraFormulario = ({ show, onHide, title, compra, productos, proveedores, onSave, formatNumber }) => {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigoFactura: "",
    proveedor: null,
    fechaCompra: new Date().toISOString().split("T")[0],
    productosAgregados: [],
    productoSeleccionado: null,
    cantidad: 1,
  })

  // Generar un código de factura único
  const generateInvoiceCode = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `COMP-${year}-${randomNum}`
  }

  // Inicializar el formulario cuando cambia la compra seleccionada
  useEffect(() => {
    if (compra) {
      setFormData({
        codigoFactura: compra.codigoFactura,
        proveedor: compra.proveedor,
        fechaCompra: compra.fechaCompra,
        productosAgregados: [...compra.productos],
        productoSeleccionado: null,
        cantidad: 1,
      })
    } else {
      setFormData({
        codigoFactura: generateInvoiceCode(),
        proveedor: null,
        fechaCompra: new Date().toISOString().split("T")[0],
        productosAgregados: [],
        productoSeleccionado: null,
        cantidad: 1,
      })
    }
  }, [compra])

  // Inicializar Bootstrap modal
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("compraModal")

    if (show) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
    } else {
      // Si show es false y el modal está abierto, cerrarlo programáticamente
      if (modalElement && modalElement.classList.contains("show")) {
        import("bootstrap").then((bootstrap) => {
          modalInstance = bootstrap.Modal.getInstance(modalElement)
          if (modalInstance) {
            modalInstance.hide()
          }
        })
      }
    }

    // Evento para cuando el modal se cierra con el botón X o haciendo clic fuera
    const handleHidden = () => {
      onHide()
    }

    modalElement?.addEventListener("hidden.bs.modal", handleHidden)

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden)
    }
  }, [show, onHide])

  // Manejador para cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Manejador para seleccionar un producto
  const handleSelectProduct = (selectedOption) => {
    setFormData({
      ...formData,
      productoSeleccionado: selectedOption ? selectedOption.value : null,
    })
  }

  // Manejador para seleccionar un proveedor
  const handleSelectProveedor = (selectedOption) => {
    setFormData({
      ...formData,
      proveedor: selectedOption ? selectedOption.value : null,
    })
  }

  // Manejador para agregar un producto a la lista
  const handleAddProduct = () => {
    const { productoSeleccionado, cantidad } = formData

    // Validaciones
    if (!productoSeleccionado) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, seleccione un producto.</p>
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

    if (!cantidad || cantidad <= 0) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, ingrese una cantidad válida.</p>
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

    // Verificar si el producto ya está en la lista
    const productoExistente = formData.productosAgregados.findIndex((p) => p.id === productoSeleccionado.id)

    const nuevosProductos = [...formData.productosAgregados]

    if (productoExistente !== -1) {
      // Actualizar cantidad si el producto ya existe
      nuevosProductos[productoExistente] = {
        ...nuevosProductos[productoExistente],
        cantidad: Number.parseInt(nuevosProductos[productoExistente].cantidad) + Number.parseInt(cantidad),
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

  // Manejador para eliminar un producto de la lista
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

  // Calcular totales
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

  // Manejador para guardar la compra
  const handleSaveCompra = () => {
    // Validaciones básicas
    if (!formData.proveedor) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, seleccione un proveedor.</p>
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

    if (formData.productosAgregados.length === 0) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, agregue al menos un producto a la compra.</p>
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
      codigoFactura: formData.codigoFactura,
      representante: formData.proveedor.representante,
      proveedor: formData.proveedor,
      fechaCompra: formData.fechaCompra,
      montoTotal: montoTotal,
      totalIVA: totalIVA,
      montoTotalConIVA: montoTotalConIVA,
      productos: [...formData.productosAgregados],
    }

    // Llamar a la función onSave del componente padre
    onSave(compraData)
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
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleRemoveProduct(index)}
          disabled={title === "Ver Detalles de la Compra"}
        >
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
    <div className="modal fade" id="compraModal" tabIndex="-1" aria-labelledby="compraModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="compraModalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
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
                    isDisabled={title === "Ver Detalles de la Compra"}
                    styles={customSelectStyles}
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No se encontraron proveedores"}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="fechaCompra" className="form-label">
                    Fecha de Compra <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaCompra"
                    name="fechaCompra"
                    value={formData.fechaCompra}
                    onChange={handleInputChange}
                    disabled={title === "Ver Detalles de la Compra"}
                    required
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h5 className="mb-3">Agregar Productos</h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="producto" className="form-label">
                    Producto
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
                    isDisabled={title === "Ver Detalles de la Compra"}
                    styles={customSelectStyles}
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No se encontraron productos"}
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="cantidad" className="form-label">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    min="1"
                    disabled={title === "Ver Detalles de la Compra" || !formData.productoSeleccionado}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-success ms-auto"
                    onClick={handleAddProduct}
                    disabled={title === "Ver Detalles de la Compra" || !formData.productoSeleccionado}
                  >
                    <Plus size={18} className="me-1" />
                    Agregar
                  </button>
                </div>
              </div>

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
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onHide}>
              Cancelar
            </button>

            {title !== "Ver Detalles de la Compra" && (
              <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveCompra}>
                <Save size={18} className="me-1" />
                {compra ? "Actualizar Compra" : "Registrar Compra"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompraFormulario


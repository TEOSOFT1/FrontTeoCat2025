"use client"

import { useState } from "react"
import { Save, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react"

/**
 * Componente de formulario para la gestión de roles
 */
const RoleForm = ({ formData, setFormData, modalTitle, handleCloseModal, handleSaveRole }) => {
  // Estado para controlar qué secciones están expandidas
  const [expandedSections, setExpandedSections] = useState({
    configuracion: false,
    usuarios: false,
    productos: false,
    proveedores: false,
    compras: false,
    mascotas: false,
    citas: false,
    servicios: false,
    ventas: false,
    resenas: false,
    devolucion: false,
    notificaciones: false,
  })

  /**
   * Manejador para cambios en el input de nombre
   */
  const handleNameChange = (e) => {
    setFormData({
      ...formData,
      nombre: e.target.value,
    })
  }

  /**
   * Manejador para cambios en los checkboxes de permisos
   */
  const handlePermissionChange = (module, submodule, permission) => {
    // Crear una copia profunda del objeto de permisos para evitar modificar el estado directamente
    const updatedPermisos = JSON.parse(JSON.stringify(formData.permisos))

    // Asegurarse de que el módulo y submódulo existan
    if (!updatedPermisos[module]) {
      updatedPermisos[module] = {}
    }

    if (!updatedPermisos[module][submodule]) {
      updatedPermisos[module][submodule] = {
        crear: false,
        modificar: false,
        cambiarEstado: false,
        visualizar: false,
        eliminar: false,
      }
    }

    // Actualizar el permiso específico
    updatedPermisos[module][submodule][permission] = !updatedPermisos[module][submodule][permission]

    setFormData({
      ...formData,
      permisos: updatedPermisos,
    })
  }

  /**
   * Función para alternar la expansión de una sección
   */
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  /**
   * Función para renderizar un checkbox de permiso
   */
  const renderCheckbox = (module, submodule, permission) => {
    // Verificar si el módulo y submódulo existen en los permisos
    const isChecked =
      formData.permisos[module] &&
      formData.permisos[module][submodule] &&
      formData.permisos[module][submodule][permission]

    return (
      <td className="text-center">
        <div className="form-check d-flex justify-content-center">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isChecked || false}
            onChange={() => handlePermissionChange(module, submodule, permission)}
            disabled={modalTitle === "Ver Detalles del Rol"}
            id={`${module}-${submodule}-${permission}`}
          />
        </div>
      </td>
    )
  }

  return (
    <form>
      <div className="mb-4">
        <label htmlFor="roleName" className="form-label">
          Nombre del Rol
        </label>
        <input
          type="text"
          className="form-control"
          id="roleName"
          value={formData.nombre}
          onChange={handleNameChange}
          disabled={modalTitle === "Ver Detalles del Rol"}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered permissions-table">
          <thead className="table-light">
            <tr>
              <th>Módulo</th>
              <th>Crear</th>
              <th>Modificar</th>
              <th>Cambiar Estado</th>
              <th>Visualizar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {/* CONFIGURACIÓN */}
            <tr className="module-header" onClick={() => toggleSection("configuracion")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.configuracion ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                CONFIGURACIÓN
              </td>
            </tr>
            {expandedSections.configuracion && (
              <>
                <tr>
                  <td className="ps-4">Gestión de Roles</td>
                  {renderCheckbox("configuracion", "roles", "crear")}
                  {renderCheckbox("configuracion", "roles", "modificar")}
                  {renderCheckbox("configuracion", "roles", "cambiarEstado")}
                  {renderCheckbox("configuracion", "roles", "visualizar")}
                  {renderCheckbox("configuracion", "roles", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Gestión de Permisos</td>
                  {renderCheckbox("configuracion", "permisos", "crear")}
                  {renderCheckbox("configuracion", "permisos", "modificar")}
                  {renderCheckbox("configuracion", "permisos", "cambiarEstado")}
                  {renderCheckbox("configuracion", "permisos", "visualizar")}
                  {renderCheckbox("configuracion", "permisos", "eliminar")}
                </tr>
              </>
            )}

            {/* USUARIOS */}
            <tr className="module-header" onClick={() => toggleSection("usuarios")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.usuarios ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                USUARIOS
              </td>
            </tr>
            {expandedSections.usuarios && (
              <>
                <tr>
                  <td className="ps-4">Gestión de Usuarios</td>
                  {renderCheckbox("usuarios", "gestion", "crear")}
                  {renderCheckbox("usuarios", "gestion", "modificar")}
                  {renderCheckbox("usuarios", "gestion", "cambiarEstado")}
                  {renderCheckbox("usuarios", "gestion", "visualizar")}
                  {renderCheckbox("usuarios", "gestion", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Gestión de Acceso</td>
                  {renderCheckbox("usuarios", "acceso", "crear")}
                  {renderCheckbox("usuarios", "acceso", "modificar")}
                  {renderCheckbox("usuarios", "acceso", "cambiarEstado")}
                  {renderCheckbox("usuarios", "acceso", "visualizar")}
                  {renderCheckbox("usuarios", "acceso", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Gestión de Clientes</td>
                  {renderCheckbox("usuarios", "clientes", "crear")}
                  {renderCheckbox("usuarios", "clientes", "modificar")}
                  {renderCheckbox("usuarios", "clientes", "cambiarEstado")}
                  {renderCheckbox("usuarios", "clientes", "visualizar")}
                  {renderCheckbox("usuarios", "clientes", "eliminar")}
                </tr>
              </>
            )}

            {/* PRODUCTOS */}
            <tr className="module-header" onClick={() => toggleSection("productos")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.productos ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                PRODUCTOS
              </td>
            </tr>
            {expandedSections.productos && (
              <>
                <tr>
                  <td className="ps-4">Gestión Categorías</td>
                  {renderCheckbox("productos", "categorias", "crear")}
                  {renderCheckbox("productos", "categorias", "modificar")}
                  {renderCheckbox("productos", "categorias", "cambiarEstado")}
                  {renderCheckbox("productos", "categorias", "visualizar")}
                  {renderCheckbox("productos", "categorias", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Gestión de Productos</td>
                  {renderCheckbox("productos", "gestion", "crear")}
                  {renderCheckbox("productos", "gestion", "modificar")}
                  {renderCheckbox("productos", "gestion", "cambiarEstado")}
                  {renderCheckbox("productos", "gestion", "visualizar")}
                  {renderCheckbox("productos", "gestion", "eliminar")}
                </tr>
              </>
            )}

            {/* PROVEEDORES */}
            <tr className="module-header" onClick={() => toggleSection("proveedores")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.proveedores ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                PROVEEDORES
              </td>
            </tr>
            {expandedSections.proveedores && (
              <tr>
                <td className="ps-4">Gestión de Proveedores</td>
                {renderCheckbox("proveedores", "gestion", "crear")}
                {renderCheckbox("proveedores", "gestion", "modificar")}
                {renderCheckbox("proveedores", "gestion", "cambiarEstado")}
                {renderCheckbox("proveedores", "gestion", "visualizar")}
                {renderCheckbox("proveedores", "gestion", "eliminar")}
              </tr>
            )}

            {/* COMPRAS */}
            <tr className="module-header" onClick={() => toggleSection("compras")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.compras ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                COMPRAS
              </td>
            </tr>
            {expandedSections.compras && (
              <tr>
                <td className="ps-4">Gestión de Compras</td>
                {renderCheckbox("compras", "gestion", "crear")}
                {renderCheckbox("compras", "gestion", "modificar")}
                {renderCheckbox("compras", "gestion", "cambiarEstado")}
                {renderCheckbox("compras", "gestion", "visualizar")}
                {renderCheckbox("compras", "gestion", "eliminar")}
              </tr>
            )}

            {/* MASCOTAS */}
            <tr className="module-header" onClick={() => toggleSection("mascotas")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.mascotas ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                MASCOTAS
              </td>
            </tr>
            {expandedSections.mascotas && (
              <tr>
                <td className="ps-4">Gestión de Mascotas</td>
                {renderCheckbox("mascotas", "gestion", "crear")}
                {renderCheckbox("mascotas", "gestion", "modificar")}
                {renderCheckbox("mascotas", "gestion", "cambiarEstado")}
                {renderCheckbox("mascotas", "gestion", "visualizar")}
                {renderCheckbox("mascotas", "gestion", "eliminar")}
              </tr>
            )}

            {/* CITAS */}
            <tr className="module-header" onClick={() => toggleSection("citas")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.citas ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                CITAS
              </td>
            </tr>
            {expandedSections.citas && (
              <tr>
                <td className="ps-4">Gestión Agenda de Citas</td>
                {renderCheckbox("citas", "agenda", "crear")}
                {renderCheckbox("citas", "agenda", "modificar")}
                {renderCheckbox("citas", "agenda", "cambiarEstado")}
                {renderCheckbox("citas", "agenda", "visualizar")}
                {renderCheckbox("citas", "agenda", "eliminar")}
              </tr>
            )}

            {/* SERVICIOS */}
            <tr className="module-header" onClick={() => toggleSection("servicios")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.servicios ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                SERVICIOS
              </td>
            </tr>
            {expandedSections.servicios && (
              <>
                <tr>
                  <td className="ps-4">Gestión de Servicios</td>
                  {renderCheckbox("servicios", "gestion", "crear")}
                  {renderCheckbox("servicios", "gestion", "modificar")}
                  {renderCheckbox("servicios", "gestion", "cambiarEstado")}
                  {renderCheckbox("servicios", "gestion", "visualizar")}
                  {renderCheckbox("servicios", "gestion", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Gestión de Tipos de Servicio</td>
                  {renderCheckbox("servicios", "tipos", "crear")}
                  {renderCheckbox("servicios", "tipos", "modificar")}
                  {renderCheckbox("servicios", "tipos", "cambiarEstado")}
                  {renderCheckbox("servicios", "tipos", "visualizar")}
                  {renderCheckbox("servicios", "tipos", "eliminar")}
                </tr>
              </>
            )}

            {/* VENTAS */}
            <tr className="module-header" onClick={() => toggleSection("ventas")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.ventas ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                VENTAS
              </td>
            </tr>
            {expandedSections.ventas && (
              <>
                <tr>
                  <td className="ps-4">Gestión de Ventas</td>
                  {renderCheckbox("ventas", "gestion", "crear")}
                  {renderCheckbox("ventas", "gestion", "modificar")}
                  {renderCheckbox("ventas", "gestion", "cambiarEstado")}
                  {renderCheckbox("ventas", "gestion", "visualizar")}
                  {renderCheckbox("ventas", "gestion", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Gestión de Pagos</td>
                  {renderCheckbox("ventas", "pagos", "crear")}
                  {renderCheckbox("ventas", "pagos", "modificar")}
                  {renderCheckbox("ventas", "pagos", "cambiarEstado")}
                  {renderCheckbox("ventas", "pagos", "visualizar")}
                  {renderCheckbox("ventas", "pagos", "eliminar")}
                </tr>
              </>
            )}

            {/* RESEÑAS */}
            <tr className="module-header" onClick={() => toggleSection("resenas")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.resenas ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                RESEÑAS
              </td>
            </tr>
            {expandedSections.resenas && (
              <>
                <tr>
                  <td className="ps-4">Gestión de Reseñas</td>
                  {renderCheckbox("resenas", "gestion", "crear")}
                  {renderCheckbox("resenas", "gestion", "modificar")}
                  {renderCheckbox("resenas", "gestion", "cambiarEstado")}
                  {renderCheckbox("resenas", "gestion", "visualizar")}
                  {renderCheckbox("resenas", "gestion", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Tipo de Reseñas</td>
                  {renderCheckbox("resenas", "tipos", "crear")}
                  {renderCheckbox("resenas", "tipos", "modificar")}
                  {renderCheckbox("resenas", "tipos", "cambiarEstado")}
                  {renderCheckbox("resenas", "tipos", "visualizar")}
                  {renderCheckbox("resenas", "tipos", "eliminar")}
                </tr>
              </>
            )}

            {/* DEVOLUCIÓN */}
            <tr className="module-header" onClick={() => toggleSection("devolucion")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.devolucion ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                DEVOLUCIÓN
              </td>
            </tr>
            {expandedSections.devolucion && (
              <tr>
                <td className="ps-4">Gestión Devoluciones</td>
                {renderCheckbox("devolucion", "gestion", "crear")}
                {renderCheckbox("devolucion", "gestion", "modificar")}
                {renderCheckbox("devolucion", "gestion", "cambiarEstado")}
                {renderCheckbox("devolucion", "gestion", "visualizar")}
                {renderCheckbox("devolucion", "gestion", "eliminar")}
              </tr>
            )}

            {/* NOTIFICACIONES */}
            <tr className="module-header" onClick={() => toggleSection("notificaciones")} style={{ cursor: "pointer" }}>
              <td colSpan="6" className="d-flex align-items-center">
                {expandedSections.notificaciones ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                NOTIFICACIONES
              </td>
            </tr>
            {expandedSections.notificaciones && (
              <>
                <tr>
                  <td className="ps-4">Stock</td>
                  {renderCheckbox("notificaciones", "stock", "crear")}
                  {renderCheckbox("notificaciones", "stock", "modificar")}
                  {renderCheckbox("notificaciones", "stock", "cambiarEstado")}
                  {renderCheckbox("notificaciones", "stock", "visualizar")}
                  {renderCheckbox("notificaciones", "stock", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Vencimiento</td>
                  {renderCheckbox("notificaciones", "vencimiento", "crear")}
                  {renderCheckbox("notificaciones", "vencimiento", "modificar")}
                  {renderCheckbox("notificaciones", "vencimiento", "cambiarEstado")}
                  {renderCheckbox("notificaciones", "vencimiento", "visualizar")}
                  {renderCheckbox("notificaciones", "vencimiento", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Reseñas</td>
                  {renderCheckbox("notificaciones", "resenas", "crear")}
                  {renderCheckbox("notificaciones", "resenas", "modificar")}
                  {renderCheckbox("notificaciones", "resenas", "cambiarEstado")}
                  {renderCheckbox("notificaciones", "resenas", "visualizar")}
                  {renderCheckbox("notificaciones", "resenas", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Comprobantes</td>
                  {renderCheckbox("notificaciones", "comprobantes", "crear")}
                  {renderCheckbox("notificaciones", "comprobantes", "modificar")}
                  {renderCheckbox("notificaciones", "comprobantes", "cambiarEstado")}
                  {renderCheckbox("notificaciones", "comprobantes", "visualizar")}
                  {renderCheckbox("notificaciones", "comprobantes", "eliminar")}
                </tr>
                <tr>
                  <td className="ps-4">Citas</td>
                  {renderCheckbox("notificaciones", "citas", "crear")}
                  {renderCheckbox("notificaciones", "citas", "modificar")}
                  {renderCheckbox("notificaciones", "citas", "cambiarEstado")}
                  {renderCheckbox("notificaciones", "citas", "visualizar")}
                  {renderCheckbox("notificaciones", "citas", "eliminar")}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Nota de advertencia */}
      <div className="alert alert-warning mt-4">
        <div className="d-flex align-items-center">
          <AlertTriangle size={20} className="me-2" />
          <strong>Nota:</strong> El rol de Administrador no puede ser eliminado ni desactivado. Solo el Administrador
          puede crear, modificar o eliminar roles.
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
          Cancelar
        </button>

        {modalTitle !== "Ver Detalles del Rol" && (
          <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveRole}>
            <Save size={18} className="me-1" />
            Guardar Rol
          </button>
        )}
      </div>
    </form>
  )
}

export default RoleForm


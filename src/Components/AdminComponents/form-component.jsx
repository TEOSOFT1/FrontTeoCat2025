"use client"

import { useState, useEffect } from "react"
import { Save, User, Scissors, Calendar, Clock, Plus, X } from "lucide-react"
import Select from "react-select"

export const FormComponent = ({ formData, onFormChange, onSave, onCancel, isEditing, clientes, servicios }) => {
  const [selectedCliente, setSelectedCliente] = useState(formData.cliente)
  const [selectedMascota, setSelectedMascota] = useState(formData.mascota)
  const [mascotas, setMascotas] = useState([])
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [selectedServicios, setSelectedServicios] = useState(
    formData.servicios && formData.servicios.length > 0 ? formData.servicios : [],
  )

  // Actualizar mascotas cuando cambia el cliente
  useEffect(() => {
    if (selectedCliente) {
      setMascotas(selectedCliente.mascotas)
      // Si no hay mascota seleccionada y hay mascotas disponibles, seleccionar la primera
      if (!selectedMascota && selectedCliente.mascotas.length > 0) {
        setSelectedMascota(selectedCliente.mascotas[0])
        onFormChange({
          ...formData,
          mascota: selectedCliente.mascotas[0],
        })
      }
    } else {
      setMascotas([])
      setSelectedMascota(null)
    }
  }, [selectedCliente])

  // Actualizar el formulario cuando cambian los servicios seleccionados
  useEffect(() => {
    onFormChange({
      ...formData,
      servicios: selectedServicios,
    })
  }, [selectedServicios])

  // Función para formatear números con separadores de miles
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Función para formatear duración
  const formatDuracion = (minutos) => {
    if (minutos < 60) {
      return `${minutos} min`
    } else {
      const horas = Math.floor(minutos / 60)
      const min = minutos % 60
      return min > 0 ? `${horas} h ${min} min` : `${horas} h`
    }
  }

  // Determinar el tamaño de la mascota (pequeño o grande)
  const getTamanioMascota = (peso) => {
    return peso <= 10 ? "Pequeño" : "Grande"
  }

  // Calcular el total de los servicios
  const calcularTotal = () => {
    return selectedServicios.reduce((total, servicio) => total + servicio.precio, 0)
  }

  // Manejador para cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    onFormChange({
      ...formData,
      [name]: value,
    })
  }

  // Manejador para seleccionar un cliente
  const handleSelectCliente = (selectedOption) => {
    const cliente = selectedOption ? selectedOption.value : null
    setSelectedCliente(cliente)
    onFormChange({
      ...formData,
      cliente,
      mascota: null,
    })
  }

  // Manejador para seleccionar una mascota
  const handleSelectMascota = (selectedOption) => {
    const mascota = selectedOption ? selectedOption.value : null
    setSelectedMascota(mascota)
    onFormChange({
      ...formData,
      mascota,
    })
  }

  // Manejador para seleccionar un servicio
  const handleSelectServicio = (selectedOption) => {
    setSelectedServicio(selectedOption ? selectedOption.value : null)
  }

  // Manejador para añadir un servicio a la lista
  const handleAddServicio = () => {
    if (selectedServicio && !selectedServicios.some((s) => s.id === selectedServicio.id)) {
      setSelectedServicios([...selectedServicios, selectedServicio])
      setSelectedServicio(null)
    }
  }

  // Manejador para eliminar un servicio de la lista
  const handleRemoveServicio = (servicioId) => {
    setSelectedServicios(selectedServicios.filter((servicio) => servicio.id !== servicioId))
  }

  // Opciones para el select de clientes
  const clientesOptions = clientes.map((cliente) => ({
    value: cliente,
    label: `${cliente.nombre} - ${cliente.telefono}`,
  }))

  // Opciones para el select de mascotas
  const mascotasOptions = mascotas.map((mascota) => ({
    value: mascota,
    label: mascota.nombre,
  }))

  // Opciones para el select de servicios
  const serviciosOptions = servicios.map((servicio) => ({
    value: servicio,
    label: `${servicio.nombre} - ${formatDuracion(servicio.duracion)} - $${formatNumber(servicio.precio)}`,
  }))

  // Opciones para el select de estados
  const estadosOptions = [
    { value: "Programada", label: "Programada" },
    { value: "Confirmada", label: "Confirmada" },
    { value: "Completada", label: "Completada" },
    { value: "Cancelada", label: "Cancelada" },
  ]

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
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  }

  // Modificar el método de renderizado para usar un layout más compacto
  return (
    <div className="cita-form-section">
      <h4 className="mb-3">Detalles de la Cita</h4>

      <div className="catalog-layout">
        {/* Primera fila: Cliente y Mascota */}
        <div className="d-flex flex-wrap gap-3">
          {/* Sección de Cliente */}
          <div className="catalog-card flex-grow-1" style={{ minWidth: "300px" }}>
            <div className="catalog-card-header">
              <h5>
                <User size={18} className="me-2" /> Cliente <span className="text-danger">*</span>
              </h5>
            </div>
            <div className="catalog-card-body">
              <Select
                id="cliente"
                name="cliente"
                className="react-select-container"
                classNamePrefix="react-select"
                options={clientesOptions}
                value={
                  formData.cliente ? clientesOptions.find((option) => option.value.id === formData.cliente?.id) : null
                }
                onChange={handleSelectCliente}
                placeholder="Seleccione un cliente..."
                styles={customSelectStyles}
                isClearable
                isSearchable
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                noOptionsMessage={() => "No se encontraron clientes"}
              />
            </div>
          </div>

          {/* Sección de Mascota */}
          {selectedCliente && (
            <div className="catalog-card flex-grow-1" style={{ minWidth: "300px" }}>
              <div className="catalog-card-header">
                <h5>
                  <span role="img" aria-label="mascota" className="me-2">
                    🐾
                  </span>{" "}
                  Mascota <span className="text-danger">*</span>
                </h5>
              </div>
              <div className="catalog-card-body">
                <Select
                  id="mascota"
                  name="mascota"
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                  options={mascotasOptions}
                  value={
                    formData.mascota ? mascotasOptions.find((option) => option.value.id === formData.mascota?.id) : null
                  }
                  onChange={handleSelectMascota}
                  placeholder="Seleccione una mascota..."
                  styles={customSelectStyles}
                  isClearable
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  noOptionsMessage={() => "No se encontraron mascotas"}
                />

                {selectedMascota && (
                  <div className="pet-info-card">
                    <div className="pet-info-header">
                      <div className="pet-avatar">{selectedMascota.especie === "Perro" ? "🐶" : "🐱"}</div>
                      <div className="pet-info-name">
                        <h6>{selectedMascota.nombre}</h6>
                        <p>{selectedMascota.raza}</p>
                      </div>
                    </div>
                    <div className="pet-info-details">
                      <div className="pet-info-item">
                        <span>Edad:</span>
                        <span className="text-primary">{selectedMascota.edad} años</span>
                      </div>
                      <div className="pet-info-item">
                        <span>Tamaño:</span>
                        <span className="text-primary">{getTamanioMascota(selectedMascota.peso)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Segunda fila: Servicios */}
        <div className="catalog-card">
          <div className="catalog-card-header">
            <h5>
              <Scissors size={18} className="me-2" /> Servicios <span className="text-danger">*</span>
            </h5>
          </div>
          <div className="catalog-card-body">
            <div className="d-flex gap-2">
              <Select
                id="servicio"
                name="servicio"
                className="react-select-container flex-grow-1"
                classNamePrefix="react-select"
                options={serviciosOptions}
                value={
                  selectedServicio ? serviciosOptions.find((option) => option.value.id === selectedServicio?.id) : null
                }
                onChange={handleSelectServicio}
                placeholder="Seleccione un servicio..."
                styles={customSelectStyles}
                isClearable
                isSearchable
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                noOptionsMessage={() => "No se encontraron servicios"}
              />
              <button className="btn btn-outline-primary" onClick={handleAddServicio} disabled={!selectedServicio}>
                <Plus size={18} />
              </button>
            </div>

            {selectedServicios.length > 0 && (
              <div className="selected-services-list">
                {selectedServicios.map((servicio) => (
                  <div key={servicio.id} className="service-item">
                    <div className="service-item-details">
                      <span className="service-item-name">{servicio.nombre}</span>
                      <span className="service-item-info">{formatDuracion(servicio.duracion)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="service-item-price">${formatNumber(servicio.precio)}</span>
                      <button className="service-item-remove" onClick={() => handleRemoveServicio(servicio.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="service-total">
                  <span>Total:</span>
                  <span>${formatNumber(calcularTotal())}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tercera fila: Fecha/Hora y Detalles Adicionales */}
        <div className="d-flex flex-wrap gap-3">
          {/* Sección de Fecha y Hora */}
          <div className="catalog-card flex-grow-1" style={{ minWidth: "300px" }}>
            <div className="catalog-card-header">
              <h5>
                <Calendar size={18} className="me-2" /> Fecha y Hora <span className="text-danger">*</span>
              </h5>
            </div>
            <div className="catalog-card-body">
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Calendar size={16} />
                    </span>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Clock size={16} />
                    </span>
                    <input
                      type="time"
                      className="form-control"
                      id="hora"
                      name="hora"
                      value={formData.hora}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Estado y Notas */}
          <div className="catalog-card flex-grow-1" style={{ minWidth: "300px" }}>
            <div className="catalog-card-header">
              <h5>Detalles Adicionales</h5>
            </div>
            <div className="catalog-card-body">
              <div className="mb-3">
                <label htmlFor="estado" className="form-label">
                  Estado
                </label>
                <select
                  className="form-select"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  {estadosOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label htmlFor="notas" className="form-label">
                  Notas
                </label>
                <textarea
                  className="form-control"
                  id="notas"
                  name="notas"
                  rows={2}
                  value={formData.notas}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
          Cancelar
        </button>
        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={onSave}>
          <Save size={18} className="me-1" />
          {isEditing ? "Actualizar Cita" : "Agendar Cita"}
        </button>
      </div>
    </div>
  )
}


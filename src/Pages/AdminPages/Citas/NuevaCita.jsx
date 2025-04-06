"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/NuevaCita.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

import { CalendarComponent } from "../../../Components/AdminComponents/CitasComponents/calendar-component"
import { TimeSlotsComponent } from "../../../Components/AdminComponents/CitasComponents/time-slots-component"
import { FormComponent } from "../../../Components/AdminComponents/CitasComponents/form-component"

/**
 * Componente para agendar una nueva cita o editar una existente
 */
const NuevaCita = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const citaId = queryParams.get("id")
  const isEditing = !!citaId

  // Datos de ejemplo para clientes
  const clientesMock = [
    {
      id: "1",
      nombre: "Juan Pérez",
      telefono: "123-456-7890",
      mascotas: [
        {
          id: "1",
          nombre: "Max",
          especie: "Perro",
          raza: "Labrador",
          edad: 3,
          peso: 25,
          foto: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "2",
          nombre: "Luna",
          especie: "Gato",
          raza: "Siamés",
          edad: 2,
          peso: 4,
        },
      ],
    },
    {
      id: "2",
      nombre: "María López",
      telefono: "987-654-3210",
      mascotas: [
        {
          id: "3",
          nombre: "Rocky",
          especie: "Perro",
          raza: "Bulldog",
          edad: 5,
          peso: 18,
        },
      ],
    },
    {
      id: "3",
      nombre: "Carlos Rodríguez",
      telefono: "555-123-4567",
      mascotas: [
        {
          id: "4",
          nombre: "Bella",
          especie: "Perro",
          raza: "Golden Retriever",
          edad: 4,
          peso: 30,
        },
      ],
    },
  ]

  // Datos de ejemplo para servicios
  const serviciosMock = [
    {
      id: "1",
      nombre: "Baño y Corte",
      descripcion: "Baño completo con shampoo especial y corte de pelo según la raza",
      duracion: 90,
      precio: 45000,
      multiplesMascotas: false,
      tipoServicioId: "1", // Referencia al tipo de servicio
    },
    {
      id: "2",
      nombre: "Consulta Veterinaria",
      descripcion: "Revisión general de salud y actualización de vacunas",
      duracion: 30,
      precio: 35000,
      multiplesMascotas: false,
      tipoServicioId: "2", // Referencia al tipo de servicio
    },
    {
      id: "3",
      nombre: "Limpieza Dental",
      descripcion: "Limpieza profunda de dientes y encías",
      duracion: 45,
      precio: 50000,
      multiplesMascotas: false,
      tipoServicioId: "2", // Referencia al tipo de servicio
    },
    {
      id: "4",
      nombre: "Paseo",
      descripcion: "Paseo de mascotas con duración de 1 hora",
      duracion: 60,
      precio: 25000,
      multiplesMascotas: true,
      tipoServicioId: "3", // Referencia al tipo de servicio
    },
  ]

  // Datos de ejemplo para citas agendadas
  const citasAgendadasMock = [
    {
      id: "1",
      clienteId: "1",
      mascotaId: "1",
      mascotasIds: ["1"],
      serviciosIds: ["1"],
      fecha: new Date().toISOString().split("T")[0],
      hora: "10:00",
      estado: "Confirmada",
      notas: "",
      duracionTotal: 90,
      precioTotal: 45000,
      fechaCreacion: new Date().toISOString(),
      // Datos para la UI
      cliente: clientesMock[0],
      mascota: clientesMock[0].mascotas[0],
      mascotas: [clientesMock[0].mascotas[0]],
      servicios: [serviciosMock[0]],
    },
    {
      id: "2",
      clienteId: "2",
      mascotaId: "3",
      mascotasIds: ["3"],
      serviciosIds: ["2", "4"],
      fecha: new Date().toISOString().split("T")[0],
      hora: "14:30",
      estado: "Programada",
      notas: "Cliente solicita atención especial",
      duracionTotal: 90,
      precioTotal: 60000,
      fechaCreacion: new Date().toISOString(),
      // Datos para la UI
      cliente: clientesMock[1],
      mascota: clientesMock[1].mascotas[0],
      mascotas: [clientesMock[1].mascotas[0]],
      servicios: [serviciosMock[1], serviciosMock[3]],
    },
    {
      id: "3",
      clienteId: "3",
      mascotaId: "4",
      mascotasIds: ["4"],
      serviciosIds: ["3"],
      fecha: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
      hora: "11:00",
      estado: "Programada",
      notas: "",
      duracionTotal: 45,
      precioTotal: 50000,
      fechaCreacion: new Date().toISOString(),
      // Datos para la UI
      cliente: clientesMock[2],
      mascota: clientesMock[2].mascotas[0],
      mascotas: [clientesMock[2].mascotas[0]],
      servicios: [serviciosMock[2]],
    },
  ]

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Estado para clientes y servicios
  const [clientes, setClientes] = useState(clientesMock)
  const [servicios, setServicios] = useState(serviciosMock)
  const [citasAgendadas, setCitasAgendadas] = useState(citasAgendadasMock)

  // Estado para el formulario (inicialmente vacío)
  const [formData, setFormData] = useState({
    cliente: null,
    mascota: null,
    mascotas: [],
    servicios: [],
    fecha: new Date().toISOString().split("T")[0],
    hora: "10:00",
    estado: "Programada",
    notas: "",
  })

  // Estado para el calendario
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Estado para validación
  const [formErrors, setFormErrors] = useState({
    cliente: "",
    mascota: "",
    mascotas: "",
    servicios: "",
  })

  // Cargar cita para edición si existe el ID
  useEffect(() => {
    if (isEditing && citaId) {
      const citaExistente = citasAgendadas.find((cita) => cita.id === citaId)
      if (citaExistente) {
        setFormData({
          ...citaExistente,
          fecha: citaExistente.fecha,
          hora: citaExistente.hora,
          notas: citaExistente.notas || "",
        })

        // Actualizar fecha seleccionada
        setSelectedDate(new Date(citaExistente.fecha))
        setSelectedTimeSlot(citaExistente.hora)
      } else {
        // Si no se encuentra la cita, mostrar error y redirigir
        toast.error(
          <div>
            <strong>Error</strong>
            <p>No se encontró la cita solicitada.</p>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClose: () => navigate("/servicios/AgendarCitas"),
          },
        )
      }
    }
  }, [isEditing, citaId, citasAgendadas, navigate])

  // Generar horarios disponibles cuando cambia la fecha seleccionada
  useEffect(() => {
    // Horarios de la tienda: 9:00 am a 6:30 pm, con descanso de 1:00 pm a 2:00 pm
    // Los domingos no trabajan (verificado en el componente de calendario)
    const horariosDisponibles = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      // Descanso de 13:00 a 14:00 (hora de almuerzo)
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
    ]

    // Si la fecha seleccionada es hoy, eliminar los horarios pasados
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())

    // Verificar si es domingo (no disponible)
    const isSunday = selectedDay.getDay() === 0

    if (isSunday) {
      // No hay horarios disponibles los domingos
      setTimeSlots([])
      setShowAlert(true)
      setAlertMessage("Los domingos no hay atención. Por favor, seleccione otro día.")
    } else if (selectedDay.getTime() === today.getTime()) {
      // Si es hoy, filtrar horarios pasados
      const currentHour = now.getHours()
      const currentMinutes = now.getMinutes()

      const horariosDisponiblesFiltrados = horariosDisponibles.filter((horario) => {
        const [hour, minutes] = horario.split(":").map(Number)
        return hour > currentHour || (hour === currentHour && minutes > currentMinutes)
      })

      setTimeSlots(horariosDisponiblesFiltrados)
      setShowAlert(horariosDisponiblesFiltrados.length === 0)
      setAlertMessage("Ya no hay horarios disponibles para hoy. Por favor, seleccione otro día.")
    } else {
      // Para otros días, mostrar todos los horarios disponibles
      setTimeSlots(horariosDisponibles)
      setShowAlert(false)
      setAlertMessage("")
    }

    // Actualizar la fecha en el formulario
    setFormData((prev) => ({
      ...prev,
      fecha: selectedDate.toISOString().split("T")[0],
    }))
  }, [selectedDate])

  /**
   * Validar el formulario de cita
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    const errors = {
      cliente: "",
      mascota: "",
      mascotas: "",
      servicios: "",
    }

    let isValid = true

    if (!formData.cliente) {
      errors.cliente = "Debe seleccionar un cliente"
      isValid = false
    }

    if (!formData.servicios || formData.servicios.length === 0) {
      errors.servicios = "Debe seleccionar al menos un servicio"
      isValid = false
    }

    // Validar que se haya seleccionado al menos una mascota
    const tieneMultiplesMascotas = formData.servicios.some((servicio) => servicio.multiplesMascotas)

    if (tieneMultiplesMascotas) {
      if (formData.mascotas.length === 0) {
        errors.mascotas = "Debe seleccionar al menos una mascota para los servicios elegidos"
        isValid = false
      }
    } else {
      if (!formData.mascota) {
        errors.mascota = "Debe seleccionar una mascota para la cita"
        isValid = false
      }
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Verificar si hay conflictos de horario con la duración del servicio
   * @param {string} fecha - Fecha de la cita
   * @param {string} hora - Hora de la cita
   * @param {Array} servicios - Servicios seleccionados
   * @param {string} citaId - ID de la cita actual (para edición)
   * @returns {boolean} - True si hay conflicto, false en caso contrario
   */
  const checkTimeConflicts = (fecha, hora, servicios, citaId = null) => {
    // Convertir hora a minutos desde el inicio del día
    const [horaNum, minutosNum] = hora.split(":").map(Number)
    const minutosTotales = horaNum * 60 + minutosNum

    // Calcular duración total de los servicios seleccionados
    const duracionTotal = servicios.reduce((total, servicio) => total + servicio.duracion, 0)

    // Hora de finalización en minutos
    const finalizacionMinutos = minutosTotales + duracionTotal

    // Verificar conflictos con otras citas
    return citasAgendadas.some((cita) => {
      // Ignorar la cita actual si estamos editando
      if (citaId && cita.id === citaId) return false

      // Solo verificar citas en la misma fecha
      if (cita.fecha !== fecha) return false

      // Convertir hora de la cita existente a minutos
      const [horaExistente, minutosExistente] = cita.hora.split(":").map(Number)
      const inicioExistenteMinutos = horaExistente * 60 + minutosExistente

      // Calcular duración de la cita existente
      const duracionExistente = cita.servicios.reduce((total, servicio) => total + servicio.duracion, 0)
      const finExistenteMinutos = inicioExistenteMinutos + duracionExistente

      // Verificar si hay solapamiento
      return (
        (minutosTotales >= inicioExistenteMinutos && minutosTotales < finExistenteMinutos) ||
        (finalizacionMinutos > inicioExistenteMinutos && finalizacionMinutos <= finExistenteMinutos) ||
        (minutosTotales <= inicioExistenteMinutos && finalizacionMinutos >= finExistenteMinutos)
      )
    })
  }

  /**
   * Manejador para seleccionar un horario
   */
  const handleSelectTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setFormData({
      ...formData,
      hora: timeSlot,
    })
  }

  /**
   * Manejador para seleccionar una fecha
   */
  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  /**
   * Manejador para ir al día siguiente
   */
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)

    // Si el siguiente día es domingo, avanzar un día más
    if (nextDay.getDay() === 0) {
      nextDay.setDate(nextDay.getDate() + 1)
    }

    setSelectedDate(nextDay)
  }

  /**
   * Manejador para actualizar el formulario
   */
  const handleFormChange = (newFormData) => {
    setFormData(newFormData)

    // Limpiar errores cuando se actualizan los campos
    const newErrors = { ...formErrors }
    if (newFormData.cliente) newErrors.cliente = ""
    if (newFormData.mascota) newErrors.mascota = ""
    if (newFormData.mascotas && newFormData.mascotas.length > 0) newErrors.mascotas = ""
    if (newFormData.servicios && newFormData.servicios.length > 0) newErrors.servicios = ""

    setFormErrors(newErrors)
  }

  /**
   * Manejador para guardar la cita
   */
  const handleSaveCita = () => {
    // Validar el formulario
    if (!validateForm()) {
      // Mostrar notificación de error general
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
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    // Verificar si el horario ya está ocupado considerando la duración del servicio
    const fechaSeleccionada = formData.fecha
    const horaSeleccionada = formData.hora
    const serviciosSeleccionados = formData.servicios

    const hayConflicto = checkTimeConflicts(
      fechaSeleccionada,
      horaSeleccionada,
      serviciosSeleccionados,
      isEditing ? citaId : null,
    )

    if (hayConflicto) {
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Este horario se solapa con otra cita existente. Por favor, seleccione otro horario.</p>
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

    // Calcular duración total y precio total
    const duracionTotal = formData.servicios.reduce((total, servicio) => total + servicio.duracion, 0)
    const precioTotal = formData.servicios.reduce((total, servicio) => total + servicio.precio, 0)

    // Preparar datos para guardar en la base de datos
    const citaData = {
      ...formData,
      // Convertir objetos a IDs para almacenar en la BD
      clienteId: formData.cliente.id,
      mascotaId: formData.mascota ? formData.mascota.id : null,
      mascotasIds: formData.mascotas.map((mascota) => mascota.id),
      serviciosIds: formData.servicios.map((servicio) => servicio.id),
      // Mantener objetos completos para la UI
      cliente: formData.cliente,
      mascota: formData.mascota,
      mascotas: formData.mascotas,
      servicios: formData.servicios,
      // Añadir campos calculados
      duracionTotal,
      precioTotal,
    }

    // Crear nueva cita o actualizar existente
    if (isEditing) {
      // Actualizar cita existente
      const citasActualizadas = citasAgendadas.map((cita) => (cita.id === citaId ? { ...citaData, id: citaId } : cita))
      setCitasAgendadas(citasActualizadas)

      if (toastIds.current.success) {
        toast.dismiss(toastIds.current.success)
      }

      toastIds.current.success = toast.success(
        <div>
          <strong>Cita actualizada</strong>
          <p>La cita ha sido actualizada correctamente.</p>
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
            navigate("/servicios/AgendarCitas")
          },
        },
      )
    } else {
      // Crear nueva cita
      const nuevaCita = {
        ...citaData,
        id: `cita-${Date.now()}`, // Generar ID único (en producción sería generado por la BD)
        fechaCreacion: new Date().toISOString(), // Añadir fecha de creación
      }

      setCitasAgendadas([...citasAgendadas, nuevaCita])

      if (toastIds.current.success) {
        toast.dismiss(toastIds.current.success)
      }

      toastIds.current.success = toast.success(
        <div>
          <strong>Cita agendada</strong>
          <p>La cita ha sido agendada correctamente.</p>
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
            // Limpiar formulario para nueva cita
            setFormData({
              cliente: null,
              mascota: null,
              mascotas: [],
              servicios: [],
              fecha: selectedDate.toISOString().split("T")[0],
              hora: "10:00",
              estado: "Programada",
              notas: "",
            })
          },
        },
      )
    }
  }

  /**
   * Manejador para cancelar y volver a la lista de citas
   */
  const handleCancel = () => {
    navigate("/servicios/AgendarCitas")
  }

  /**
   * Manejador para cuando se hace clic en una cita existente
   */
  const handleCitaClick = (cita) => {
    // Si estamos en modo edición, preguntar si quiere cambiar
    if (isEditing) {
      if (window.confirm("¿Desea cambiar a la edición de esta cita?")) {
        navigate(`/servicios/NuevaCita?id=${cita.id}`)
      }
    } else {
      // Actualizar fecha y hora seleccionada
      setSelectedDate(new Date(cita.fecha))
      setSelectedTimeSlot(cita.hora)

      // Mostrar información de la cita
      toast.info(
        <div>
          <strong>Información de cita</strong>
          <p>Cliente: {cita.cliente.nombre}</p>
          <p>Mascota: {cita.mascota ? cita.mascota.nombre : cita.mascotas.map((m) => m.nombre).join(", ")}</p>
          <p>Servicios: {cita.servicios.map((s) => s.nombre).join(", ")}</p>
          <p>Duración: {cita.duracionTotal} minutos</p>
          <p>Hora: {cita.hora}</p>
          <p>Estado: {cita.estado}</p>
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
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? "Editar Cita" : "Agendar Nueva Cita"}</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Citas
        </button>
      </div>

      {showAlert && (
        <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
          <AlertCircle size={18} className="me-2" />
          <div>{alertMessage}</div>
        </div>
      )}

      <div className="cita-layout">
        {/* Panel izquierdo: Calendario y horarios */}
        <div className="cita-panel">
          <div className="panel-section">
            <CalendarComponent
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              citasAgendadas={citasAgendadas}
            />
          </div>

          <div className="panel-section">
            <TimeSlotsComponent
              timeSlots={timeSlots}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSelect={handleSelectTimeSlot}
              selectedDate={selectedDate}
              citasAgendadas={citasAgendadas}
              onNextDayRequest={handleNextDay}
              onCitaClick={handleCitaClick}
            />
          </div>
        </div>

        {/* Panel derecho: Formulario */}
        <div className="cita-panel">
          <FormComponent
            formData={formData}
            formErrors={formErrors}
            onFormChange={handleFormChange}
            onSave={handleSaveCita}
            onCancel={handleCancel}
            isEditing={isEditing}
            clientes={clientes}
            servicios={servicios}
            hideEstado={!isEditing}
            allowMultipleMascotas={true}
          />
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

export default NuevaCita


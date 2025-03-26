"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/NuevaCita.css"
import "../../Styles/AdminStyles/ToastStyles.css"

import { CalendarComponent } from "../../components/AdminComponents/calendar-component"
import { TimeSlotsComponent } from "../../components/AdminComponents/time-slots-component"
import { FormComponent } from "../../components/AdminComponents/form-component"

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
  ]

  // Datos de ejemplo para servicios
  const serviciosMock = [
    {
      id: "1",
      nombre: "Baño y Corte",
      descripcion: "Baño completo con shampoo especial y corte de pelo según la raza",
      duracion: 90,
      precio: 45000,
    },
    {
      id: "2",
      nombre: "Consulta Veterinaria",
      descripcion: "Revisión general de salud y actualización de vacunas",
      duracion: 30,
      precio: 35000,
    },
    {
      id: "3",
      nombre: "Limpieza Dental",
      descripcion: "Limpieza profunda de dientes y encías",
      duracion: 45,
      precio: 50000,
    },
  ]

  // Estado para clientes y servicios
  const [clientes, setClientes] = useState(clientesMock)
  const [servicios, setServicios] = useState(serviciosMock)

  // Pre-seleccionar cliente, mascota y servicio para mostrar los datos de ejemplo
  const clienteEjemplo = clientesMock[0]
  const mascotaEjemplo = clienteEjemplo.mascotas[0]
  const servicioEjemplo = serviciosMock[0]

  // Estado para el formulario (inicialmente vacío)
  const [formData, setFormData] = useState({
    cliente: null,
    mascota: null,
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

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Generar horarios disponibles cuando cambia la fecha seleccionada
  useEffect(() => {
    // Simulación temporal de horarios disponibles
    const horariosDisponibles = [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ]

    // Si la fecha seleccionada es hoy, eliminar los horarios pasados
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())

    if (selectedDay.getTime() === today.getTime()) {
      const currentHour = now.getHours()
      const currentMinutes = now.getMinutes()

      const horariosDisponiblesFiltrados = horariosDisponibles.filter((horario) => {
        const [hour, minutes] = horario.split(":").map(Number)
        return hour > currentHour || (hour === currentHour && minutes > currentMinutes)
      })

      setTimeSlots(horariosDisponiblesFiltrados)
    } else {
      setTimeSlots(horariosDisponibles)
    }

    // Actualizar la fecha en el formulario
    setFormData((prev) => ({
      ...prev,
      fecha: selectedDate.toISOString().split("T")[0],
    }))
  }, [selectedDate])

  // Manejador para seleccionar un horario
  const handleSelectTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setFormData({
      ...formData,
      hora: timeSlot,
    })
  }

  // Manejador para seleccionar una fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  // Manejador para actualizar el formulario
  const handleFormChange = (newFormData) => {
    setFormData(newFormData)
  }

  // Manejador para guardar la cita
  const handleSaveCita = () => {
    // Validaciones básicas
    if (
      !formData.cliente ||
      !formData.servicios ||
      formData.servicios.length === 0 ||
      !formData.fecha ||
      !formData.hora ||
      (formData.cliente && !formData.mascota)
    ) {
      toast.error(
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

    // Simulación temporal de guardado
    toast.success(
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
          // Redirigir a la lista de citas después de que se cierre la notificación
          navigate("/servicios/AgendarCitas")
        },
      },
    )
  }

  // Manejador para cancelar y volver a la lista de citas
  const handleCancel = () => {
    navigate("/servicios/AgendarCitas")
  }

  return (
    <div className="nueva-cita-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{isEditing ? "Editar Cita" : "Agendar Nueva Cita"}</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Citas
        </button>
      </div>

      <div className="appointment-layout">
        <div className="calendar-section">
          <CalendarComponent selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          <TimeSlotsComponent
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSelect={handleSelectTimeSlot}
          />
        </div>

        <div className="form-section">
          <FormComponent
            formData={formData}
            onFormChange={handleFormChange}
            onSave={handleSaveCita}
            onCancel={handleCancel}
            isEditing={isEditing}
            clientes={clientes}
            servicios={servicios}
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


import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiChevronLeft, FiChevronRight, FiCalendar,
  FiClock, FiUser, FiDollarSign, FiFileText,
  FiX,
} from 'react-icons/fi'
import { useMyAppointments } from '../../hooks/useAppointments'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const statusBadge = {
  Scheduled: 'badge-info',
  Completed: 'badge-success',
  Cancelled: 'badge-danger',
}

const statusDot = {
  Scheduled: 'bg-sky-500',
  Completed: 'bg-emerald-500',
  Cancelled: 'bg-rose-500',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function getDayAppointments(appointments, year, month, day) {
  return appointments.filter((a) => {
    const d = new Date(a.date || a.dateTime)
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
  })
}

export default function AppointmentCalendar() {
  const { data, isLoading, error } = useMyAppointments()

  const today = useMemo(() => new Date(), [])
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const appointments = useMemo(() => {
    return Array.isArray(data) ? data : data?.data || data?.appointments || []
  }, [data])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    while (days.length % 7 !== 0) {
      days.push(null)
    }
    return days
  }, [currentYear, currentMonth])

  const selectedDayAppointments = useMemo(() => {
    if (!selectedDate) return []
    return getDayAppointments(appointments, currentYear, currentMonth, selectedDate)
  }, [appointments, currentYear, currentMonth, selectedDate])

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
    setSelectedAppointment(null)
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDate(null)
    setSelectedAppointment(null)
  }

  const isToday = (day) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  const isSelected = (day) => day === selectedDate

  const hasAppointments = (day) => {
    return getDayAppointments(appointments, currentYear, currentMonth, day).length > 0
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={FiCalendar}
        title="Failed to load appointments"
        description="Something went wrong. Please try again."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Appointment Calendar</h1>
        <p className="text-sm text-gray-400">View your appointments in calendar format</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-800">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={nextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div key={day} className="py-2 text-center text-xs font-bold text-gray-400 uppercase">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, i) => (
                <div key={i} className="aspect-square">
                  {day && (
                    <button
                      onClick={() => setSelectedDate(day)}
                      className={`relative flex h-full w-full items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                        isSelected(day)
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                          : isToday(day)
                          ? 'border-2 border-cyan-500 text-cyan-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                      {hasAppointments(day) && (
                        <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${
                          isSelected(day) ? 'bg-white' : statusDot.Scheduled
                        }`} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              {selectedDate
                ? `${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}`
                : 'Select a date'}
            </h3>

            {!selectedDate ? (
              <EmptyState
                icon={FiCalendar}
                title="No date selected"
                description="Click a date on the calendar to view appointments."
              />
            ) : selectedDayAppointments.length === 0 ? (
              <EmptyState
                icon={FiCalendar}
                title="No appointments"
                description="No appointments scheduled for this day."
              />
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {selectedDayAppointments.map((app) => (
                  <motion.div
                    key={app._id || app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedAppointment(app)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                      (selectedAppointment?._id || selectedAppointment?.id) === (app._id || app.id)
                        ? 'border-cyan-500 bg-cyan-50 shadow-md'
                        : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        {formatTime(app.date || app.dateTime)}
                      </span>
                      <span className={statusBadge[app.status] || 'badge-info'}>
                        {app.status || 'Scheduled'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {app.doctor?.name || app.patient?.name || app.doctorName || app.patientName || 'Appointment'}
                    </p>
                    {(app.doctor?.specialization || app.specialization) && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {app.doctor?.specialization || app.specialization}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="card"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Appointment Details</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <FiUser className="mb-2 h-5 w-5 text-cyan-600" />
                <p className="text-xs font-medium text-gray-400">
                  {selectedAppointment.doctor?.name || selectedAppointment.patient?.name || selectedAppointment.doctorName || selectedAppointment.patientName || 'Name'}
                </p>
                <p className="mt-1 text-sm font-bold text-gray-800">
                  {selectedAppointment.doctor?.specialization || selectedAppointment.specialization || ''}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <FiCalendar className="mb-2 h-5 w-5 text-violet-600" />
                <p className="text-xs font-medium text-gray-400">Date</p>
                <p className="mt-1 text-sm font-bold text-gray-800">
                  {formatDate(selectedAppointment.date || selectedAppointment.dateTime)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <FiClock className="mb-2 h-5 w-5 text-amber-600" />
                <p className="text-xs font-medium text-gray-400">Time</p>
                <p className="mt-1 text-sm font-bold text-gray-800">
                  {formatTime(selectedAppointment.date || selectedAppointment.dateTime)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <FiDollarSign className="mb-2 h-5 w-5 text-emerald-600" />
                <p className="text-xs font-medium text-gray-400">Fee</p>
                <p className="mt-1 text-sm font-bold text-gray-800">
                  ${selectedAppointment.consultationFee || 0}
                </p>
              </div>
            </div>
            {selectedAppointment.notes && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiFileText className="h-4 w-4 text-cyan-600" /> Notes
                </p>
                <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
              </div>
            )}
            <div className="mt-4">
              <span className={statusBadge[selectedAppointment.status] || 'badge-info'}>
                {selectedAppointment.status || 'Scheduled'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FiCalendar, FiClock, FiUser, FiMapPin,
  FiDollarSign, FiXCircle, FiFileText,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useMyAppointments, useUpdateAppointment } from '../../hooks/useAppointments'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'

const statusBadge = {
  Scheduled: 'badge-info',
  Completed: 'badge-success',
  Cancelled: 'badge-danger',
}

const views = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'all', label: 'All' },
]

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function AppointmentList() {
  const { data, isLoading, error } = useMyAppointments()
  const updateAppointment = useUpdateAppointment()

  const [view, setView] = useState('upcoming')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const allAppointments = useMemo(() => {
    return Array.isArray(data) ? data : data?.data || data?.appointments || []
  }, [data])

  const filteredAppointments = useMemo(() => {
    const now = new Date()
    switch (view) {
      case 'upcoming':
        return allAppointments.filter((a) => {
          const date = new Date(a.date || a.dateTime)
          return date >= now && a.status !== 'Cancelled'
        }).sort((a, b) => new Date(a.date || a.dateTime) - new Date(b.date || b.dateTime))
      case 'past':
        return allAppointments.filter((a) => {
          const date = new Date(a.date || a.dateTime)
          return date < now || a.status === 'Completed' || a.status === 'Cancelled'
        }).sort((a, b) => new Date(b.date || b.dateTime) - new Date(a.date || a.dateTime))
      default:
        return [...allAppointments].sort((a, b) => new Date(b.date || b.dateTime) - new Date(a.date || a.dateTime))
    }
  }, [allAppointments, view])

  const handleCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await updateAppointment.mutateAsync({
        id: cancelTarget,
        data: { status: 'Cancelled' },
      })
      toast.success('Appointment cancelled successfully')
      setCancelTarget(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel appointment')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-sm text-gray-400">View and manage your appointments</p>
      </div>

      <div className="flex gap-2">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              view === v.key
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <LoadingSkeleton key={i} type="card" />)}
        </div>
      ) : error ? (
        <EmptyState
          icon={FiCalendar}
          title="Failed to load appointments"
          description="Something went wrong. Please try again."
        />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title={view === 'upcoming' ? 'No upcoming appointments' : 'No appointments found'}
          description={view === 'upcoming' ? 'You have no upcoming appointments scheduled.' : 'No appointments match the current filter.'}
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app, i) => (
            <motion.div
              key={app._id || app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                    <FiUser className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-800">
                      {app.doctor?.name || app.patient?.name || app.doctorName || app.patientName || 'Appointment'}
                    </h3>
                    {(app.doctor?.specialization || app.specialization) && (
                      <p className="text-sm font-medium text-gray-500">
                        {app.doctor?.specialization || app.specialization}
                      </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-4 w-4" />
                        {formatDate(app.date || app.dateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="h-4 w-4" />
                        {formatTime(app.date || app.dateTime)}
                      </span>
                      {app.consultationFee && (
                        <span className="flex items-center gap-1">
                          <FiDollarSign className="h-4 w-4" />
                          ${app.consultationFee}
                        </span>
                      )}
                    </div>
                    {app.notes && (
                      <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-500">
                        <FiFileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {app.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={statusBadge[app.status] || 'badge-info'}>
                    {app.status || 'Scheduled'}
                  </span>
                  {app.status === 'Scheduled' && (
                    <button
                      onClick={() => setCancelTarget(app._id || app.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Cancel Appointment"
                    >
                      <FiXCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel Appointment"
        size="sm"
      >
        <p className="mb-6 text-gray-600">Are you sure you want to cancel this appointment? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setCancelTarget(null)}
            className="btn-secondary flex-1"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="btn-danger flex-1"
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

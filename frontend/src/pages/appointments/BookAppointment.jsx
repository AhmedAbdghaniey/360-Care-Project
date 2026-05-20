import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUser, FiSearch, FiCalendar, FiClock,
  FiFileText, FiDollarSign, FiCheckCircle,
  FiArrowLeft, FiArrowRight, FiStar, FiMapPin,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDoctors, useDoctor } from '../../hooks/useDoctors'
import { useCreateAppointment } from '../../hooks/useAppointments'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const steps = [
  { key: 'doctor', label: 'Select Doctor' },
  { key: 'datetime', label: 'Date & Time' },
  { key: 'notes', label: 'Add Notes' },
  { key: 'confirm', label: 'Confirm' },
]

function generateTimeSlots(startTime, endTime, intervalMin = 30) {
  const slots = []
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  let start = sh * 60 + sm
  const end = eh * 60 + em
  while (start + intervalMin <= end) {
    const h = Math.floor(start / 60)
    const m = start % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    start += intervalMin
  }
  return slots
}

export default function BookAppointment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: doctorsData, isLoading: loadingDoctors } = useDoctors()
  const createAppointment = useCreateAppointment()

  const [step, setStep] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const preselected = location.state?.doctor
    if (preselected) {
      setSelectedDoctor(preselected)
      setStep(1)
    }
  }, [location.state])

  const doctorId = selectedDoctor?.doctorId || selectedDoctor?.id
  const { data: doctorFull, isLoading: loadingAvailability } = useDoctor(doctorId)

  const availabilities = useMemo(() => {
    if (!doctorFull?.availabilities) return []
    return doctorFull.availabilities.filter((a) => a.isAvailable)
  }, [doctorFull])

  const selectedDayAvail = useMemo(() => {
    if (!date) return []
    const dayName = DAY_NAMES[new Date(date).getDay()]
    return availabilities.filter((a) => a.dayOfWeek === dayName)
  }, [date, availabilities])

  const timeSlots = useMemo(() => {
    const slots = new Set()
    selectedDayAvail.forEach((a) => {
      generateTimeSlots(a.startTime, a.endTime).forEach((t) => slots.add(t))
    })
    return [...slots].sort()
  }, [selectedDayAvail])

  const doctors = useMemo(() => {
    const list = Array.isArray(doctorsData) ? doctorsData : doctorsData?.data || doctorsData?.doctors || []
    return list.filter((doc) => {
      const name = (doc.fullName || doc.name || '').toLowerCase()
      const spec = (doc.specialization || '').toLowerCase()
      const q = search.toLowerCase()
      return name.includes(q) || spec.includes(q)
    })
  }, [doctorsData, search])

  const consultationFee = selectedDoctor?.consultationFee || selectedDoctor?.fee || 0

  const canNext = () => {
    switch (step) {
      case 0: return !!selectedDoctor
      case 1: return !!date && !!time
      case 2: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (!canNext()) {
      toast.error('Please fill in all required fields')
      return
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await createAppointment.mutateAsync({
        doctorId: selectedDoctor?.doctorId || selectedDoctor?._id || selectedDoctor?.id,
        appointmentDate: new Date(`${date}T${time}`).toISOString(),
        notes: notes.trim(),
        consultationFeeAtBooking: consultationFee,
      })
      toast.success('Appointment booked successfully!')
      navigate('/appointments')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to book appointment'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const SelectedDoctorBadge = () => selectedDoctor ? (
    <div className="flex items-center justify-between rounded-xl border border-cyan-100 bg-cyan-50/50 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
          {(selectedDoctor.fullName || selectedDoctor.name || '?').charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{selectedDoctor.fullName || selectedDoctor.name}</p>
          <p className="text-xs text-gray-500">{selectedDoctor.specialization || 'General'}</p>
        </div>
      </div>
    </div>
  ) : null

  const renderDoctorStep = () => (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-700">Choose a Doctor</p>
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctors by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {loadingDoctors ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <LoadingSkeleton key={i} type="list" />)}
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={FiUser}
          title="No doctors found"
          description={search ? 'Try a different search term.' : 'No doctors are currently available.'}
        />
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {doctors.map((doc) => {
            const did = doc.doctorId || doc._id || doc.id
            return (
              <motion.div
                key={did}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => { setSelectedDoctor(doc); setStep(1) }}
                className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg font-bold">
                  {(doc.fullName || doc.name || '?').charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-800">{doc.fullName || doc.name}</h4>
                  <p className="text-sm text-gray-500">{doc.specialization || 'General'}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {(doc.doctorScore || doc.rating) && (
                      <span className="flex items-center gap-1">
                        <FiStar className="h-3.5 w-3.5 text-amber-400" />
                        {(doc.doctorScore || doc.rating).toFixed(1)}
                      </span>
                    )}
                    {(doc.consultationFee || doc.fee || 0) > 0 && (
                      <span className="flex items-center gap-1 font-semibold text-gray-600">
                        <FiDollarSign className="h-3.5 w-3.5" />
                        ${doc.consultationFee || doc.fee || 0}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <SelectedDoctorBadge />
      {availabilities.length > 0 && (
        <div className="rounded-xl bg-cyan-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-cyan-800">
            <FiClock className="h-4 w-4" />
            Doctor's Working Hours
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {availabilities.map((a, i) => (
              <span key={i} className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm">
                {a.dayOfWeek?.slice(0, 3)} {a.startTime}-{a.endTime}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setTime('') }}
          min={new Date().toISOString().split('T')[0]}
          className="input-field"
        />
      </div>

      {date && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Select Time</label>
          {loadingAvailability ? (
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,4].map((i) => <LoadingSkeleton key={i} type="list" />)}
            </div>
          ) : timeSlots.length === 0 ? (
            <p className="text-sm text-rose-500">The doctor is not available on this day. Please choose another date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    time === t
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-cyan-300 hover:shadow-sm'
                  }`}
                >
                  {new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {date && time && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-cyan-50 p-4"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-cyan-800">
            <FiCalendar className="h-4 w-4" />
            {new Date(`${date}T${time}`).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-cyan-800">
            <FiClock className="h-4 w-4" />
            {new Date(`${date}T${time}`).toLocaleTimeString('en-US', {
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </motion.div>
      )}
    </div>
  )

  const renderNotesStep = () => (
    <div className="space-y-4">
      <SelectedDoctorBadge />
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Reason for Visit / Notes</label>
        <textarea
          placeholder="Describe your symptoms or reason for the appointment..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field min-h-[180px] resize-y"
          rows={6}
        />
      </div>
    </div>
  )

  const renderConfirmStep = () => {
    const doctorName = selectedDoctor?.fullName || selectedDoctor?.name || 'Selected Doctor'
    const dateTimeStr = date && time ? new Date(`${date}T${time}`) : null

    return (
      <div className="space-y-5">
        <div className="rounded-xl bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <FiCheckCircle className="h-5 w-5" />
            <span className="font-semibold">Almost done! Review your appointment details.</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg font-bold">
              {doctorName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-800">{doctorName}</p>
              <p className="text-sm text-gray-500">{selectedDoctor?.specialization || 'General'}</p>
            </div>
          </div>

          {dateTimeStr && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar className="h-4 w-4 text-cyan-600" />
                <span className="font-medium">{dateTimeStr.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <FiClock className="h-4 w-4 text-cyan-600" />
                <span className="font-medium">{dateTimeStr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </p>
            </div>
          )}

          {notes && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiFileText className="h-4 w-4 text-cyan-600" />
                Notes
              </p>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}

          {consultationFee > 0 && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiDollarSign className="h-4 w-4 text-emerald-600" />
                Consultation Fee
              </p>
              <p className="text-2xl font-bold text-gray-800">${consultationFee}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const stepContent = [renderDoctorStep, renderDateTimeStep, renderNotesStep, renderConfirmStep]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => navigate('/appointments')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-cyan-600 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to Appointments
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">Book an Appointment</h1>
            <p className="text-sm text-gray-400">Schedule a visit with a doctor</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center flex-1">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    i <= step ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < step ? <FiCheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 ${
                      i < step ? 'bg-cyan-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between px-1">
              {steps.map((s, i) => (
                <span key={s.key} className={`text-xs font-medium ${
                  i === step ? 'text-cyan-600' : i < step ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {stepContent[step]()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            {step === 1 ? null : step > 0 ? (
              <button
                onClick={handleBack}
                className="btn-secondary flex items-center gap-2"
              >
                <FiArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <button
                onClick={() => navigate('/appointments')}
                className="btn-secondary flex items-center gap-2"
              >
                Cancel
              </button>
            )}

            <div className="flex-1" />

            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="btn-primary flex items-center gap-2"
              >
                Next <FiArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                {submitting ? 'Booking...' : 'Confirm & Book'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

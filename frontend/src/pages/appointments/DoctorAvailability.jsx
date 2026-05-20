import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDoctorAvailability, useSetDoctorAvailability } from '../../hooks/useAvailability'
import { useMyDoctorProfile } from '../../hooks/useDoctors'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const emptySlot = { dayOfWeek: 'Sunday', startTime: '09:00', endTime: '17:00', isAvailable: true }

export default function DoctorAvailability() {
  const { data: profile } = useMyDoctorProfile()
  const doctorId = profile?.doctorId
  const { data: availability, isLoading } = useDoctorAvailability(doctorId)
  const setAvailability = useSetDoctorAvailability()

  const [slots, setSlots] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (availability && Array.isArray(availability)) {
      setSlots(availability.map((a) => ({
        id: a.id,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        isAvailable: a.isAvailable,
      })))
    } else if (!isLoading && availability === undefined) {
      setSlots([])
    }
  }, [availability, isLoading])

  const updateSlot = (index, field, value) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const addSlot = () => {
    setSlots((prev) => [...prev, { ...emptySlot }])
  }

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await setAvailability.mutateAsync({
        doctorId,
        slots: slots.map(({ dayOfWeek, startTime, endTime, isAvailable }) => ({
          dayOfWeek, startTime, endTime, isAvailable,
        })),
      })
      toast.success('Availability updated successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update availability')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Availability</h1>
          <p className="text-sm text-gray-400">Set your weekly working hours for appointments</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {slots.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center">
              <FiClock className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">No availability slots set</p>
              <p className="mt-1 text-xs text-gray-400">Add your weekly working hours below</p>
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot, i) => (
                <div key={i} className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <div className="flex-1 min-w-[140px]">
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Day</label>
                    <select
                      value={slot.dayOfWeek}
                      onChange={(e) => updateSlot(i, 'dayOfWeek', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="w-[130px]">
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Start</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(i, 'startTime', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="w-[130px]">
                    <label className="mb-1 block text-xs font-semibold text-gray-500">End</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(i, 'endTime', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slot.isAvailable}
                        onChange={(e) => updateSlot(i, 'isAvailable', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-xs font-medium text-gray-600">Available</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={addSlot} className="btn-secondary flex items-center gap-2 text-sm">
            <FiPlus className="h-4 w-4" /> Add Time Slot
          </button>

          <div className="flex justify-end border-t border-gray-100 pt-4">
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              <FiSave className="h-4 w-4" />
              {submitting ? 'Saving...' : 'Save Availability'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

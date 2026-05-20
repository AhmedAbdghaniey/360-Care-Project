import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiX, FiSearch, FiUser, FiCalendar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCreateMedicalRecord, useUpdateMedicalRecord } from '../../hooks/useMedicalRecords'
import { usePatients } from '../../hooks/usePatients'
import { useAuth } from '../../context/AuthContext'

const VISIT_TYPES = ['Consultation', 'FollowUp', 'Emergency', 'Routine', 'Surgery', 'CheckUp']
const INITIAL_STATE = {
  patient: '',
  doctor: '',
  appointment: '',
  symptoms: '',
  diagnosis: '',
  treatmentPlan: '',
  visitType: 'Consultation',
}

export default function AddMedicalRecord({ record, onSuccess }) {
  const createRecord = useCreateMedicalRecord()
  const updateRecord = useUpdateMedicalRecord()
  const { data: patientsData } = usePatients()
  const { user } = useAuth()
  const isEdit = !!record

  const [form, setForm] = useState(INITIAL_STATE)
  const [patientSearch, setPatientSearch] = useState('')
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const patients = Array.isArray(patientsData) ? patientsData : patientsData?.data || []

  useEffect(() => {
    if (isEdit && record) {
      setForm({
        patient: record.patient?._id || record.patientId || '',
        doctor: record.doctor?._id || record.doctorId || user?._id || '',
        appointment: record.appointment?._id || record.appointment || '',
        symptoms: Array.isArray(record.symptoms) ? record.symptoms.join(', ') : (record.symptoms || ''),
        diagnosis: record.diagnosis || '',
        treatmentPlan: record.treatmentPlan || '',
        visitType: record.visitType || 'Consultation',
      })
      if (record.patient) setSelectedPatient(record.patient)
    } else {
      setForm((prev) => ({ ...prev, doctor: user?._id || '' }))
    }
  }, [record, isEdit, user])

  const filteredPatients = patients.filter((p) => {
    const name = p.name || p.user?.name || ''
    return name.toLowerCase().includes(patientSearch.toLowerCase())
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
    setForm((prev) => ({ ...prev, patient: patient._id || patient.id }))
    setPatientSearch(patient.name || patient.user?.name || '')
    setShowPatientDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patient) {
      toast.error('Please select a patient')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        patientId: form.patient ? Number(form.patient) : undefined,
        doctorId: form.doctor ? Number(form.doctor) : undefined,
        appointmentId: form.appointment ? Number(form.appointment) : undefined,
        symptoms: form.symptoms,
        diagnosis: form.diagnosis,
        treatmentPlan: form.treatmentPlan,
        visitType: form.visitType,
      }
      if (isEdit) {
        await updateRecord.mutateAsync({ id: record._id || record.id, data: payload })
        toast.success('Medical record updated')
      } else {
        await createRecord.mutateAsync(payload)
        toast.success('Medical record created')
      }
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save medical record')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="relative">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Patient *</label>
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={patientSearch}
            onChange={(e) => { setPatientSearch(e.target.value); setShowPatientDropdown(true); setSelectedPatient(null) }}
            onFocus={() => setShowPatientDropdown(true)}
            placeholder="Search for a patient..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        {showPatientDropdown && patientSearch && (
          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            {filteredPatients.length === 0 ? (
              <p className="p-3 text-sm text-gray-400">No patients found</p>
            ) : (
              filteredPatients.map((p) => (
                <button
                  key={p._id || p.id}
                  type="button"
                  onClick={() => handleSelectPatient(p)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-xs font-bold text-white">
                    {(p.name || p.user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{p.name || p.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{p.email || p.user?.email || ''}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
        {selectedPatient && !showPatientDropdown && (
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
              {selectedPatient.name || selectedPatient.user?.name || 'Unknown'}
              <button type="button" onClick={() => { setSelectedPatient(null); setForm((prev) => ({ ...prev, patient: '' })); setPatientSearch('') }}>
                <FiX className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Doctor ID</label>
          <input
            type="text"
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            placeholder="Doctor ID"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm text-gray-500"
            readOnly
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" /> Appointment ID (optional)</span>
          </label>
          <input
            type="text"
            name="appointment"
            value={form.appointment}
            onChange={handleChange}
            placeholder="Appointment ID"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Symptoms (comma-separated)</label>
        <textarea
          name="symptoms"
          value={form.symptoms}
          onChange={handleChange}
          rows={2}
          placeholder="e.g. Fever, Cough, Headache"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Diagnosis</label>
        <textarea
          name="diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
          rows={2}
          placeholder="Diagnosis details..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Treatment Plan</label>
        <textarea
          name="treatmentPlan"
          value={form.treatmentPlan}
          onChange={handleChange}
          rows={3}
          placeholder="Treatment plan details..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Visit Type</label>
        <select
          name="visitType"
          value={form.visitType}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        >
          {VISIT_TYPES.map((vt) => (
            <option key={vt} value={vt}>{vt}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center gap-2"
        >
          <FiSave className="h-4 w-4" />
          {submitting ? 'Saving...' : isEdit ? 'Update Record' : 'Create Record'}
        </button>
      </div>
    </motion.form>
  )
}

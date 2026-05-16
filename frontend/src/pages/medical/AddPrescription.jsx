import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiSave, FiPlus, FiTrash2, FiSearch, FiUser,
  FiCalendar, FiFileText, FiX,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCreatePrescription } from '../../hooks/usePrescriptions'
import { usePatients } from '../../hooks/usePatients'
import { useDrugs } from '../../hooks/useDrugs'
import { useAuth } from '../../context/AuthContext'

const emptyMedication = { drugName: '', dosage: '', frequency: '', duration: '', instructions: '' }

export default function AddPrescription() {
  const navigate = useNavigate()
  const createPrescription = useCreatePrescription()
  const { data: patientsData } = usePatients()
  const { data: drugsData } = useDrugs()
  const { user } = useAuth()

  const [patientSearch, setPatientSearch] = useState('')
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [doctorId, setDoctorId] = useState(user?._id || '')
  const [medicalRecordId, setMedicalRecordId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [medications, setMedications] = useState([{ ...emptyMedication }])
  const [submitting, setSubmitting] = useState(false)

  const patients = Array.isArray(patientsData) ? patientsData : patientsData?.data || []
  const drugs = Array.isArray(drugsData) ? drugsData : drugsData?.data || []

  const filteredPatients = patients.filter((p) => {
    const name = p.name || p.user?.name || ''
    return name.toLowerCase().includes(patientSearch.toLowerCase())
  })

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
    setPatientSearch(patient.name || patient.user?.name || '')
    setShowPatientDropdown(false)
  }

  const addMedication = () => {
    setMedications((prev) => [...prev, { ...emptyMedication }])
  }

  const removeMedication = (index) => {
    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMedication = (index, field, value) => {
    setMedications((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    )
  }

  const handleDrugSelect = (index, drug) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === index ? { ...med, drugName: drug.name || drug.drugName || '', dosage: drug.dosage || med.dosage } : med
      )
    )
  }

  const [drugSearch, setDrugSearch] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPatient) {
      toast.error('Please select a patient')
      return
    }
    if (medications.length === 0 || medications.every((m) => !m.drugName)) {
      toast.error('Please add at least one medication')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        patient: selectedPatient._id || selectedPatient.id,
        doctor: doctorId,
        medicalRecord: medicalRecordId || undefined,
        date,
        medications: medications
          .filter((m) => m.drugName.trim())
          .map((m) => ({
            drugName: m.drugName,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions,
          })),
      }
      await createPrescription.mutateAsync(payload)
      toast.success('Prescription created successfully')
      navigate('/medical-records/prescriptions')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prescription')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">New Prescription</h1>
          <p className="text-sm text-gray-400">Create a new prescription for a patient</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Patient Information</h3>

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
                    <button type="button" onClick={() => { setSelectedPatient(null); setPatientSearch('') }}>
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Doctor ID</label>
                <input
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm text-gray-500"
                  readOnly
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" /> Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <span className="flex items-center gap-1"><FiFileText className="h-3 w-3" /> Medical Record ID</span>
                </label>
                <input
                  type="text"
                  value={medicalRecordId}
                  onChange={(e) => setMedicalRecordId(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Medications</h3>
              <button type="button" onClick={addMedication} className="btn-secondary flex items-center gap-1.5 text-xs">
                <FiPlus className="h-3.5 w-3.5" /> Add Medication
              </button>
            </div>

            {medications.map((med, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                {medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Drug Name *</label>
                    <input
                      type="text"
                      value={med.drugName}
                      onChange={(e) => updateMedication(index, 'drugName', e.target.value)}
                      placeholder="Type drug name or search..."
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                      list={`drug-suggestions-${index}`}
                    />
                    <datalist id={`drug-suggestions-${index}`}>
                      {drugs.map((d) => (
                        <option key={d._id || d.id} value={d.name || d.drugName || ''} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Dosage</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      placeholder="e.g. 500mg"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Frequency</label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      placeholder="e.g. Twice daily"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Duration</label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      placeholder="e.g. 7 days"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Instructions</label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      placeholder="e.g. After meals"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              <FiSave className="h-4 w-4" /> {submitting ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

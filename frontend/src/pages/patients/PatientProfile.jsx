import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUser, FiCalendar, FiMapPin, FiDroplet, FiPhone,
  FiAlertTriangle, FiHeart, FiFileText, FiClock,
} from 'react-icons/fi'
import { usePatient } from '../../hooks/usePatients'
import { useMedicalRecords } from '../../hooks/useMedicalRecords'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const coverGradients = [
  'from-violet-600 via-purple-600 to-pink-600',
  'from-cyan-600 via-blue-600 to-indigo-700',
  'from-teal-500 via-emerald-500 to-green-600',
  'from-amber-500 via-orange-500 to-rose-600',
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function getCoverGradient(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return coverGradients[Math.abs(hash) % coverGradients.length]
}

function formatDate(d) {
  if (!d) return '--'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PatientProfile() {
  const { id } = useParams()
  const { data: patient, isLoading, isError, error } = usePatient(id)
  const { data: medicalRecords } = useMedicalRecords()

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="-mt-16 ml-6 h-32 w-32 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
        <div className="space-y-4 p-6">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (isError || !patient) {
    return <EmptyState icon={FiUser} title="Patient not found" description={error?.message || 'Could not load patient profile.'} />
  }

  const p = patient?.data || patient || {}
  const name = p.name || 'Unknown Patient'
  const dob = p.dob || p.dOB
  const gender = p.gender || '--'
  const address = p.address || '--'
  const bloodType = p.bloodType || '--'
  const emergencyContact = p.emergencyContact || '--'
  const allergies = Array.isArray(p.allergies) ? p.allergies : []
  const chronicDiseases = Array.isArray(p.chronicDiseases) ? p.chronicDiseases : []

  const patientRecords = Array.isArray(medicalRecords)
    ? medicalRecords.filter(r => r.patientId === p.id || r.patient?.id === p.id)
    : []

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Banner */}
      <div className={`relative h-44 sm:h-52 rounded-t-2xl bg-gradient-to-br ${getCoverGradient(name)} overflow-hidden`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-violet-400 to-pink-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shrink-0">
              {getInitials(name)}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                {gender && <span className="flex items-center gap-1"><FiUser className="h-3.5 w-3.5" />{gender}</span>}
                {bloodType && <span className="flex items-center gap-1"><FiDroplet className="h-3.5 w-3.5" />{bloodType}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Personal Information */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Gender', value: gender, icon: FiUser, color: 'text-violet-600 bg-violet-50' },
                  { label: 'Date of Birth', value: formatDate(dob), icon: FiCalendar, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Blood Type', value: bloodType, icon: FiDroplet, color: 'text-rose-600 bg-rose-50' },
                  { label: 'Emergency Contact', value: emergencyContact, icon: FiPhone, color: 'text-emerald-600 bg-emerald-50' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{s.label}</p>
                      <p className="text-sm font-medium text-gray-700">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {address !== '--' && (
                <div className="flex items-center gap-3 mt-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <FiMapPin className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-700">{address}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Allergies */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                <FiAlertTriangle className="inline h-4 w-4 mr-1.5 text-amber-500" />Allergies
              </h2>
              {allergies.length === 0 ? (
                <p className="text-sm text-gray-400">No allergies recorded</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allergies.map((a, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                      {typeof a === 'string' ? a : a.name || a.allergen || 'Unknown'}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Chronic Diseases */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                <FiHeart className="inline h-4 w-4 mr-1.5 text-rose-500" />Chronic Diseases
              </h2>
              {chronicDiseases.length === 0 ? (
                <p className="text-sm text-gray-400">No chronic diseases recorded</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {chronicDiseases.map((d, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                      {typeof d === 'string' ? d : d.name || 'Unknown'}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Medical Records */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                <FiFileText className="inline h-4 w-4 mr-1.5 text-cyan-500" />Medical History
              </h2>
              {patientRecords.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-gray-300">
                  <FiFileText className="h-8 w-8 mb-2" />
                  <p className="text-sm text-gray-400">No medical records found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientRecords.map((r, i) => (
                    <div key={r._id || r.id || i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0 mt-0.5">
                        <FiFileText className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{r.title || r.diagnosis || 'Medical Record'}</p>
                        {r.description && <p className="text-sm text-gray-500">{r.description}</p>}
                        {r.date && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><FiClock className="h-3 w-3" />{formatDate(r.date)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Medical Summary</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Blood Type', value: bloodType },
                  { label: 'Allergies', value: allergies.length },
                  { label: 'Chronic Conditions', value: chronicDiseases.length },
                  { label: 'Medical Records', value: patientRecords.length },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">{s.label}</span>
                    <span className="font-semibold text-gray-700">{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                <FiCalendar className="inline h-4 w-4 mr-1.5 text-gray-400" />Appointments
              </h3>
              <EmptyState icon={FiCalendar} title="No appointment data" description="Patient appointment history will appear here." />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

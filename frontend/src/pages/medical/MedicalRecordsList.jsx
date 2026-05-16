import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiFileText, FiPlus, FiSearch, FiCalendar, FiUser,
  FiChevronDown, FiChevronUp, FiActivity, FiAlertCircle,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useMedicalRecords } from '../../hooks/useMedicalRecords'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import DataCard from '../../components/ui/DataCard'
import Modal from '../../components/ui/Modal'
import AddMedicalRecord from './AddMedicalRecord'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const visitTypeBadge = {
  Consultation: 'badge-info',
  Emergency: 'badge-danger',
  FollowUp: 'badge-warning',
  Routine: 'badge-success',
}

export default function MedicalRecordsList() {
  const { data: records, isLoading, error } = useMedicalRecords()
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = useMemo(() => {
    if (!records) return []
    const list = Array.isArray(records) ? records : records?.data || []
    if (!search.trim()) return list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    const q = search.toLowerCase()
    return list.filter((r) => {
      const doctorName = r.doctor?.name || r.doctorName || ''
      const patientName = r.patient?.name || r.patientName || ''
      const diagnosis = r.diagnosis || ''
      const dateStr = formatDate(r.date || r.createdAt)
      return (
        doctorName.toLowerCase().includes(q) ||
        patientName.toLowerCase().includes(q) ||
        diagnosis.toLowerCase().includes(q) ||
        dateStr.toLowerCase().includes(q)
      )
    }).sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
  }, [records, search])

  if (isLoading) return <div className="space-y-4"><LoadingSkeleton type="list" count={5} /></div>
  if (error) return <EmptyState icon={FiAlertCircle} title="Failed to load records" description={error.message} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
          <p className="text-sm text-gray-400">View and manage patient medical records</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 self-start">
          <FiPlus className="h-4 w-4" /> Add New Record
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by doctor, patient, diagnosis, or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title={search ? 'No records match your search' : 'No medical records yet'}
          description={search ? 'Try a different search term' : 'Click "Add New Record" to create the first one'}
          action={search ? null : 'Add New Record'}
          onAction={search ? null : () => setShowAddModal(true)}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((record, idx) => {
              const isExpanded = expandedId === (record._id || record.id)
              const doctorName = record.doctor?.name || record.doctorName || 'Unknown'
              const patientName = record.patient?.name || record.patientName || 'Unknown'
              const diagnosis = record.diagnosis || 'No diagnosis'
              const visitType = record.visitType || record.appointmentType || 'Consultation'
              const symptoms = record.symptoms || []
              const recordDate = record.date || record.createdAt
              const recordId = record._id || record.id

              return (
                <motion.div
                  key={recordId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <DataCard>
                    <div
                      className="flex cursor-pointer flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                      onClick={() => setExpandedId(isExpanded ? null : recordId)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-sm">
                          <FiFileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {diagnosis.length > 50 ? diagnosis.slice(0, 50) + '...' : diagnosis}
                            </p>
                            <span className={`badge ${visitTypeBadge[visitType] || 'badge-info'} shrink-0`}>{visitType}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" />{formatDate(recordDate)}</span>
                            <span className="flex items-center gap-1"><FiUser className="h-3 w-3" />{patientName}</span>
                            <span>Dr. {doctorName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {symptoms.length > 0 && (
                          <span className="hidden text-xs text-gray-400 sm:inline">{symptoms.length} symptom{symptoms.length > 1 ? 's' : ''}</span>
                        )}
                        {isExpanded ? <FiChevronUp className="h-4 w-4 text-gray-400" /> : <FiChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 border-t border-gray-100 pt-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Symptoms</h4>
                                {symptoms.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {symptoms.map((s, i) => (
                                      <span key={i} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">{s}</span>
                                    ))}
                                  </div>
                                ) : <p className="text-sm text-gray-500">None recorded</p>}
                              </div>
                              <div>
                                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Diagnosis</h4>
                                <p className="text-sm text-gray-700">{diagnosis}</p>
                              </div>
                            </div>
                            {record.treatmentPlan && (
                              <div className="mt-3">
                                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Treatment Plan</h4>
                                <p className="text-sm text-gray-700">{record.treatmentPlan}</p>
                              </div>
                            )}
                            <div className="mt-4 flex items-center gap-3">
                              <Link
                                to={`/medical-records/${recordId}`}
                                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                              >
                                View Full Details
                              </Link>
                              <Link
                                to={`/medical-records/edit/${recordId}`}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </DataCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Medical Record" size="lg">
        <AddMedicalRecord onSuccess={() => { setShowAddModal(false); toast.success('Medical record created successfully') }} />
      </Modal>
    </div>
  )
}

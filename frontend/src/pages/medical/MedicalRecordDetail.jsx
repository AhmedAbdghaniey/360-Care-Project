import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiCalendar, FiUser,
  FiFileText, FiPaperclip, FiDownload, FiAlertCircle,
  FiMessageSquare,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useMedicalRecords, useDeleteMedicalRecord } from '../../hooks/useMedicalRecords'
import { usePrescriptions } from '../../hooks/usePrescriptions'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import DataCard from '../../components/ui/DataCard'
import Modal from '../../components/ui/Modal'
import AddMedicalRecord from './AddMedicalRecord'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

const visitTypeBadge = {
  Consultation: 'badge-info',
  Emergency: 'badge-danger',
  FollowUp: 'badge-warning',
  Routine: 'badge-success',
}

export default function MedicalRecordDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: recordsData } = useMedicalRecords()
  const deleteRecord = useDeleteMedicalRecord()
  const { data: prescriptionsData } = usePrescriptions()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const records = Array.isArray(recordsData) ? recordsData : recordsData?.data || []
  const record = records.find((r) => (r._id || r.id) === id)

  const prescriptions = (Array.isArray(prescriptionsData) ? prescriptionsData : prescriptionsData?.data || [])
    .filter((p) => {
      const recId = p.medicalRecord?._id || p.medicalRecord?.id || p.medicalRecord
      return recId === id
    })

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteRecord.mutateAsync(id)
      toast.success('Medical record deleted')
      navigate('/medical-records')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete record')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!record) {
    return (
      <EmptyState
        icon={FiFileText}
        title="Record not found"
        description="The medical record you're looking for doesn't exist or has been removed."
        action="Back to Records"
        onAction={() => navigate('/medical-records')}
      />
    )
  }

  const doctorName = record.doctor?.name || record.doctorName || 'Unknown'
  const patientName = record.patient?.name || record.patientName || 'Unknown'
  const symptoms = record.symptoms || []
  const attachments = record.attachments || []
  const visitType = record.visitType || record.appointmentType || 'Consultation'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/medical-records')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to Records
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEditModal(true)} className="btn-secondary flex items-center gap-2 text-sm">
            <FiEdit2 className="h-4 w-4" /> Edit
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger flex items-center gap-2 text-sm">
            <FiTrash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DataCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md">
                <FiFileText className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Medical Record</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><FiCalendar className="h-3.5 w-3.5" />{formatDate(record.date || record.createdAt)}</span>
                  <span className={`badge ${visitTypeBadge[visitType] || 'badge-info'}`}>{visitType}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                <FiUser className="h-3.5 w-3.5" /> Doctor
              </div>
              <p className="font-semibold text-gray-800">{doctorName}</p>
              {record.doctor?.specialty && <p className="text-sm text-gray-500">{record.doctor.specialty}</p>}
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                <FiUser className="h-3.5 w-3.5" /> Patient
              </div>
              <p className="font-semibold text-gray-800">{patientName}</p>
              {record.patient?.email && <p className="text-sm text-gray-500">{record.patient.email}</p>}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Symptoms</h3>
            {symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {symptoms.map((s, i) => (
                  <span key={i} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No symptoms recorded</p>
            )}
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Diagnosis</h3>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm leading-relaxed text-gray-700">{record.diagnosis || 'No diagnosis recorded'}</p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Treatment Plan</h3>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm leading-relaxed text-gray-700">{record.treatmentPlan || 'No treatment plan recorded'}</p>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiPaperclip className="h-4 w-4" /> Attachments ({attachments.length})
              </h3>
              <div className="space-y-2">
                {attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url || att.path}
                    download
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 hover:border-cyan-200 hover:bg-cyan-50 transition-all"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                      <FiDownload className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="flex-1 truncate">{att.name || `Attachment ${i + 1}`}</span>
                    <span className="text-xs text-gray-400">{att.size ? `${(att.size / 1024).toFixed(1)} KB` : ''}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {prescriptions.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiMessageSquare className="h-4 w-4" /> Linked Prescriptions ({prescriptions.length})
              </h3>
              <div className="space-y-2">
                {prescriptions.map((p) => (
                  <Link
                    key={p._id || p.id}
                    to={`/prescriptions/${p._id || p.id}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 hover:border-cyan-200 hover:bg-cyan-50 transition-all"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 text-white">
                      <FiFileText className="h-4 w-4" />
                    </div>
                    <span className="flex-1 font-medium">{p.medications?.length || 0} medication{(p.medications?.length || 0) !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-gray-400">{formatDate(p.date || p.createdAt)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </DataCard>
      </motion.div>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Medical Record" size="lg">
        <AddMedicalRecord record={record} onSuccess={() => { setShowEditModal(false); toast.success('Medical record updated') }} />
      </Modal>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Record" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
            <FiAlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">Are you sure you want to delete this medical record? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm">{deleting ? 'Deleting...' : 'Delete'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

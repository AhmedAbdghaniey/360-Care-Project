import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiFileText, FiPlus, FiSearch, FiCalendar,
  FiUser, FiChevronRight, FiAlertCircle, FiPackage,
} from 'react-icons/fi'
import { usePrescriptions } from '../../hooks/usePrescriptions'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import DataCard from '../../components/ui/DataCard'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function PrescriptionsList() {
  const { data: prescriptions, isLoading, error } = usePrescriptions()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const list = Array.isArray(prescriptions) ? prescriptions : prescriptions?.data || []
    if (!search.trim()) return list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    const q = search.toLowerCase()
    return list.filter((p) => {
      const doctorName = p.doctor?.name || p.doctorName || ''
      const patientName = p.patient?.name || p.patientName || ''
      return doctorName.toLowerCase().includes(q) || patientName.toLowerCase().includes(q)
    }).sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
  }, [prescriptions, search])

  if (isLoading) return <div className="space-y-4"><LoadingSkeleton type="list" count={5} /></div>
  if (error) return <EmptyState icon={FiAlertCircle} title="Failed to load prescriptions" description={error.message} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
          <p className="text-sm text-gray-400">Manage patient prescriptions and medications</p>
        </div>
        <Link to="/medical-records/prescriptions/new" className="btn-primary flex items-center gap-2 self-start">
          <FiPlus className="h-4 w-4" /> New Prescription
        </Link>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by doctor or patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title={search ? 'No prescriptions match your search' : 'No prescriptions yet'}
          description={search ? 'Try a different search term' : 'Click "New Prescription" to create the first one'}
          action={search ? null : 'New Prescription'}
          onAction={search ? null : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prescription, idx) => {
            const doctorName = prescription.doctor?.name || prescription.doctorName || 'Unknown'
            const patientName = prescription.patient?.name || prescription.patientName || 'Unknown'
            const medCount = prescription.medications?.length || 0
            const prescId = prescription._id || prescription.id

            return (
              <motion.div
                key={prescId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/medical-records/prescriptions/${prescId}`} className="block">
                  <DataCard className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-sm">
                          <FiFileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-cyan-600 transition-colors">
                            Prescription
                          </p>
                          <p className="mt-1 text-xs text-gray-400">{formatDate(prescription.date || prescription.createdAt)}</p>
                        </div>
                      </div>
                      <FiChevronRight className="h-4 w-4 text-gray-300 group-hover:text-cyan-500 transition-colors" />
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FiUser className="h-3 w-3" />{patientName}</span>
                      <span>Dr. {doctorName}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5">
                      <FiPackage className="h-3.5 w-3.5 text-cyan-500" />
                      <span className="text-xs font-medium text-gray-600">{medCount} medication{medCount !== 1 ? 's' : ''}</span>
                    </div>

                    {prescription.medications && prescription.medications.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {prescription.medications.slice(0, 3).map((med, i) => (
                          <span key={i} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {med.drugName || med.name || med.drug?.name || 'Medication'}
                          </span>
                        ))}
                        {prescription.medications.length > 3 && (
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                            +{prescription.medications.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </DataCard>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FiStar, FiSend, FiUser, FiMessageSquare,
  FiThumbsUp, FiAlertCircle, FiSearch,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useRecommendations, useCreateRecommendation } from '../../hooks/useRecommendations'
import { useDoctors } from '../../hooks/useDoctors'
import { useAuth } from '../../context/AuthContext'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import DataCard from '../../components/ui/DataCard'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function StarRating({ value, onChange, readonly }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <FiStar
            className={`h-5 w-5 ${
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function RecommendationsList() {
  const { user } = useAuth()
  const { data: recommendationsData, isLoading, error } = useRecommendations()
  const createRecommendation = useCreateRecommendation()
  const { data: doctorsData } = useDoctors()

  const [search, setSearch] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [doctorSearch, setDoctorSearch] = useState('')
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [rank, setRank] = useState(5)
  const [reason, setReason] = useState('')
  const [source, setSource] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const recommendations = useMemo(() => {
    const list = Array.isArray(recommendationsData) ? recommendationsData : recommendationsData?.data || []
    if (!search.trim()) return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const q = search.toLowerCase()
    return list.filter((r) => {
      const doctorName = r.doctor?.name || r.doctorName || ''
      const reasonText = r.reason || ''
      const patientName = r.patient?.name || r.patientName || ''
      return doctorName.toLowerCase().includes(q) || reasonText.toLowerCase().includes(q) || patientName.toLowerCase().includes(q)
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [recommendationsData, search])

  const doctors = useMemo(() => {
    return Array.isArray(doctorsData) ? doctorsData : doctorsData?.data || []
  }, [doctorsData])

  const filteredDoctors = doctors.filter((d) => {
    const name = d.name || d.user?.name || ''
    return name.toLowerCase().includes(doctorSearch.toLowerCase())
  })

  const isPatient = user?.role === 'patient'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDoctor) {
      toast.error('Please select a doctor')
      return
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for your recommendation')
      return
    }
    setSubmitting(true)
    try {
      await createRecommendation.mutateAsync({
        doctor: selectedDoctor,
        rank,
        reason: reason.trim(),
        source: source.trim() || undefined,
      })
      toast.success('Recommendation submitted successfully')
      setSelectedDoctor('')
      setDoctorSearch('')
      setRank(5)
      setReason('')
      setSource('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit recommendation')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <div className="space-y-4"><LoadingSkeleton type="list" count={5} /></div>
  if (error) return <EmptyState icon={FiAlertCircle} title="Failed to load recommendations" description={error.message} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Recommendations</h1>
        <p className="text-sm text-gray-400">
          {isPatient ? 'Recommend doctors and share your experience' : 'View recommendations you\'ve received'}
        </p>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search recommendations by doctor, patient, or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {isPatient && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <DataCard title="Recommend a Doctor">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Doctor *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={doctorSearch}
                    onChange={(e) => { setDoctorSearch(e.target.value); setShowDoctorDropdown(true); setSelectedDoctor('') }}
                    onFocus={() => setShowDoctorDropdown(true)}
                    placeholder="Search for a doctor..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
                {showDoctorDropdown && doctorSearch && (
                  <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                    {filteredDoctors.length === 0 ? (
                      <p className="p-3 text-sm text-gray-400">No doctors found</p>
                    ) : (
                      filteredDoctors.map((d) => (
                        <button
                          key={d._id || d.id}
                          type="button"
                          onClick={() => {
                            setSelectedDoctor(d._id || d.id)
                            setDoctorSearch(d.name || d.user?.name || '')
                            setShowDoctorDropdown(false)
                          }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
                            {(d.name || d.user?.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{d.name || d.user?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400">{d.specialty || d.specialization || 'Doctor'}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Rating *</label>
                <StarRating value={rank} onChange={setRank} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Reason *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Describe why you recommend this doctor..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Source (optional)</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. In-person visit, Teleconsultation"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 text-sm">
                  <FiSend className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit Recommendation'}
                </button>
              </div>
            </form>
          </DataCard>
        </motion.div>
      )}

      {recommendations.length === 0 ? (
        <EmptyState
          icon={FiStar}
          title={search ? 'No recommendations match your search' : isPatient ? 'No recommendations yet' : 'No recommendations received'}
          description={search ? 'Try a different search term' : 'Recommendations will appear here once submitted'}
        />
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {isPatient ? 'My Recommendations' : 'Received Recommendations'}
          </h2>
          {recommendations.map((rec, idx) => {
            const doctorName = rec.doctor?.name || rec.doctorName || 'Unknown Doctor'
            const patientName = rec.patient?.name || rec.patientName || 'Unknown Patient'
            const recId = rec._id || rec.id

            return (
              <motion.div
                key={recId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <DataCard>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                        <FiStar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{doctorName}</p>
                          <StarRating value={rec.rank || rec.rating} readonly />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><FiUser className="h-3 w-3" /> Recommended by {patientName}</span>
                          <span>{formatDate(rec.createdAt)}</span>
                        </div>
                        {rec.reason && (
                          <div className="mt-2 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
                            <FiMessageSquare className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600">{rec.reason}</p>
                          </div>
                        )}
                        {rec.source && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                            <FiThumbsUp className="h-3 w-3" /> {rec.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </DataCard>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

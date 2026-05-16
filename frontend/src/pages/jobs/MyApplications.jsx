import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiFileText, FiBriefcase, FiCalendar, FiCheckCircle,
  FiXCircle, FiClock, FiUser, FiChevronRight, FiChevronDown,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useMyJobApplications } from '../../hooks/useJobApplications'
import { useJobApplications, useUpdateApplicationStatus } from '../../hooks/useJobs'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const statusMap = {
  Submitted: 'Pending',
  UnderReview: 'Reviewed',
  Shortlisted: 'Shortlisted',
  Rejected: 'Rejected',
  Hired: 'Accepted',
}

function normalizeStatus(s) {
  return statusMap[s] || s || 'Pending'
}

const appStatusBadge = {
  Pending: 'badge-warning',
  Reviewed: 'badge-info',
  Shortlisted: 'badge-purple',
  Interviewed: 'badge-info',
  Accepted: 'badge-success',
  Rejected: 'badge-danger',
  Withdrawn: 'badge-danger',
}

const statusTimeline = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted']

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const statusOptions = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'UnderReview', label: 'Under Review' },
  { value: 'Shortlisted', label: 'Shortlisted' },
  { value: 'Hired', label: 'Hired' },
  { value: 'Rejected', label: 'Rejected' },
]

export default function MyApplications() {
  const { user } = useAuth()
  const isHospital = user?.role === 'hospital'
  const doctorQuery = useMyJobApplications()
  const hospitalQuery = useJobApplications()

  const query = isHospital ? hospitalQuery : doctorQuery
  const { data, isLoading, error } = query
  const updateStatus = useUpdateApplicationStatus()
  const [openDropdown, setOpenDropdown] = useState(null)

  const applications = useMemo(() => {
    const list = Array.isArray(data) ? data : data?.data || data?.applications || []
    return list.sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt))
  }, [data])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{isHospital ? 'All Applications' : 'My Applications'}</h1>
        <p className="text-sm text-gray-400">{isHospital ? 'Review doctor applications to your jobs' : 'Track your job applications and their status'}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <LoadingSkeleton key={i} type="card" />)}
        </div>
      ) : error ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
          <FiFileText className="h-12 w-12 text-rose-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">Failed to load applications</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">{(error?.response?.data?.message || error?.message || 'Something went wrong.')}</p>
          <button onClick={() => window.location.reload()} className="btn-outline text-sm">Try Again</button>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No applications yet"
          description={isHospital ? 'No doctors have applied to your jobs yet.' : "You haven't applied to any jobs yet. Browse available positions."}
          action={isHospital ? 'Post a Job' : 'Browse Jobs'}
          onAction={() => window.location.href = isHospital ? '/jobs/post' : '/jobs'}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => {
            const currentStatus = normalizeStatus(app.status)
            const isRejected = currentStatus === 'Rejected'
            const currentIdx = statusTimeline.indexOf(currentStatus)
            const title = app.jobTitle || app.position || 'Position'
            const subtitle = isHospital ? (app.doctorName || 'Doctor') : (app.hospitalName || 'Hospital')
            const linkId = app.jobOpportunityId || app.jobId

            return (
              <motion.div
                key={app._id || app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
                      <FiBriefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                      <p className="text-sm font-medium text-gray-500">{subtitle}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="h-3.5 w-3.5" />
                          Applied {timeAgo(app.appliedAt || app.createdAt)}
                        </span>
                        {app.jobLocation && <span>{app.jobLocation}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isHospital ? (
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === app.id ? null : app.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            app.status === 'Pending' || app.status === 'Submitted' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                            app.status === 'UnderReview' || app.status === 'Reviewed' ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' :
                            app.status === 'Shortlisted' ? 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100' :
                            app.status === 'Hired' || app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                            app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' :
                            'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {currentStatus}
                          <FiChevronDown className="h-3 w-3" />
                        </button>
                        {openDropdown === app.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                            <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]">
                              {statusOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => {
                                    updateStatus.mutate(
                                      { jobId: app.jobOpportunityId || app.jobId, appId: app.id, status: opt.value },
                                      { onSuccess: () => { toast.success(`Status changed to ${opt.label}`); setOpenDropdown(null) }, onError: (err) => toast.error(err?.response?.data?.message || 'Failed') }
                                    )
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                    opt.value === 'Rejected' ? 'text-rose-600' :
                                    opt.value === 'Hired' ? 'text-emerald-600' : 'text-gray-700'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className={appStatusBadge[currentStatus] || 'badge-warning'}>
                        {currentStatus}
                      </span>
                    )}
                    {linkId && (
                      <Link
                        to={`/jobs/${linkId}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      >
                        <FiChevronRight className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  {isRejected ? (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3">
                      <FiXCircle className="h-5 w-5 shrink-0 text-rose-500" />
                      <span className="text-sm font-medium text-rose-700">Not selected for this position</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {statusTimeline.map((step, idx) => {
                        const isComplete = idx <= currentIdx
                        const isCurrent = idx === currentIdx
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                              isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-300'
                            }`}>
                              {isComplete ? (
                                <FiCheckCircle className="h-4 w-4" />
                              ) : (
                                <span className="text-xs font-bold">{idx + 1}</span>
                              )}
                            </div>
                            {idx < statusTimeline.length - 1 && (
                              <div className={`h-0.5 flex-1 mx-1 ${
                                idx < currentIdx ? 'bg-emerald-300' : 'bg-gray-200'
                              }`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className="mt-2 flex justify-between px-1">
                    {['Pending', 'Reviewed', 'Shortlisted', 'Accepted'].map((step) => (
                      <span key={step} className={`text-[10px] font-medium ${
                        step === currentStatus ? 'text-cyan-600' : 'text-gray-400'
                      }`}>
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

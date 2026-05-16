import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBriefcase, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiMail, FiExternalLink, FiSend,
  FiArrowLeft, FiCheckCircle, FiXCircle, FiClipboard,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { ROLES, JOB_STATUS } from '../../utils/constants'
import { useJob, useUpdateApplicationStatus } from '../../hooks/useJobs'
import { useCreateJobApplication, useMyJobApplications } from '../../hooks/useJobApplications'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import DataCard from '../../components/ui/DataCard'

const jobStatusBadge = {
  Open: 'badge-success',
  Closed: 'badge-danger',
  Draft: 'badge-warning',
  Filled: 'badge-info',
  OnHold: 'badge-warning',
  Cancelled: 'badge-danger',
}

const statusMap = {
  Submitted: 'Pending',
  UnderReview: 'Reviewed',
  Shortlisted: 'Shortlisted',
  Rejected: 'Rejected',
  Hired: 'Accepted',
}

const reverseStatusMap = {
  Pending: 'Submitted',
  Reviewed: 'UnderReview',
  Shortlisted: 'Shortlisted',
  Accepted: 'Hired',
  Rejected: 'Rejected',
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

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: job, isLoading, error } = useJob(id)
  const { data: myApplicationsData } = useMyJobApplications()
  const createApplication = useCreateJobApplication()
  const updateStatus = useUpdateApplicationStatus()

  const [cvUrl, setCvUrl] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const jobData = job?.data || job?.job || job
  const myApplications = Array.isArray(myApplicationsData) ? myApplicationsData : myApplicationsData?.data || []

  const isDoctor = user?.role === ROLES.DOCTOR
  const isHospital = user?.role === ROLES.HOSPITAL

  const myApplication = myApplications.find(
    (app) => app.jobOpportunityId === id || app.jobId === id
  )

  const jobApplications = Array.isArray(jobData?.applications)
    ? jobData.applications
    : []

  const handleApply = async (e) => {
    e.preventDefault()
    if (!cvUrl.trim()) {
      toast.error('Please provide your CV URL')
      return
    }
    setSubmitting(true)
    try {
      await createApplication.mutateAsync({
        jobOpportunityId: Number(id),
        cvFileUrl: cvUrl.trim(),
        coverLetterText: coverLetter.trim(),
      })
      toast.success('Application submitted successfully!')
      setCvUrl('')
      setCoverLetter('')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusUpdate = async (appId, status) => {
    const backendStatus = reverseStatusMap[status] || status
    try {
      await updateStatus.mutateAsync({ jobId: id, appId, status: backendStatus })
      toast.success(`Application status updated to ${status}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" count={2} />
      </div>
    )
  }

  if (error || !jobData) {
    return (
      <EmptyState
        icon={FiBriefcase}
        title="Job not found"
        description="This job posting may have been removed or doesn't exist."
        action="Back to Jobs"
        onAction={() => navigate('/jobs')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-cyan-600 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to Jobs
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white sm:p-8"
      >
        <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{jobData.jobTitle || jobData.title}</h1>
                {jobData.hospitalName && (
                  <p className="text-lg text-white/80">{jobData.hospitalName}</p>
                )}
              </div>
              <span className={jobStatusBadge[jobData.status] || 'badge-info'}>{jobData.status || 'Open'}</span>
            </div>
            <p className="flex items-center gap-2 text-white/70">
              <FiMapPin className="h-4 w-4" />
              {jobData.location || 'Location not specified'}
            </p>
          </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DataCard title="Description">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {jobData.description || 'No description provided.'}
            </p>
          </DataCard>

          <DataCard title="Details">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <FiDollarSign className="mb-2 h-5 w-5 text-cyan-600" />
                <p className="text-xs font-medium text-gray-400">Salary Range</p>
                <p className="mt-1 text-sm font-bold text-gray-800">
                  ${(jobData.minimumSalary || jobData.salaryMin)?.toLocaleString() || '--'} — ${(jobData.maximumSalary || jobData.salaryMax)?.toLocaleString() || '--'}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <FiClipboard className="mb-2 h-5 w-5 text-violet-600" />
                <p className="text-xs font-medium text-gray-400">Specialization</p>
                <p className="mt-1 text-sm font-bold text-gray-800">{jobData.requiredSpecialization || jobData.specialization || 'Any'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <FiCalendar className="mb-2 h-5 w-5 text-amber-600" />
                <p className="text-xs font-medium text-gray-400">Deadline</p>
                <p className="mt-1 text-sm font-bold text-gray-800">{formatDate(jobData.applicationDeadline)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <FiClock className="mb-2 h-5 w-5 text-emerald-600" />
                <p className="text-xs font-medium text-gray-400">Posted</p>
                <p className="mt-1 text-sm font-bold text-gray-800">{formatDateTime(jobData.postedDate || jobData.createdAt)}</p>
              </div>
            </div>
          </DataCard>

          {isHospital && jobApplications.length > 0 && (
            <DataCard title={`Applicants (${jobApplications.length})`}>
              <div className="space-y-3">
                {jobApplications.map((app) => (
                  <div
                    key={app._id || app.id}
                    className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold">
                        {(app.doctorName || app.name || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{app.doctorName || app.name || 'Applicant'}</p>
                        <p className="text-xs text-gray-400">{app.doctorEmail || app.email || ''}</p>
                        {app.coverLetter && (
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{app.coverLetter}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={appStatusBadge[normalizeStatus(app.status)] || 'badge-warning'}>{normalizeStatus(app.status)}</span>
                      {app.cvUrl && (
                        <a
                          href={app.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {app.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app._id || app.id, JOB_STATUS.APPLICATION.REVIEWED)}
                          className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-200 transition-colors"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id || app.id, JOB_STATUS.APPLICATION.SHORTLISTED)}
                          className="rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-200 transition-colors"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id || app.id, JOB_STATUS.APPLICATION.REJECTED)}
                          className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DataCard>
          )}
        </div>

        <div className="space-y-6">
          {jobData.hospitalName && (
            <DataCard title="Hospital Information">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white">
                  <FiBriefcase className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{jobData.hospitalName}</h3>
                {jobData.hospitalEmail && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <FiMail className="h-4 w-4" />
                    {jobData.hospitalEmail}
                  </p>
                )}
                {jobData.location && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <FiMapPin className="h-4 w-4" />
                    {jobData.location}
                  </p>
                )}
              </div>
            </DataCard>
          )}

          {isDoctor && (
            <DataCard title="Apply for this position">
              {myApplication ? (
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <span className={appStatusBadge[normalizeStatus(myApplication.status)] || 'badge-warning'}>
                      {normalizeStatus(myApplication.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You have already applied to this position.
                  </p>
                  {normalizeStatus(myApplication.status) === 'Accepted' && (
                    <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-emerald-600">
                      <FiCheckCircle className="h-4 w-4" /> Congratulations!
                    </p>
                  )}
                  {normalizeStatus(myApplication.status) === 'Rejected' && (
                    <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-rose-600">
                      <FiXCircle className="h-4 w-4" /> Not selected at this time
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">CV URL *</label>
                    <input
                      type="url"
                      placeholder="https://example.com/my-cv.pdf"
                      value={cvUrl}
                      onChange={(e) => setCvUrl(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">Cover Letter</label>
                    <textarea
                      placeholder="Why are you a good fit for this role?"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="input-field min-h-[120px] resize-y"
                      rows={4}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex w-full items-center justify-center gap-2"
                  >
                    {submitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <FiSend className="h-4 w-4" /> Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </DataCard>
          )}

          {myApplication && (
            <DataCard title="Application Status">
              <div className="space-y-3">
                {['Pending', 'Reviewed', 'Shortlisted', 'Accepted'].map((step) => {
                  const appStatus = normalizeStatus(myApplication.status)
                  const statusOrder = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted']
                  const currentIdx = statusOrder.indexOf(appStatus)
                  const stepIdx = statusOrder.indexOf(step)
                  const isComplete = stepIdx <= currentIdx && appStatus !== 'Rejected'
                  const isRejected = appStatus === 'Rejected'

                  if (isRejected && step === 'Pending') {
                    return (
                      <div key="rejected" className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                          <FiXCircle className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-rose-600">Rejected</span>
                      </div>
                    )
                  }

                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isComplete ? <FiCheckCircle className="h-4 w-4" /> : <span className="text-xs font-bold">{stepIdx + 1}</span>}
                      </div>
                      <span className={`text-sm ${isComplete ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>
                        {step}
                      </span>
                      {step === appStatus && (
                        <span className="ml-auto text-xs font-medium text-cyan-600">Current</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </DataCard>
          )}
        </div>
      </div>
    </div>
  )
}

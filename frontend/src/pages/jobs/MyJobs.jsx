import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBriefcase, FiEdit3, FiTrash2, FiEye, FiPlus,
  FiMapPin, FiUsers, FiCalendar, FiChevronDown,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useMyJobs, useDeleteJob, useUpdateJob } from '../../hooks/useJobs'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'

const jobStatusBadge = {
  Open: 'badge-success',
  Closed: 'badge-danger',
  Draft: 'badge-warning',
  Filled: 'badge-info',
  OnHold: 'badge-warning',
  Cancelled: 'badge-danger',
}

const statusOptions = ['Open', 'Closed', 'OnHold', 'Filled', 'Cancelled']

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MyJobs() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useMyJobs()
  const deleteJob = useDeleteJob()

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(null)
  const { mutateAsync: updateJob } = useUpdateJob()

  const jobs = Array.isArray(data) ? data : data?.data || data?.jobs || []

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteJob.mutateAsync(deleteTarget)
      toast.success('Job deleted successfully')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete job')
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusUpdate = async (jobId, status) => {
    setStatusUpdating(jobId)
    try {
      await updateJob({ id: jobId, data: { status } })
      toast.success(`Status updated to ${status}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setStatusUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Job Postings</h1>
          <p className="text-sm text-gray-400">Manage your hospital&apos;s job opportunities</p>
        </div>
        <Link
          to="/jobs/post"
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="h-4 w-4" /> Post New Job
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <LoadingSkeleton key={i} type="card" />)}
        </div>
      ) : error ? (
        <EmptyState
          icon={FiBriefcase}
          title="Failed to load jobs"
          description="Something went wrong. Please try again."
        />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={FiBriefcase}
          title="No jobs posted yet"
          description="Post your first job opportunity for doctors."
          action="Post a Job"
          onAction={() => navigate('/jobs/post')}
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job._id || job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg">
                    <FiBriefcase className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-800">{job.title || job.position}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <FiMapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-3.5 w-3.5" />
                        {formatDate(job.createdAt || job.created)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUsers className="h-3.5 w-3.5" />
                        {job.applicationCount ?? job.applications?.length ?? 0} applicant{(job.applicationCount ?? job.applications?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <span className={`${jobStatusBadge[job.status] || 'badge-info'} cursor-pointer pr-6`}>
                      {job.status || 'Open'}
                      <FiChevronDown className="absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
                    </span>
                    <div className="absolute right-0 top-full z-20 mt-1 hidden min-w-[120px] rounded-xl border border-gray-100 bg-white p-1 shadow-xl group-hover:block">
                      {statusOptions.filter((s) => s !== job.status).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(job._id || job.id, s)}
                          disabled={statusUpdating === (job._id || job.id)}
                          className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/jobs/${job._id || job.id}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    title="View"
                  >
                    <FiEye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/jobs/edit/${job._id || job.id}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    title="Edit"
                  >
                    <FiEdit3 className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(job._id || job.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Job"
        size="sm"
      >
        <p className="mb-6 text-gray-600">Are you sure you want to delete this job posting? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger flex-1"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

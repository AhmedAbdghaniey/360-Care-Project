import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBriefcase, FiSearch, FiMapPin, FiDollarSign,
  FiCalendar, FiClock, FiSliders, FiX,
} from 'react-icons/fi'
import { useJobs } from '../../hooks/useJobs'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const jobStatusBadge = {
  Open: 'badge-success',
  Closed: 'badge-danger',
  Draft: 'badge-warning',
  Filled: 'badge-info',
  OnHold: 'badge-warning',
  Cancelled: 'badge-danger',
}

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

const specializations = [
  'All', 'Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Orthopedics',
  'Dermatology', 'Psychiatry', 'Radiology', 'Anesthesiology', 'Surgery',
  'Emergency Medicine', 'ENT', 'Pulmonology', 'Gastroenterology', 'Urology',
  'Ophthalmology', 'Internal Medicine', 'Pathology', 'Endocrinology',
]

export default function JobList() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useJobs()

  const [search, setSearch] = useState('')
  const [specFilter, setSpecFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const jobs = useMemo(() => {
    const list = Array.isArray(data) ? data : data?.data || data?.jobs || []
    return list.filter((job) => {
      const title = (job.jobTitle || job.title || job.position || '').toLowerCase()
      const loc = (job.location || '').toLowerCase()
      const spec = job.requiredSpecialization || job.specialization || ''

      if (search && !title.includes(search.toLowerCase())) return false
      if (specFilter !== 'All' && spec !== specFilter) return false
      if (locationFilter && !loc.includes(locationFilter.toLowerCase())) return false

      const minSal = job.minimumSalary || job.salaryMin
      const maxSal = job.maximumSalary || job.salaryMax
      if (salaryMin && minSal && Number(minSal) < Number(salaryMin)) return false
      if (salaryMax && maxSal && Number(maxSal) > Number(salaryMax)) return false

      return true
    })
  }, [data, search, specFilter, locationFilter, salaryMin, salaryMax])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical Jobs Board</h1>
          <p className="text-sm text-gray-400">Find your next opportunity in healthcare</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
            showFilters
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:shadow-md'
          }`}
        >
          <FiSliders className="h-4 w-4" />
          Filters
          {(specFilter !== 'All' || locationFilter || salaryMin || salaryMax) && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">!</span>
          )}
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Advanced Filters</h3>
            <button
              onClick={() => { setSpecFilter('All'); setLocationFilter(''); setSalaryMin(''); setSalaryMax('') }}
              className="flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700"
            >
              <FiX className="h-3.5 w-3.5" /> Clear all
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Specialization</label>
              <select
                value={specFilter}
                onChange={(e) => setSpecFilter(e.target.value)}
                className="input-field"
              >
                {specializations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Location</label>
              <input
                type="text"
                placeholder="City or region..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Min Salary ($)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Max Salary ($)</label>
              <input
                type="number"
                placeholder="e.g. 200000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSkeleton key={i} type="card" />
          ))}
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
          title="No jobs found"
          description={search || specFilter !== 'All' ? 'Try adjusting your search or filters.' : 'No job opportunities available at the moment.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <motion.div
              key={job._id || job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/jobs/${job._id || job.id}`)}
              className="card hover:scale-[1.02] hover:-translate-y-1 cursor-pointer group"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                  <FiBriefcase className="h-6 w-6" />
                </div>
                <span className={jobStatusBadge[job.status] || 'badge-info'}>
                  {job.status || 'Open'}
                </span>
              </div>

              <h3 className="mb-1 text-lg font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                {job.jobTitle || job.title || job.position}
              </h3>

              {job.hospitalName && (
                <p className="mb-3 text-sm font-medium text-gray-500">{job.hospitalName}</p>
              )}

              <div className="mb-4 flex flex-wrap gap-2">
                {job.location && (
                  <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    <FiMapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                )}
                {(job.requiredSpecialization || job.specialization) && (
                  <span className="badge-purple">
                    {job.requiredSpecialization || job.specialization}
                  </span>
                )}
              </div>

              <div className="mb-4 space-y-1.5 text-sm text-gray-400">
                {(job.minimumSalary || job.maximumSalary) && (
                  <p className="flex items-center gap-1.5">
                    <FiDollarSign className="h-4 w-4" />
                    <span className="font-semibold text-gray-700">
                      ${(job.minimumSalary || job.salaryMin)?.toLocaleString() || '--'} — ${(job.maximumSalary || job.salaryMax)?.toLocaleString() || '--'}
                    </span>
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <FiCalendar className="h-4 w-4" />
                  Posted {timeAgo(job.postedDate || job.createdAt)}
                </p>
                {job.applicationDeadline && (
                  <p className="flex items-center gap-1.5">
                    <FiClock className="h-4 w-4" />
                    Deadline: {formatDate(job.applicationDeadline)}
                  </p>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job._id || job.id}`) }}
                className="btn-primary w-full text-center"
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

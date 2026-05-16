import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBriefcase, FiUsers, FiFileText, FiTrendingUp,
  FiPlusCircle, FiSearch, FiArrowRight, FiClock,
  FiMapPin, FiCalendar, FiDollarSign, FiEye,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/ui/StatCard'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import { getMyProfile as getHospitalProfile } from '../../api/hospitals'
import { getMyJobs } from '../../api/jobs'

const quickActions = [
  { label: 'Post New Job', icon: FiPlusCircle, path: '/jobs/post', color: 'from-cyan-500 to-blue-600', desc: 'Create a new job opening' },
  { label: 'View Applications', icon: FiSearch, path: '/jobs/applications', color: 'from-violet-500 to-purple-600', desc: 'Review doctor applications' },
  { label: 'Manage Profile', icon: FiUsers, path: '/profile', color: 'from-teal-400 to-cyan-500', desc: 'Update hospital info' },
  { label: 'My Jobs', icon: FiEye, path: '/jobs/my', color: 'from-amber-400 to-orange-500', desc: 'Manage job postings' },
]

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

export default function HospitalDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    setLoadingProfile(true)
    getHospitalProfile()
      .then((res) => setProfile(res?.data || res))
      .catch(() => {})
      .finally(() => setLoadingProfile(false))
  }, [])

  useEffect(() => {
    setLoadingJobs(true)
    getMyJobs()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data || []
        setJobs(list)
      })
      .catch(() => {})
      .finally(() => setLoadingJobs(false))
  }, [])

  const openJobs = jobs.filter((j) => (j.status || j.jobOpportunityStatus) === 'Open')
  const closedJobs = jobs.filter((j) => (j.status || j.jobOpportunityStatus) === 'Closed')
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationCount ?? j.applications?.length ?? 0), 0)
  const newThisMonth = jobs.filter((j) => {
    const created = new Date(j.createdAt || j.postedDate || j.created)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  })

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt || b.postedDate || b.created) - new Date(a.createdAt || a.postedDate || a.created))
    .slice(0, 6)

  const recentApplications = jobs
    .flatMap((j) => (j.applications || []).map((app) => ({ ...app, jobTitle: j.title || j.jobTitle || j.position })))
    .sort((a, b) => new Date(b.createdAt || b.appliedAt) - new Date(a.createdAt || a.appliedAt))
    .slice(0, 5)

  const stats = [
    { title: 'Jobs Posted', value: jobs.length, icon: FiBriefcase, color: 'primary', trend: `${openJobs.length} open`, trendUp: openJobs.length > 0 },
    { title: 'Active Applications', value: totalApplications, icon: FiFileText, color: 'secondary', trend: totalApplications > 0 ? `${totalApplications} total` : 'No applications', trendUp: totalApplications > 0 },
    { title: 'Hiring Rate', value: jobs.length > 0 ? `${Math.round((openJobs.length / jobs.length) * 100)}%` : '0%', icon: FiTrendingUp, color: 'accent', trend: `${closedJobs.length} filled`, trendUp: closedJobs.length > 0 },
    { title: 'New This Month', value: newThisMonth.length, icon: FiClock, color: 'warm', trend: `${newThisMonth.length} job${newThisMonth.length !== 1 ? 's' : ''} posted`, trendUp: newThisMonth.length > 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white sm:p-8"
      >
        <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm">
              <FiBriefcase className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {profile?.name || user?.name?.split(' ')[0] || 'Hospital'} Dashboard
              </h1>
              <p className="mt-1 text-white/80">Manage your job postings and doctor applications.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <FiUsers className="h-4 w-4" />
              {profile?.doctorCount ?? profile?.doctors ?? 0} doctors
            </span>
            <span className="flex items-center gap-1.5">
              <FiBriefcase className="h-4 w-4" />
              {jobs.length} jobs posted
            </span>
            <span className="flex items-center gap-1.5">
              <FiFileText className="h-4 w-4" />
              {totalApplications} applications
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loadingProfile && loadingJobs ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <LoadingSkeleton key={i} type="card" />)}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent Jobs */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Recent Job Postings</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your latest job opportunities</p>
              </div>
              <Link to="/jobs/my" className="flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700">
                View All <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingJobs ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => <LoadingSkeleton key={i} type="card" />)}
              </div>
            ) : recentJobs.length === 0 ? (
              <EmptyState
                icon={FiBriefcase}
                title="No jobs posted yet"
                description="Post your first job opening for doctors."
                action="Post a Job"
                onAction={() => navigate('/jobs/post')}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recentJobs.map((job, i) => (
                  <motion.div
                    key={job._id || job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                    className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-sm">
                        <FiBriefcase className="h-5 w-5" />
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        (job.status || job.jobOpportunityStatus) === 'Open' ? 'bg-emerald-100 text-emerald-700' :
                        (job.status || job.jobOpportunityStatus) === 'Closed' ? 'bg-rose-100 text-rose-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {job.status || job.jobOpportunityStatus || 'Open'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-cyan-600 transition-colors mb-1 line-clamp-1">
                      {job.title || job.jobTitle || job.position}
                    </h4>
                    {(job.location || job.jobLocation) && (
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <FiMapPin className="h-3 w-3 shrink-0" />
                        {job.location || job.jobLocation}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
                      {(job.minimumSalary || job.maximumSalary) && (
                        <span className="flex items-center gap-1">
                          <FiDollarSign className="h-3 w-3" />
                          ${(job.minimumSalary || 0).toLocaleString()} — ${(job.maximumSalary || 0).toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiFileText className="h-3 w-3" />
                        {job.applicationCount ?? job.applications?.length ?? 0} applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        {timeAgo(job.createdAt || job.postedDate || job.created)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Recent Applications</h3>
                <p className="text-xs text-gray-400 mt-0.5">Latest doctor applications</p>
              </div>
              <Link to="/jobs/applications" className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
                View All <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingJobs ? (
              <LoadingSkeleton type="table" count={3} />
            ) : recentApplications.length === 0 ? (
              <EmptyState
                icon={FiFileText}
                title="No applications yet"
                description="Applications from doctors will appear here once they apply to your jobs."
              />
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app, i) => (
                  <motion.div
                    key={app._id || app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-all hover:bg-white hover:shadow-sm hover:border-violet-100"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold shadow-sm">
                      {(app.doctorName || app.doctor?.name || app.name || '?').charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">{app.doctorName || app.doctor?.name || app.name || 'Applicant'}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FiBriefcase className="h-3 w-3 shrink-0" />
                        {app.jobTitle || app.position}
                        <span className="mx-1">&middot;</span>
                        <FiClock className="h-3 w-3 shrink-0" />
                        {timeAgo(app.createdAt || app.appliedAt)}
                      </p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      app.status === 'Pending' || app.status === 'Submitted' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'UnderReview' || app.status === 'Reviewed' ? 'bg-sky-100 text-sky-700' :
                      app.status === 'Shortlisted' ? 'bg-violet-100 text-violet-700' :
                      app.status === 'Hired' || app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {app.status || 'Pending'}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="group relative flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{action.label}</span>
                  <span className="text-[10px] text-gray-400 leading-tight">{action.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Hospital Profile Card */}
          {profile && (
            <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border border-cyan-100">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                  <FiUsers className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{profile.name || user?.name || 'Hospital'}</p>
                  <p className="text-xs text-gray-500">
                    {[profile.city, profile.state, profile.location].filter(Boolean).join(', ') || 'No location set'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{profile.doctorCount ?? profile.doctors ?? 0}</p>
                  <p className="text-[11px] text-gray-500">Doctors</p>
                </div>
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{jobs.length}</p>
                  <p className="text-[11px] text-gray-500">Jobs Posted</p>
                </div>
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{openJobs.length}</p>
                  <p className="text-[11px] text-gray-500">Open Positions</p>
                </div>
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{totalApplications}</p>
                  <p className="text-[11px] text-gray-500">Applications</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-sm font-semibold text-cyan-600 shadow-sm transition-all hover:bg-cyan-50"
              >
                <FiUsers className="h-4 w-4" /> Manage Profile
              </Link>
            </div>
          )}

          {/* Tips Card */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-100">
            <h4 className="mb-2 text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <FiTrendingUp className="h-4 w-4 text-amber-500" />
              Tips for Success
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                Write detailed job descriptions to attract qualified doctors
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                Respond to applications quickly to show your hospital is active
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                Keep your hospital profile updated with accurate information
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

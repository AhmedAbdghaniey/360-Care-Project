import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUsers, FiCalendar, FiFileText, FiStar, FiClock,
  FiPlusCircle, FiEdit3, FiMessageSquare,
  FiArrowRight, FiBriefcase, FiMapPin, FiDollarSign,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useJobs } from '../../hooks/useJobs'
import { useJobRecommendations } from '../../hooks/useJobRecommendations'
import StatCard from '../../components/ui/StatCard'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import { getMy as getMyAppointments } from '../../api/appointments'
import { getMyProfile as getDoctorProfile } from '../../api/doctors'

const quickActions = [
  { label: 'View Schedule', icon: FiCalendar, path: '/appointments', color: 'from-cyan-500 to-blue-600', desc: 'Manage appointments' },
  { label: 'Add Medical Record', icon: FiPlusCircle, path: '/medical-records', color: 'from-cyan-500 to-blue-600', desc: 'Document patient visit' },
  { label: 'Write Prescription', icon: FiEdit3, path: '/prescriptions', color: 'from-teal-400 to-cyan-500', desc: 'Prescribe medication' },
  { label: 'View Messages', icon: FiMessageSquare, path: '/messages', color: 'from-amber-400 to-orange-500', desc: 'Chat with patients' },
  { label: 'Jobs', icon: FiBriefcase, path: '/jobs', color: 'from-emerald-400 to-teal-500', desc: 'Find opportunities' },
]

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
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

export default function DoctorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: jobsData, isLoading: loadingJobs } = useJobs()
  const { data: recData, isLoading: loadingRecs } = useJobRecommendations()

  const [profile, setProfile] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingAppts, setLoadingAppts] = useState(true)

  useEffect(() => {
    setLoadingProfile(true)
    getDoctorProfile()
      .then((res) => setProfile(res?.data || res))
      .catch(() => {})
      .finally(() => setLoadingProfile(false))
  }, [])

  useEffect(() => {
    setLoadingAppts(true)
    getMyAppointments()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data || []
        setAppointments(list)
      })
      .catch(() => {})
      .finally(() => setLoadingAppts(false))
  }, [])

  const today = new Date().toDateString()
  const todayAppts = appointments.filter((a) => new Date(a.date || a.dateTime).toDateString() === today)
  const upcomingAppts = appointments
    .filter((a) => new Date(a.date || a.dateTime) >= new Date())
    .sort((a, b) => new Date(a.date || a.dateTime) - new Date(b.date || b.dateTime))
  const recentAppts = appointments
    .filter((a) => a.date || a.dateTime)
    .sort((a, b) => new Date(b.date || b.dateTime) - new Date(a.date || a.dateTime))
    .slice(0, 5)

  const availableJobs = useMemo(() => {
    const list = Array.isArray(jobsData) ? jobsData : jobsData?.data || jobsData?.jobs || []
    return list.filter(j => (j.status || j.jobOpportunityStatus) === 'Open' || !j.status).slice(0, 3)
  }, [jobsData])

  const recommendedJobs = useMemo(() => {
    const list = Array.isArray(recData) ? recData : recData?.data || recData?.recommendations || []
    return list.slice(0, 3)
  }, [recData])

  const stats = [
    { title: 'Specialization', value: profile?.specialization || '--', icon: FiBriefcase, color: 'primary', trend: null },
    { title: "Today's Appointments", value: todayAppts.length, icon: FiCalendar, color: 'secondary', trend: todayAppts.length > 0 ? `${todayAppts.length} scheduled` : 'None', trendUp: todayAppts.length > 2 },
    { title: 'Experience', value: profile?.experienceYears ? `${profile.experienceYears} yrs` : '--', icon: FiClock, color: 'warm', trend: null },
    { title: 'Rating', value: profile?.doctorScore ? `${profile.doctorScore.toFixed(1)}/5` : '--', icon: FiStar, color: 'accent', trend: profile?.licenseNumber ? 'Licensed' : null, trendUp: true },
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
              <FiUsers className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome back, {user?.name?.split(' ')[0] || 'Doctor'}
              </h1>
              <p className="mt-1 text-white/80">
                {profile?.specialization ? `${profile.specialization} Specialist` : 'Healthcare Professional'}
                {profile?.experienceYears ? ` \u2022 ${profile.experienceYears} years experience` : ''}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="h-4 w-4" />
              {todayAppts.length > 0 ? `${todayAppts.length} appointment${todayAppts.length > 1 ? 's' : ''} today` : 'No appointments today'}
            </span>
            <span className="flex items-center gap-1.5">
              <FiStar className="h-4 w-4" />
              {profile?.doctorScore ? `${profile.doctorScore.toFixed(1)}/5 rating` : 'No ratings yet'}
            </span>
            <span className="flex items-center gap-1.5">
              <FiFileText className="h-4 w-4" />
              {appointments.length} total visits
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loadingProfile ? (
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
          {/* Recent Appointments */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your scheduled patient visits</p>
              </div>
              <Link to="/appointments" className="flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700">
                View All <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingAppts ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => <LoadingSkeleton key={i} type="card" />)}
              </div>
            ) : upcomingAppts.length === 0 ? (
              <EmptyState
                icon={FiCalendar}
                title="No upcoming appointments"
                description="Your scheduled patient visits will appear here."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingAppts.slice(0, 6).map((a, i) => (
                  <motion.div
                    key={a._id || a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/appointments`)}
                    className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">
                        <FiCalendar className="h-5 w-5" />
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        a.status === 'Scheduled' ? 'bg-sky-100 text-sky-700' :
                        a.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        a.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {a.status || 'Scheduled'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-cyan-600 transition-colors mb-1 line-clamp-1">
                      {a.patient?.name || a.doctorName || 'Patient'}
                    </h4>
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        {formatDate(a.date || a.dateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="h-3 w-3" />
                        {formatTime(a.date || a.dateTime)}
                      </span>
                    </div>
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

          {/* Today's Summary */}
          <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border border-cyan-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                <FiClock className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {todayAppts.length > 0
                    ? `${todayAppts.length} appointment${todayAppts.length > 1 ? 's' : ''} today`
                    : 'No appointments today'}
                </p>
                <p className="text-xs text-gray-500">
                  {todayAppts.length > 0
                    ? `Next at ${formatTime(todayAppts[0]?.date || todayAppts[0]?.dateTime)}`
                    : 'Enjoy your day!'}
                </p>
              </div>
            </div>
            {todayAppts.length > 0 && (
              <div className="mt-4 space-y-2">
                {todayAppts.slice(0, 3).map((a) => (
                  <div key={a._id || a.id} className="flex items-center gap-2 rounded-lg bg-white/60 p-2.5 text-sm">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                    <span className="font-medium text-gray-700">{a.patient?.name || a.doctorName || 'Patient'}</span>
                    <span className="ml-auto text-xs text-gray-400">{formatTime(a.date || a.dateTime)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Card */}
          {profile && (
            <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border border-cyan-100">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                  <FiUsers className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user?.name || 'Doctor'}</p>
                  <p className="text-xs text-gray-500">{profile?.specialization || 'General Practitioner'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{profile?.experienceYears || 0}</p>
                  <p className="text-[11px] text-gray-500">Years Exp.</p>
                </div>
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{profile?.doctorScore?.toFixed(1) || '--'}</p>
                  <p className="text-[11px] text-gray-500">Rating</p>
                </div>
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{appointments.length}</p>
                  <p className="text-[11px] text-gray-500">Visits</p>
                </div>
                <div className="rounded-lg bg-white/60 p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{todayAppts.length}</p>
                  <p className="text-[11px] text-gray-500">Today</p>
                </div>
              </div>
              <Link
                to="/doctors/me"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-sm font-semibold text-cyan-600 shadow-sm transition-all hover:bg-cyan-50"
              >
                <FiUsers className="h-4 w-4" /> View Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
              <FiStar className="text-amber-400" />
              Recommended For You
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Jobs matched to your specialty</p>
          </div>
          <Link to="/jobs" className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700">
            View All <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loadingRecs ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map(i => <LoadingSkeleton key={i} type="card" />)}
          </div>
        ) : recommendedJobs.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {availableJobs.length > 0 ? availableJobs.slice(0, 3).map((job) => (
              <motion.div
                key={job._id || job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm mb-3">
                  <FiBriefcase className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition-colors mb-1 line-clamp-1">
                  {job.title || job.jobTitle || job.position}
                </h4>
                {job.hospitalName && (
                  <p className="text-xs text-gray-500 mb-2">{job.hospitalName}</p>
                )}
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
                  {(job.location || job.jobLocation) && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-3 w-3" />{job.location || job.jobLocation}
                    </span>
                  )}
                  {(job.minimumSalary || job.maximumSalary) && (
                    <span className="flex items-center gap-1">
                      <FiDollarSign className="h-3 w-3" />${(job.minimumSalary || job.salaryMin || 0).toLocaleString()}
                    </span>
                  )}
                </div>
              </motion.div>
            )) : (
              <EmptyState
                icon={FiBriefcase}
                title="No recommendations yet"
                description="Jobs matching your profile will appear here"
              />
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {recommendedJobs.map((rec) => {
              const job = rec.job || rec
              return (
                <motion.div
                  key={rec._id || rec.id || job._id || job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                  className="group cursor-pointer rounded-xl border border-amber-100 bg-amber-50/30 p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm mb-3">
                    <FiStar className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition-colors mb-1 line-clamp-1">
                    {job.title || job.jobTitle || job.position || 'Job'}
                  </h4>
                  {job.hospitalName && (
                    <p className="text-xs text-gray-500 mb-2">{job.hospitalName}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
                    {(job.location || job.jobLocation) && (
                      <span className="flex items-center gap-1">
                        <FiMapPin className="h-3 w-3" />{job.location || job.jobLocation}
                      </span>
                    )}
                    {(job.minimumSalary || job.maximumSalary) && (
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="h-3 w-3" />${(job.minimumSalary || job.salaryMin || 0).toLocaleString()}
                      </span>
                    )}
                    {rec.matchScore && (
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <FiStar className="h-3 w-3" />{rec.matchScore}% match
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* All Open Jobs */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
              <FiBriefcase className="text-emerald-500" />
              All Open Jobs
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest medical opportunities</p>
          </div>
          <Link to="/jobs" className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View All <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loadingJobs ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map(i => <LoadingSkeleton key={i} type="card" />)}
          </div>
        ) : availableJobs.length === 0 ? (
          <EmptyState
            icon={FiBriefcase}
            title="No jobs available"
            description="Check back later for new opportunities"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {availableJobs.map((job) => (
              <motion.div
                key={job._id || job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm mb-3">
                  <FiBriefcase className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-1 line-clamp-1">
                  {job.title || job.jobTitle || job.position}
                </h4>
                {job.hospitalName && (
                  <p className="text-xs text-gray-500 mb-2">{job.hospitalName}</p>
                )}
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
                  {(job.location || job.jobLocation) && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-3 w-3" />{job.location || job.jobLocation}
                    </span>
                  )}
                  {(job.minimumSalary || job.maximumSalary) && (
                    <span className="flex items-center gap-1">
                      <FiDollarSign className="h-3 w-3" />${(job.minimumSalary || job.salaryMin || 0).toLocaleString()}
                    </span>
                  )}
                  {(job.postedDate || job.createdAt) && (
                    <span className="flex items-center gap-1">
                      <FiClock className="h-3 w-3" />{timeAgo(job.postedDate || job.createdAt)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

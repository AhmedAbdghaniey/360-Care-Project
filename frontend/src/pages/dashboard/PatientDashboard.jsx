import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUser, FiCalendar, FiFileText, FiActivity,
  FiSearch, FiPlusCircle, FiMessageSquare, FiArrowRight,
  FiMapPin, FiClock, FiHeart, FiSend, FiStar,
  FiChevronRight, FiDollarSign,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/ui/StatCard'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import { getMy as getMyAppointments } from '../../api/appointments'
import { getAll as getAllDoctors } from '../../api/doctors'

const quickActions = [
  { label: 'Book Appointment', icon: FiPlusCircle, path: '/appointments/book', color: 'from-violet-500 to-purple-600', desc: 'Schedule a visit' },
  { label: 'Messages', icon: FiMessageSquare, path: '/messages', color: 'from-amber-400 to-orange-500', desc: 'Chat with doctors' },
]

const gradientPairs = [
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-teal-400 to-cyan-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-emerald-400 to-teal-500',
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function getGradient(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return gradientPairs[Math.abs(hash) % gradientPairs.length]
}

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
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

export default function PatientDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [doctorSearch, setDoctorSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getMyAppointments().then(r => Array.isArray(r) ? r : r?.data || []).catch(() => []),
      getAllDoctors().then(r => Array.isArray(r) ? r : r?.data || []).catch(() => []),
    ])
      .then(([apps, docs]) => {
        setAppointments(apps)
        setDoctors(docs)
      })
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const upcoming = appointments
    .filter((a) => a.status === 'Scheduled' && new Date(a.date || a.dateTime) >= now)
    .sort((a, b) => new Date(a.date || a.dateTime) - new Date(b.date || b.dateTime))
  const completed = appointments.filter((a) => a.status === 'Completed')

  const myDoctorIds = [...new Set(appointments.map(a => a.doctorId).filter(Boolean))]
  const myDoctors = doctors.filter(d => myDoctorIds.includes(d.userId)).slice(0, 6)

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const name = (d.fullName || d.name || '').toLowerCase()
      const spec = (d.specialization || '').toLowerCase()
      const q = doctorSearch.toLowerCase()
      return name.includes(q) || spec.includes(q)
    }).slice(0, 8)
  }, [doctors, doctorSearch])

  const stats = [
    { title: 'My Doctors', value: myDoctorIds.length || '--', icon: FiUser, color: 'primary', trend: `${appointments.length} total visits`, trendUp: true },
    { title: 'Upcoming', value: upcoming.length, icon: FiCalendar, color: 'secondary', trend: upcoming.length > 0 ? `Next: ${formatDate(upcoming[0]?.date || upcoming[0]?.dateTime)}` : 'None scheduled', trendUp: upcoming.length > 0 },
    { title: 'Completed Visits', value: completed.length, icon: FiFileText, color: 'accent', trend: completed.length > 0 ? 'Completed visits' : 'No visits yet', trendUp: completed.length > 0 },
    { title: 'All Doctors', value: doctors.length, icon: FiStar, color: 'warm', trend: 'Browse all specialists', trendUp: true },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white sm:p-8"
      >
        <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm">
              <FiHeart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome back, {user?.name?.split(' ')[0] || 'Patient'}
              </h1>
              <p className="mt-1 text-white/80">Find doctors, book visits, stay healthy.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="h-4 w-4" />
              {upcoming.length > 0 ? `${upcoming.length} upcoming visit${upcoming.length > 1 ? 's' : ''}` : 'No upcoming visits'}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUser className="h-4 w-4" />
              {myDoctorIds.length || 0} doctor{myDoctorIds.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <FiFileText className="h-4 w-4" />
              {completed.length} completed visits
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
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

      {/* Doctor Search - Main Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Find a Doctor</h3>
          <p className="text-xs text-gray-400 mt-0.5">Search by name or specialization</p>
        </div>
        <div className="relative mb-4">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={doctorSearch}
            onChange={(e) => setDoctorSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <LoadingSkeleton key={i} type="card" />)}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-6">
            <FiSearch className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">
              {doctorSearch ? 'No doctors match your search' : 'Loading doctors...'}
            </p>
            {!doctorSearch && (
              <Link
                to="/doctors"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                Browse All Doctors <FiArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredDoctors.map((doc, i) => (
                <motion.div
                  key={doc.doctorId || doc._id || doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center text-center mb-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${getGradient(doc.fullName || doc.name)} text-white text-lg font-bold shadow-md mb-2`}>
                      {getInitials(doc.fullName || doc.name)}
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                      Dr. {doc.fullName || doc.name || 'Doctor'}
                    </h4>
                    <span className="mt-0.5 text-xs text-cyan-600 font-medium">
                      {doc.specialization || 'General'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mb-3">
                    {doc.experienceYears != null && (
                      <span>{doc.experienceYears} yr</span>
                    )}
                    {doc.doctorScore != null && doc.doctorScore > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <FiStar className="h-3 w-3 fill-current" />{doc.doctorScore.toFixed(1)}
                      </span>
                    )}
                    {doc.consultationFee != null && (
                      <span>${doc.consultationFee}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/messages?userId=${doc.userId || doc.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-semibold hover:bg-cyan-100 transition-all"
                    >
                      <FiSend className="h-3.5 w-3.5" /> Message
                    </button>
                    <button
                      onClick={() => navigate(`/appointments/book?doctorId=${doc.doctorId || doc.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-all"
                    >
                      <FiCalendar className="h-3.5 w-3.5" /> Book
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {doctors.length > 8 && (
              <Link
                to="/doctors"
                className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View All Doctors ({doctors.length}) <FiArrowRight className="h-4 w-4" />
              </Link>
            )}
          </>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upcoming Appointments */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your scheduled doctor visits</p>
              </div>
              <Link to="/appointments" className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                View All <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => <LoadingSkeleton key={i} type="card" />)}
              </div>
            ) : upcoming.length === 0 ? (
              <EmptyState
                icon={FiCalendar}
                title="No upcoming appointments"
                description="Book your next visit with a doctor."
                action="Find a Doctor"
                onAction={() => navigate('/doctors')}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcoming.slice(0, 6).map((a, i) => (
                  <motion.div
                    key={a._id || a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-sm">
                        <FiCalendar className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                        {a.status || 'Scheduled'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">
                      Dr. {a.doctorName || 'Doctor'}
                    </h4>
                    {a.specialization && (
                      <p className="text-xs text-gray-400 mb-2">{a.specialization}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        {formatDate(a.date || a.dateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="h-3 w-3" />
                        {formatTime(a.date || a.dateTime)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {a.doctorId && (
                        <button
                          onClick={() => navigate(`/messages?userId=${a.doctorId}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-semibold hover:bg-cyan-100 transition-all"
                        >
                          <FiSend className="h-3.5 w-3.5" /> Message
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/appointments/book?doctorId=${a.doctorId || ''}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-all"
                      >
                        <FiCalendar className="h-3.5 w-3.5" /> Book Again
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* My Doctors */}
          {myDoctors.length > 0 && (
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">My Doctors</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Quick contact with your doctors</p>
                </div>
                <Link to="/doctors" className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                  View All <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {myDoctors.map((d, i) => (
                  <motion.div
                    key={d.userId || d.doctorId || d.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getGradient(d.fullName || d.name)} text-white text-sm font-bold shadow-sm`}>
                        {getInitials(d.fullName || d.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          Dr. {d.fullName || d.name || 'Doctor'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{d.specialization || 'Specialist'}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => navigate(`/messages?userId=${d.userId || d.id}`)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-all"
                        title="Send Message"
                      >
                        <FiSend className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/appointments/book?doctorId=${d.doctorId || d.id}`)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-all"
                        title="Book Appointment"
                      >
                        <FiCalendar className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
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

          {/* Recent Activity */}
          <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 p-5 border border-teal-100">
            <h3 className="mb-4 text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <FiClock className="h-4 w-4 text-teal-500" />
              Recent Activity
            </h3>
            {loading ? (
              <LoadingSkeleton type="list" count={3} />
            ) : appointments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 5).map((a) => (
                  <div key={a._id || a.id} className="flex items-center gap-3 rounded-lg bg-white/60 p-2.5">
                    <div className={`h-3 w-3 shrink-0 rounded-full ${
                      a.status === 'Completed' ? 'bg-emerald-400' :
                      a.status === 'Cancelled' ? 'bg-rose-400' :
                      'bg-cyan-400'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700">
                        {a.status === 'Completed' ? 'Visited' : a.status === 'Cancelled' ? 'Cancelled' : 'Upcoming visit with'}{' '}
                        <span className="font-semibold text-gray-800">{a.doctorName || 'a doctor'}</span>
                      </p>
                      {a.specialization && (
                        <p className="text-xs text-gray-400">{a.specialization}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">{timeAgo(a.date || a.dateTime)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Link */}
          <Link
            to="/doctors"
            className="block rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border border-cyan-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                <FiSearch className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Browse All Doctors</h4>
                <p className="text-xs text-gray-500">View full doctor directory</p>
              </div>
              <FiChevronRight className="ml-auto h-5 w-5 text-cyan-400" />
            </div>
          </Link>

          {/* Health Tips */}
          <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 p-5 border border-teal-100">
            <h4 className="mb-2 text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <FiHeart className="h-4 w-4 text-teal-500" />
              Health Tips
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                Regular check-ups help catch health issues early
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                Keep your medical history up to date
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                Don't hesitate to message your doctor
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

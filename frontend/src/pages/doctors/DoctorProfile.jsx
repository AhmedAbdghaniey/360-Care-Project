import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiStar, FiClock, FiDollarSign, FiAward, FiCalendar,
  FiMapPin, FiUser, FiBriefcase, FiCheckCircle, FiMessageSquare,
  FiUserPlus, FiUserCheck, FiShield, FiPhone, FiMail, FiExternalLink,
  FiSend,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useDoctor } from '../../hooks/useDoctors'
import { useRecommendations } from '../../hooks/useRecommendations'
import { useIsFollowing, useFollow, useUnfollow } from '../../hooks/useFollows'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const coverGradients = [
  'from-cyan-600 via-blue-600 to-indigo-700',
  'from-violet-600 via-purple-600 to-pink-600',
  'from-teal-500 via-emerald-500 to-green-600',
  'from-amber-500 via-orange-500 to-rose-600',
  'from-sky-500 via-indigo-500 to-violet-600',
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function getCoverGradient(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return coverGradients[Math.abs(hash) % coverGradients.length]
}

function formatDate(d) {
  if (!d) return '--'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DoctorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: doctor, isLoading, isError, error } = useDoctor(id)
  const { data: recommendations } = useRecommendations()
  const doc = doctor?.data || doctor || {}
  const userId = doc.userId

  const { data: isFollowingData } = useIsFollowing(userId)
  const followMutation = useFollow()
  const unfollowMutation = useUnfollow()

  const isFollowing = isFollowingData?.isFollowing ?? false

  const handleToggleFollow = () => {
    if (!user) { toast.error('Please login to follow doctors'); return }
    if (!userId) { toast.error('Could not identify user'); return }
    if (isFollowing) unfollowMutation.mutate(userId, { onError: () => toast.error('Failed to unfollow') })
    else followMutation.mutate(userId, { onError: () => toast.error('Failed to follow') })
  }

  const doctorRecommendations = useMemo(() => {
    if (!recommendations || !doctor) return []
    const list = Array.isArray(recommendations) ? recommendations : recommendations?.data || []
    return list.filter(r => r.doctorId === doc.doctorId || r.doctor?.id === doc.doctorId)
  }, [recommendations, doctor])

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-56 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="-mt-16 ml-6 h-32 w-32 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
        <div className="space-y-4 p-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !doctor) {
    return <EmptyState icon={FiUser} title="Doctor not found" description={error?.message || 'Could not load doctor profile.'} />
  }

  const name = doc.fullName || 'Unknown Doctor'
  const specialization = doc.specialization || 'General'
  const licenseNumber = doc.licenseNumber || 'N/A'
  const experienceYears = doc.experienceYears ?? 0
  const consultationFee = doc.consultationFee ?? 0
  const score = doc.doctorScore ?? 0
  const isAvailable = doc.availabilityStatus?.toLowerCase() === 'available'
  const bio = doc.bio || 'No bio provided.'
  const email = doc.email || ''
  const certifications = doc.certificates || []

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Banner */}
      <div className={`relative h-48 sm:h-56 rounded-t-2xl bg-gradient-to-br ${getCoverGradient(name)} overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Profile Section - overlaps cover */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shrink-0">
              {getInitials(name)}
            </div>
            {/* <div className="pt-6 sm:pt-0">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight break-words">{name}</h1>
              <p className="text-gray-500 font-medium mt-1">{specialization}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                {experienceYears > 0 && <span className="flex items-center gap-1"><FiBriefcase className="h-3.5 w-3.5" />{experienceYears} yrs</span>}
                {email && <a href={`mailto:${email}`} className="flex items-center gap-1 text-cyan-600 hover:underline"><FiMail className="h-3.5 w-3.5" />{email}</a>}
              </div>
            </div> */}

            <div className="pt-6 sm:pt-0 space-y-2">

              {/* Name */}
              <div className="relative inline-block px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-md">
                <h1 className="text-2xl sm:text-2xl font-bold text-cyan-800 tracking-tight">
                  {name}
                </h1>
                {/* Specialization badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-cyan-700 text-sm font-medium w-fit">
                  {specialization}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-100/40 to-blue-100/40 blur-xl -z-10" />
              </div>
              {/* Info row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mt-2">

                {experienceYears > 0 && (
                  <span className="flex items-center gap-1.5">
                    <FiBriefcase className="h-4 w-4 text-cyan-600" />
                    <span className="font-medium text-gray-600">
                      {experienceYears} yrs experience
                    </span>
                  </span>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 hover:underline transition"
                  >
                    <FiMail className="h-4 w-4" />
                    <span className="truncate max-w-[220px]">{email}</span>
                  </a>
                )}

              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => navigate(`/messages?userId=${userId}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:shadow-sm transition-all"
            >
              <FiSend className="h-4 w-4" />
              Message
            </button>
            <button
              onClick={handleToggleFollow}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isFollowing
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg'
                }`}
            >
              {isFollowing ? <FiUserCheck className="h-4 w-4" /> : <FiUserPlus className="h-4 w-4" />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Experience', value: `${experienceYears} yr`, icon: FiClock, color: 'text-blue-600 bg-blue-50' },
            { label: 'Fee', value: consultationFee ? `$${consultationFee}` : 'Free', icon: FiDollarSign, color: 'text-violet-600 bg-violet-50' },
            { label: 'Score', value: score ? `${score.toFixed(1)}` : '--', icon: FiStar, color: 'text-amber-600 bg-amber-50' },
            { label: 'Status', value: isAvailable ? 'Available' : 'Unavailable', icon: FiCalendar, color: isAvailable ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                <s.icon className="h-4 w-4" />
              </div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-lg font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">About</h2>
              <p className="text-sm leading-relaxed text-gray-600">{bio}</p>
            </motion.div>

            {/* Certifications */}
            {certifications.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                  <FiAward className="inline h-4 w-4 mr-1.5 text-amber-500" />
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <FiAward className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{cert.certificateName || 'Certification'}</p>
                        {cert.issuingOrganization && <p className="text-xs text-gray-400">{cert.issuingOrganization}</p>}
                        {cert.issueDate && <p className="text-xs text-gray-400 mt-0.5">{new Date(cert.issueDate).getFullYear()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                <FiMessageSquare className="inline h-4 w-4 mr-1.5 text-violet-500" />
                Patient Recommendations
              </h2>
              {doctorRecommendations.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-gray-300">
                  <FiMessageSquare className="h-8 w-8 mb-2" />
                  <p className="text-sm text-gray-400">No recommendations yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {doctorRecommendations.map((r, i) => (
                    <div key={i} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">{r.patientName || r.patient?.fullName || 'Anonymous'}</span>
                        {r.rating != null && (
                          <span className="flex items-center gap-1 text-xs text-amber-500">
                            <FiStar className="h-3.5 w-3.5 fill-current" />{r.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      {r.comment && <p className="text-sm text-gray-500 leading-relaxed">{r.comment}</p>}
                      {r.date && <p className="text-xs text-gray-400 mt-1">{formatDate(r.date)}</p>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">

            {/* Book Appointment */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Book Appointment</h3>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-semibold text-gray-700">{consultationFee ? `$${consultationFee}` : 'Free'}</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-semibold ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>{isAvailable ? 'Available' : 'Unavailable'}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/appointments/book?doctorId=${doc.doctorId}`)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <FiCalendar className="inline h-4 w-4 mr-2" />Book Appointment
              </button>
            </motion.div>

            {/* License & Credentials */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                <FiShield className="inline h-4 w-4 mr-1.5 text-gray-400" />License & Credentials
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">License</span>
                  <span className="font-medium text-gray-700">{licenseNumber}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Experience</span>
                  <span className="font-medium text-gray-700">{experienceYears} years</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Score</span>
                  <span className="font-medium text-gray-700">{score.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>

            {/* Jobs Section */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                <FiBriefcase className="inline h-4 w-4 mr-1.5 text-gray-400" />Jobs
              </h3>
              <p className="text-sm text-gray-500 mb-3">Browse medical job opportunities</p>
              <button
                onClick={() => navigate('/jobs')}
                className="w-full py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all"
              >
                <FiExternalLink className="inline h-4 w-4 mr-2" />Browse All Jobs
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSave, FiUser, FiBriefcase, FiClock, FiDollarSign,
  FiFileText, FiStar, FiCalendar, FiAward, FiShield,
  FiExternalLink, FiMail, FiEdit3, FiX, FiMapPin,
  FiMessageSquare, FiCheckCircle,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useMyDoctorProfile, useUpdateDoctorProfile } from '../../hooks/useDoctors'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'

const coverGradients = [
  'from-cyan-600 via-blue-600 to-indigo-700',
  'from-violet-600 via-purple-600 to-pink-600',
  'from-teal-500 via-emerald-500 to-green-600',
  'from-amber-500 via-orange-500 to-rose-600',
  'from-sky-500 via-indigo-500 to-violet-600',
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
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

export default function MyDoctorProfile() {
  const navigate = useNavigate()
  const { data: profile, isLoading, isError, error } = useMyDoctorProfile()
  const updateMutation = useUpdateDoctorProfile()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    specialization: '',
    licenseNumber: '',
    experienceYears: '',
    bio: '',
    consultationFee: '',
  })

  const doc = profile?.data || profile || {}
  const name = doc.fullName || 'My Profile'
  const email = doc.email || ''
  const specialization = editing ? form.specialization : (doc.specialization || 'General')
  const experienceYears = editing ? Number(form.experienceYears || 0) : (doc.experienceYears ?? 0)
  const consultationFee = editing ? Number(form.consultationFee || 0) : (doc.consultationFee ?? 0)
  const score = doc.doctorScore ?? 0
  const isAvailable = doc.availabilityStatus?.toLowerCase() === 'available'
  const bio = editing ? form.bio : (doc.bio || 'No bio provided.')
  const licenseNumber = editing ? form.licenseNumber : (doc.licenseNumber || 'N/A')
  const certifications = doc.certificates || []

  useEffect(() => {
    if (profile) {
      const p = profile?.data || profile || {}
      setForm({
        specialization: p.specialization || '',
        licenseNumber: p.licenseNumber || '',
        experienceYears: p.experienceYears ?? '',
        bio: p.bio || '',
        consultationFee: p.consultationFee ?? '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      specialization: form.specialization,
      licenseNumber: form.licenseNumber,
      experienceYears: Number(form.experienceYears),
      bio: form.bio,
      consultationFee: Number(form.consultationFee),
    }
    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Profile updated successfully')
        setEditing(false)
      },
      onError: (err) => {
        toast.error(err?.message || 'Failed to update profile')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-56 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="-mt-16 ml-6 h-32 w-32 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
        <div className="space-y-4 p-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <FiUser className="h-8 w-8 text-rose-400" />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-gray-700">Failed to load profile</h3>
        <p className="text-sm text-gray-500">{error?.message || 'Something went wrong.'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Banner */}
      <div className={`relative h-48 sm:h-56 rounded-t-2xl bg-gradient-to-br ${getCoverGradient(name)} overflow-hidden`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shrink-0">
              {getInitials(name)}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              <p className="text-gray-500 font-medium">{specialization}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                {experienceYears > 0 && (
                  <span className="flex items-center gap-1"><FiBriefcase className="h-3.5 w-3.5" />{experienceYears} yrs</span>
                )}
                {email && (
                  <span className="flex items-center gap-1"><FiMail className="h-3.5 w-3.5" />{email}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setEditing(!editing)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                editing
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {editing ? <FiX className="h-4 w-4" /> : <FiEdit3 className="h-4 w-4" />}
              {editing ? 'Cancel' : 'Edit Profile'}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {editing && <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
            >
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5">Edit Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Specialization</label>
                    <input type="text" name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Cardiology" className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">License Number</label>
                    <input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="e.g. MED-12345" className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Experience (years)</label>
                    <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} placeholder="e.g. 10" min="0" className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Consultation Fee ($)</label>
                    <input type="number" name="consultationFee" value={form.consultationFee} onChange={handleChange} placeholder="e.g. 150" min="0" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Tell patients about yourself..." className="input-field" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={updateMutation.isPending} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                    <FiSave className="h-4 w-4" />
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>}
            {!editing && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">About</h2>
              <p className="text-sm leading-relaxed text-gray-600">{bio}</p>
            </motion.div>}
            {!editing && certifications.length > 0 && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
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
            </motion.div>}
          </div>

          <div className="space-y-4">
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

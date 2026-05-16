import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUser, FiCalendar, FiMapPin, FiDroplet, FiPhone,
  FiPlus, FiX, FiAlertTriangle, FiHeart, FiMail, FiEdit3,
  FiShield, FiSave, FiChevronRight, FiSearch, FiMessageSquare,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useMyPatientProfile, useUpdatePatientProfile } from '../../hooks/usePatients'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function calculateAge(dob) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / 31557600000)
}

export default function MyPatientProfile() {
  const navigate = useNavigate()
  const { data: profile, isLoading, isError, error } = useMyPatientProfile()
  const updateMutation = useUpdatePatientProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    dob: '',
    gender: '',
    address: '',
    bloodType: '',
    emergencyContact: '',
  })
  const [allergies, setAllergies] = useState([])
  const [chronicDiseases, setChronicDiseases] = useState([])
  const [newAllergy, setNewAllergy] = useState('')
  const [newDisease, setNewDisease] = useState('')

  useEffect(() => {
    if (profile) {
      const p = profile?.data || profile || {}
      setForm({
        dob: p.dob ? p.dob.split('T')[0] : '',
        gender: p.gender || '',
        address: p.address || '',
        bloodType: p.bloodType || '',
        emergencyContact: p.emergencyContact || '',
      })
      setAllergies(Array.isArray(p.allergies) ? p.allergies : [])
      setChronicDiseases(Array.isArray(p.chronicDiseases) ? p.chronicDiseases : [])
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const addAllergy = () => {
    const trimmed = newAllergy.trim()
    if (!trimmed) return
    if (allergies.includes(trimmed)) { toast.error('Already added'); return }
    setAllergies((prev) => [...prev, trimmed])
    setNewAllergy('')
  }

  const removeAllergy = (i) => setAllergies((prev) => prev.filter((_, idx) => idx !== i))

  const addDisease = () => {
    const trimmed = newDisease.trim()
    if (!trimmed) return
    if (chronicDiseases.includes(trimmed)) { toast.error('Already added'); return }
    setChronicDiseases((prev) => [...prev, trimmed])
    setNewDisease('')
  }

  const removeDisease = (i) => setChronicDiseases((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate({
      ...form,
      dob: form.dob ? new Date(form.dob).toISOString() : undefined,
      allergies,
      chronicDiseases,
    }, {
      onSuccess: () => { toast.success('Profile updated'); setIsEditing(false) },
      onError: (err) => toast.error(err?.message || 'Failed to update'),
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="-mt-16 ml-8 h-28 w-28 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
        <div className="space-y-4 p-6"><LoadingSkeleton type="table" count={3} /></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
        <FiUser className="h-12 w-12 text-rose-300 mb-3" />
        <h3 className="text-lg font-semibold text-gray-700">Failed to load profile</h3>
        <p className="text-sm text-gray-500 mt-1">{error?.message || 'Something went wrong.'}</p>
      </div>
    )
  }

  const p = profile?.data || profile || {}
  const name = p.name || p.fullName || 'Patient'
  const age = calculateAge(p.dob)

  return (
    <div className="space-y-6">
      {/* Cover + Avatar - LinkedIn style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="h-48 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_70%)]" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        </div>
        <div className="absolute -bottom-16 left-8">
          <div className="h-28 w-28 rounded-2xl border-4 border-white bg-gradient-to-br from-teal-400 to-emerald-500 shadow-xl flex items-center justify-center text-4xl font-bold text-white">
            {getInitials(name)}
          </div>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg backdrop-blur-sm hover:bg-white transition-all"
          >
            <FiEdit3 className="h-4 w-4 text-teal-600" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </motion.div>

      {/* Profile Name + Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="ml-2 mt-4"
      >
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <FiMail className="h-3.5 w-3.5" /> {p.email || 'No email'}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {age && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              <FiCalendar className="h-3.5 w-3.5" /> {age} years old
            </span>
          )}
          {p.bloodType && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
              <FiDroplet className="h-3.5 w-3.5" /> Type {p.bloodType}
            </span>
          )}
          {p.gender && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
              <FiUser className="h-3.5 w-3.5" /> {p.gender}
            </span>
          )}
          {allergies.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <FiAlertTriangle className="h-3.5 w-3.5" /> {allergies.length} allerg{allergies.length > 1 ? 'ies' : 'y'}
            </span>
          )}
          {chronicDiseases.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
              <FiHeart className="h-3.5 w-3.5" /> {chronicDiseases.length} condition{chronicDiseases.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About / Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">About</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <FiCalendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-bold text-gray-800">
                    {p.dob ? new Date(p.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '--'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <FiUser className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-bold text-gray-800">{p.gender || '--'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                  <FiDroplet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Blood Type</p>
                  <p className="text-sm font-bold text-gray-800">{p.bloodType || '--'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <FiPhone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                  <p className="text-sm font-bold text-gray-800">{p.emergencyContact || '--'}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <FiMapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-bold text-gray-800">{p.address || 'No address set'}</p>
              </div>
            </div>
          </motion.div>

          {/* Medical Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <FiAlertTriangle className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-gray-800">Allergies</h4>
                {allergies.length > 0 && (
                  <span className="ml-auto text-xs font-medium text-amber-600">{allergies.length}</span>
                )}
              </div>
              {allergies.length === 0 ? (
                <p className="text-sm text-gray-400">No allergies recorded.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map((a, i) => (
                    <span key={i} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-700 shadow-sm">
                      {typeof a === 'string' ? a : a.name || 'Unknown'}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                  <FiHeart className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-gray-800">Chronic Conditions</h4>
                {chronicDiseases.length > 0 && (
                  <span className="ml-auto text-xs font-medium text-rose-600">{chronicDiseases.length}</span>
                )}
              </div>
              {chronicDiseases.length === 0 ? (
                <p className="text-sm text-gray-400">No chronic conditions recorded.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {chronicDiseases.map((d, i) => (
                    <span key={i} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-rose-700 shadow-sm">
                      {typeof d === 'string' ? d : d.name || 'Unknown'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Edit Form - slides down when editing */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-2 border-teal-100"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <FiEdit3 className="h-5 w-5 text-teal-500" /> Edit Personal Info
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 text-xs font-semibold text-gray-600">Date of Birth</label>
                    <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1 text-xs font-semibold text-gray-600">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                      <option value="">Not specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 text-xs font-semibold text-gray-600">Blood Type</label>
                    <select name="bloodType" value={form.bloodType} onChange={handleChange} className="input-field">
                      <option value="">Not specified</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 text-xs font-semibold text-gray-600">Emergency Contact</label>
                    <input type="text" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Phone number" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 text-xs font-semibold text-gray-600">Address</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Your address" className="input-field" />
                </div>

                {/* Allergies Editor */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mb-2">
                    <FiAlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Allergies
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {allergies.length === 0 ? (
                      <span className="text-xs text-gray-400">None added</span>
                    ) : (
                      allergies.map((a, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          {typeof a === 'string' ? a : a.name || '?'}
                          <button type="button" onClick={() => removeAllergy(i)} className="hover:bg-amber-100 rounded-full p-0.5"><FiX className="h-3 w-3" /></button>
                        </span>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAllergy() } }} placeholder="Add allergy..." className="input-field flex-1 text-sm" />
                    <button type="button" onClick={addAllergy} className="btn-secondary text-sm px-3 py-1.5"><FiPlus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                {/* Diseases Editor */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mb-2">
                    <FiHeart className="h-3.5 w-3.5 text-rose-500" /> Chronic Conditions
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {chronicDiseases.length === 0 ? (
                      <span className="text-xs text-gray-400">None added</span>
                    ) : (
                      chronicDiseases.map((d, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                          {typeof d === 'string' ? d : d.name || '?'}
                          <button type="button" onClick={() => removeDisease(i)} className="hover:bg-rose-100 rounded-full p-0.5"><FiX className="h-3 w-3" /></button>
                        </span>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newDisease} onChange={(e) => setNewDisease(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDisease() } }} placeholder="Add condition..." className="input-field flex-1 text-sm" />
                    <button type="button" onClick={addDisease} className="btn-secondary text-sm px-3 py-1.5"><FiPlus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={updateMutation.isPending} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                    <FiSave className="h-4 w-4" /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Health Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 p-5"
          >
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 mb-4">
              <FiShield className="h-4 w-4 text-teal-500" /> Health Summary
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3">
                <span className="text-xs text-gray-500">Age</span>
                <span className="text-sm font-bold text-gray-800">{age ? `${age}` : '--'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3">
                <span className="text-xs text-gray-500">Blood Type</span>
                <span className="text-sm font-bold text-gray-800">{p.bloodType || '--'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3">
                <span className="text-xs text-gray-500">Allergies</span>
                <span className="text-sm font-bold text-gray-800">{allergies.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3">
                <span className="text-xs text-gray-500">Conditions</span>
                <span className="text-sm font-bold text-gray-800">{chronicDiseases.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-5"
          >
            <h3 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/appointments/book')}
                className="w-full flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-cyan-50 hover:text-cyan-700 transition-all"
              >
                <span className="flex items-center gap-2"><FiCalendar className="h-4 w-4 text-cyan-500" /> Book Appointment</span>
                <FiChevronRight className="h-4 w-4 text-gray-300" />
              </button>
              <button
                onClick={() => navigate('/doctors')}
                className="w-full flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-cyan-50 hover:text-cyan-700 transition-all"
              >
                <span className="flex items-center gap-2"><FiSearch className="h-4 w-4 text-cyan-500" /> Find a Doctor</span>
                <FiChevronRight className="h-4 w-4 text-gray-300" />
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="w-full flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-cyan-50 hover:text-cyan-700 transition-all"
              >
                <span className="flex items-center gap-2"><FiMessageSquare className="h-4 w-4 text-cyan-500" /> My Messages</span>
                <FiChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

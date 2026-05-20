import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiUser, FiMail, FiShield, FiLock,
  FiBell, FiTrash2, FiAlertCircle, FiSave,
  FiEdit3, FiX, FiCamera,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import DataCard from '../../components/ui/DataCard'
import Modal from '../../components/ui/Modal'

const coverGradients = [
  'from-cyan-600 via-blue-600 to-indigo-700',
  'from-violet-600 via-purple-600 to-pink-600',
  'from-teal-500 via-emerald-500 to-green-600',
  'from-amber-500 via-orange-500 to-rose-600',
  'from-sky-500 via-indigo-500 to-violet-600',
]

function getCoverGradient(name) {
  if (!name) return coverGradients[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return coverGradients[Math.abs(hash) % coverGradients.length]
}

const roleBadge = {
  doctor: 'bg-cyan-50 text-cyan-600',
  patient: 'bg-emerald-50 text-emerald-600',
  hospital: 'bg-amber-50 text-amber-600',
  admin: 'bg-rose-50 text-rose-600',
}

export default function Settings() {
  const { user, updateUser, logout } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [changingPassword, setChangingPassword] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ fullName: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  const name = user?.name || 'User'
  const email = user?.email || ''
  const role = user?.role || 'user'
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await api.delete('/auth/me')
      toast.success('Account deleted')
      logout()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const startEditing = () => {
    setProfileForm({ fullName: user?.name || '' })
    setEditingProfile(true)
  }

  const handleSaveProfile = async () => {
    if (!profileForm.fullName.trim()) {
      toast.error('Name cannot be empty')
      return
    }
    setSavingProfile(true)
    try {
      await api.put('/auth/me', { fullName: profileForm.fullName.trim(), profileImage: null })
      updateUser({ ...user, name: profileForm.fullName.trim() })
      toast.success('Profile updated')
      setEditingProfile(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setChangingPassword(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password changed successfully')
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Banner */}
      <div className={`relative h-44 sm:h-52 rounded-t-2xl bg-gradient-to-br ${getCoverGradient(name)} overflow-hidden`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shrink-0">
              {initials}
            </div>
           <div className="pt-5 sm:pt-0">
  <div className="relative inline-block px-6 py-3 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
    
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-indigo-500/30 backdrop-blur-xl"></div>

    <div className="relative">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-lg">
        {name}
      </h1>
    </div>

  </div>
</div>
            {/* <div className="pt-6 sm:pt-0">
              <div className="inline-block px-5 py-2 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-lg">
                  {name}
                </h1>
              </div>
            </div> */}
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => editingProfile ? setEditingProfile(false) : startEditing()}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${editingProfile
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg'
                }`}
            >
              {editingProfile ? <FiX className="h-4 w-4" /> : <FiEdit3 className="h-4 w-4" />}
              {editingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* User Information */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                <FiUser className="inline h-4 w-4 mr-1.5 text-cyan-500" />
                User Information
              </h2>
              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                    <input type="text" value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="input-field" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingProfile(false)} className="btn-secondary text-sm">Cancel</button>
                    <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary text-sm">
                      <FiSave className="mr-1.5 inline h-4 w-4" />
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Name', value: name, icon: FiUser, color: 'text-cyan-600 bg-cyan-50' },
                    { label: 'Email', value: email, icon: FiMail, color: 'text-blue-600 bg-blue-50' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{s.label}</p>
                        <p className="text-sm font-medium text-gray-700">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <FiLock className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Password</h3>
                    <p className="text-xs text-gray-400">Update your account password</p>
                  </div>
                </div>
                <button onClick={() => setShowPasswordModal(true)} className="btn-secondary text-xs">Change</button>
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <FiBell className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Email Notifications</h3>
                    <p className="text-xs text-gray-400">Receive email notifications for updates</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-cyan-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                <FiShield className="inline h-4 w-4 mr-1.5 text-gray-400" />Account Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Name</span>
                  <span className="font-medium text-gray-700 truncate ml-2">{name}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium text-gray-700 truncate ml-2">{email}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Role</span>
                  <span className={`font-medium capitalize ${roleBadge[role] || 'text-gray-600'}`}>{role}</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-red-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-red-700 mb-3">
                <FiTrash2 className="inline h-4 w-4 mr-1.5" />Danger Zone
              </h3>
              <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all data</p>
              <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                <FiTrash2 className="inline h-4 w-4 mr-2" />Delete Account
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <Modal isOpen={showPasswordModal} onClose={() => { setShowPasswordModal(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }} title="Change Password" size="sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="input w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="input w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="Enter new password (min 6 chars)"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="input w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowPasswordModal(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleChangePassword} disabled={changingPassword} className="btn-primary text-sm">
              {changingPassword ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Account" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4">
            <FiAlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">This action is irreversible</p>
              <p className="mt-1 text-sm text-red-600">
                All your data including medical records, prescriptions, and messages will be permanently deleted.
                Are you sure you want to continue?
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleDeleteAccount} disabled={deleting} className="btn-danger text-sm">
              {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

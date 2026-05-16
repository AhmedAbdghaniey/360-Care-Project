import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiSave, FiHome, FiMapPin, FiPhone, FiMail, FiGlobe, FiFileText,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useMyHospitalProfile, useUpdateHospitalProfile } from '../../hooks/useHospitals'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'

export default function MyHospitalProfile() {
  const { data: profile, isLoading, isError, error } = useMyHospitalProfile()
  const updateMutation = useUpdateHospitalProfile()
  const [form, setForm] = useState({
    hospitalName: '',
    hospitalAddress: '',
    contactPhoneNumber: '',
    contactEmail: '',
    officialWebsiteUrl: '',
    hospitalDescription: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        hospitalName: profile.hospitalName || '',
        hospitalAddress: profile.hospitalAddress || '',
        contactPhoneNumber: profile.contactPhoneNumber || '',
        contactEmail: profile.contactEmail || '',
        officialWebsiteUrl: profile.officialWebsiteUrl || '',
        hospitalDescription: profile.hospitalDescription || '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(form, {
      onSuccess: () => toast.success('Hospital profile updated'),
      onError: (err) => toast.error(err?.message || 'Failed to update'),
    })
  }

  if (isLoading) return <div className="space-y-6"><LoadingSkeleton type="profile" /><LoadingSkeleton type="table" /></div>

  if (isError) return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
      <FiHome className="mb-4 h-12 w-12 text-gray-300" />
      <h3 className="mb-1 text-lg font-semibold text-gray-700">Failed to load profile</h3>
      <p className="text-sm text-gray-500">{error?.message || 'You may not have a hospital profile yet.'}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hospital Profile</h1>
        <p className="mt-1 text-sm text-gray-400">Manage your hospital information.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <FiHome className="h-4 w-4 text-teal-500" />Hospital Name
              </label>
              <input type="text" name="hospitalName" value={form.hospitalName} onChange={handleChange}
                className="input-field w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <FiMapPin className="h-4 w-4 text-teal-500" />Address
              </label>
              <input type="text" name="hospitalAddress" value={form.hospitalAddress} onChange={handleChange}
                className="input-field w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <FiPhone className="h-4 w-4 text-teal-500" />Phone
                </label>
                <input type="text" name="contactPhoneNumber" value={form.contactPhoneNumber} onChange={handleChange}
                  className="input-field w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <FiMail className="h-4 w-4 text-teal-500" />Email
                </label>
                <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange}
                  className="input-field w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <FiGlobe className="h-4 w-4 text-teal-500" />Website URL
              </label>
              <input type="url" name="officialWebsiteUrl" value={form.officialWebsiteUrl} onChange={handleChange}
                placeholder="https://"
                className="input-field w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <FiFileText className="h-4 w-4 text-teal-500" />Description
              </label>
              <textarea name="hospitalDescription" value={form.hospitalDescription} onChange={handleChange} rows={4}
                className="input-field w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={updateMutation.isPending}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                <FiSave className="h-4 w-4" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

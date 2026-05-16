import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBriefcase, FiSend, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCreateJob, useUpdateJob, useJob } from '../../hooks/useJobs'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'

const specializations = [
  '', 'Cardiology', 'Neurology', 'Pediatrics', 'Oncology',
  'Orthopedics', 'Dermatology', 'Psychiatry', 'Radiology', 'Anesthesiology',
  'General Surgery', 'Internal Medicine', 'Emergency Medicine', 'Pathology',
]

export default function PostJob() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!jobId
  const { data: jobData, isLoading: loadingJob } = useJob(jobId)
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    specialization: '',
    minSalary: '',
    maxSalary: '',
    deadline: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEditMode && jobData) {
      const job = jobData?.data || jobData?.job || jobData
      setForm({
        title: job.title || job.jobTitle || '',
        description: job.description || job.jobDescription || '',
        location: job.location || job.jobLocation || '',
        specialization: job.requiredSpecialization || job.specialization || '',
        minSalary: job.minimumSalary || job.minSalary || '',
        maxSalary: job.maximumSalary || job.maxSalary || '',
        deadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : job.deadline ? job.deadline.split('T')[0] : '',
      })
    }
  }, [isEditMode, jobData])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        jobTitle: form.title.trim(),
        jobDescription: form.description.trim(),
        jobLocation: form.location.trim(),
        requiredSpecialization: form.specialization || null,
        minimumSalary: form.minSalary ? Number(form.minSalary) : null,
        maximumSalary: form.maxSalary ? Number(form.maxSalary) : null,
        applicationDeadline: form.deadline || null,
      }

      if (isEditMode) {
        await updateJob.mutateAsync({ id: jobId, data: payload })
        toast.success('Job updated successfully!')
      } else {
        await createJob.mutateAsync(payload)
        toast.success('Job posted successfully!')
      }
      navigate('/jobs')
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'post'} job`)
    } finally {
      setSubmitting(false)
    }
  }

  if (isEditMode && loadingJob) {
    return <LoadingSkeleton type="card" count={3} />
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-cyan-600 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to Jobs
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <FiBriefcase className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {isEditMode ? 'Edit Job' : 'Post a New Job'}
              </h1>
              <p className="text-sm text-gray-400">
                {isEditMode ? 'Update your job listing details' : 'Create a new job opportunity for doctors'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Cardiologist"
                value={form.title}
                onChange={handleChange('title')}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                placeholder="Describe the role, responsibilities, and qualifications..."
                value={form.description}
                onChange={handleChange('description')}
                className="input-field min-h-[160px] resize-y"
                rows={6}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. New York, NY"
                value={form.location}
                onChange={handleChange('location')}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Specialization Required</label>
              <select
                value={form.specialization}
                onChange={handleChange('specialization')}
                className="input-field"
              >
                <option value="">Any Specialization</option>
                {specializations.filter(Boolean).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Minimum Salary ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 80000"
                  value={form.minSalary}
                  onChange={handleChange('minSalary')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Maximum Salary ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 200000"
                  value={form.maxSalary}
                  onChange={handleChange('maxSalary')}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Application Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={handleChange('deadline')}
                className="input-field"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex flex-1 items-center justify-center gap-2"
              >
                {submitting ? (
                  'Saving...'
                ) : (
                  <>
                    <FiSend className="h-4 w-4" />
                    {isEditMode ? 'Update Job' : 'Post Job'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

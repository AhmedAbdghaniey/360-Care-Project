import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiHome, FiMapPin, FiPhone, FiMail, FiGlobe,
  FiBriefcase, FiCalendar, FiStar, FiShield, FiDollarSign, FiMapPin as FiLocation,
  FiExternalLink,
} from 'react-icons/fi'
import { useHospital } from '../../hooks/useHospitals'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

export default function HospitalProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: hospital, isLoading, isError, error } = useHospital(id)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="-mt-16 ml-6 h-32 w-32 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
        <div className="space-y-4 p-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (isError || !hospital) {
    return <EmptyState icon={FiHome} title="Hospital not found" description={error?.message || 'Could not load hospital profile.'} />
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Banner */}
      <div className="relative h-44 sm:h-52 rounded-t-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shrink-0">
              <FiHome className="h-10 w-10" />
            </div>
            {/* <div className="pt-6 sm:pt-0">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight break-words">{hospital.hospitalName}</h1>
              {hospital.hospitalAddress && (
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <FiMapPin className="h-3.5 w-3.5" />{hospital.hospitalAddress}
                </p>
              )}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {hospital.hospitalDescription && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">About</h2>
                <p className="text-sm leading-relaxed text-gray-600">{hospital.hospitalDescription}</p>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Phone', value: hospital.contactPhoneNumber, icon: FiPhone, color: 'text-teal-600 bg-teal-50' },
                  { label: 'Email', value: hospital.contactEmail, icon: FiMail, color: 'text-blue-600 bg-blue-50' },
                ].map((s, i) => (
                  s.value && (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{s.label}</p>
                        <p className="text-sm font-medium text-gray-700">{s.value}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
              {hospital.officialWebsiteUrl && (
                <div className="flex items-center gap-3 mt-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                    <FiGlobe className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Website</p>
                    <a href={hospital.officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-600 hover:underline">{hospital.officialWebsiteUrl}</a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                <FiShield className="inline h-4 w-4 mr-1.5 text-gray-400" />Quick Info
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Phone', value: hospital.contactPhoneNumber },
                  { label: 'Email', value: hospital.contactEmail },
                  { label: 'Location', value: hospital.hospitalAddress },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-400">{s.label}</span>
                    <span className="font-medium text-gray-700 text-right">{s.value || '--'}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Open Jobs */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <FiBriefcase className="h-4 w-4 text-emerald-500" />
                Open Jobs
                {hospital.jobs?.length > 0 && (
                  <span className="ml-auto badge badge-success text-[10px]">{hospital.jobs.length}</span>
                )}
              </h3>
              {hospital.jobs?.length > 0 ? (
                <div className="space-y-3">
                  {hospital.jobs.slice(0, 5).map((job) => (
                    <button
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-all group"
                    >
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700">{job.jobTitle}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-400">
                        {job.jobLocation && <span className="flex items-center gap-0.5"><FiLocation className="h-3 w-3" />{job.jobLocation}</span>}
                        {job.requiredSpecialization && <span>{job.requiredSpecialization}</span>}
                        {job.minimumSalary != null && <span className="flex items-center gap-0.5"><FiDollarSign className="h-3 w-3" />{job.minimumSalary} - {job.maximumSalary}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No open jobs at the moment</p>
              )}
              <button
                onClick={() => navigate(`/jobs`)}
                className="w-full mt-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <FiExternalLink className="h-4 w-4" />
                Browse All Jobs
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

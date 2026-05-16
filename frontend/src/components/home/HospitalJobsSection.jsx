import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiBriefcase } from 'react-icons/fi'
import { getAll as getJobs } from '../../api/jobs'

const fallbackJobs = [
  { title: 'Senior Cardiologist', hospital: 'NYC Health + Hospitals', location: 'New York, NY', type: 'Full-Time', salary: '$280K - $350K' },
  { title: 'Lead Neurologist', hospital: 'UCSF Medical Center', location: 'San Francisco, CA', type: 'Full-Time', salary: '$250K - $320K' },
  { title: 'Staff Pediatrician', hospital: 'Boston Children\'s Hospital', location: 'Boston, MA', type: 'Full-Time', salary: '$200K - $260K' },
  { title: 'Orthopedic Surgeon', hospital: 'Mount Sinai Medical Center', location: 'Miami, FL', type: 'Full-Time', salary: '$300K - $400K' },
  { title: 'Clinical Psychiatrist', hospital: 'Houston Methodist', location: 'Houston, TX', type: 'Full-Time', salary: '$220K - $280K' },
  { title: 'Pulmonary Specialist', hospital: 'Swedish Medical Center', location: 'Seattle, WA', type: 'Full-Time', salary: '$240K - $310K' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HospitalJobsSection() {
  const [jobs, setJobs] = useState(fallbackJobs)

  useEffect(() => {
    getJobs()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.jobs || []
        if (list.length > 0) {
          setJobs(
            list.map((job) => {
              const min = job.minimumSalary || job.MinimumSalary
              const max = job.maximumSalary || job.MaximumSalary
              const salary = min && max ? `$${min?.toLocaleString()} - $${max?.toLocaleString()}` : 'Negotiable'
              return {
                title: job.jobTitle || job.JobTitle || job.title,
                hospital: job.hospitalName || job.HospitalName || job.hospital,
                location: job.jobLocation || job.JobLocation || job.location,
                type: job.type || 'Full-Time',
                salary,
              }
            })
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="jobs" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block rounded-full bg-cyan-100 px-4 py-1.5 text-sm font-semibold text-cyan-700"
          >
            Hospital Jobs
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Top{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              Medical Positions
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Discover premier job opportunities at leading hospitals across the United States.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {jobs.map((job) => (
            <motion.div
              key={job.title + job.hospital}
              variants={cardVariants}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/80"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 shadow-lg">
                <FiBriefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
              <p className="text-sm text-cyan-600">{job.hospital}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiMapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="h-4 w-4" />
                  {job.type}
                </span>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <span className="font-bold text-cyan-600">{job.salary}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

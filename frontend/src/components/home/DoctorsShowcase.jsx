import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getAll as getDoctors } from '../../api/doctors'

const fallbackDoctors = [
  { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', rating: 4.9, reviews: 127, location: 'New York, NY' },
  { name: 'Dr. Michael Chen', specialty: 'Neurology', rating: 4.8, reviews: 98, location: 'San Francisco, CA' },
  { name: 'Dr. Emily Williams', specialty: 'Pediatrics', rating: 4.9, reviews: 156, location: 'Boston, MA' },
  { name: 'Dr. James Rodriguez', specialty: 'Orthopedics', rating: 4.7, reviews: 89, location: 'Miami, FL' },
  { name: 'Dr. Lisa Anderson', specialty: 'Dermatology', rating: 4.8, reviews: 112, location: 'Los Angeles, CA' },
  { name: 'Dr. Robert Kim', specialty: 'Ophthalmology', rating: 4.9, reviews: 134, location: 'Chicago, IL' },
  { name: 'Dr. Amanda Martinez', specialty: 'Psychiatry', rating: 4.7, reviews: 78, location: 'Houston, TX' },
  { name: 'Dr. David Thompson', specialty: 'Pulmonology', rating: 4.8, reviews: 95, location: 'Seattle, WA' },
]

export default function DoctorsShowcase() {
  const [doctors, setDoctors] = useState(fallbackDoctors)
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(4)

  useEffect(() => {
    getDoctors()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.doctors || []
        if (list.length > 0) {
          setDoctors(
            list.map((doc) => ({
              name: doc.fullName || doc.FullName || doc.name,
              specialty: doc.specialization || doc.Specialization || doc.specialty,
              rating: doc.doctorScore || doc.DoctorScore || doc.rating || 4.5,
              reviews: doc.reviews || Math.floor(Math.random() * 100) + 50,
              location: doc.location || 'Available',
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setVisible(1)
      else if (w < 1024) setVisible(2)
      else if (w < 1280) setVisible(3)
      else setVisible(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = doctors.length - visible
  const atStart = current === 0
  const atEnd = current >= maxIndex

  const next = () => setCurrent((p) => Math.min(p + 1, maxIndex))
  const prev = () => setCurrent((p) => Math.max(p - 1, 0))

  return (
    <section id="doctors" className="relative py-24 sm:py-32">
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
            Our Doctors
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Meet Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              Specialists
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-600"
          >
            Browse through our network of verified healthcare professionals.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mt-16"
          >
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{ x: `-${current * (320 + 24)}px` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {doctors.map((doctor) => (
                  <div
                    key={doctor.name}
                    className="min-w-[320px] flex-shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 shadow-xl shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
                  >
                    <div className="p-6">
                      <div className="mb-5 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-cyan-500/30">
                          {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                          <p className="mt-0.5 text-sm font-medium text-blue-600">{doctor.specialty}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FiStar
                              key={s}
                              className={`h-4 w-4 ${
                                s <= Math.floor(doctor.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-blue-200 text-blue-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{doctor.rating}</span>
                        <span className="text-sm text-gray-400">({doctor.reviews})</span>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-400">
                        <FiMapPin className="h-4 w-4 text-gray-400" />
                        {doctor.location}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {!atStart && (
              <motion.button
                onClick={prev}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg shadow-gray-200/50 transition-colors hover:bg-gray-50"
              >
                <FiChevronLeft className="h-5 w-5 text-gray-700" />
              </motion.button>
            )}
            {!atEnd && (
              <motion.button
                onClick={next}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg shadow-gray-200/50 transition-colors hover:bg-gray-50"
              >
                <FiChevronRight className="h-5 w-5 text-gray-700" />
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-cyan-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

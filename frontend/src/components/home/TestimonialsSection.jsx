import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist',
    hospital: 'NYC Health + Hospitals',
    content: 'MidSpace has transformed how I manage my practice. The platform is intuitive and my patients love the easy booking system.',
    rating: 5,
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Neurologist',
    hospital: 'UCSF Medical Center',
    content: 'The digital records system is a game-changer. I can access patient history instantly, making diagnosis faster and more accurate.',
    rating: 5,
  },
  {
    name: 'Dr. Emily Williams',
    role: 'Pediatrician',
    hospital: 'Boston Children\'s Hospital',
    content: 'As a busy pediatrician, MidSpace saves me hours each week. The secure messaging feature is particularly valuable for follow-ups.',
    rating: 5,
  },
  {
    name: 'Dr. James Rodriguez',
    role: 'Orthopedic Surgeon',
    hospital: 'Mount Sinai Medical Center',
    content: 'Finding and hiring qualified staff through MidSpace Jobs has been incredibly efficient. The platform understands healthcare recruiting.',
    rating: 5,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
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
            Testimonials
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Trusted by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              Healthcare Professionals
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Hear from doctors and healthcare professionals who use MidSpace every day.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/80"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="mb-4 flex gap-0.5"
              >
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 + j * 0.1 + i * 0.12 }}
                  >
                    <FiStar className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-sm leading-relaxed text-gray-500">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="font-bold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

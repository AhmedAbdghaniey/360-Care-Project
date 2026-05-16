import { motion } from 'framer-motion'
import {
  FiCalendar, FiFileText, FiMessageSquare, FiBriefcase, FiStar, FiShield,
} from 'react-icons/fi'

const features = [
  {
    icon: FiCalendar,
    title: 'Smart Appointment Booking',
    desc: 'Book appointments with top specialists instantly. AI-powered scheduling finds the perfect time for you.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: FiFileText,
    title: 'Digital Medical Records',
    desc: 'Secure, accessible medical records at your fingertips. Share with any doctor instantly.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: FiMessageSquare,
    title: 'Secure Messaging',
    desc: 'HIPAA-compliant messaging between doctors and patients. Real-time consultations made simple.',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: FiBriefcase,
    title: 'Job Opportunities',
    desc: 'Discover top medical positions at leading hospitals. AI-matched to your specialty and experience.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: FiStar,
    title: 'Smart Recommendations',
    desc: 'Data-driven doctor recommendations based on patient reviews, success rates, and specialization.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: FiShield,
    title: 'Verified Credentials',
    desc: 'Every doctor is verified with authentic licenses and certifications. Trust built into the platform.',
    color: 'from-sky-500 to-indigo-600',
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

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
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
            Platform Features
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Everything You Need in{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              One Place
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-600"
          >
            From booking appointments to managing your medical career, MidSpace provides all the tools
            healthcare professionals and patients need.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/80"
            >
              <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${feature.color} p-3 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

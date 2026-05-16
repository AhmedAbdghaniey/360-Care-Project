import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiCalendar, FiArrowRight, FiShield, FiActivity, FiStar, FiFileText, FiHeart } from 'react-icons/fi'

const badgeColors = {
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
}

const activityItems = [
  { icon: FiCalendar, label: 'Appointment Booked', desc: 'Dr. Sarah with Patient #2341', time: '2m ago', color: 'cyan' },
  { icon: FiStar, label: 'New Review', desc: '5 stars for Dr. Ahmed', time: '5m ago', color: 'amber' },
  { icon: FiActivity, label: 'Doctor Joined', desc: 'Dr. Emily Chen - Cardiologist', time: '12m ago', color: 'violet' },
  { icon: FiFileText, label: 'Prescription Filled', desc: 'Patient #342 - Amoxicillin', time: '18m ago', color: 'emerald' },
  { icon: FiHeart, label: 'Record Updated', desc: 'Lab results uploaded', time: '25m ago', color: 'rose' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-gray-50 pt-16 lg:pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-100/50 via-blue-50/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent" />

      <motion.div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid w-full items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16"
        >
          {/* Text Side */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700">
              <FiShield className="h-4 w-4" />
              Trusted by 10,000+ healthcare professionals
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              The Future of{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500">
                Healthcare
              </span>{' '}
              is Connected
            </motion.h1>

            <motion.p variants={itemVariants} className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-500 lg:mx-0">
              MidSpace brings together doctors, patients, and hospitals on one intelligent platform.
              Book appointments, manage records, and advance your career.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/40 sm:w-auto"
              >
                <FiSearch className="h-4 w-4" />
                Find Doctors
                <FiArrowRight className="h-4 w-4 transition-all group-hover:translate-x-1" />
              </Link>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  to="/register"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-cyan-200 hover:text-cyan-600 sm:w-auto"
                >
                  <FiCalendar className="h-4 w-4" />
                  Book Appointment
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Card Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="mx-auto w-full max-w-sm lg:mx-0"
          >
            <motion.div
              animate={{ y: [0, -8, 0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Glow */}
              <motion.div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 blur-3xl"
                animate={{
                  opacity: [0.12, 0.3, 0.12],
                  scale: [0.95, 1.06, 0.95],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md"
              >
                {/* Animated gradient top line */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 100%' }}
                />

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-gray-50 px-5 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <FiActivity className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Live Activity</div>
                  </div>
                  <div className="flex gap-1">
                    {[0, 0.3, 0.6].map((delay) => (
                      <motion.div
                        key={delay}
                        className="h-1.5 w-1.5 rounded-full bg-green-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </div>

                {/* Activity list */}
                <div className="divide-y divide-gray-100">
                  {activityItems.map((item, i) => {
                    const colors = badgeColors[item.color]
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-5 py-3.5 transition-all duration-300 hover:bg-gray-50 hover:pl-6"
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                          <item.icon className={`h-[18px] w-[18px] ${colors.text}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                          <div className="text-xs text-gray-400">{item.desc}</div>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-gray-400">{item.time}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

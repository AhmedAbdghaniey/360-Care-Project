import { motion } from 'framer-motion'
import { FiSearch, FiCalendar, FiMessageSquare, FiCheckCircle } from 'react-icons/fi'

const steps = [
  { icon: FiSearch, title: 'Find a Doctor', desc: 'Search by specialty, location, or condition. Read verified reviews and compare top-rated physicians.' },
  { icon: FiCalendar, title: 'Book an Appointment', desc: 'Choose your preferred time slot and book instantly. Get confirmation via email and SMS.' },
  { icon: FiMessageSquare, title: 'Get Treatment', desc: 'Visit in person or consult online. Receive prescriptions and follow-up plans digitally.' },
  { icon: FiCheckCircle, title: 'Follow Up', desc: 'Access your medical records, track your progress, and stay connected with your doctor.' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
}

const stepVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
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
            Simple Process
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            How It{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              Works
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Getting started with MidSpace is easy. Follow these simple steps to begin your healthcare journey.
          </p>
        </motion.div>

        <div className="relative mt-16">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-200 via-blue-200 to-cyan-100 sm:block"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative space-y-12 lg:space-y-16"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                variants={stepVariants}
                className={`relative flex flex-col items-center lg:flex-row lg:items-center ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
              >
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg sm:hidden">
                  {idx + 1}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.25 }}
                  className={`mt-4 text-center lg:mt-0 lg:w-5/12 ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}
                >
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-500">{step.desc}</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: idx * 0.25 + 0.1 }}
                  className="relative z-10 mx-auto hidden h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg sm:flex lg:mx-0"
                >
                  <step.icon className="h-5 w-5 text-white" />
                </motion.div>

                <div className="hidden lg:block lg:w-5/12" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

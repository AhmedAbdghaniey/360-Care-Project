import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiCalendar, FiHome, FiAward } from 'react-icons/fi'

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const num = parseInt(value.replace(/[^0-9]/g, ''))
          const duration = 1500
          const steps = 30
          const increment = num / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= num) {
              setCount(num)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{count}{suffix}</span>
}

const stats = [
  { icon: FiUsers, label: 'Active Users', value: '50', suffix: 'K+' },
  { icon: FiCalendar, label: 'Monthly Appointments', value: '10', suffix: 'K+' },
  { icon: FiHome, label: 'Partner Hospitals', value: '500', suffix: '+' },
  { icon: FiAward, label: 'Verified Doctors', value: '8', suffix: 'K+' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function StatsSection() {
  return (
    <section id="stats" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/80"
            >
              <div className="mx-auto mb-4 inline-flex rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 shadow-lg">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm font-medium text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

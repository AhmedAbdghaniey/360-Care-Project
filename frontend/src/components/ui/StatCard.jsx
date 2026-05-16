import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const gradients = {
  primary: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  secondary: 'bg-gradient-to-br from-violet-500 to-purple-600',
  accent: 'bg-gradient-to-br from-teal-400 to-cyan-500',
  danger: 'bg-gradient-to-br from-rose-500 to-red-600',
  warm: 'bg-gradient-to-br from-amber-400 to-orange-500',
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'primary' }) {
  const gradientClass = gradients[color] || gradients.primary

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white ${gradientClass} animate-fade-in`}>
      <div className="absolute right-4 top-4 opacity-20">
        {Icon && <Icon className="h-12 w-12" />}
      </div>
      <div className="relative z-10">
        <div className="mb-1 flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-white/80" />}
          <span className="text-sm font-medium text-white/80">{title}</span>
        </div>
        <p className="mb-2 text-3xl font-bold tracking-tight">{value}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-300' : 'text-red-300'}`}>
            {trendUp ? <FiTrendingUp className="h-4 w-4" /> : <FiTrendingDown className="h-4 w-4" />}
            <span>{trend}</span>
            <span className="text-white/60 ml-1">vs last month</span>
          </div>
        )}
      </div>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
    </div>
  )
}

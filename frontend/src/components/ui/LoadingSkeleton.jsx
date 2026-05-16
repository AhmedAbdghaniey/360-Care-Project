import { useMemo } from 'react'

const skeletons = {
  card: (
    <div className="skeleton h-48 w-full rounded-2xl" />
  ),
  table: (
    <div className="space-y-3">
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-10 w-3/4" />
    </div>
  ),
  profile: (
    <div className="flex items-center gap-4">
      <div className="skeleton h-16 w-16 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-5 w-48" />
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-4 w-24" />
      </div>
    </div>
  ),
  list: (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
    </div>
  ),
}

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const items = useMemo(() => Array.from({ length: count }), [count])
  const template = skeletons[type] || skeletons.card

  return (
    <div className="animate-fade-in space-y-4" role="status" aria-label="Loading">
      {items.map((_, i) => (
        <div key={i}>{template}</div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

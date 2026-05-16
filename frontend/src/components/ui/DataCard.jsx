export default function DataCard({ title, children, className = '', actions }) {
  return (
    <div className={`card animate-fade-in ${className}`}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

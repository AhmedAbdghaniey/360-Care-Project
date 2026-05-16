import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ icon: Icon, title, description, action, onAction }) {
  const IconComponent = Icon || FiInbox

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <IconComponent className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-700">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {action && onAction && (
        <button onClick={onAction} className="btn-primary">
          {action}
        </button>
      )}
    </div>
  )
}

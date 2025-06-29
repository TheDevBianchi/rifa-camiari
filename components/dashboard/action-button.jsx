import { Check, X, Loader2 } from 'lucide-react'

export function ActionButton ({ onClick, disabled, variant, isLoading }) {
  const variants = {
    approve: {
      baseClass: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-[0_0_15px_rgba(140,82,255,0.3)] border border-primary-500/30',
      icon: Check,
      text: 'Aprobar',
      loadingText: 'Aprobando...'
    },
    reject: {
      baseClass: 'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:shadow-[0_0_15px_rgba(255,87,87,0.3)] border border-secondary-500/30',
      icon: X,
      text: 'Rechazar',
      loadingText: 'Rechazando...'
    }
  }

  const { baseClass, icon: Icon, text, loadingText } = variants[variant]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 ${baseClass} text-white py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm`}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className='animate-spin' />
          {loadingText}
        </>
      ) : (
        <>
          <Icon size={16} />
          {text}
        </>
      )}
    </button>
  )
}

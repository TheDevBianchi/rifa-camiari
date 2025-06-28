export function FormField ({ label, children, error, optional = true }) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
        {label}
        {optional && <span className='text-xs text-gray-400'>(Opcional)</span>}
      </label>
      {children}
      {error && (
        <p className='text-sm text-red-400' role='alert'>
          {error.message}
        </p>
      )}
    </div>
  )
}

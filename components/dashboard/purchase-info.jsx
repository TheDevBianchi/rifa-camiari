export function PurchaseInfo({ icon, label, value, valueClass = '', customValue }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {icon && icon}
        <span className='text-gray-400'>{label}:</span>
      </div>
      {customValue ? (
        customValue
      ) : (
        <span className={valueClass}>{value}</span>
      )}
    </div>
  )
}

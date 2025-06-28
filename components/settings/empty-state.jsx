import { CreditCard } from 'lucide-react'

export function EmptyState () {
  return (
    <div className='bg-gray-800 p-4 md:p-6 rounded-lg'>
      <div className='text-center py-6 md:py-8'>
        <CreditCard className='w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-3 md:mb-4' />
        <h3 className='text-lg md:text-xl font-medium text-white mb-1 md:mb-2'>
          Sin métodos de pago
        </h3>
        <p className='text-gray-400 text-sm md:text-base'>
          Agrega tu primer método de pago para comenzar a recibir pagos
        </p>
      </div>
    </div>
  )
}

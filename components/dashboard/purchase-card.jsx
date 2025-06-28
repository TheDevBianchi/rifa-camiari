import { formatDate } from '@/lib/utils'
import { PurchaseInfo } from './purchase-info'
import { ActionButton } from './action-button'
import { Calendar, User, Mail, Phone, CreditCard, Receipt, Ticket, DollarSign } from 'lucide-react'
import CountryPrice from '@/components/ui/country-price'
import { useSettingsStore } from '@/store/use-settings-store'
import { useEffect, useState } from 'react'

export function PurchaseCard ({ purchase, loadingStates, onApprove, onReject }) {
  const { paymentMethods, getPaymentMethods } = useSettingsStore()
  const [paymentMethodName, setPaymentMethodName] = useState('')
  
  useEffect(() => {
    // Cargar los métodos de pago si no están disponibles
    if (paymentMethods.length === 0) {
      getPaymentMethods()
    }
    
    // Buscar el nombre del método de pago
    const method = paymentMethods.find(m => m.id === purchase.paymentMethod)
    setPaymentMethodName(method ? method.name : purchase.paymentMethod)
  }, [purchase.paymentMethod, paymentMethods, getPaymentMethods])
  return (
    <div className='bg-gradient-to-br from-black to-gray-900 rounded-lg p-5 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
      <div className='mb-4'>
        <h3 className='font-bold text-lg bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-1'>
          {purchase.raffleName}
        </h3>
        <p className='text-gray-400 text-sm flex items-center gap-1'>
          <Calendar className='w-3.5 h-3.5' />
          {formatDate(purchase.createdAt)}
        </p>
      </div>

      <div className='space-y-3 text-gray-300 bg-black/40 p-4 rounded-lg border border-amber-500/10 mb-4'>
        <PurchaseInfo 
          icon={<User className='w-4 h-4 text-amber-400' />}
          label='Comprador' 
          value={purchase.name} 
        />
        <PurchaseInfo 
          icon={<Mail className='w-4 h-4 text-amber-400' />}
          label='Email' 
          value={purchase.email} 
        />
        <PurchaseInfo 
          icon={<Phone className='w-4 h-4 text-amber-400' />}
          label='Teléfono' 
          value={purchase.phone} 
        />
        <div className='border-t border-gray-800 my-2'></div>
        <PurchaseInfo 
          icon={<CreditCard className='w-4 h-4 text-amber-400' />}
          label='Método de pago' 
          value={paymentMethodName} 
        />
        <PurchaseInfo 
          icon={<Receipt className='w-4 h-4 text-amber-400' />}
          label='Referencia' 
          value={purchase.paymentReference} 
        />
        <div className='border-t border-gray-800 my-2'></div>
        <PurchaseInfo
          icon={<Ticket className='w-4 h-4 text-amber-400' />}
          label='Tickets'
          value={`${purchase.selectedTickets.length} tickets`}
          valueClass='font-medium'
        />
        <PurchaseInfo
          icon={<DollarSign className='w-4 h-4 text-amber-400' />}
          label='Total'
          customValue={
            <CountryPrice 
              amount={purchase.selectedTickets.length * purchase.rafflePrice} 
              className="font-semibold text-amber-400"
            />
          }
        />
      </div>

      <div className='flex gap-3'>
        <ActionButton
          onClick={() => onApprove(purchase.raffleId, purchase)}
          disabled={loadingStates.approve[purchase.createdAt.seconds]}
          variant='approve'
          isLoading={loadingStates.approve[purchase.createdAt.seconds]}
        />
        <ActionButton
          onClick={() => onReject(purchase.raffleId, purchase)}
          disabled={loadingStates.reject[purchase.createdAt.seconds]}
          variant='reject'
          isLoading={loadingStates.reject[purchase.createdAt.seconds]}
        />
      </div>
    </div>
  )
}

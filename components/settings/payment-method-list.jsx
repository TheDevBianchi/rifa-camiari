import { useSettingsStore } from '@/store/use-settings-store'
import { PaymentMethodItem } from './payment-method-item'
import { LoadingState } from './loading-state'
import { EmptyState } from './empty-state'

export function PaymentMethodList() {
  const { paymentMethods, loading } = useSettingsStore()

  if (loading) return <LoadingState />
  if (paymentMethods.length === 0) return <EmptyState />

  return (
    <div className='bg-gray-800 p-4 md:p-6 rounded-lg'>
      <h2 className='text-lg md:text-xl font-semibold mb-3 md:mb-4'>
        Métodos de Pago Actuales
      </h2>
      <div className='space-y-3 md:space-y-4' role='list'>
        {paymentMethods.map((method) => (
          <PaymentMethodItem key={method.id} method={method} />
        ))}
      </div>
    </div>
  )
}

import { Trash2, Pencil } from 'lucide-react'
import { useSettingsStore } from '@/store/use-settings-store'
import { toast } from 'sonner'

export function PaymentMethodItem ({ method }) {
  const { deletePaymentMethod, setSelectedMethod, setEditModal } =
    useSettingsStore()

  const handleDelete = async () => {
    try {
      await deletePaymentMethod(method.id)
      toast.success('Método de pago eliminado exitosamente')
    } catch (error) {
      toast.error('Error al eliminar el método de pago')
    }
  }

  const handleEdit = () => {
    setSelectedMethod(method)
    setEditModal(true)
  }

  return (
    <div
      className='bg-gray-900/50 p-3 md:p-4 rounded-lg border border-gray-700'
      role='listitem'
    >
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4'>
        <div className='space-y-1 md:space-y-0.5'>
          <h3 className='font-medium text-sm md:text-base'>{method.name}</h3>
          <p className='text-gray-400 text-xs md:text-sm'>{method.email}</p>
          {method.contactName && (
            <p className='text-gray-400 text-xs md:text-sm'>
              {method.contactName}
            </p>
          )}
          {method.phone && (
            <p className='text-gray-400 text-xs md:text-sm'>{method.phone}</p>
          )}
        </div>

        <div className='flex items-center gap-2 self-end md:self-center'>
          <button
            onClick={() => handleEdit(method)}
            className='p-1.5 md:p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors'
          >
            <Pencil className='w-4 h-4 md:w-5 md:h-5' />
          </button>
          <button
            onClick={() => handleDelete(method.id)}
            className='p-1.5 md:p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-gray-800 transition-colors'
          >
            <Trash2 className='w-4 h-4 md:w-5 md:h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

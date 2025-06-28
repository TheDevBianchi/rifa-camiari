import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentMethodSchema } from '@/schema/paymentMethodSchema'
import { useSettingsStore } from '@/store/use-settings-store'
import { toast } from 'sonner'
import { X, Loader2 } from 'lucide-react'
import { FormField } from '../ui/form-field'
import { Input } from '../ui/input'

export function EditPaymentMethodModal () {
  const { selectedMethod, isEditModalOpen, setEditModal, updatePaymentMethod } =
    useSettingsStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: '',
      identificationNumber: '',
      bankName: '',
      bankCode: '',
      email: '',
      contactName: '',
      phone: ''
    }
  })

  useEffect(() => {
    if (selectedMethod) {
      reset(selectedMethod)
    }
  }, [selectedMethod, reset])

  const onSubmit = async data => {
    try {
      await updatePaymentMethod(selectedMethod.id, data)
      toast.success('Método de pago actualizado exitosamente')
      setEditModal(false)
    } catch (error) {
      toast.error('Error al actualizar el método de pago')
    }
  }

  if (!isEditModalOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'>
      <div className='min-h-screen px-4 flex items-center justify-center'>
        <div className='bg-gray-800 rounded-lg w-full max-w-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Editar Método de Pago</h2>
            <button
              onClick={() => setEditModal(false)}
              className='text-gray-400 hover:text-white'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              <FormField label='Nombre del método de pago'>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: 'El nombre es requerido' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Ej: PayPal, Zelle, etc.'
                      className='bg-gray-900/50'
                    />
                  )}
                />
                {errors.name && (
                  <p className='text-sm text-red-400'>{errors.name.message}</p>
                )}
              </FormField>

              <FormField label='Número de identificación'>
                <Controller
                  name='identificationNumber'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Número de identificación'
                      className='bg-gray-900/50'
                    />
                  )}
                />
              </FormField>

              <FormField label='Nombre del banco'>
                <Controller
                  name='bankName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Nombre del banco'
                      className='bg-gray-900/50'
                    />
                  )}
                />
              </FormField>

              <FormField label='Código del banco'>
                <Controller
                  name='bankCode'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Código del banco'
                      className='bg-gray-900/50'
                    />
                  )}
                />
              </FormField>

              <FormField label='Email'>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='email'
                      placeholder='Email de contacto'
                      className='bg-gray-900/50'
                    />
                  )}
                />
              </FormField>

              <FormField label='Nombre de contacto'>
                <Controller
                  name='contactName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Nombre de la persona de contacto'
                      className='bg-gray-900/50'
                    />
                  )}
                />
              </FormField>

              <FormField label='Teléfono'>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Número de teléfono'
                      className='bg-gray-900/50'
                    />
                  )}
                />
              </FormField>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-primary text-white p-2.5 rounded hover:bg-primary/90 disabled:opacity-50'
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center gap-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Actualizando...</span>
                </span>
              ) : (
                'Actualizar Método de Pago'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

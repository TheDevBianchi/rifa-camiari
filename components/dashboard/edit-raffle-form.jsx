'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRaffles } from '@/hooks/useRaffles'
import { schema as raffleSchema } from '@/schema/raffleSchema'
import { getInitialDate } from '@/lib/utils'
import {
  Calendar,
  ImageIcon,
  DollarSign,
  Hash,
  AlignLeft,
  Save,
  Loader2,
} from 'lucide-react'
import DatePicker from 'react-datepicker'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import FormField from './form-fields/FormField'
import ImageUploadField from './form-fields/imageSelector'

export function EditRaffleForm({ raffle }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateRaffle } = useRaffles()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      title: raffle?.title || '',
      description: raffle?.description || '',
      price: raffle?.price || '',
      totalTickets: raffle?.totalTickets || '',
      minTickets: raffle?.minTickets || '',
      endDate: raffle?.endDate ? getInitialDate(raffle.endDate) : new Date(),
      images: raffle?.images?.join('\n') || '',
      randomTickets: raffle?.randomTickets || false,
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      console.log('Datos del formulario:', data)
      toast.success('Formulario enviado')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al procesar el formulario')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='w-full'>
      <Card className='border-gray-800 bg-gray-900/50 backdrop-blur'>
        <CardHeader>
          <CardTitle className='text-primary-400'>Editar Rifa</CardTitle>
          <CardDescription>Modifica los detalles de la rifa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <FormField
                  label='Título'
                  error={errors.title?.message}
                  icon={AlignLeft}>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className={cn(
                          'bg-gray-800/50 border-gray-700',
                          errors.title && 'border-secondary-500 focus:ring-secondary-500'
                        )}
                        placeholder='Nombre de la rifa'
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label='Precio'
                  error={errors.price?.message}
                  icon={DollarSign}>
                  <Controller
                    name='price'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='text'
                        className={cn(
                          'bg-gray-800/50 border-gray-700',
                          errors.price && 'border-secondary-500 focus:ring-secondary-500'
                        )}
                        placeholder='0.00'
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label='Total de Tickets'
                  error={errors.totalTickets?.message}
                  icon={Hash}>
                  <Controller
                    name='totalTickets'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='string'
                        className={cn(
                          'bg-gray-800/50 border-gray-700',
                          errors.totalTickets &&
                            'border-secondary-500 focus:ring-secondary-500'
                        )}
                        placeholder={`${raffle.totalTickets}`}
                      />
                    )}
                  />
                </FormField>

                <FormField label='Fecha de finalización' icon={Calendar}>
                  <Controller
                    name='endDate'
                    control={control}
                    render={({ field }) => (
                      <div className='relative'>
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          showTimeSelect
                          dateFormat='Pp'
                          className='w-full bg-gray-800/50 border-gray-700 rounded-md px-3 py-2'
                          placeholderText='Selecciona fecha y hora'
                        />
                      </div>
                    )}
                  />
                </FormField>
              </div>

              <div className='space-y-4'>
                <FormField
                  label='Descripción'
                  error={errors.description?.message}
                  icon={AlignLeft}>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className={cn(
                          'bg-gray-800/50 border-gray-700 min-h-[120px]',
                          errors.description &&
                            'border-secondary-500 focus:ring-secondary-500'
                        )}
                        placeholder='Describe los detalles de la rifa'
                      />
                    )}
                  />
                </FormField>

                <FormField label='Imágenes' icon={ImageIcon}>
                  <Controller
                    name='images'
                    control={control}
                    render={({ field }) => <ImageUploadField field={field} />}
                  />
                </FormField>
              </div>
            </div>

            <Separator className='bg-gray-800' />

            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='min-w-[200px] bg-primary-500 hover:bg-primary-600'>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

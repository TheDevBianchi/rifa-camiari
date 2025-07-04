'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useRaffleStore } from '@/store/use-rifa-store'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  PlusIcon,
  XIcon,
  DollarSign,
  Hash,
  Clock,
  ImageIcon,
  FileText
} from 'lucide-react'
import { schema } from '@/schema/raffleSchema'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

function CreateRaffle ({ modal, onClose }) {
  const router = useRouter()
  const createRaffle = useRaffleStore(state => state.createRaffle)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      totalTickets: '',
      minTickets: '',
      reservedNumbers: [],
      soldTickets: 0,
      images: [],
      createdAt: new Date(),
      startDate: new Date(),
      endDate: '',
      randomTickets: true
    }
  })

  const onSubmit = async data => {
    setIsSubmitting(true)
    try {
      await createRaffle(data)
      toast.success('Rifa creada exitosamente', {
        description: `La rifa "${data.title}" ha sido creada correctamente`
      })
      router.push('/dashboard/rifas')
      onClose()
    } catch (error) {
      toast.error('Error al crear la rifa', {
        description: error.message || 'Ocurrió un error al crear la rifa'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 overflow-y-auto bg-primary-950/90 backdrop-blur-sm z-50'>
      <div className='min-h-screen px-4 flex items-center justify-center'>
        <Card className='w-full max-w-2xl bg-primary-950/90 backdrop-blur-xl border border-primary-700 shadow-2xl'>
          <CardHeader className='border-b border-primary-700 sticky top-0 bg-primary-950/80 backdrop-blur-xl z-10'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-2xl font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent'>
                Crear Nueva Rifa
              </CardTitle>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='text-primary-400 hover:text-primary-500 hover:bg-primary-500/10 transition-colors'
              >
                <XIcon className='h-5 w-5' />
              </Button>
            </div>
          </CardHeader>

          <CardContent className='p-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid gap-6 md:grid-cols-2'>
                {/* Información básica */}
                <div className='space-y-4 bg-primary-900/60 p-6 rounded-xl border border-primary-700 hover:border-primary-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(140,82,255,0.15)]'>
                  <h3 className='text-xl font-bold text-primary flex items-center gap-2'>
                    <FileText className='w-5 h-5 text-primary' />
                    Información Básica
                  </h3>

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='title' className='text-primary-200'>
                        Título de la Rifa
                      </Label>
                      <Controller
                        name='title'
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              id='title'
                              placeholder='Ej: iPhone 15 Pro Max'
                              className='bg-primary-950 border-primary-700 focus:border-primary-500 text-primary-100 placeholder-primary-400 transition-colors'
                            />
                            {errors.title && (
                              <p className='mt-1 text-sm text-secondary-400'>
                                {errors.title.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='price' className='text-primary-200'>
                          <div className='flex items-center gap-2'>
                            <DollarSign className='w-4 h-4 text-primary' />
                            Precio
                          </div>
                        </Label>
                        <Controller
                          name='price'
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Input
                                {...field}
                                type='number'
                                step='0.01'
                                placeholder='0.00'
                                className='bg-primary-950 border-primary-700 focus:border-primary-500 text-primary-100 placeholder-primary-400 transition-colors'
                              />
                              {errors.price && (
                                <p className='mt-1 text-sm text-secondary-400'>
                                  {errors.price.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='totalTickets' className='text-primary-200'>
                          <div className='flex items-center gap-2'>
                            <Hash className='w-4 h-4 text-primary' />
                            Total Tickets
                          </div>
                        </Label>
                        <Controller
                          name='totalTickets'
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Input
                                {...field}
                                type='number'
                                placeholder='100'
                                className='bg-primary-950 border-primary-700 focus:border-primary-500 text-primary-100 placeholder-primary-400 transition-colors'
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <div className='space-y-2 w-full'>
                      <Label htmlFor='minTickets' className='text-primary-200'>
                        <div className='flex items-center gap-2'>
                          <Hash className='w-4 h-4 text-primary' />
                          Tickets Minimos
                        </div>
                      </Label>
                      <Controller
                        name='minTickets'
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type='number'
                              placeholder='2'
                              className='bg-primary-950 border-primary-700 focus:border-primary-500 text-primary-100 placeholder-primary-400 transition-colors'
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className='space-y-4'>
                      <div className='flex items-center space-x-2'>
                        <Controller
                          name='randomTickets'
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id='randomTickets'
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='bg-primary-950 border-primary-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                            />
                          )}
                        />
                        <div className='space-y-1'>
                          <Label
                            htmlFor='randomTickets'
                            className='text-sm font-medium text-primary-200'
                          >
                            Tickets Aleatorios
                          </Label>
                          <p className='text-xs text-primary-400'>
                            Si está activado, los tickets se asignarán de forma
                            aleatoria
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción e Imágenes */}
                <div className='space-y-4 bg-secondary-900/60 p-6 rounded-xl border border-secondary-700 hover:border-secondary-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,87,87,0.15)]'>
                  <h3 className='text-xl font-bold text-secondary flex items-center gap-2'>
                    <ImageIcon className='w-5 h-5 text-secondary' />
                    Multimedia
                  </h3>

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='description' className='text-secondary-200'>
                        Descripción
                      </Label>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Textarea
                              {...field}
                              placeholder='Describe los detalles de la rifa...'
                              className='bg-secondary-950 border-secondary-700 focus:border-secondary-500 text-secondary-100 placeholder-secondary-400 transition-colors min-h-[120px]'
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-secondary-200'>Imágenes</Label>
                      <Controller
                        name='images'
                        control={control}
                        render={({ field }) => (
                          <div className='space-y-4'>
                            <div className='border-2 border-dashed border-secondary-700 rounded-lg p-4 hover:border-secondary-500 transition-colors'>
                              <label className='flex flex-col items-center cursor-pointer'>
                                <PlusIcon className='w-8 h-8 text-secondary-400' />
                                <span className='mt-2 text-sm text-secondary-400'>
                                  Arrastra imágenes o haz clic para seleccionar
                                </span>
                                <input
                                  type='file'
                                  className='hidden'
                                  multiple
                                  accept='image/*'
                                  onChange={e => {
                                    const files = Array.from(e.target.files)
                                    const newImages = files.map(file => ({
                                      file,
                                      preview: URL.createObjectURL(file)
                                    }))
                                    field.onChange([
                                      ...(field.value || []),
                                      ...newImages
                                    ])
                                  }}
                                />
                              </label>
                            </div>

                            {field.value?.length > 0 && (
                              <div className='grid grid-cols-3 gap-4'>
                                {field.value.map((image, index) => (
                                  <div key={index} className='relative group'>
                                    <Image
                                      src={image.preview}
                                      alt={`Preview ${index + 1}`}
                                      width={100}
                                      height={100}
                                      className='w-full h-24 object-cover rounded-lg'
                                    />
                                    <button
                                      type='button'
                                      onClick={() => {
                                        const newImages = field.value.filter(
                                          (_, i) => i !== index
                                        )
                                        field.onChange(newImages)
                                        URL.revokeObjectURL(image.preview)
                                      }}
                                      className='absolute -top-2 -right-2 bg-secondary-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                                    >
                                      <XIcon className='w-4 h-4' />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas y Opciones */}
              <div className='bg-primary-900/60 p-6 rounded-xl border border-primary-700 hover:border-primary-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(140,82,255,0.15)]'>
                <h3 className='text-xl font-bold text-primary flex items-center gap-2 mb-4'>
                  <Clock className='w-5 h-5 text-primary' />
                  Fechas
                </h3>

                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <Label className='text-primary-200'>Fechas de Inicio</Label>
                    <div className='grid grid-cols-2 gap-4'>
                      <Controller
                        name='startDate'
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            showTimeSelect
                            dateFormat='Pp'
                            placeholderText='Fecha inicio'
                            className='w-full bg-primary-950 border-primary-700 rounded-md px-3 py-2 text-sm text-primary-100'
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end pt-4 border-t border-primary-700'>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='min-w-[200px] bg-primary-500 hover:bg-primary-600 text-white shadow-[0_0_15px_rgba(140,82,255,0.2)] font-bold'
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin' />
                      <span>Creando...</span>
                    </div>
                  ) : (
                    'Crear Rifa'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateRaffle

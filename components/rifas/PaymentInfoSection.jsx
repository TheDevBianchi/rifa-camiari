import { Controller } from 'react-hook-form'
import { CreditCard, Receipt, AlertCircle, Loader2, Copy, CheckCircle2, Info, CreditCardIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

import { toast } from 'sonner'
import Image from 'next/image'
import { useCountryStore } from '@/store/use-country-store'
import CountryPrice from '@/components/ui/country-price'

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('¡Copiado al portapapeles!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Error al copiar')
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className="group inline-flex items-center gap-1 text-gray-400 hover:text-primary transition-colors"
      title="Copiar al portapapeles"
      type='button'
    >
      {label}
      {copied ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  )
}

const PaymentInfoSection = ({
  control,
  errors,
  paymentMethods,
  loading,
  selectedMethod,
  raffle,
}) => {
  const { selectedCountry } = useCountryStore()
  const [filteredMethods, setFilteredMethods] = useState([])
  const [customFieldValues, setCustomFieldValues] = useState({})
  
  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedMethod
  )
  
  // Filtrar métodos de pago por país seleccionado
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0) {
      const filtered = paymentMethods.filter(method => {
        // Si el método no tiene países específicos, está disponible para todos
        if (!method.countries || method.countries.length === 0) return true
        // Si tiene países específicos, verificar si el país seleccionado está incluido
        return method.countries.includes(selectedCountry)
      })
      setFilteredMethods(filtered)
    }
  }, [paymentMethods, selectedCountry])
  
  // Manejar cambios en campos personalizados
  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  return (
    <div className='space-y-6 bg-gradient-to-br from-black/40 to-primary-500/5 p-6 rounded-xl border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(140,82,255,0.15)]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent flex items-center gap-2'>
          <CreditCard className='w-5 h-5 text-primary-500' />
          Métodos de Pago
        </h2>
      </div>

      <div className='space-y-4'>
        {/* Método de Pago - Visualización en tarjetas con imágenes */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
            <CreditCard className='w-4 h-4 text-primary-500' />
            Selecciona un método de pago:
          </label>
          
          {loading ? (
            <div className='flex items-center justify-center p-6 bg-black/40 rounded-lg border border-primary-500/10'>
              <Loader2 className='h-6 w-6 animate-spin text-primary-500 mr-2' />
              <span className='text-gray-400'>Cargando métodos de pago...</span>
            </div>
          ) : filteredMethods.length === 0 ? (
            <div className='flex flex-col items-center justify-center p-6 bg-black/40 rounded-lg border border-primary-500/10'>
              <AlertCircle className='h-8 w-8 text-primary-500/70 mb-2' />
              <p className='text-gray-300 text-center'>No hay métodos de pago disponibles para {selectedCountry}</p>
            </div>
          ) : (
            <Controller
              name='paymentMethod'
              control={control}
              rules={{ required: 'Debes seleccionar un método de pago' }}
              render={({ field }) => (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {filteredMethods.map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => field.onChange(method.id)}
                      className={`relative flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${field.value === method.id 
                        ? 'bg-primary-500/10 border-primary-500/40 shadow-[0_0_10px_rgba(140,82,255,0.15)]' 
                        : 'bg-black/40 border-gray-700/50 hover:border-primary-500/30'}`}
                    >
                      <div className='w-full h-20 relative mb-2 rounded-md overflow-hidden bg-black/50 flex items-center justify-center'>
                        {method.imageUrl ? (
                          <Image 
                            src={method.imageUrl} 
                            alt={method.name}
                            width={80}
                            height={80}
                            className='object-contain'
                            unoptimized
                          />
                        ) : (
                          <CreditCardIcon className='w-10 h-10 text-primary-500/50' />
                        )}
                      </div>
                      <span className={`text-sm font-medium text-center ${field.value === method.id ? 'text-primary-300' : 'text-gray-300'}`}>
                        {method.name}
                      </span>
                      {field.value === method.id && (
                        <div className='absolute top-2 right-2 w-3 h-3 bg-primary-500 rounded-full'></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            />
          )}
          {errors.paymentMethod && (
            <p className='text-secondary-400 text-sm'>
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Información del método de pago */}
        {selectedPaymentMethod && (
          <div className='flex flex-col gap-4 p-3 rounded-lg bg-gradient-to-br from-primary-500/10 to-black/40 border border-primary-500/20'>
            <div className='flex items-center gap-2'>
              <Info className='w-5 h-5 text-primary-400' />
              <h3 className='text-lg font-semibold text-primary-400'>
                Información de {selectedPaymentMethod.name}
              </h3>
            </div>
            <div className='space-y-2'>
              {selectedPaymentMethod.name && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-primary-500/10'>
                  <span className='text-gray-400'>Nombre del método:</span>
                  <CopyButton text={selectedPaymentMethod.name} label={selectedPaymentMethod.name} />
                </div>
              )}
              {selectedPaymentMethod.identity && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-primary-500/10'>
                  <span className='text-gray-400'>Cédula de Identidad:</span>
                  <CopyButton text={selectedPaymentMethod.identity} label={selectedPaymentMethod.identity} />
                </div>
              )}
              {selectedPaymentMethod.bank && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-primary-500/10'>
                  <span className='text-gray-400'>Banco:</span>
                  <CopyButton text={selectedPaymentMethod.bank} label={selectedPaymentMethod.bank} />
                </div>
              )}
              {selectedPaymentMethod.bankCode && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-primary-500/10'>
                  <span className='text-gray-400'>Código del Banco:</span>
                  <CopyButton text={selectedPaymentMethod.bankCode} label={selectedPaymentMethod.bankCode} />
                </div>
              )}
              {selectedPaymentMethod.email && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-primary-500/10'>
                  <span className='text-gray-400'>Correo electrónico:</span>
                  <CopyButton text={selectedPaymentMethod.email} label={selectedPaymentMethod.email} />
                </div>
              )}
              {selectedPaymentMethod.contactName && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-primary-500/10'>
                  <span className='text-gray-400'>Nombre de contacto:</span>
                  <CopyButton text={selectedPaymentMethod.contactName} label={selectedPaymentMethod.contactName} />
                </div>
              )}
              {selectedPaymentMethod.phone && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-primary-500/10'>
                  <span className='text-gray-400'>Teléfono:</span>
                  <CopyButton text={selectedPaymentMethod.phone} label={selectedPaymentMethod.phone} />
                </div>
              )}
            </div>
          </div>
        )}
        {/* Referencia de Pago */}
        {selectedMethod && (
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
              <Receipt className='w-4 h-4 text-primary-500' />
              Referencia de Pago
            </label>
            <Controller
              name='paymentReference'
              control={control}
              rules={{
                required: 'La referencia de pago es requerida',
                minLength: {
                  value: 6,
                  message: 'La referencia debe tener al menos 6 caracteres',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  className='bg-black/50 border-gray-700/50 focus-visible:ring-primary-500/50 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors'
                  placeholder='Número de referencia o ID de transacción'
                />
              )}
            />
            {errors.paymentReference && (
              <p className='text-secondary-400 text-sm'>
                {errors.paymentReference.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentInfoSection

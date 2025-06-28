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
    <div className='space-y-6 bg-gradient-to-br from-black/40 to-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent flex items-center gap-2'>
          <CreditCard className='w-5 h-5 text-amber-500' />
          Métodos de Pago
        </h2>
      </div>

      <div className='space-y-4'>
        {/* Método de Pago - Visualización en tarjetas con imágenes */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
            <CreditCard className='w-4 h-4 text-amber-500' />
            Selecciona un método de pago:
          </label>
          
          {loading ? (
            <div className='flex items-center justify-center p-6 bg-black/40 rounded-lg border border-amber-500/10'>
              <Loader2 className='h-6 w-6 animate-spin text-amber-500 mr-2' />
              <span className='text-gray-400'>Cargando métodos de pago...</span>
            </div>
          ) : filteredMethods.length === 0 ? (
            <div className='flex flex-col items-center justify-center p-6 bg-black/40 rounded-lg border border-amber-500/10'>
              <AlertCircle className='h-8 w-8 text-amber-500/70 mb-2' />
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
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
                        : 'bg-black/40 border-gray-700/50 hover:border-amber-500/30'}`}
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
                          <CreditCardIcon className='w-10 h-10 text-amber-500/50' />
                        )}
                      </div>
                      <span className={`text-sm font-medium text-center ${field.value === method.id ? 'text-amber-300' : 'text-gray-300'}`}>
                        {method.name}
                      </span>
                      {field.value === method.id && (
                        <div className='absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full'></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            />
          )}
          {errors.paymentMethod && (
            <p className='text-red-400 text-sm'>
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Información del método de pago */}
        {selectedPaymentMethod && (
          <div className='flex flex-col gap-4 p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-black/40 border border-amber-500/20'>
            <div className='flex items-center gap-2'>
              <Info className='w-5 h-5 text-amber-400' />
              <h3 className='text-lg font-semibold text-amber-400'>
                Información de {selectedPaymentMethod.name}
              </h3>
            </div>

            {selectedPaymentMethod.instructions && (
              <div className='text-sm text-gray-300 p-3 bg-black/30 rounded-lg border border-amber-500/10'>
                <p>{selectedPaymentMethod.instructions}</p>
              </div>
            )}

            <div className='space-y-2'>
              {/* Mostrar información básica del método de pago */}
              {selectedPaymentMethod.accountHolder && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-amber-500/10'>
                  <span className='text-gray-400'>Titular:</span>
                  <CopyButton text={selectedPaymentMethod.accountHolder} label={selectedPaymentMethod.accountHolder} />
                </div>
              )}
              {selectedPaymentMethod.accountNumber && (
                <div className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-amber-500/10'>
                  <span className='text-gray-400'>Cuenta:</span>
                  <CopyButton text={selectedPaymentMethod.accountNumber} label={selectedPaymentMethod.accountNumber} />
                </div>
              )}
              
              {/* Mostrar campos personalizados si existen */}
              {selectedPaymentMethod.customFields && selectedPaymentMethod.customFields.length > 0 && (
                <div className='mt-3 pt-3 border-t border-amber-500/10'>
                  <h4 className='text-sm font-medium text-amber-300 mb-2'>Información adicional</h4>
                  <div className='space-y-2'>
                    {selectedPaymentMethod.customFields.map(field => (
                      <div key={field.id} className='flex flex-col md:flex-row justify-between items-center p-2 rounded bg-black/20 border border-amber-500/10'>
                        <span className='text-gray-400'>{field.label}:</span>
                        {field.value ? (
                          <CopyButton text={field.value} label={field.value} />
                        ) : (
                          <span className='text-gray-300'>-</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Campos personalizados para que el usuario complete */}
              {selectedPaymentMethod.customFields && selectedPaymentMethod.customFields.filter(f => f.userInput).length > 0 && (
                <div className='mt-4 pt-4 border-t border-amber-500/10 space-y-3'>
                  <h4 className='text-sm font-medium text-amber-300'>Información requerida</h4>
                  {selectedPaymentMethod.customFields.filter(f => f.userInput).map(field => (
                    <div key={field.id} className='space-y-1'>
                      <label className='text-xs font-medium text-gray-300'>
                        {field.label} {field.required && <span className='text-red-400'>*</span>}
                      </label>
                      <Controller
                        name={`customField_${field.id}`}
                        control={control}
                        rules={field.required ? { required: `${field.label} es requerido` } : {}}
                        render={({ field: inputField }) => (
                          <Input
                            {...inputField}
                            type={field.type || 'text'}
                            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
                            className='bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors'
                            onChange={(e) => {
                              inputField.onChange(e)
                              handleCustomFieldChange(field.id, e.target.value)
                            }}
                          />
                        )}
                      />
                      {errors[`customField_${field.id}`] && (
                        <p className='text-red-400 text-xs'>
                          {errors[`customField_${field.id}`].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Referencia de Pago */}
        {selectedMethod && (
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
              <Receipt className='w-4 h-4 text-amber-500' />
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
                  className='bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors'
                  placeholder='Número de referencia o ID de transacción'
                />
              )}
            />
            {errors.paymentReference && (
              <p className='text-red-400 text-sm'>
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

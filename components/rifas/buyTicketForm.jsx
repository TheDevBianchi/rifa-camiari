'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pendingPurchaseSchema } from '@/schema/pendingPurchaseSchema'
import { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/use-settings-store'
import { useDollarPrice } from '@/hooks/useDollarPrice'
import PersonalInfoSection from './PersonalInfoSection'
import PaymentInfoSection from './PaymentInfoSection'
import TicketSelectionSection from './TicketSelectionSection'
import FloatingTotal from './FloatingTotal'
import SuccessModal from './success-modal'
import ConfirmationModal from './confirmation-modal'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCountryStore } from '@/store/use-country-store'

const BuyTicketForm = ({ raffle, onSubmit }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [randomTicketCount, setRandomTicketCount] = useState(0)
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { dollarPrice, getDollarPrice } = useDollarPrice()
  const { selectedCountry } = useCountryStore()
  
  // Estado para las promociones
  const [promotionData, setPromotionData] = useState({
    selectedPromotion: null,
    regularTotal: 0,
    discountedTotal: 0,
    savings: 0
  })

  const { paymentMethods, getPaymentMethods, loading } = useSettingsStore()

  const form = useForm({
    resolver: zodResolver(pendingPurchaseSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      paymentMethod: '',
      paymentReference: '',
      selectedTickets: [],
    },
  })

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form
  const selectedTickets = watch('selectedTickets') || []
  const selectedMethod = watch('paymentMethod')

  useEffect(() => {
    getPaymentMethods()
    getDollarPrice()
  }, [getPaymentMethods, getDollarPrice])

  const validateForm = (data) => {
    setError(null)
    
    try {
      const ticketsRequested = data.selectedTickets.length
      const availableTickets = raffle.totalTickets - 
        (raffle.soldTickets?.length || 0) - 
        (raffle.reservedTickets?.length || 0)

      if (ticketsRequested > availableTickets) {
        throw new Error(`No hay suficientes tickets disponibles. Solo quedan ${availableTickets} tickets.`)
      }
      
      // Agregar información de promoción a los datos enviados
      const dataWithPromotion = {
        ...data,
        promotion: promotionData.selectedPromotion ? {
          id: promotionData.selectedPromotion.id,
          name: promotionData.selectedPromotion.name,
          discountType: promotionData.selectedPromotion.discountType,
          regularTotal: promotionData.regularTotal,
          discountedTotal: promotionData.discountedTotal,
          savings: promotionData.savings
        } : null
      }
      
      return dataWithPromotion
    } catch (error) {
      console.error('Error de validación:', error)
      setError(error.message || 'Ha ocurrido un error al validar tu compra')
      toast.error('Error de validación', {
        description: error.message || 'Ha ocurrido un error al validar tu compra',
      })
      return null
    }
  }

  const handleSubmit = async (data) => {
    const validatedData = validateForm(data)
    if (!validatedData) return
    
    setFormData(validatedData)
    setShowConfirmationModal(true)
  }
  
  const handleConfirmPurchase = async () => {
    if (!formData) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await onSubmit(formData)
      
      if (result) {
        setShowConfirmationModal(false)
        form.reset()
        setRandomTicketCount(0)
        setShowSuccessModal(true)
        setSubmittedData(formData)
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error)
      setError(error.message || 'Ha ocurrido un error al procesar tu compra')
      setShowConfirmationModal(false)
      toast.error('Error al procesar la compra', {
        description: error.message || 'Ha ocurrido un error al procesar tu compra',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const ticketCount = raffle.randomTickets
    ? randomTicketCount
    : selectedTickets.length

  const availableTickets = raffle.totalTickets - (raffle.soldTickets?.length || 0) - (raffle.reservedTickets?.length || 0)

  if (availableTickets === 0) {
    return (
      <div className='p-6 text-center'>
        <div className='bg-amber-500/10 border border-amber-500/20 rounded-lg p-6'>
          <h3 className='text-xl font-bold text-amber-400 mb-2'>
            Rifa Agotada
          </h3>
          <p className='text-gray-300'>
            Lo sentimos, todos los tickets de esta rifa han sido vendidos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className='space-y-6 p-5 text-gray-200'>
      {error && (
        <div className='flex items-start gap-2 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20'>
          <AlertCircle className='w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0' />
          <p className='text-sm text-gray-300'>{error}</p>
        </div>
      )}
      <PersonalInfoSection control={control} errors={errors} />
      <TicketSelectionSection
        raffle={raffle}
        control={control}
        errors={errors}
        randomTicketCount={randomTicketCount}
        setRandomTicketCount={setRandomTicketCount}
        selectedTickets={selectedTickets}
        showAllTickets={showAllTickets}
        setShowAllTickets={setShowAllTickets}
        setValue={setValue}
        dollarPrice={dollarPrice}
        setPromotionData={setPromotionData}
      />
      <PaymentInfoSection
        control={control}
        errors={errors}
        paymentMethods={paymentMethods}
        loading={loading}
        selectedMethod={selectedMethod}
        raffle={raffle}
      />
      <FloatingTotal
        ticketCount={ticketCount}
        raffle={raffle}
        isSubmitting={form.formState.isSubmitting || isSubmitting}
        minTickets={raffle.minTickets}
        selectedPromotion={promotionData.selectedPromotion}
        regularTotal={promotionData.regularTotal}
        discountedTotal={promotionData.discountedTotal}
        savings={promotionData.savings}
      />
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmPurchase}
        purchaseData={formData}
        raffle={raffle}
        paymentMethod={paymentMethods.find(method => method.id === selectedMethod)}
        isSubmitting={isSubmitting}
      />
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setSubmittedData(null)
        }}
        purchaseData={submittedData}
        raffle={raffle}
      />
    </form>
  )
}

export default BuyTicketForm

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Ticket, Receipt, CreditCard, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/store/use-settings-store'
import CountryPrice from '@/components/ui/country-price'

const SuccessModal = ({ isOpen, onClose, purchaseData, raffle }) => {
  const paymentMethod = useSettingsStore((state) =>
    state.paymentMethods.find(
      (method) => method.id === purchaseData?.paymentMethod
    )
  )

  if (!purchaseData) return null

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Acabo de reservar ${
      purchaseData?.selectedTickets?.length
    } tickets para la rifa ${raffle?.title}:
    \n\nTotal pagado: $${(
      purchaseData?.selectedTickets?.length * raffle?.price
    ).toFixed(2)} USD
    \n\nMétodo de pago: ${paymentMethod?.name}
    \n\nReferencia: ${purchaseData.paymentReference}
    `
  )

  const whatsappUrl = `https://wa.me/584248719024?text=${whatsappMessage}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Modal */}
          <motion.div
            role='dialog'
            aria-labelledby='modal-title'
            aria-modal='true'
            className='fixed left-1/2 top-1/2 z-50 w-full max-w-md'
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: 100 }}>
            <div className='relative bg-gradient-to-br from-black to-gray-900 rounded-lg p-6 shadow-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]'>
              {/* Close button */}
              <button
                onClick={() => onClose()}
                className='absolute right-4 top-4 text-gray-400 hover:text-amber-400 transition-colors'
                aria-label='Cerrar modal'>
                <X className='h-5 w-5' />
              </button>

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className='mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/30'>
                <Check className='h-8 w-8 text-amber-500' />
              </motion.div>

              <div className='text-center mb-6'>
                <h2
                  id='modal-title'
                  className='text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-2'>
                  ¡Reserva Exitosa!
                </h2>
                <p className='text-gray-300 text-sm'>
                  Tu reserva se ha realizado correctamente, envía tu comprobante
                  de pago a través del botón de WhatsApp.
                </p>
              </div>

              <div className='space-y-4 mb-6'>
                {/* Resumen de tickets */}
                <div className='bg-black/40 p-4 rounded-lg border border-amber-500/10'>
                  <h3 className='font-medium text-amber-400 mb-2 flex items-center gap-2'>
                    <Ticket className='h-4 w-4' />
                    Detalles de la compra
                  </h3>
                  <div className='space-y-2 text-gray-300'>
                    {!raffle.randomTickets ? (
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Tickets seleccionados:</span>
                        <span className='font-medium text-white'>{purchaseData.selectedTickets?.join(', ')}</span>
                      </div>
                    ) : (
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Cantidad de tickets:</span>
                        <span className='font-medium text-white'>{purchaseData.selectedTickets?.length}</span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Precio por ticket:</span>
                      <CountryPrice amount={raffle.price} className="font-medium text-white" />
                    </div>
                    <div className='flex justify-between pt-2 border-t border-gray-800'>
                      <span className='text-gray-400'>Total:</span>
                      <CountryPrice 
                        amount={purchaseData.selectedTickets.length * raffle.price} 
                        className="font-medium text-amber-400" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Método de pago */}
                <div className='bg-black/40 p-4 rounded-lg border border-amber-500/10'>
                  <h3 className='font-medium text-amber-400 mb-2 flex items-center gap-2'>
                    <CreditCard className='h-4 w-4' />
                    Método de pago
                  </h3>
                  <div className='space-y-2 text-gray-300'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Método:</span>
                      <span className='font-medium text-white'>{paymentMethod?.name}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Referencia:</span>
                      <span className='font-medium text-white'>{purchaseData.paymentReference}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <a
                  href={whatsappUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2'>
                  Contactar por WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onClose()}
                  className='flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium'>
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SuccessModal

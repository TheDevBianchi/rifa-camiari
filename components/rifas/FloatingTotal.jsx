import { motion } from 'framer-motion'
import { Tag, Percent, ArrowDownCircle, Package, DollarSign } from 'lucide-react'
import { useCountryStore } from '@/store/use-country-store'
import { useDollarPrice } from '@/hooks/useDollarPrice'
import CountryPrice from '@/components/ui/country-price'

const FloatingTotal = ({ 
  ticketCount,  
  isSubmitting, 
  minTickets,
  selectedPromotion,
  regularTotal,
  discountedTotal,
  savings,
  raffle
}) => {

  return (
    <motion.div
      className='bg-black/80 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex flex-col space-y-4'>
        {/* Promoción aplicada */}
        {selectedPromotion && (
          <div className='flex items-center justify-between bg-amber-900/20 p-3 rounded-lg border border-amber-500/20'>
            <div className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-amber-400' />
              <span className='text-sm font-medium text-amber-300'>Promoción aplicada:</span>
              <span className='text-sm font-medium text-white'>{selectedPromotion.name}</span>
            </div>
            <div className='flex items-center gap-1'>
              {selectedPromotion.discountType === 'percentage' && (
                <Percent className='w-4 h-4 text-amber-400' />
              )}
              {selectedPromotion.discountType === 'lower_cost' && (
                <ArrowDownCircle className='w-4 h-4 text-amber-400' />
              )}
              {selectedPromotion.discountType === 'package' && (
                <Package className='w-4 h-4 text-amber-400' />
              )}
            </div>
          </div>
        )}
        
        {/* Detalles del precio */}
        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            {selectedPromotion && (
              <div className='flex items-center'>
                <span className='text-sm text-gray-400 line-through mr-2'>
                  <CountryPrice amount={regularTotal} className="inline" />
                </span>
                <span className='text-xs bg-amber-900/30 text-amber-300 px-2 py-0.5 rounded-full'>
                  Ahorras <CountryPrice amount={savings} className="inline" />
                </span>
              </div>
            )}
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <span className='text-sm font-medium text-gray-300 mr-2'>Total:</span>
                <span className='text-lg font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>
                  <CountryPrice amount={discountedTotal} className="inline" />
                </span>
              </div>
              <div className='flex items-center text-xs text-gray-400 mt-1'>
                <DollarSign className='w-3 h-3 mr-1' />
                <span>Precio base: ${discountedTotal.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
          
          <div className='flex items-center space-x-2'>
            <button
              type='submit'
              disabled={isSubmitting || ticketCount < minTickets}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isSubmitting || ticketCount < minTickets
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300'
              }`}
            >
              {isSubmitting ? 'Comprando...' : 'Comprar'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FloatingTotal

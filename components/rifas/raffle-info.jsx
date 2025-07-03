import { DollarSign, Tag } from 'lucide-react'
import React from 'react'
import { PromoDisplay } from './PromoDisplay'

function RaffleInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles de la Rifa */}
          <div className="bg-black/40 p-5 rounded-xl border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(140,82,255,0.1)]">
            <h3 className="text-xl font-bold text-primary-400 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-400" />
              Detalles de la Rifa
            </h3>
            <div className="space-y-3">
              <p className="flex justify-between items-center">
                <span className="text-white">Precio por ticket:</span>
                <span className="text-xl font-bold text-primary-400">
                  ${raffle.price} USD
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Tickets mínimos:</span>
                <span className="text-gray-300">{raffle.minTickets}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Total de tickets:</span>
                <span className="text-gray-300">{raffle.totalTickets}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Tickets vendidos:</span>
                <span className="text-gray-300">{raffle.soldTickets?.length || 0}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Tickets disponibles:</span>
                <span className="text-gray-300">{raffle.availableNumbers}</span>
              </p>

              {/* Promociones disponibles */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <h4 className="text-lg font-medium text-primary-400 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary-400" />
                  Promociones Disponibles
                </h4>
                <PromoDisplay raffleId={raffle.id} ticketPrice={raffle.price} />
              </div>
            </div>
          </div>

        </div>
  )
}

export default RaffleInfo
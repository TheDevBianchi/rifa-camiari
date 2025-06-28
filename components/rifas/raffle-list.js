import React, { useState } from 'react'
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'
import { DeleteRaffleModal } from './delete-raffle-modal'
import { useRaffleStore } from '@/store/use-rifa-store'
import { toast } from 'sonner'
import { Trash2, Ticket, DollarSign, Calendar, ArrowRight, Users } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { ReserveTicketsButton } from '../dashboard/reserve-tickets-button'
import CountryPrice from '@/components/ui/country-price'

function RaffleList ({ raffles }) {
  const [selectedRaffle, setSelectedRaffle] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteRaffle = useRaffleStore(state => state.deleteRaffle)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteRaffle(selectedRaffle.id)
      toast.success('Rifa eliminada exitosamente', {
        description: 'La rifa y todos sus recursos han sido eliminados.'
      })
    } catch (error) {
      toast.error('Error al eliminar la rifa', {
        description:
          error.message || 'Ha ocurrido un error al intentar eliminar la rifa.'
      })
    } finally {
      setIsDeleting(false)
      setSelectedRaffle(null)
    }
  }

  if (!raffles.length) {
    return (
      <div className='text-center py-8 text-gray-400' role='status'>
        No hay rifas creadas aún.
      </div>
    )
  }

  return (
    <>
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        role='list'
        aria-label='Lista de rifas disponibles'
      >
        {raffles.map(raffle => {
          const soldTickets = raffle.soldTickets?.length || 0
          const reservedTickets = raffle.reservedTickets?.length || 0
          const progress =
            ((soldTickets + reservedTickets) / raffle.totalTickets) * 100

          return (
            <div
              key={raffle.id}
              className='bg-gradient-to-br from-black to-gray-900 rounded-lg p-6 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all duration-300 border border-amber-500/10 hover:border-amber-500/30'
              role='listitem'
            >
              <h3 className='text-lg font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-2'>
                {raffle.title}
              </h3>

              <div className='space-y-3 text-gray-300'>
                <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-1'>
                    <DollarSign className='w-3.5 h-3.5 text-amber-400' />
                    Precio:
                  </span>
                  <CountryPrice amount={raffle.price} className='text-amber-400 font-semibold' />
                </div>

                <div className='flex items-center gap-2'>
                  <Ticket className='w-4 h-4 text-amber-400' />
                  <div className='flex-1'>
                    <Progress value={progress} className='h-2 bg-black/60' />
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-2 text-sm'>
                  <div className='text-center bg-black/40 p-2 rounded-lg border border-gray-800/50'>
                    <span className='block text-gray-400'>Disponibles</span>
                    <span className='font-semibold text-gray-200'>
                      {raffle.totalTickets - soldTickets - reservedTickets}
                    </span>
                  </div>
                  <div className='text-center bg-black/40 p-2 rounded-lg border border-amber-500/20'>
                    <span className='block text-gray-400'>Reservados</span>
                    <span className='font-semibold text-amber-400'>
                      {reservedTickets}
                    </span>
                  </div>
                  <div className='text-center bg-black/40 p-2 rounded-lg border border-green-500/20'>
                    <span className='block text-gray-400'>Vendidos</span>
                    <span className='font-semibold text-green-400'>
                      {soldTickets}
                    </span>
                  </div>
                </div>

                <div className='text-sm text-gray-400 flex items-center gap-1'>
                  <Calendar className='w-3.5 h-3.5' />
                  Creada el: {formatDate(raffle.createdAt)}
                </div>
                
                <div className='text-sm text-gray-400 flex items-center gap-1'>
                  <Users className='w-3.5 h-3.5' />
                  Participantes: {raffle.users?.length || 0}
                </div>
              </div>

              <div className='mt-4 flex justify-between items-center gap-3'>
                <Link
                  href={`rifas/${raffle.id}`}
                  className='flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-md hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2'
                  aria-label={`Ver detalles de la rifa ${raffle.title}`}
                >
                  Ver Rifa
                  <ArrowRight className='w-4 h-4' />
                </Link>

                <div className='flex gap-2'>
                  {raffle.randomTickets ? null : (
                    <ReserveTicketsButton raffle={raffle} />
                  )}
                  <button
                    onClick={() => setSelectedRaffle(raffle)}
                    className='p-2 text-red-400 hover:bg-red-950/50 rounded-full transition-colors border border-red-500/30 hover:border-red-500/50'
                    aria-label={`Eliminar rifa ${raffle.title}`}
                  >
                    <Trash2 className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <DeleteRaffleModal
        isOpen={!!selectedRaffle}
        onClose={() => setSelectedRaffle(null)}
        onConfirm={handleDelete}
        raffle={selectedRaffle}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default RaffleList

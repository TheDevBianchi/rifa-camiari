'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import TicketVerificationModal from './ticket-verification-modal'
import { PromoDisplay } from './PromoDisplay'

export function RaffleCardSkeleton () {
  return (
    <div className='raffle-card-skeleton'>
      <div className='relative h-56 bg-gray-700/50 animate-pulse' />
      <div className='p-6 space-y-4'>
        <div className='h-7 bg-gray-700/50 rounded-md w-3/4 animate-pulse' />
        <div className='h-4 bg-gray-700/50 rounded-md w-full animate-pulse' />
        <div className='flex justify-between items-center pt-2'>
          <div className='h-6 bg-gray-700/50 rounded-md w-24 animate-pulse' />
          <div className='h-10 bg-gray-700/50 rounded-md w-32 animate-pulse' />
        </div>
      </div>
    </div>
  )
}

export function RaffleCard ({ raffle }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const images = raffle.images

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <div className='group relative bg-[#111111] rounded-xl border border-amber-500/10 hover:border-amber-500/30 overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
      {/* Ribbon */}
      <div className='absolute top-4 right-0 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium py-1 px-4 text-sm shadow-md transform skew-x-[-15deg]'>
        <span className='transform skew-x-[15deg] inline-block'>Disponible</span>
      </div>
      
      <div className='relative'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex'>
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className='flex-[0_0_100%] min-w-0'>
                  <div className='relative h-56 transition-transform duration-500 group-hover:scale-105'>
                    <Image
                      src={`${image}`}
                      alt={`${raffle.title || 'Rifa'} - Imagen ${index + 1}`}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent'></div>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex-[0_0_100%] min-w-0'>
                <div className='relative h-56 bg-gray-800 flex items-center justify-center'>
                  <span className='text-gray-400'>
                    No hay imágenes disponibles
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={scrollPrev}
          className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-amber-500/70 transition-colors opacity-0 group-hover:opacity-100 z-10'
        >
          <ChevronLeft className='w-5 h-5 text-white' />
        </button>
        <button
          onClick={scrollNext}
          className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-amber-500/70 transition-colors opacity-0 group-hover:opacity-100 z-10'
        >
          <ChevronRight className='w-5 h-5 text-white' />
        </button>

        {/* Indicators */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
          {raffle.images &&
            raffle.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'bg-amber-500 w-3'
                    : 'bg-white/50 hover:bg-amber-400/80'
                }`}
              />
            ))}
        </div>
      </div>

      <div className='flex flex-col p-5 space-y-4'>
        <h3 className='text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1'>
          {raffle.title}
        </h3>
        <p className='text-gray-400 text-sm line-clamp-2'>{raffle.description}</p>
        
        <div className='flex justify-between items-center pt-2'>
          <div className='flex flex-col'>
            <span className='text-gray-400 text-xs'>Precio:</span>
            <span className='text-amber-400 font-bold text-lg'>
              ${raffle.price} USD
            </span>
          </div>
          <div className='flex flex-col items-end'>
            <span className='text-gray-400 text-xs'>Tickets:</span>
            <span className='text-white font-medium text-sm'>
              {raffle.soldTickets?.length || 0}/{raffle.totalTickets}
            </span>
          </div>
        </div>
        
        {/* Mostrar promociones activas */}
        <PromoDisplay raffleId={raffle.id} ticketPrice={raffle.price} />
        
        <div className='flex gap-3 pt-2'>
          <Link
            href={`/rifa/${raffle.id}`}
            className='
              flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 
              text-black py-2.5 px-4 rounded-lg font-medium transition-all duration-300 
              text-center hover:cursor-pointer flex items-center justify-center
            '
          >
            <Tag className='w-4 h-4 mr-2' />
            Juega y Gana
          </Link>
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className='
              bg-black border border-amber-500/50 text-amber-400 py-2.5 px-4 rounded-lg font-medium
              hover:bg-amber-500/10 transition-all duration-300
            '
          >
            Verificar
          </button>
        </div>
        <TicketVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          raffleId={raffle.id}
        />
      </div>
    </div>
  )
}

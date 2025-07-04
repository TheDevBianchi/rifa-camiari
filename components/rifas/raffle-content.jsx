import { RaffleDetails } from './raffle-details'
import RaffleForm from './buyTicketForm'
import RaffleDate from './raffle-date'

export function RaffleContent ({ raffle, onSubmit }) {
  return (
    <main className='container mx-auto px-4 py-12 md:py-16'>
      <div className='max-w-5xl mx-auto space-y-12'>
        {/* Título de la sección */}
        <div className='text-center mt-20'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>
            <span className='bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent'>Detalles de la Rifa</span>
          </h1>
          <p className='text-gray-400 max-w-2xl mx-auto'>Revisa los detalles y selecciona tus tickets para participar.</p>
        </div>
        
        {/* Contenido principal */}
        <div className='grid grid-cols-1 gap-8'>
          <div className='lg:col-span-2'>
            <RaffleDetails raffle={raffle} />
          </div>
          <div className='lg:col-span-1 w-full'>
            <div className='bg-[#111111] rounded-xl border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(140,82,255,0.1)] overflow-hidden sticky top-24'>
              <div className='bg-gradient-to-r from-primary-500 to-primary-600 py-3 px-4'>
                <h2 className='text-white font-bold text-lg text-center'>Comprar Tickets</h2>
              </div>
              <RaffleForm raffle={raffle} onSubmit={onSubmit} />
            </div>
          </div>
        </div>
          <RaffleDate raffle={raffle} />
      </div>
    </main>
  )
}

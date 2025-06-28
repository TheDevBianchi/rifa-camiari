import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { RafflesSection } from '@/components/rifas/RafflesSection'
import Image from 'next/image'
import Link from 'next/link'
import { Gift, Award, Clock, CheckCircle, TrendingUp } from 'lucide-react'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-black text-white'>
      <Header />

      {/* Sección de Rifas */}
      <main>
        <section id='rifas' className='bg-[#111111] py-16'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                <span className='bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>Rifas Disponibles</span>
              </h2>
              <p className='text-gray-400 max-w-2xl mx-auto'>Participa en nuestras rifas exclusivas y gana increíbles premios.</p>
            </div>
            
            <RafflesSection />
          </div>
        </section>

        {/* Sección de Características */}
        <section className='py-16 bg-black'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                <span className='bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>¿Por qué elegirnos?</span>
              </h2>
              <p className='text-gray-400 max-w-2xl mx-auto'>Descubre las ventajas de participar en nuestras rifas.</p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              <div className='bg-[#111111] p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
                <div className='bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto'>
                  <Award className='w-6 h-6 text-black' />
                </div>
                <h3 className='text-xl font-bold text-center text-amber-400 mb-2'>Premios Exclusivos</h3>
                <p className='text-gray-400 text-center'>Ofrecemos los mejores premios del mercado con valores reales.</p>
              </div>
              
              <div className='bg-[#111111] p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
                <div className='bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto'>
                  <CheckCircle className='w-6 h-6 text-black' />
                </div>
                <h3 className='text-xl font-bold text-center text-amber-400 mb-2'>100% Confiable</h3>
                <p className='text-gray-400 text-center'>Transparencia total en nuestros sorteos y entrega de premios garantizada.</p>
              </div>
              
              <div className='bg-[#111111] p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
                <div className='bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto'>
                  <Clock className='w-6 h-6 text-black' />
                </div>
                <h3 className='text-xl font-bold text-center text-amber-400 mb-2'>Sorteos Frecuentes</h3>
                <p className='text-gray-400 text-center'>Realizamos sorteos regularmente para que tengas más oportunidades de ganar.</p>
              </div>
              
              <div className='bg-[#111111] p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
                <div className='bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto'>
                  <TrendingUp className='w-6 h-6 text-black' />
                </div>
                <h3 className='text-xl font-bold text-center text-amber-400 mb-2'>Mejores Probabilidades</h3>
                <p className='text-gray-400 text-center'>Limitamos la cantidad de tickets para aumentar tus probabilidades de ganar.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sección de CTA */}
        <section className='py-16 bg-[#111111] relative overflow-hidden'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 mix-blend-overlay'></div>
            <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent'></div>
            <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent'></div>
          </div>
          
          <div className='container mx-auto px-4 md:px-6 relative z-10'>
            <div className='max-w-4xl mx-auto text-center'>
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                <span className='bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>¿Listo para ganar?</span>
              </h2>
              <p className='text-gray-300 text-lg mb-8 max-w-2xl mx-auto'>
                No pierdas la oportunidad de participar en nuestras rifas y ganar increíbles premios. ¡Tu próximo premio te está esperando!
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link 
                  href='#rifas' 
                  className='bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium py-3 px-8 rounded-md transition-all duration-300 text-center'
                >
                  Participar Ahora
                </Link>
                <Link 
                  href='/como-jugar' 
                  className='border border-amber-500 text-amber-400 hover:bg-amber-500/10 font-medium py-3 px-8 rounded-md transition-all duration-300 text-center'
                >
                  Aprender Más
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage

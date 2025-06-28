import Image from 'next/image'
import Navbar from './navbar'

export default function Header() {
  return (
    <>
      <Navbar />
      <header className='pt-20 bg-black'>
        <div className='container mx-auto px-4 md:px-6'>
          {/* Hero Section */}
          <div className='flex flex-col md:flex-row items-center justify-between py-12 md:py-20'>
            <div className='w-full md:w-1/2 space-y-6 text-center md:text-left mb-8 md:mb-0'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold'>
                <span className='bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>Gana Grandes Premios</span>
                <br />
                <span className='text-white'>con Nuestras Rifas</span>
              </h1>
              <p className='text-gray-400 text-lg md:text-xl max-w-xl'>
                Participa en nuestras rifas exclusivas y ten la oportunidad de ganar increíbles premios con los mejores precios del mercado.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
                <a 
                  href='/rifas' 
                  className='bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium py-3 px-6 rounded-md transition-all duration-300 text-center'
                >
                  Ver Rifas Disponibles
                </a>
                <a 
                  href='/como-participar' 
                  className='border border-amber-500 text-amber-400 hover:bg-amber-500/10 font-medium py-3 px-6 rounded-md transition-all duration-300 text-center'
                >
                  Cómo Participar
                </a>
              </div>
            </div>
            <div className='w-full md:w-1/2 relative'>
              <div className='relative w-full max-w-md mx-auto'>
                {/* Efectos de fondo para las monedas */}
                <div className='absolute inset-0 bg-gradient-to-br from-amber-500/30 to-amber-700/30 rounded-full blur-3xl animate-pulse-slow'></div>
                <div className='absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-amber-600/20 rounded-full blur-2xl'></div>
                
                {/* Partículas doradas flotantes */}
                <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
                  <div className='absolute w-2 h-2 rounded-full bg-amber-300 animate-float-1 opacity-70' style={{left: '10%', top: '20%'}}></div>
                  <div className='absolute w-3 h-3 rounded-full bg-amber-400 animate-float-2 opacity-60' style={{left: '25%', top: '10%'}}></div>
                  <div className='absolute w-2 h-2 rounded-full bg-amber-500 animate-float-3 opacity-70' style={{left: '70%', top: '15%'}}></div>
                  <div className='absolute w-1 h-1 rounded-full bg-amber-300 animate-float-2 opacity-80' style={{left: '85%', top: '30%'}}></div>
                  <div className='absolute w-2 h-2 rounded-full bg-amber-400 animate-float-1 opacity-60' style={{left: '40%', top: '80%'}}></div>
                  <div className='absolute w-1 h-1 rounded-full bg-amber-500 animate-float-3 opacity-70' style={{left: '60%', top: '75%'}}></div>
                </div>
                
                {/* Contenedor de la imagen con máscara y efectos */}
                <div className='relative z-10 overflow-hidden rounded-full border-4 border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.3)] group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-700/20 group-hover:opacity-0 transition-opacity duration-700 z-20'></div>
                    <Image
                    src='https://cdn-icons-png.flaticon.com/512/2933/2933116.png'
                    alt='Premios de rifas'
                    width={500}
                    height={500}
                    className='relative z-10 object-cover w-full h-full transform scale-105 group-hover:scale-110 transition-all duration-700'
                    priority
                    />
                  {/* Overlay dorado para dar efecto de brillo */}
                  <div className='absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-700/20 mix-blend-overlay'></div>
                  
                  {/* Efecto de brillo al pasar el cursor */}
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-amber-400/10 to-amber-300/5 z-30 transition-opacity duration-700'></div>
                </div>
                
                {/* Badge de próximo sorteo con animación */}
                <div className='absolute -bottom-4 -right-4 bg-black border border-amber-500/50 rounded-lg p-4 shadow-[0_0_15px_rgba(245,158,11,0.2)] z-20 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300'>
                  <p className='text-amber-400 font-bold'>¡Próximo Sorteo!</p>
                  <p className='text-white text-sm'>1 de Junio, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className='w-full overflow-hidden'>
          <svg className='w-full h-16 md:h-24' viewBox='0 0 1440 74' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M0,37 C240,74 480,0 720,37 C960,74 1200,0 1440,37 L1440,74 L0,74 Z' fill='#111111'></path>
          </svg>
        </div>
      </header>
    </>  
  )
}

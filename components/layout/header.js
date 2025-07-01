import Image from 'next/image'
import Navbar from './navbar'

export default function Header() {
  return (
    <>
      <Navbar />
      <header className='relative pt-20'>
        {/* Fondo y superposición */}
        <div className="absolute top-0 left-0 w-full h-full bg-header-banner bg-cover bg-center"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>

        {/* Contenido sobre el fondo */}
        <div className="relative">
          <div className='container mx-auto px-4 md:px-6'>
            {/* Hero Section */}
            <div className='flex flex-col md:flex-row items-center justify-between py-12 md:py-20'>
              <div className='w-full md:w-1/2 space-y-6 text-center md:text-left mb-8 md:mb-0'>
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold'>
                  <span className='bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent'>Gana Grandes Premios</span>
                  <br />
                  <span className='text-white'>con Nuestras Rifas</span>
                </h1>
                <p className='text-gray-300 text-lg md:text-xl max-w-xl'>
                  Participa en nuestras rifas exclusivas y ten la oportunidad de ganar increíbles premios con los mejores precios del mercado.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
                  <a 
                    href='/rifas' 
                    className='bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 text-center'
                  >
                    Ver Rifas Disponibles
                  </a>
                  <a 
                    href='/como-participar' 
                    className='border border-primary-500 text-primary-400 hover:bg-primary-500/10 font-medium py-3 px-6 rounded-md transition-all duration-300 text-center'
                  >
                    Cómo Participar
                  </a>
                </div>
              </div>
              <div className='w-full md:w-1/2 relative'>
                <div className='relative w-full max-w-md mx-auto'>
                  {/* Efectos de fondo para las monedas */}
                  <div className='absolute inset-0 bg-gradient-to-br from-primary-500/30 to-primary-700/30 rounded-full blur-3xl animate-pulse-slow'></div>
                  <div className='absolute inset-0 bg-gradient-to-tr from-primary-400/20 to-primary-600/20 rounded-full blur-2xl'></div>
                  
                  {/* Partículas doradas flotantes */}
                  <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
                    <div className='absolute w-2 h-2 rounded-full bg-primary-300 animate-float-1 opacity-70' style={{left: '10%', top: '20%'}}></div>
                    <div className='absolute w-3 h-3 rounded-full bg-primary-400 animate-float-2 opacity-60' style={{left: '25%', top: '10%'}}></div>
                    <div className='absolute w-2 h-2 rounded-full bg-primary-500 animate-float-3 opacity-70' style={{left: '70%', top: '15%'}}></div>
                    <div className='absolute w-1 h-1 rounded-full bg-primary-300 animate-float-2 opacity-80' style={{left: '85%', top: '30%'}}></div>
                    <div className='absolute w-2 h-2 rounded-full bg-primary-400 animate-float-1 opacity-60' style={{left: '40%', top: '80%'}}></div>
                    <div className='absolute w-1 h-1 rounded-full bg-primary-500 animate-float-3 opacity-70' style={{left: '60%', top: '75%'}}></div>
                  </div>
                  
                  {/* Contenedor de la imagen con máscara y efectos */}
                  <div className='relative z-10 overflow-hidden rounded-full border-4 border-primary-500/30 shadow-[0_0_25px_rgba(140,82,255,0.3)] group'>
                    <div className='absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-700/20 group-hover:opacity-0 transition-opacity duration-700 z-20'></div>
                      <Image
                      src='/logo-transparente.webp'
                      alt='Logo de Rifas Camiari'
                      width={900}
                      height={900}
                      className='relative z-10 object-contain w-full h-full p-8'
                      priority
                      />
                    {/* Overlay dorado para dar efecto de brillo */}
                    <div className='absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-700/20 mix-blend-overlay'></div>
                    
                    {/* Efecto de brillo al pasar el cursor */}
                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-primary-400/10 to-primary-300/5 z-30 transition-opacity duration-700'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>  
  )
}

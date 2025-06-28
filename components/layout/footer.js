import Image from 'next/image'
import Link from 'next/link'

function Footer() {
  return (
    <footer className='bg-black border-t border-gray-900'>
      {/* Wave Divider */}
      <div className='w-full overflow-hidden transform rotate-180'>
        <svg className='w-full h-16 md:h-24' viewBox='0 0 1440 74' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M0,37 C240,74 480,0 720,37 C960,74 1200,0 1440,37 L1440,74 L0,74 Z' fill='#111111'></path>
        </svg>
      </div>
      
      <div className='container mx-auto px-4 md:px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12'>
          {/* Logo y descripción */}
          <div className='flex flex-col items-center md:items-start'>
            <div className='flex items-center mb-4'>
              <Image
                src='/logo-transparente.webp'
                alt='Logo Rifas Adrian'
                width={50}
                height={50}
                className='h-12 w-auto'
              />
              <span className='ml-2 text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>Rifas Adrian</span>
            </div>
            <p className='text-gray-400 text-center md:text-left mb-6'>
              Plataforma de rifas online con los mejores premios y las mejores oportunidades para ganar.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='https://www.facebook.com/profile.php?id=61574174905201'
                className='bg-black hover:bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 p-2 rounded-full transition-all duration-300'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src='/facebook.svg' alt='Facebook' width={24} height={24} />
              </Link>
              <Link
                href='https://www.instagram.com/jirvin.flores'
                className='bg-black hover:bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 p-2 rounded-full transition-all duration-300'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src='/instagram.svg' alt='Instagram' width={24} height={24} />
              </Link>
              <Link
                href='https://wa.me/584248719024'
                className='bg-black hover:bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 p-2 rounded-full transition-all duration-300'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src='/whatsapp.svg' alt='WhatsApp' width={24} height={24} />
              </Link>
              <Link
                href='https://www.tiktok.com/@jirvinflores'
                className='bg-black hover:bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 p-2 rounded-full transition-all duration-300'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src='/tiktok.svg' alt='TikTok' width={24} height={24} />
              </Link>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h3 className='text-amber-400 font-bold text-lg mb-4'>Enlaces Rápidos</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='text-gray-300 hover:text-amber-300 transition-colors'>Inicio</Link>
              </li>
              <li>
                <Link href='/rifas' className='text-gray-300 hover:text-amber-300 transition-colors'>Rifas Disponibles</Link>
              </li>
              <li>
                <Link href='/como-participar' className='text-gray-300 hover:text-amber-300 transition-colors'>Cómo Participar</Link>
              </li>
              <li>
                <Link href='/contacto' className='text-gray-300 hover:text-amber-300 transition-colors'>Contacto</Link>
              </li>
              <li>
                <Link href='/dashboard' className='text-gray-300 hover:text-amber-300 transition-colors'>Mi Cuenta</Link>
              </li>
            </ul>
          </div>
          
          {/* Contacto */}
          <div>
            <h3 className='text-amber-400 font-bold text-lg mb-4'>Contacto</h3>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-amber-500 mr-2 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
                <span className='text-gray-300'>+58 424-871-9024</span>
              </li>
              <li className='flex items-start'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-amber-500 mr-2 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                <span className='text-gray-300'>contacto@rifasadrian.com</span>
              </li>
              <li className='flex items-start'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-amber-500 mr-2 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <span className='text-gray-300'>Caracas, Venezuela</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className='border-t border-gray-800 mt-12 pt-8 text-center'>
          <p className='text-gray-500'>
            &copy; {new Date().getFullYear()} Rifas Adrian. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

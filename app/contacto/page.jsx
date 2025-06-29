'use client'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const ContactoPage = () => {
  return (
    <div className='min-h-screen bg-black relative overflow-hidden'>
      {/* Elementos decorativos */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent'></div>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]'></div>
      </div>
      
      <div className='relative'>
        <Header />
        
        <main className='container mx-auto px-4 py-12 max-w-6xl'>
          <motion.h1 
            className='text-4xl md:text-5xl font-bold text-center text-primary-500 mb-8'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contacto
          </motion.h1>
          
          <div className='flex flex-col items-center justify-center gap-8'>
            <motion.div 
              className='space-y-6'
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className='bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800'>
                <h2 className='text-2xl font-semibold text-primary-400 mb-6'>Información de Contacto</h2>
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <Mail className='h-6 w-6 text-primary-500 mt-1 mr-3 flex-shrink-0' />
                    <div>
                      <h3 className='text-white font-medium'>Correo Electrónico</h3>
                      <a href='mailto:info@rifaadrian.com' className='text-zinc-300 hover:text-primary-400 transition-colors'>
                        info@rifaadrian.com
                      </a>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <Phone className='h-6 w-6 text-primary-500 mt-1 mr-3 flex-shrink-0' />
                    <div>
                      <h3 className='text-white font-medium'>Teléfono</h3>
                      <a href='https://wa.me/584244422372/?text=Hola, quiero informacion sobre...' className='text-zinc-300 hover:text-primary-400 transition-colors'>
                        +58 424-442-2372
                      </a>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <MessageSquare className='h-6 w-6 text-primary-500 mt-1 mr-3 flex-shrink-0' />
                    <div>
                      <h3 className='text-white font-medium'>Redes Sociales</h3>
                      <div className='flex space-x-3 mt-2'>
                        <a href='https://www.instagram.com/rifascamiari' target='_blank' rel='noopener noreferrer' className='text-zinc-300 hover:text-primary-400 transition-colors'>
                          Instagram
                        </a>
                        <a href='https://www.facebook.com/profile.php?id=61577763572070' target='_blank' rel='noopener noreferrer' className='text-zinc-300 hover:text-primary-400 transition-colors'>
                          Facebook
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800'>
                <h2 className='text-2xl font-semibold text-primary-400 mb-4'>Preguntas Frecuentes</h2>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-white font-medium'>¿Tienes dudas sobre cómo participar?</h3>
                    <p className='text-zinc-300 mt-1'>
                      Visita nuestra página de <Link href='/como-participar' className='text-primary-400 hover:underline'>Cómo Participar</Link> para obtener información detallada.
                    </p>
                  </div>
                  <div>
                    <h3 className='text-white font-medium'>¿Problemas con tu compra?</h3>
                    <p className='text-zinc-300 mt-1'>
                      Contáctanos directamente por correo electrónico o teléfono para una respuesta más rápida.
                    </p>
                  </div>
                  <div>
                    <h3 className='text-white font-medium'>¿Quieres conocer las rifas disponibles?</h3>
                    <p className='text-zinc-300 mt-1'>
                      Explora nuestra sección de <Link href='/rifas' className='text-primary-400 hover:underline'>Rifas</Link> para ver todos los sorteos activos.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ContactoPage

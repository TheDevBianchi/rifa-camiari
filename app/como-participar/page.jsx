'use client'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { ArrowRight, Check, HelpCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const ComoParticiparPage = () => {
  return (
    <div className='min-h-screen bg-black relative overflow-hidden'>
      {/* Elementos decorativos */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent'></div>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]'></div>
      </div>
      
      <div className='relative'>
        <Header />
        
        <main className='container mx-auto px-4 py-12 max-w-5xl'>
          <motion.h1 
            className='text-4xl md:text-5xl font-bold text-center text-amber-500 mb-8'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cómo Participar
          </motion.h1>
          
          <motion.div 
            className='bg-zinc-900 rounded-xl p-6 md:p-8 mb-8 border border-zinc-800'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className='text-2xl font-semibold text-amber-400 mb-4 flex items-center'>
              <HelpCircle className='mr-2 h-6 w-6' />
              Proceso Simple en 4 Pasos
            </h2>
            
            <div className='space-y-6 mt-6'>
              <div className='flex flex-col md:flex-row gap-4 p-4 bg-zinc-800/50 rounded-lg'>
                <div className='flex-shrink-0 bg-amber-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center'>1</div>
                <div>
                  <h3 className='text-xl font-medium text-white'>Elige tu Rifa</h3>
                  <p className='text-zinc-300 mt-2'>Navega por nuestras rifas disponibles y selecciona la que más te interese. Cada rifa tiene su propio premio y fecha de sorteo.</p>
                </div>
              </div>
              
              <div className='flex flex-col md:flex-row gap-4 p-4 bg-zinc-800/50 rounded-lg'>
                <div className='flex-shrink-0 bg-amber-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center'>2</div>
                <div>
                  <h3 className='text-xl font-medium text-white'>Selecciona tus Números</h3>
                  <p className='text-zinc-300 mt-2'>Escoge los números que deseas comprar. Puedes seleccionar números específicos o dejar que el sistema los asigne aleatoriamente.</p>
                </div>
              </div>
              
              <div className='flex flex-col md:flex-row gap-4 p-4 bg-zinc-800/50 rounded-lg'>
                <div className='flex-shrink-0 bg-amber-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center'>3</div>
                <div>
                  <h3 className='text-xl font-medium text-white'>Realiza el Pago</h3>
                  <p className='text-zinc-300 mt-2'>Completa tu compra utilizando cualquiera de nuestros métodos de pago disponibles. Recuerda guardar tu comprobante de pago.</p>
                </div>
              </div>
              
              <div className='flex flex-col md:flex-row gap-4 p-4 bg-zinc-800/50 rounded-lg'>
                <div className='flex-shrink-0 bg-amber-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center'>4</div>
                <div>
                  <h3 className='text-xl font-medium text-white'>Confirma tu Participación</h3>
                  <p className='text-zinc-300 mt-2'>Una vez verificado tu pago, recibirás un correo electrónico con la confirmación de tus números. ¡Ya estás participando!</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className='bg-zinc-900 rounded-xl p-6 md:p-8 mb-8 border border-zinc-800'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className='text-2xl font-semibold text-amber-400 mb-4 flex items-center'>
              <Check className='mr-2 h-6 w-6' />
              Preguntas Frecuentes
            </h2>
            
            <div className='space-y-4 mt-4'>
              <div className='border-b border-zinc-800 pb-4'>
                <h3 className='text-lg font-medium text-white'>¿Cómo sé si gané?</h3>
                <p className='text-zinc-300 mt-2'>Los resultados del sorteo se publican en nuestra página web y redes sociales. Además, nos pondremos en contacto con el ganador a través del correo electrónico proporcionado durante la compra.</p>
              </div>
              
              <div className='border-b border-zinc-800 pb-4'>
                <h3 className='text-lg font-medium text-white'>¿Cuándo se realiza el sorteo?</h3>
                <p className='text-zinc-300 mt-2'>Cada rifa tiene su propia fecha de sorteo. Puedes consultar esta información en la página de detalles de la rifa correspondiente.</p>
              </div>
              
              <div className='border-b border-zinc-800 pb-4'>
                <h3 className='text-lg font-medium text-white'>¿Puedo participar desde cualquier país?</h3>
                <p className='text-zinc-300 mt-2'>¡Sí! Aceptamos participantes de cualquier país. Los precios se muestran en tu moneda local para mayor comodidad.</p>
              </div>
              
              <div>
                <h3 className='text-lg font-medium text-white'>¿Cómo recibo mi premio?</h3>
                <p className='text-zinc-300 mt-2'>Nos pondremos en contacto contigo para coordinar la entrega del premio. Dependiendo de tu ubicación y del tipo de premio, podemos enviarlo por correo o coordinar una entrega en persona.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className='bg-amber-500 rounded-xl p-6 md:p-8 text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className='text-2xl font-bold text-black mb-4'>¿Listo para participar?</h2>
            <p className='text-black/80 mb-6 max-w-2xl mx-auto'>Explora nuestras rifas disponibles y encuentra la que más te guste. ¡No pierdas la oportunidad de ganar increíbles premios!</p>
            <Link href="/rifas" className='inline-flex items-center bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors'>
              Ver Rifas Disponibles
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default ComoParticiparPage

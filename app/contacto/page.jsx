'use client'

import { useState } from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const ContactoPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      // Aquí se implementaría la lógica para enviar el formulario
      // Por ahora simulamos una respuesta exitosa después de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitSuccess(true)
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitError('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.')
      console.error('Error al enviar formulario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
        
        <main className='container mx-auto px-4 py-12 max-w-6xl'>
          <motion.h1 
            className='text-4xl md:text-5xl font-bold text-center text-amber-500 mb-8'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contacto
          </motion.h1>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <motion.div 
              className='bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800'
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className='text-2xl font-semibold text-amber-400 mb-6'>Envíanos un Mensaje</h2>
              
              {submitSuccess ? (
                <div className='bg-green-900/30 border border-green-700 rounded-lg p-6 text-center'>
                  <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
                  <h3 className='text-xl font-medium text-white mb-2'>¡Mensaje Enviado!</h3>
                  <p className='text-zinc-300 mb-4'>Gracias por contactarnos. Te responderemos a la brevedad posible.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className='bg-amber-500 text-black px-6 py-2 rounded-full font-medium hover:bg-amber-400 transition-colors'
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label htmlFor='name' className='block text-zinc-300 mb-1'>Nombre Completo</label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className='w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor='email' className='block text-zinc-300 mb-1'>Correo Electrónico</label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className='w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor='subject' className='block text-zinc-300 mb-1'>Asunto</label>
                    <input
                      type='text'
                      id='subject'
                      name='subject'
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className='w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor='message' className='block text-zinc-300 mb-1'>Mensaje</label>
                    <textarea
                      id='message'
                      name='message'
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className='w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500'
                    />
                  </div>
                  
                  {submitError && (
                    <div className='bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-200'>
                      {submitError}
                    </div>
                  )}
                  
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-amber-500 text-black px-6 py-3 rounded-full font-medium hover:bg-amber-400 transition-colors flex items-center justify-center w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed'
                  >
                    {isSubmitting ? 'Enviando...' : (
                      <>
                        Enviar Mensaje
                        <Send className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
            
            <motion.div 
              className='space-y-6'
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className='bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800'>
                <h2 className='text-2xl font-semibold text-amber-400 mb-6'>Información de Contacto</h2>
                
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <Mail className='h-6 w-6 text-amber-500 mt-1 mr-3 flex-shrink-0' />
                    <div>
                      <h3 className='text-white font-medium'>Correo Electrónico</h3>
                      <a href='mailto:info@rifaadrian.com' className='text-zinc-300 hover:text-amber-400 transition-colors'>
                        info@rifaadrian.com
                      </a>
                    </div>
                  </div>
                  
                  <div className='flex items-start'>
                    <Phone className='h-6 w-6 text-amber-500 mt-1 mr-3 flex-shrink-0' />
                    <div>
                      <h3 className='text-white font-medium'>Teléfono</h3>
                      <a href='tel:+123456789' className='text-zinc-300 hover:text-amber-400 transition-colors'>
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  
                  <div className='flex items-start'>
                    <MessageSquare className='h-6 w-6 text-amber-500 mt-1 mr-3 flex-shrink-0' />
                    <div>
                      <h3 className='text-white font-medium'>Redes Sociales</h3>
                      <div className='flex space-x-3 mt-2'>
                        <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-zinc-300 hover:text-amber-400 transition-colors'>
                          Instagram
                        </a>
                        <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-zinc-300 hover:text-amber-400 transition-colors'>
                          Facebook
                        </a>
                        <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='text-zinc-300 hover:text-amber-400 transition-colors'>
                          Twitter
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800'>
                <h2 className='text-2xl font-semibold text-amber-400 mb-4'>Preguntas Frecuentes</h2>
                
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-white font-medium'>¿Tienes dudas sobre cómo participar?</h3>
                    <p className='text-zinc-300 mt-1'>
                      Visita nuestra página de <Link href='/como-participar' className='text-amber-400 hover:underline'>Cómo Participar</Link> para obtener información detallada.
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
                      Explora nuestra sección de <Link href='/rifas' className='text-amber-400 hover:underline'>Rifas</Link> para ver todos los sorteos activos.
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

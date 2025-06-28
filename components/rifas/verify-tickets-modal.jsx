'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Ticket, CheckCircle, AlertCircle } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const VerifyTicketsModal = ({ isOpen, onClose, raffleId, raffleName }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  if (!isOpen) return null

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Por favor, ingresa tu correo electrónico')
      return
    }
    
    try {
      setIsSubmitting(true)
      setError('')
      
      // Buscar tickets en Firestore
      const ticketsRef = collection(db, 'tickets')
      const q = query(
        ticketsRef, 
        where('raffleId', '==', raffleId),
        where('buyerEmail', '==', email.trim().toLowerCase()),
        where('status', '==', 'confirmed')
      )
      
      const querySnapshot = await getDocs(q)
      const ticketsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setTickets(ticketsData)
      setSearched(true)
    } catch (err) {
      console.error('Error al verificar tickets:', err)
      setError('Hubo un error al verificar tus tickets. Por favor, intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible'
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          className="bg-zinc-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-zinc-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-amber-500" />
              Verificar Tickets
            </h2>
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-5">
            <div className="mb-6">
              <p className="text-zinc-300 mb-2">
                Verifica los tickets que has comprado para la rifa <span className="text-amber-400 font-medium">{raffleName}</span>
              </p>
              
              <form onSubmit={handleVerify} className="space-y-4 mt-4">
                <div>
                  <label htmlFor="email" className="block text-zinc-300 mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingresa el correo con el que compraste"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-200 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-medium py-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verificando...
                    </>
                  ) : (
                    <>
                      Verificar Tickets
                      <Search className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {searched && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-3">Resultados</h3>
                
                {tickets.length > 0 ? (
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-white font-medium">Ticket #{ticket.number}</span>
                        </div>
                        <div className="text-sm text-zinc-300 space-y-1">
                          <p>Comprado el: {formatDate(ticket.purchaseDate)}</p>
                          <p>Estado: <span className="text-green-400">Confirmado</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 text-center">
                    <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                    <p className="text-zinc-300">No se encontraron tickets confirmados para este correo electrónico en esta rifa.</p>
                    <p className="text-zinc-400 text-sm mt-2">Verifica que el correo sea correcto o contacta con soporte si crees que hay un error.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-zinc-800 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default VerifyTicketsModal

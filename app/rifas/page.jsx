'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Calendar, Tag, Clock, Award, Search, Filter, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import CountryPrice from '@/components/ui/country-price'

const RifasPage = () => {
  const router = useRouter()
  const [raffles, setRaffles] = useState([])
  const [filteredRaffles, setFilteredRaffles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'completed'
    sortBy: 'newest' // 'newest', 'oldest', 'priceAsc', 'priceDesc'
  })

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        setLoading(true)
        const rafflesRef = collection(db, 'raffles')
        const q = query(rafflesRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        const rafflesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }))
        
        setRaffles(rafflesData)
        setFilteredRaffles(rafflesData)
      } catch (err) {
        console.error('Error fetching raffles:', err)
        setError('Hubo un error al cargar las rifas. Por favor, intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchRaffles()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...raffles]
    
    // Filter by status
    if (filters.status !== 'all') {
      const now = new Date()
      if (filters.status === 'active') {
        result = result.filter(raffle => {
          const endDate = raffle.endDate?.toDate ? raffle.endDate.toDate() : new Date(raffle.endDate)
          return endDate > now
        })
      } else if (filters.status === 'completed') {
        result = result.filter(raffle => {
          const endDate = raffle.endDate?.toDate ? raffle.endDate.toDate() : new Date(raffle.endDate)
          return endDate <= now
        })
      }
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(raffle => 
        raffle.title?.toLowerCase().includes(term) || 
        raffle.description?.toLowerCase().includes(term)
      )
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt)
        break
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt)
        break
      case 'priceAsc':
        result.sort((a, b) => a.ticketPrice - b.ticketPrice)
        break
      case 'priceDesc':
        result.sort((a, b) => b.ticketPrice - a.ticketPrice)
        break
      default:
        break
    }
    
    setFilteredRaffles(result)
  }, [raffles, filters, searchTerm])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      sortBy: 'newest'
    })
    setSearchTerm('')
  }

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible'
    
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getRaffleStatus = (raffle) => {
    if (!raffle.endDate) return { label: 'Activa', color: 'green' }
    
    const endDate = raffle.endDate instanceof Date ? raffle.endDate : new Date(raffle.endDate)
    const now = new Date()
    
    if (endDate > now) {
      return { label: 'Activa', color: 'green' }
    } else {
      return { label: 'Finalizada', color: 'gray' }
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
        
        <main className='container mx-auto px-4 py-12'>
          <motion.h1 
            className='text-4xl md:text-5xl font-bold text-center text-amber-500 mb-8'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Rifas Disponibles
          </motion.h1>
          
          <motion.div 
            className='bg-zinc-900 rounded-xl p-6 md:p-8 mb-8 border border-zinc-800'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
              <div className='relative w-full md:w-auto flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400' />
                <input
                  type='text'
                  placeholder='Buscar rifas...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='w-full bg-zinc-800 border border-zinc-700 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500'
                />
              </div>
              
              <div className='flex flex-wrap gap-2 w-full md:w-auto'>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className='bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500'
                >
                  <option value='all'>Todas</option>
                  <option value='active'>Activas</option>
                  <option value='completed'>Finalizadas</option>
                </select>
                
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className='bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500'
                >
                  <option value='newest'>Más recientes</option>
                  <option value='oldest'>Más antiguas</option>
                  <option value='priceAsc'>Precio: menor a mayor</option>
                  <option value='priceDesc'>Precio: mayor a menor</option>
                </select>
                
                {(filters.status !== 'all' || filters.sortBy !== 'newest' || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className='bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-white hover:bg-zinc-700 transition-colors flex items-center'
                  >
                    <X className='h-4 w-4 mr-1' />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
          
          {loading ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
              <p className='mt-4 text-zinc-300'>Cargando rifas...</p>
            </div>
          ) : error ? (
            <div className='bg-red-900/30 border border-red-700 rounded-xl p-6 text-center'>
              <p className='text-white'>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='mt-4 bg-amber-500 text-black px-6 py-2 rounded-full font-medium hover:bg-amber-400 transition-colors'
              >
                Intentar nuevamente
              </button>
            </div>
          ) : filteredRaffles.length === 0 ? (
            <div className='bg-zinc-900 rounded-xl p-6 md:p-8 text-center border border-zinc-800'>
              <p className='text-zinc-300 mb-4'>No se encontraron rifas que coincidan con tus criterios de búsqueda.</p>
              <button
                onClick={clearFilters}
                className='bg-amber-500 text-black px-6 py-2 rounded-full font-medium hover:bg-amber-400 transition-colors'
              >
                Ver todas las rifas
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredRaffles.map((raffle, index) => {
                const status = getRaffleStatus(raffle)
                
                return (
                  <motion.div
                    key={raffle.id}
                    className='bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-colors'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index % 6) }}
                  >
                    <div className='relative h-48 overflow-hidden'>
                      {raffle.imageUrl ? (
                        <Image
                          src={raffle.imageUrl}
                          alt={raffle.title}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-700/20 flex items-center justify-center'>
                          <Award className='h-16 w-16 text-amber-500/60' />
                        </div>
                      )}
                      <div className={`absolute top-3 right-3 bg-${status.color}-500/90 text-white text-sm px-3 py-1 rounded-full`}>
                        {status.label}
                      </div>
                    </div>
                    
                    <div className='p-5'>
                      <h2 className='text-xl font-bold text-white mb-2 line-clamp-1'>{raffle.title}</h2>
                      <p className='text-zinc-400 text-sm mb-4 line-clamp-2'>{raffle.description}</p>
                      
                      <div className='space-y-2 mb-4'>
                        <div className='flex items-center text-zinc-300'>
                          <Tag className='h-4 w-4 mr-2 text-amber-500' />
                          <span>Precio: </span>
                          <span className='ml-1 font-medium'>
                            <CountryPrice amount={raffle.ticketPrice || 0} />
                          </span>
                        </div>
                        
                        <div className='flex items-center text-zinc-300'>
                          <Calendar className='h-4 w-4 mr-2 text-amber-500' />
                          <span>Fecha de sorteo: </span>
                          <span className='ml-1 font-medium'>
                            {formatDate(raffle.endDate)}
                          </span>
                        </div>
                        
                        <div className='flex items-center text-zinc-300'>
                          <Clock className='h-4 w-4 mr-2 text-amber-500' />
                          <span>Creada: </span>
                          <span className='ml-1 font-medium'>
                            {formatDate(raffle.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/rifa/${raffle.id}`}
                        className='block w-full bg-amber-500 hover:bg-amber-400 text-black font-medium py-2 rounded-lg text-center transition-colors'
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
          
          <motion.div 
            className='mt-12 bg-zinc-900 rounded-xl p-6 md:p-8 text-center border border-zinc-800'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className='text-2xl font-bold text-amber-500 mb-2'>¿Quieres saber más sobre cómo participar?</h2>
            <p className='text-zinc-300 mb-6 max-w-2xl mx-auto'>Visita nuestra guía detallada para aprender todo sobre el proceso de participación en nuestras rifas.</p>
            <Link href="/como-participar" className='inline-flex items-center bg-amber-500 text-black px-6 py-3 rounded-full font-medium hover:bg-amber-400 transition-colors'>
              Cómo Participar
            </Link>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default RifasPage

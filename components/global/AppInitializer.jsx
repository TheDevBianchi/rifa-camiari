'use client'

import { useEffect } from 'react'
import { useDollarPrice } from '@/hooks/useDollarPrice'

export default function AppInitializer() {
  const { getDollarPrice } = useDollarPrice()

  useEffect(() => {
    // Cargar los precios de las monedas al iniciar la aplicación
    getDollarPrice()
    
    // Configurar un intervalo para actualizar los precios cada 30 minutos
    const interval = setInterval(() => {
      getDollarPrice()
    }, 30 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [getDollarPrice])

  // Este componente no renderiza nada
  return null
}

'use client'

import { useState, useEffect } from 'react'

export function useWindowSize() {
  // Estado inicial con valores por defecto
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return

    // Función para actualizar el estado
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Agregar event listener
    window.addEventListener('resize', handleResize)
    
    // Llamar al handler inmediatamente para establecer el tamaño inicial
    handleResize()
    
    // Limpiar event listener al desmontar
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

'use client'

import { useCountryStore } from '@/store/use-country-store'
import { useDollarPrice } from '@/hooks/useDollarPrice'
import { useMemo, useEffect } from 'react'

// Componente para mostrar precios según el país seleccionado
const CountryPrice = ({ amount, className = '' }) => {
  // Obtener las tasas de cambio desde el store centralizado
  const { dollarPrice, getDollarPrice } = useDollarPrice()
  
  // Cargar las tasas de cambio si no están disponibles
  useEffect(() => {
    if (!dollarPrice || !dollarPrice.ARS) {
      getDollarPrice()
    }
  }, [dollarPrice, getDollarPrice])

  // Obtener datos del país con manejo de errores
  const countryDataRaw = useCountryStore((state) => {
    try {
      if (state?.getSelectedCountryData) {
        return state.getSelectedCountryData()
      }
    } catch (error) {
      console.error('Error al obtener datos del país:', error)
    }
    
    // Fallback por si el método no existe o falla
    return {
      id: 'Argentina',
      name: 'Argentina',
      currency: 'ARS',
      currencySymbol: '$'
    }
  })
  
  // Corregir los datos para Venezuela (forzar VES como moneda y símbolo)
  const countryData = useMemo(() => {
    if (countryDataRaw.id === 'Venezuela') {
      return {
        ...countryDataRaw,
        currency: 'VES',
        currencySymbol: 'VES'
      }
    }
    return countryDataRaw
  }, [countryDataRaw])

  // Tasas de conversión dinámicas desde la configuración centralizada
  const conversionRates = useMemo(() => ({
    'ARS': dollarPrice?.ARS || 900,
    'CLP': dollarPrice?.CLP || 950,
    'VES': dollarPrice?.VES || 36.5, // Bolívares venezolanos
  }), [dollarPrice?.ARS, dollarPrice?.CLP, dollarPrice?.VES])

  // Convertir el monto según el país seleccionado
  const convertedAmount = useMemo(() => {
    // Asegurarse de que amount sea un número válido
    const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : parseInt(amount);
    const rate = conversionRates[countryData.currency] || 1;
    return (validAmount * rate).toFixed(2);
  }, [amount, countryData.currency, conversionRates])

  // Formatear el precio según el país
  const formattedPrice = useMemo(() => {
    // Asegurarse de que convertedAmount sea un número válido
    const validAmount = !isNaN(parseFloat(convertedAmount)) ? parseFloat(convertedAmount) : 0;
    
    // Para Venezuela, usar directamente el formato VES
    if (countryData.id === 'Venezuela') {
      return `VES ${validAmount.toFixed(2)}`;
    }
    
    try {
      const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: countryData.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
      
      return formatter.format(validAmount);
    } catch (error) {
      console.error('Error al formatear precio:', error);
      // Fallback en caso de error de formateo
      return `${countryData.currencySymbol} ${validAmount.toFixed(2)}`;
    }
  }, [convertedAmount, countryData])

  return (
    <span className={className}>
      {formattedPrice}
    </span>
  )
}

export default CountryPrice

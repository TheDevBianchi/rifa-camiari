'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useCountryStore } from '@/store/use-country-store'
import { ChevronDown, Check } from 'lucide-react'

const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  // Usar selectores individuales con valores por defecto para mayor seguridad
  const selectedCountry = useCountryStore((state) => state?.selectedCountry || 'Argentina')
  const countries = useCountryStore((state) => state?.countries || [])
  const setSelectedCountry = useCountryStore((state) => state?.setSelectedCountry || (() => {}))
  
  // Datos del país seleccionado con fallback
  const selectedCountryData = useCountryStore((state) => {
    if (state?.getSelectedCountryData) {
      return state.getSelectedCountryData()
    }
    // Fallback por si el método no existe o falla
    return {
      id: 'Argentina',
      name: 'Argentina',
      flag: 'https://flagcdn.com/w80/ar.png',
      currency: 'ARS',
      currencySymbol: '$'
    }
  })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCountrySelect = (countryId) => {
    setSelectedCountry(countryId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-black/50 hover:bg-black/80 border border-amber-500/20 hover:border-amber-500/40 rounded-md py-1 px-2 transition-all duration-300"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="relative w-5 h-5 overflow-hidden rounded-sm bg-gray-800 flex items-center justify-center">
          {selectedCountryData && selectedCountryData.flag ? (
            <Image
              src={selectedCountryData.flag}
              alt={selectedCountryData.name || 'País'}
              width={20}
              height={20}
              className="object-cover"
              onError={(e) => {
                // Fallback para cuando la imagen no carga
                e.target.src = 'https://via.placeholder.com/20'
              }}
            />
          ) : (
            <span className="text-[8px] text-gray-400">N/A</span>
          )}
        </div>
        <span className="text-xs text-white">{selectedCountryData?.name || 'Seleccionar país'}</span>
        <ChevronDown className="h-3 w-3 text-amber-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-black border border-amber-500/20 rounded-md shadow-lg overflow-hidden z-50">
          <ul className="py-1" role="listbox">
            {countries && countries.length > 0 ? (
              countries.map((country) => (
                <li
                  key={country.id}
                  role="option"
                  aria-selected={selectedCountry === country.id}
                  className={`flex items-center space-x-2 px-3 py-2 cursor-pointer ${
                    selectedCountry === country.id
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-white hover:bg-amber-500/10'
                  }`}
                  onClick={() => handleCountrySelect(country.id)}
                >
                  <div className="relative w-5 h-5 overflow-hidden rounded-sm flex-shrink-0">
                    <Image
                      src={country.flag || 'https://via.placeholder.com/20'}
                      alt={country.name}
                      width={20}
                      height={20}
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/20'
                      }}
                    />
                  </div>
                  <span className="text-xs">{country.name}</span>
                  {selectedCountry === country.id && (
                    <Check className="h-3 w-3 text-amber-400 ml-auto" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400 text-xs">
                No hay países disponibles
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CountrySelector

// store/use-country-store.js
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Definir los países por defecto
const defaultCountries = [
  { 
    id: 'Argentina', 
    name: 'Argentina', 
    flag: 'https://flagcdn.com/w80/ar.png',
    currency: 'ARS',
    currencySymbol: '$'
  },
  { 
    id: 'Chile', 
    name: 'Chile', 
    flag: 'https://flagcdn.com/w80/cl.png',
    currency: 'CLP',
    currencySymbol: '$'
  },
  { 
    id: 'Venezuela', 
    name: 'Venezuela', 
    flag: 'https://flagcdn.com/w80/ve.png',
    currency: 'VES',
    currencySymbol: 'VES'
  }
];

// Crear el store con manejo seguro para SSR
export const useCountryStore = create(
  persist(
    (set, get) => ({
      selectedCountry: 'Argentina', // País por defecto
      countries: defaultCountries,
      
      // Acciones
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      
      // Selectores
      getSelectedCountryData: () => {
        const state = get();
        if (!state.countries || !state.selectedCountry) {
          return defaultCountries[0];
        }
        return state.countries.find(country => country.id === state.selectedCountry) || state.countries[0];
      }
    }),
    {
      name: 'country-storage', // nombre para localStorage
      storage: createJSONStorage(() => {
        // Verificar si estamos en el navegador antes de usar localStorage
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Proporcionar un almacenamiento simulado para SSR
        return {
          getItem: () => JSON.stringify({
            state: { selectedCountry: 'Argentina', countries: defaultCountries }
          }),
          setItem: () => {},
          removeItem: () => {}
        };
      })
    }
  )
)

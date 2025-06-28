'use client'
import React, { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/use-settings-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Loader2, Check, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCountryStore } from '@/store/use-country-store'

export default function DollarPricePage() {
  const { dollarPrice, getDollarPrice, updateDollarPrice, loading } = useSettingsStore()
  const { countries } = useCountryStore()
  
  const [exchangeRates, setExchangeRates] = useState({
    ARS: 900, // Tasa para Argentina (Pesos Argentinos)
    CLP: 950, // Tasa para Chile (Pesos Chilenos)
    VES: 100    // Tasa para Venezuela (Dólares)
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)

  // Cargar datos solo una vez al montar el componente
  useEffect(() => {
    if (!dataFetched) {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          await getDollarPrice()
          
          // Inicializar con valores desde el store
          setExchangeRates({
            ARS: dollarPrice.ARS || 900,
            CLP: dollarPrice.CLP || 950,
            VES: dollarPrice.VES || 100
          })
          
          setDataFetched(true)
        } catch (error) {
          console.error('Error al cargar precios del dólar:', error)
          toast.error('Error al cargar los precios del dólar')
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchData()
    }
  }, [getDollarPrice, dataFetched, dollarPrice?.ARS, dollarPrice?.CLP, dollarPrice?.VES])
  
  // Actualizar exchangeRates cuando dollarPrice cambia, pero solo después de la carga inicial
  useEffect(() => {
    if (dataFetched && dollarPrice) {
      setExchangeRates({
        ARS: dollarPrice.ARS || 900,
        CLP: dollarPrice.CLP || 950,
        VES: dollarPrice.VES || 1
      })
    }
  }, [dollarPrice, dataFetched, dollarPrice.ARS, dollarPrice.CLP, dollarPrice.VES])

  const handleInputChange = (currency, value) => {
    // Permitir valores vacíos para facilitar la edición
    const numericValue = value === '' ? '' : parseFloat(value) || 0
    setExchangeRates(prev => ({
      ...prev,
      [currency]: numericValue
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar que todos los valores sean números válidos antes de guardar
    const validatedRates = {
      ARS: parseFloat(exchangeRates.ARS) || 0,
      CLP: parseFloat(exchangeRates.CLP) || 0,
      VES: parseFloat(exchangeRates.VES) || 0
    }
    
    try {
      setIsSaving(true)
      await updateDollarPrice(validatedRates)
      toast.success('Precios del dólar actualizados correctamente')
    } catch (error) {
      console.error('Error al actualizar precios del dólar:', error)
      toast.error('Error al actualizar los precios del dólar')
    } finally {
      setIsSaving(false)
    }
  }

  // Función para obtener nombre del país según la moneda
  const getCountryNameByCurrency = (currencyCode) => {
    const countryMap = {
      'ARS': 'Argentina',
      'CLP': 'Chile',
      'VES': 'Venezuela'
    }
    return countryMap[currencyCode] || currencyCode
  }

  // Función para obtener bandera del país según la moneda
  const getCountryFlagByCurrency = (currencyCode) => {
    const country = countries.find(c => c.currency === currencyCode)
    return country?.flag || `https://flagcdn.com/w80/${currencyCode.toLowerCase().substring(0, 2)}.png`
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="icon" className="text-amber-500 hover:bg-amber-500/10 hover:text-amber-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Precio del Dólar
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Configura el tipo de cambio para cada país
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 md:py-12">
          <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-amber-500" />
          <p className="text-gray-400 mt-4 text-sm md:text-base">
            Cargando precios del dólar...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="bg-black/60 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <CardHeader>
              <CardTitle className="text-amber-300 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tasas de Cambio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-400 text-sm">
                Configura cuántas unidades de moneda local equivalen a 1 dólar estadounidense (VES).
                Estos valores se utilizarán para calcular los precios en la moneda del país seleccionado.
              </p>
              
              {/* Exchange Rates Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(exchangeRates).map((currency) => (
                  <Card key={currency} className="bg-black/40 border-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.03)]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden relative">
                          <Image 
                            src={getCountryFlagByCurrency(currency)} 
                            alt={currency}
                            width={24}
                            height={24}
                            className="object-cover"
                            onError={() => {
                              // Next/Image no soporta onError de la misma manera
                              // Se maneja con la prop unoptimized para fallbacks
                            }}
                            unoptimized
                          />
                        </div>
                        <CardTitle className="text-sm font-medium text-amber-300">
                          {getCountryNameByCurrency(currency)} ({currency})
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="flex-1 relative">
                          <Input
                            type="number"
                            value={exchangeRates[currency]}
                            onChange={(e) => handleInputChange(currency, e.target.value)}
                            min="0"
                            step="0.01"
                            className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors pl-8"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {currency === 'USD' ? '$' : currency === 'ARS' ? '$' : '$'}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-400">=</span>
                        <div className="bg-amber-500/10 px-3 py-2 rounded-md border border-amber-500/20 text-amber-300 font-medium">
                          $1 USD
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Exchange Rate Info */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-amber-500" />
                  Las tasas de cambio se actualizan manualmente. Recuerda mantenerlas actualizadas para ofrecer precios precisos a tus clientes.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading || isSaving}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
      
      {/* Exchange Rate History */}
      <Card className="bg-black/60 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
        <CardHeader>
          <CardTitle className="text-amber-300">Historial de Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">
            Aquí podrás ver un historial de los cambios realizados a las tasas de cambio.
            Esta funcionalidad estará disponible próximamente.
          </p>
          
          <div className="mt-4 p-4 bg-black/40 rounded-lg border border-amber-500/10 text-center">
            <p className="text-amber-400 text-sm">Próximamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

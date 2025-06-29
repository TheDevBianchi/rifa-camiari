'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePurchaseStore } from '@/store/purchaseStore'
import { PurchaseTable } from '@/components/purchases/PurchaseTable'
import { CreatePurchaseModal } from '@/components/purchases/CreatePurchaseModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, X } from 'lucide-react'
import { getPurchases, getRaffles } from './actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PurchasesPage = () => {
  const { isPurchaseModalOpen, setPurchaseModalOpen } = usePurchaseStore()
  const [purchases, setPurchases] = useState([])
  const [raffles, setRaffles] = useState([])
  const [selectedRaffle, setSelectedRaffle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener la lista de rifas
  const fetchRaffles = useCallback(async () => {
    try {
      const result = await getRaffles()
      if (result.success) {
        setRaffles(result.raffles)
        // Seleccionar la primera rifa por defecto si existe
        if (result.raffles.length > 0) {
          setSelectedRaffle(result.raffles[0].id)
        }
      }
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchPurchases = useCallback(async () => {
    if (!selectedRaffle) return

    try {
      setIsLoading(true)
      const result = await getPurchases(1, 20, selectedRaffle, searchTerm)
      if (result.success) {
        setPurchases(result.purchases)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [selectedRaffle, searchTerm])

  useEffect(() => {
    fetchRaffles()
  }, [fetchRaffles])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases, selectedRaffle, searchTerm])

  const handlePurchaseUpdate = useCallback((newPurchases) => {
    setPurchases(newPurchases)
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-secondary-500">
          Error al cargar las compras: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-500">Gestión de Compras</h1>

      </div>

      <div className="mb-6 space-y-4">
        {/* Selector de rifa */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Seleccionar Rifa
          </label>
          <Select
            value={selectedRaffle}
            onValueChange={setSelectedRaffle}
          >
            <SelectTrigger className="w-[280px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Selecciona una rifa" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {raffles.map((raffle) => (
                <SelectItem key={raffle.id} value={raffle.id} className="text-white hover:bg-gray-700">
                  {raffle.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Barra de búsqueda */}
        <div className='w-full md:w-auto flex flex-col items-end'>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Buscar Compras
          </label>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por número de ticket, email, nombre, teléfono..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Busca por número de ticket, correo electrónico, nombre del comprador, teléfono, método de pago, referencia de pago o nombre de la rifa.
          </p>
        </div>
        </div>

        {/* Información de resultados */}
        {!isLoading && (
          <div className="text-sm text-gray-400">
            {searchTerm ? (
              <span>
                Mostrando {purchases.length} resultado{purchases.length !== 1 ? 's' : ''} para &quot;{searchTerm}&quot;
              </span>
            ) : (
              <span>
                Total de compras: {purchases.length}
              </span>
            )}
          </div>
        )}
      </div>

      <PurchaseTable 
        purchases={purchases} 
        isLoading={isLoading}
        onPurchaseUpdate={handlePurchaseUpdate}
      />

      {isPurchaseModalOpen && (
        <CreatePurchaseModal 
          open={isPurchaseModalOpen}
          onOpenChange={setPurchaseModalOpen}
          onPurchaseCreated={fetchPurchases}
        />
      )}
    </div>
  )
}

export default PurchasesPage

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRaffleStore } from '@/store/use-rifa-store'
import { useRaffles } from '@/hooks/useRaffles'
import { Loader2 } from 'lucide-react'
import { DataTable } from "@/components/ui/data-table"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const columns = [
  {
    accessorKey: "position",
    header: "Posición",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "totalTickets",
    header: "Total Tickets",
  },
  {
    accessorKey: "lastPurchase",
    header: "Última Compra",
    cell: ({ row }) => {
      const date = row.original.lastPurchase
      if (!date) return "N/A"
      // Verificar si date es un objeto Timestamp de Firebase
      if (date?.seconds) {
        return new Date(date.seconds * 1000).toLocaleDateString()
      }
      // Si ya es un objeto Date
      if (date instanceof Date) {
        return date.toLocaleDateString()
      }
      return "N/A"
    },
  }
]

const columnsTop10 = [
  {
    accessorKey: "position",
    header: "Posición",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "totalTickets",
    header: "Total Tickets",
  },
]

export function UserRanking() {
  const { raffles, getRaffles } = useRaffles()
  const [selectedRaffle, setSelectedRaffle] = useState('all')
  const resetUserRanking = useRaffleStore(state => state.resetUserRanking)
  const getRankingByRaffle = useRaffleStore(state => state.getRankingByRaffle)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [rankingData, setRankingData] = useState([])

  useEffect(() => {
    getRaffles()
  }, [getRaffles])

  useEffect(() => {
    const loadRankingData = async () => {
      setIsLoading(true)
      try {
        const data = await getRankingByRaffle(selectedRaffle)
        setRankingData(data)
      } catch (error) {
        console.error('Error loading ranking:', error)
        toast.error('Error al cargar el ranking')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadRankingData()
  }, [selectedRaffle, getRankingByRaffle])

  const handleReset = async () => {
    if (!window.confirm('¿Estás seguro de que deseas reiniciar el ranking? Esta acción no se puede deshacer.')) {
      return
    }

    setIsResetting(true)
    try {
      await resetUserRanking()
      toast.success('Ranking reiniciado exitosamente')
      // Recargar datos después del reinicio
      const data = await getRankingByRaffle(selectedRaffle)
      setRankingData(data)
    } catch (error) {
      toast.error('Error al reiniciar el ranking')
      console.error(error)
    } finally {
      setIsResetting(false)
    }
  }

  const sortedData = useMemo(() => {
    if (!rankingData) return []
    return [...rankingData].sort((a, b) => b.totalTickets - a.totalTickets)
  }, [rankingData])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-4" />
          <p className="text-gray-400">Cargando ranking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl mb-4 md:mb-0 font-bold text-white">Ranking General</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedRaffle}
            onValueChange={setSelectedRaffle}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Rifa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Rifas</SelectItem>
              {raffles?.map((raffle) => (
                <SelectItem key={raffle.id} value={raffle.id}>
                  {raffle.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleReset}
            disabled={isResetting}
            variant="destructive"
            size="sm"
            className="bg-secondary-500 hover:bg-secondary-600"
          >
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reiniciando...
              </>
            ) : (
              'Reiniciar Ranking'
            )}
          </Button>
        </div>
      </div>

      {!sortedData.length ? (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            No hay datos disponibles
          </h2>
          <p className="text-gray-400">
            {selectedRaffle === 'all' 
              ? 'Aún no hay compras registradas en el sistema.'
              : 'Esta rifa aún no tiene compras confirmadas.'}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <DataTable
            columns={columns}
            data={sortedData}
          />
        </div>
      )}
    </div>
  )
}

export function UserRankingTop10({ raffleId }) {
  const getRankingByRaffle = useRaffleStore(state => state.getRankingByRaffle)
  const [isLoading, setIsLoading] = useState(true)
  const [rankingData, setRankingData] = useState([])

  useEffect(() => {
    const loadRankingData = async () => {
      setIsLoading(true)
      try {
        const data = await getRankingByRaffle(raffleId)
        setRankingData(data)
      } catch (error) {
        console.error('Error loading ranking:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (raffleId) {
      loadRankingData()
    }
  }, [raffleId, getRankingByRaffle])

  // Ordenar y filtrar del 10 al 1 (top 10, invertido)
  const top10 = useMemo(() => {
    if (!rankingData) return []
    const sorted = [...rankingData].sort((a, b) => b.totalTickets - a.totalTickets)
    return sorted.slice(0, 10) // del 1 al 10, el que más tickets primero
  }, [rankingData])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary-500 mb-2" />
          <p className="text-gray-400">Cargando ranking...</p>
        </div>
      </div>
    )
  }

  if (!top10.length) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-300 mb-2">
          No hay datos de ranking para esta rifa
        </h2>
      </div>
    )
  }

  return (
    <div className="py-6">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Ranking Top 10</h2>
      <div className="rounded-md border">
        <DataTable
          columns={columnsTop10}
          data={top10}
        />
      </div>
    </div>
  )
}

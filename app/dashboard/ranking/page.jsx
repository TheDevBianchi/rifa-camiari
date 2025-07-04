'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { useRaffles } from '@/hooks/useRaffles'
import { columns } from './columns'
import { useRaffleStore } from '@/store/use-rifa-store'
import { Loader2 } from 'lucide-react'

export default function RankingPage() {
  const { raffles, getRaffles } = useRaffles()
  const [selectedRaffle, setSelectedRaffle] = useState('all')
  const [rankingData, setRankingData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const getRankingByRaffle = useRaffleStore(state => state.getRankingByRaffle)

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
      } finally {
        setIsLoading(false)
      }
    }
    
    loadRankingData()
  }, [selectedRaffle, getRankingByRaffle])

  const sortedData = useMemo(() => {
    return [...rankingData]
      .sort((a, b) => {
        const ticketsA = Number(a.totalTickets) || 0;
        const ticketsB = Number(b.totalTickets) || 0;
        return ticketsB - ticketsA;
      });
  }, [rankingData])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-400">Cargando ranking...</p>
        </div>
      </div>
    )
  }

  if (!sortedData.length) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary-500">Ranking de Usuarios</h1>
          <Select
            value={selectedRaffle}
            onValueChange={setSelectedRaffle}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Rifa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Rifas</SelectItem>
              {raffles.map((raffle) => (
                <SelectItem key={raffle.id} value={raffle.id}>
                  {raffle.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            No hay datos disponibles
          </h2>
          <p className="text-gray-400">
            {selectedRaffle === 'all' 
              ? 'Aún no hay compras registradas en ninguna rifa.'
              : 'Esta rifa aún no tiene compras confirmadas.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary-500">Ranking de Usuarios</h1>
        <Select
          value={selectedRaffle}
          onValueChange={setSelectedRaffle}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar Rifa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Rifas</SelectItem>
            {raffles.map((raffle) => (
              <SelectItem key={raffle.id} value={raffle.id}>
                {raffle.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={sortedData}
        />
      </div>
    </div>
  )
} 
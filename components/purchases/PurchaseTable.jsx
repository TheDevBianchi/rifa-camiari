import { memo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UndoAction } from './UndoAction'
import { ConfirmAction } from './ConfirmAction'
import { TableSkeleton } from './TableSkeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Mail, Phone } from 'lucide-react'

export const PurchaseTable = memo(({ purchases, isLoading, selectedRaffle, onPurchaseUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const totalPages = Math.ceil(purchases.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPurchases = purchases.slice(startIndex, endIndex)

  if (isLoading) return <TableSkeleton />

  const formatDate = (timestamp) => {
    try {
      // Si es una fecha en formato string (nuevo formato UTC-4)
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      
      // Si es un timestamp de Firestore (formato antiguo)
      if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Caracas' // UTC-4
        }) + ' UTC-4';
      }

      // Si es una fecha inválida o no existe
      return 'Fecha no disponible';
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)

    // Ajustar el rango si estamos cerca del final
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={`w-10 h-10 ${currentPage === i ? 'bg-primary-500 text-white hover:bg-primary-600' : 'hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return buttons
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-700 rounded-md bg-gray-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-primary-400 font-semibold">Fecha</TableHead>
              <TableHead className="text-primary-400 font-semibold">Comprador</TableHead>
              <TableHead className="text-primary-400 font-semibold">Contacto</TableHead>
              <TableHead className="text-primary-400 font-semibold">Rifa</TableHead>
              <TableHead className="text-primary-400 font-semibold">Tickets</TableHead>
              <TableHead className="text-primary-400 font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPurchases?.map((purchase) => (
              <TableRow key={purchase.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell className="text-gray-300 text-sm">
                  {formatDate(purchase.purchaseDate || purchase.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-white">{purchase.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="w-3 h-3 text-primary-400" />
                      {purchase.email}
                    </div>
                    {purchase.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone className="w-3 h-3 text-primary-400" />
                        {purchase.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {purchase.raffleName}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-pointer underline text-primary-400 hover:text-primary-300">
                          {purchase.selectedTickets.length} tickets
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 border-gray-700">
                        <p className="max-w-xs text-wrap text-white">
                          <strong>Números:</strong> {purchase.selectedTickets.sort((a, b) => a - b).join(', ')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UndoAction 
                      purchase={purchase} 
                      selectedRaffle={selectedRaffle}
                      onPurchaseUpdate={onPurchaseUpdate} 
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent className="flex gap-2">
            <PaginationItem>
              <PaginationPrevious 
                className="h-10 px-4 py-2 hover:bg-gray-700 hover:text-white border-gray-700 text-gray-300"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {currentPage > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    className="w-10 h-10 hover:bg-gray-700 hover:text-white border-gray-700 text-gray-300"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 4 && (
                  <PaginationItem>
                    <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                      ...
                    </span>
                  </PaginationItem>
                )}
              </>
            )}

            {renderPaginationButtons()}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <PaginationItem>
                    <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                      ...
                    </span>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    className="w-10 h-10 hover:bg-gray-700 hover:text-white border-gray-700 text-gray-300"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext 
                className="h-10 px-4 py-2 hover:bg-gray-700 hover:text-white border-gray-700 text-gray-300"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
})

PurchaseTable.displayName = 'PurchaseTable' 
'use client'

import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react'
import { FixedSizeGrid } from 'react-window'
import { UserInfoDialog } from '@/components/dashboard/UserInfoDialog'
import { UnreservTicketDialog } from '@/components/dashboard/UnreservTicketDialog'
import { cn } from '@/lib/utils'
import { Ticket, AlertCircle, User } from 'lucide-react'
import { useWindowSize } from '@/hooks/useWindowSize'

const VirtualizedTicketGrid = memo(({
  totalTickets,
  reservedTickets = [],
  soldTickets = [],
  selectedTickets = [],
  onTicketClick,
  isDashboard = false,
  randomTickets = false,
  users = [],
  onUnreserveTicket,
  highlightedTicket
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [ticketToUnreserve, setTicketToUnreserve] = useState(null)
  const [isUnreserving, setIsUnreserving] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const gridRef = useRef(null)
  const containerRef = useRef(null)
  const { width } = useWindowSize()

  // Calcular el número de columnas basado en el ancho de la pantalla
  const columnCount = useMemo(() => {
    if (width < 640) return 5; // móvil
    if (width < 768) return 8; // tablet
    if (width < 1024) return 10; // laptop
    return 12; // desktop grande
  }, [width]);

  // Calcular el número de filas
  const rowCount = useMemo(() => {
    return Math.ceil(totalTickets / columnCount);
  }, [totalTickets, columnCount]);

  // Memoizar la función de normalización
  const normalizeTicketNumber = useMemo(() => {
    return (number) => {
      const cleanNumber = typeof number === 'string' ? parseInt(number, 10) : number
      if (totalTickets <= 100) return cleanNumber.toString().padStart(2, '0')
      if (totalTickets <= 1000) return cleanNumber.toString().padStart(3, '0')
      if (totalTickets <= 10000) return cleanNumber.toString().padStart(4, '0')
      return cleanNumber.toString()
    }
  }, [totalTickets])

  // Memoizar los tickets normalizados
  const {
    normalizedSoldTickets,
    normalizedReservedTickets,
    normalizedSelectedTickets
  } = useMemo(() => {
    return {
      normalizedSoldTickets: new Set(soldTickets.map(ticket => normalizeTicketNumber(ticket))),
      normalizedReservedTickets: new Set(reservedTickets.map(ticket => normalizeTicketNumber(ticket))),
      normalizedSelectedTickets: new Set(selectedTickets.map(ticket => normalizeTicketNumber(ticket)))
    }
  }, [soldTickets, reservedTickets, selectedTickets, normalizeTicketNumber])

  // Memoizar el mapa de usuarios por ticket
  const usersByTicket = useMemo(() => {
    const map = new Map()
    users.forEach(user => {
      if (user.status === 'confirmed') {
        user.selectedTickets.forEach(ticket => {
          map.set(normalizeTicketNumber(ticket), user)
        })
      }
    })
    return map
  }, [users, normalizeTicketNumber])

  const handleTicketClick = useCallback((number, isReserved) => {
    if (isDashboard) {
      if (isReserved) {
        setTicketToUnreserve(number)
      } else {
        const formattedNumber = normalizeTicketNumber(number)
        const buyer = usersByTicket.get(formattedNumber)
        if (buyer) {
          setSelectedUser({
            ...buyer,
            ticketNumber: formattedNumber
          })
          setDialogOpen(true)
        }
      }
    } else {
      onTicketClick(number)
    }
  }, [isDashboard, normalizeTicketNumber, usersByTicket, onTicketClick])

  const handleUnreserveConfirm = useCallback(async () => {
    setIsUnreserving(true)
    try {
      await onUnreserveTicket(ticketToUnreserve)
    } finally {
      setIsUnreserving(false)
      setTicketToUnreserve(null)
    }
  }, [ticketToUnreserve, onUnreserveTicket])

  // Memoizar la generación de tickets
  const tickets = useMemo(() => {
    return Array.from({ length: totalTickets }, (_, i) => {
      const number = i + 1 // Ajustado para que comience desde 1 en lugar de 0
      const formattedNumber = normalizeTicketNumber(number)
      const isReserved = normalizedReservedTickets.has(formattedNumber)
      const isSold = normalizedSoldTickets.has(formattedNumber)
      const isSelected = normalizedSelectedTickets.has(formattedNumber)
      const isHighlighted = highlightedTicket === number
      const buyer = usersByTicket.get(formattedNumber)

      return {
        number,
        formattedNumber,
        isReserved,
        isSold,
        isSelected,
        isHighlighted,
        buyer,
        isDisabled: !isDashboard && (isReserved || isSold),
        cursorStyle: isDashboard
          ? 'cursor-pointer'
          : isReserved || isSold
          ? 'cursor-not-allowed'
          : 'cursor-pointer'
      }
    })
  }, [
    totalTickets,
    normalizeTicketNumber,
    normalizedReservedTickets,
    normalizedSoldTickets,
    normalizedSelectedTickets,
    highlightedTicket,
    usersByTicket,
    isDashboard
  ])

  // Calcular el tamaño de cada celda
  const CELL_SIZE = useMemo(() => {
    // Ajustar el tamaño de la celda según el ancho de la pantalla
    if (width < 640) return 45; // móvil
    if (width < 768) return 48; // tablet
    return 52; // desktop
  }, [width]);

  // Renderizar una celda individual
  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= totalTickets) return null;
    
    const ticket = tickets[index];
    if (!ticket) return null;

    return (
      <div style={{
        ...style,
        padding: '4px'
      }}>
        <div
          className={cn(
            'relative group h-full',
            ticket.isHighlighted && 'z-10'
          )}
        >
          <button
            id={`ticket-${ticket.number}`}
            type='button'
            onClick={() => {
              if (isDashboard && ticket.buyer) {
                setSelectedUser({
                  ...ticket.buyer,
                  ticketNumber: ticket.formattedNumber
                })
                setDialogOpen(true)
                setSelectedIndex(ticket.number)
              } else {
                handleTicketClick(ticket.number, ticket.isReserved)
              }
            }}
            disabled={ticket.isDisabled}
            aria-label={`Número ${ticket.formattedNumber}${
              ticket.isReserved ? ', reservado' : ticket.isSold ? ', vendido' : ''
            }`}
            aria-pressed={ticket.isSelected}
            className={cn(
              'w-full h-full p-2 text-sm rounded-md transition-all duration-300 flex items-center justify-center',
              'focus:outline-none focus:ring-2',
              ticket.cursorStyle,
              ticket.isHighlighted && 'ring-4 ring-primary ring-opacity-75',
              ticket.isSelected && 'bg-primary text-gray-200 shadow-[0_0_10px_rgba(0,255,140,0.3)]',
              ticket.isSold && 'bg-red-900/20 text-red-300 border border-red-500/30 cursor-not-allowed',
              ticket.isReserved && 'bg-yellow-900/20 text-yellow-300 border border-yellow-500/30',
              !ticket.isSold && !ticket.isReserved && !ticket.isSelected && 'bg-black/50 text-gray-200 border border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
            )}
          >
            {ticket.isSold ? (
              <Ticket className="w-3 h-3 mr-1" />
            ) : ticket.isReserved ? (
              <AlertCircle className="w-3 h-3 mr-1" />
            ) : null}
            {ticket.formattedNumber}
          </button>
          
          {/* Mostrar información del comprador en tickets vendidos */}
          {isDashboard && ticket.buyer && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 cursor-pointer"
              onClick={() => {
                setSelectedUser({
                  ...ticket.buyer,
                  ticketNumber: ticket.formattedNumber
                })
                setDialogOpen(true)
                setSelectedIndex(ticket.number)
              }}
            >
              <User className="w-3 h-3" />
            </div>
          )}
          
          {/* Botón para liberar tickets reservados */}
          {isDashboard && ticket.isReserved && (
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                type="button" 
                className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                onClick={() => setTicketToUnreserve(ticket.number)}
              >
                <span className="text-xs font-bold">×</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }, [tickets, columnCount, totalTickets, isDashboard, handleTicketClick]);

  // Efecto para ajustar el tamaño de la cuadrícula cuando cambia el tamaño de la ventana
  useEffect(() => {
    if (gridRef.current) {
      // Usar una forma más segura de actualizar el grid cuando cambia el tamaño
      // En lugar de resetAfterIndices que puede no estar disponible en todas las versiones
      try {
        // Intentar usar resetAfterIndices si está disponible
        if (typeof gridRef.current.resetAfterIndices === 'function') {
          gridRef.current.resetAfterIndices({
            columnIndex: 0,
            rowIndex: 0,
            shouldForceUpdate: true,
          });
        } else {
          // Alternativa: forzar una actualización del grid
          gridRef.current._outerRef.scrollTop = gridRef.current._outerRef.scrollTop;
        }
      } catch (error) {
        console.log('Error al actualizar el grid:', error);
      }
    }
  }, [width]);

  // Calcular el ancho y alto del contenedor
  const containerWidth = useMemo(() => {
    // Usar el 100% del ancho disponible
    return width > 0 ? width - 40 : 1000; // Restar un pequeño margen para evitar scroll horizontal
  }, [width]);

  const containerHeight = useMemo(() => {
    // Altura más grande para mostrar más filas a la vez
    return Math.min(500, rowCount * CELL_SIZE);
  }, [rowCount, CELL_SIZE]);

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        <FixedSizeGrid
          ref={gridRef}
          columnCount={columnCount}
          columnWidth={(containerWidth / columnCount) - 2} // Ajustar el ancho de columna para llenar el espacio
          height={containerHeight}
          rowCount={rowCount}
          rowHeight={CELL_SIZE}
          width={containerWidth}
          className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 w-full"
        >
          {Cell}
        </FixedSizeGrid>
      </div>

      <UserInfoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        index={selectedIndex}
      />

      <UnreservTicketDialog
        selectedTicket={ticketToUnreserve}
        isUnreserving={isUnreserving}
        onClose={() => setTicketToUnreserve(null)}
        onConfirm={handleUnreserveConfirm}
        index={selectedIndex}
      />
    </>
  )
})

VirtualizedTicketGrid.displayName = 'VirtualizedTicketGrid'
export default VirtualizedTicketGrid

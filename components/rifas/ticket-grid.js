import { useState, useMemo, useCallback, memo } from 'react'
import { UserInfoDialog } from '@/components/dashboard/UserInfoDialog'
import { UnreservTicketDialog } from '@/components/dashboard/UnreservTicketDialog'
import { Ticket, AlertCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TicketGrid = memo(({
  totalTickets,
  reservedTickets,
  soldTickets = [],
  selectedTickets,
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
      const number = i
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

  return (
    <>
      <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[600px] overflow-y-auto p-2'>
        {tickets.map(ticket => (
          <div
            key={ticket.number}
            className={cn(
              'relative group',
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
                'w-full p-2 text-sm rounded-md transition-all duration-300 flex items-center justify-center',
                'focus:outline-none focus:ring-2',
                ticket.cursorStyle,
                ticket.isHighlighted && 'ring-4 ring-amber-500 ring-opacity-75',
                ticket.isSelected && 'bg-amber-500 text-gray-900 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
                ticket.isSold && 'bg-black text-amber-500 border border-amber-500/30 cursor-not-allowed',
                ticket.isReserved && 'bg-amber-900/20 text-amber-300 border border-amber-500/30',
                !ticket.isSold && !ticket.isReserved && !ticket.isSelected && 'bg-black/50 text-gray-200 border border-gray-700/50 hover:bg-gray-800/50 hover:border-amber-600/50'
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
              <div className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full p-0.5 cursor-pointer"
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
                  className="h-5 w-5 rounded-full bg-amber-500 text-black flex items-center justify-center"
                  onClick={() => setTicketToUnreserve(ticket.number)}
                >
                  <span className="text-xs font-bold">×</span>
                </button>
              </div>
            )}
          </div>
        ))}
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

TicketGrid.displayName = 'TicketGrid'
export default TicketGrid

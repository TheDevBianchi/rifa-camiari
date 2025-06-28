'use client'

import { useState, memo, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail } from 'lucide-react'
import { toast } from 'sonner'

export const ConfirmAction = memo(({ purchase, onPurchaseUpdate, selectedRaffle }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleConfirm = useCallback(async () => {
    if (isPending) return

    setIsPending(true)
    try {
      const result = await confirmPurchase(purchase)
      if (result.success) {
        toast.success(result.message || 'Compra confirmada exitosamente')
        setIsOpen(false)
        if (typeof onPurchaseUpdate === 'function') {
          // Actualizar la lista de compras para reflejar el cambio de estado
          onPurchaseUpdate(prevPurchases => 
            prevPurchases.map(p => 
              p.id === purchase.id 
                ? { ...p, status: 'confirmed' } 
                : p
            )
          )
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsPending(false)
    }
  }, [purchase, isPending, onPurchaseUpdate])

  const formatTickets = (tickets) => {
    if (!tickets || tickets.length === 0) return 'sin tickets'
    return tickets.sort((a, b) => a - b).join(', ')
  }

  const getPurchaseDetails = () => {
    const details = []
    
    if (purchase.name) details.push(`Nombre: ${purchase.name}`)
    if (purchase.email) details.push(`Email: ${purchase.email}`)
    if (purchase.phone) details.push(`Teléfono: ${purchase.phone}`)
    
    return details.join('\n')
  }

  // Si la compra ya está confirmada, no mostrar el botón
  if (purchase.status === 'confirmed') {
    return (
      <span className="inline-flex items-center text-green-500 text-sm">
        <CheckCircle className="h-4 w-4 mr-1" />
        Confirmado
      </span>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="border-amber-500/30 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-300"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Confirmar
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar esta compra?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="whitespace-pre-line font-medium">
                {getPurchaseDetails()}
              </p>
              <p>
                Tickets seleccionados: <span className="font-medium">{formatTickets(purchase.selectedTickets)}</span>
              </p>
              <p>
                Rifa: <span className="font-medium">{purchase.raffleName}</span>
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-4 text-amber-400 flex items-start">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  Al confirmar esta compra, se enviará un correo electrónico de confirmación al comprador y se asignarán oficialmente los tickets.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              {isPending ? 'Procesando...' : 'Confirmar Compra'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})

ConfirmAction.displayName = 'ConfirmAction'

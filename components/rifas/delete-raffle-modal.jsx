import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DeleteRaffleModal({
  isOpen,
  onClose,
  onConfirm,
  raffle,
  isDeleting,
}) {
  const hasPendingPurchases = raffle?.pendingPurchases?.length > 0
  const hasConfirmedUsers = raffle?.users?.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-primary-950 border-primary-700 text-primary-100 shadow-2xl">
        <DialogHeader>
          <div className='flex items-center gap-3 text-secondary-500'>
            <AlertTriangle size={24} />
            <DialogTitle className="text-secondary-500">Confirmar eliminación</DialogTitle>
          </div>
        </DialogHeader>

        <div className='space-y-4'>
          <DialogDescription className='text-primary-200'>
            ¿Estás seguro de que deseas eliminar la rifa &quot;{raffle?.title}
            ?&quot;
          </DialogDescription>

          {(hasPendingPurchases || hasConfirmedUsers) && (
            <div className='bg-secondary-50/10 border border-secondary-500/40 rounded-md p-4 text-sm'>
              <p className='font-medium text-secondary-400 mb-2'>¡Atención!</p>
              {hasPendingPurchases && (
                <p className='text-secondary-300 mb-2'>
                  Esta rifa tiene {raffle.pendingPurchases.length} compras
                  pendientes.
                </p>
              )}
              {hasConfirmedUsers && (
                <p className='text-secondary-300'>
                  Esta rifa tiene {raffle.users.length} tickets vendidos.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className='flex gap-3'>
          <Button variant='outline' onClick={onClose} disabled={isDeleting} className="border-secondary-500 text-secondary-500 hover:bg-secondary-500/10 hover:text-white">
            Cancelar
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold border-none"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className='animate-spin mr-2' />
                Eliminando...
              </>
            ) : (
              'Eliminar Rifa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

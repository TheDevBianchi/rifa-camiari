import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2, AlertCircle } from 'lucide-react'

export function UnreservTicketDialog({
  selectedTicket,
  isUnreserving,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={!!selectedTicket} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-amber-500 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Liberar Ticket #{selectedTicket}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            ¿Estás seguro de que deseas liberar este ticket reservado?
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' className="border-amber-500/50 text-amber-500 hover:bg-amber-950" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isUnreserving}
            className='bg-amber-500 text-black hover:bg-amber-600'>
            {isUnreserving ? (
              <>
                <Loader2 size={16} className='animate-spin mr-2' />
                Liberando...
              </>
            ) : (
              'Liberar Ticket'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

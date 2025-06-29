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
      <DialogContent className="bg-black border border-primary-500/20 shadow-[0_0_15px_rgba(140,82,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-primary-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary-400" />
            Liberar Ticket #{selectedTicket}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            ¿Estás seguro de que deseas liberar este ticket reservado?
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' className="border-primary-500/50 text-primary-400 hover:bg-primary-950" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isUnreserving}
            className='bg-primary-500 text-white hover:bg-primary-600'>
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserInfoField } from './user-info-field'
import { Ticket } from 'lucide-react'

export function UserInfoDialog({ open, onOpenChange, user, index }) {
  if (!user) return null
  console.log(index)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] bg-black border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
        <DialogHeader>
          <DialogTitle className='text-amber-500 flex items-center gap-2'>
            <Ticket className='w-5 h-5 text-amber-500' />
            Información del ticket #{index}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <UserInfoField label='Nombre' value={user.name} />
          <UserInfoField label='Email' value={user.email} isSensitive={true} />
          <UserInfoField
            label='Teléfono'
            value={user.phone}
            isSensitive={true}
          />
          <UserInfoField
            label='Fecha de compra'
            value={new Date(user.purchaseDate?.seconds * 1000).toLocaleString()}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

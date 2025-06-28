import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className='bg-gray-800 p-4 md:p-6 rounded-lg'>
      <div className='animate-pulse space-y-3 md:space-y-4'>
        <div className='h-6 md:h-7 bg-gray-700 rounded w-48'></div>
        <div className='space-y-3 md:space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-20 md:h-24 bg-gray-700 rounded'></div>
          ))}
        </div>
      </div>
    </div>
  )
}

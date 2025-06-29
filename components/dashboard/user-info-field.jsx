import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UserInfoField({ label, value, isSensitive = false, isLink = false, linkText = "" }) {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  const maskValue = (value) => {
    if (!value) return ''
    if (value.includes('@')) {
      // Email mask
      const [username, domain] = value.split('@')
      return `${username[0]}${'*'.repeat(username.length - 1)}@${domain}`
    }
    // Phone mask
    return `${value[0]}${'*'.repeat(value.length - 2)}${
      value[value.length - 1]
    }`
  }

  return (
    <div className='relative'>
      <label className='text-sm text-primary-400/80'>{label}:</label>
      <div className='flex items-center gap-2'>
        {isLink ? (
          <a href={linkText} className='font-medium text-gray-200' target='_blank' rel='noopener noreferrer'>
            {isSensitive ? (isVisible ? value : maskValue(value)) : value}
          </a>
        ) : (
          <p className='font-medium text-gray-200'>
            {isSensitive ? (isVisible ? value : maskValue(value)) : value}
          </p>
        )}
        {isSensitive && (
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleVisibility}
            className='p-1 h-auto hover:bg-primary-900/20 hover:text-primary-400'>
            {isVisible ? (
              <EyeOff className='h-4 w-4 text-primary-400/70' />
            ) : (
              <Eye className='h-4 w-4 text-primary-400/70' />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

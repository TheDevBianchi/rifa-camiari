import { Controller } from 'react-hook-form'
import { User, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'

const PersonalInfoSection = ({ control, errors }) => (
  <div className='space-y-6 bg-black/80 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
    <h2 className='text-xl text-amber-500 font-bold flex items-center gap-2'>
      <User className='w-5 h-5' />
      Información Personal
    </h2>

    <div className='space-y-4'>
      {/* Campo Nombre */}
      <div className='space-y-2'>
        <label
          htmlFor='name'
          className='text-sm font-medium text-gray-200 flex items-center gap-2'>
          <User className='w-4 h-4 text-amber-500' />
          Nombre Completo
        </label>
        <Controller
          name='name'
          control={control}
          rules={{ required: 'El nombre es requerido' }}
          render={({ field }) => (
            <Input
              {...field}
              id='name'
              className='bg-black/50 border-gray-700/50 focus:border-amber-500/50 transition-colors'
              placeholder='John Doe'
            />
          )}
        />
        {errors.name && (
          <p className='text-amber-400 text-sm'>{errors.name.message}</p>
        )}
      </div>

      {/* Campo Email */}
      <div className='space-y-2'>
        <label
          htmlFor='email'
          className='text-sm font-medium text-gray-200 flex items-center gap-2'>
          <Mail className='w-4 h-4 text-amber-500' />
          Correo Electrónico
        </label>
        <Controller
          name='email'
          control={control}
          rules={{
            required: 'El correo es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              id='email'
              type='email'
              className='bg-black/50 border-gray-700/50 focus:border-amber-500/50 transition-colors'
              placeholder='john@example.com'
            />
          )}
        />
        {errors.email && (
          <p className='text-amber-400 text-sm'>{errors.email.message}</p>
        )}
      </div>

      {/* Campo Teléfono */}
      <div className='space-y-2'>
        <label
          htmlFor='phone'
          className='text-sm font-medium text-gray-200 flex items-center gap-2'>
          <Phone className='w-4 h-4 text-amber-500' />
          Teléfono
        </label>
        <Controller
          name='phone'
          control={control}
          rules={{ required: 'El teléfono es requerido' }}
          render={({ field }) => (
            <Input
              {...field}
              id='phone'
              type='tel'
              className='bg-black/50 border-gray-700/50 focus:border-amber-500/50 transition-colors'
              placeholder='+58 424 1234567'
            />
          )}
        />
        {errors.phone && (
          <p className='text-amber-400 text-sm'>{errors.phone.message}</p>
        )}
      </div>
    </div>
  </div>
)

export default PersonalInfoSection

import { Controller } from 'react-hook-form'
import { Ticket, AlertCircle, DollarSign, Tag, Percent, Package, ArrowDownCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePromotion } from '@/hooks/usePromotion'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const TicketSelectionSection = ({
  raffle,
  control,
  errors,
  randomTicketCount,
  setRandomTicketCount,
  selectedTickets,
  showAllTickets,
  setShowAllTickets,
  setValue,
  dollarPrice,
  setPromotionData, // Función para enviar datos de promoción al componente padre
}) => {
  // Usar el hook de promociones
  const {
    promotions,
    loading: loadingPromotions,
    selectedPromotion,
    setSelectedPromotion,
    calculateTotal,
    getApplicablePromotions,
    getBestPromotion,
    calculateSavings,
    validateCreatorCode
  } = usePromotion(raffle.id, raffle.price);
  
  // Estado para el código de creador
  const [creatorCode, setCreatorCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeValidationResult, setCodeValidationResult] = useState(null);
  const [showCreatorCodeInput, setShowCreatorCodeInput] = useState(false);
  
  // Estado para mostrar el badge de mejor oferta
  const [bestPromoId, setBestPromoId] = useState(null);
  const availableTickets = Array.from(
    { length: raffle.totalTickets },
    (_, i) => {
      const number = i + 1
      if (raffle.totalTickets <= 100) {
        return number.toString().padStart(2, '0')
      } else if (raffle.totalTickets <= 1000) {
        return number.toString().padStart(3, '0')
      } else {
        return number.toString().padStart(4, '0')
      }
    }
  )

  const handleTicketClick = (number) => {
    const updatedTickets = selectedTickets.includes(number)
      ? selectedTickets.filter((t) => t !== number)
      : [...selectedTickets, number]
    setValue('selectedTickets', updatedTickets, { shouldValidate: true })
  }
  
  // Actualizar la promoción cuando cambia la cantidad de tickets
  useEffect(() => {
    const ticketCount = raffle.randomTickets ? randomTicketCount : selectedTickets.length;
    
    // Obtener la mejor promoción (solo para mostrar el badge)
    const bestPromo = getBestPromotion(ticketCount);
    setBestPromoId(bestPromo.promotion?.id || null);
    
    // Calcular precios y enviar al componente padre
    const regularTotal = ticketCount * raffle.price;
    const discountedTotal = selectedPromotion ? calculateTotal(ticketCount) : regularTotal;
    const savings = selectedPromotion ? calculateSavings(ticketCount) : 0;
    
    setPromotionData({
      selectedPromotion,
      regularTotal,
      discountedTotal,
      savings
    });
  }, [raffle.randomTickets, randomTicketCount, selectedTickets.length, getBestPromotion, calculateTotal, calculateSavings, setPromotionData, selectedPromotion, raffle.price]);
  
  // Función para manejar la selección de promociones
  const handleSelectPromotion = (promo) => {
    // Si ya está seleccionada, deseleccionar
    if (selectedPromotion?.id === promo.id) {
      setSelectedPromotion(null);
    } else {
      setSelectedPromotion(promo);
    }
    
    // Limpiar el código de creador si se selecciona otra promoción
    if (promo && promo.discountType !== 'creator_code') {
      setCreatorCode('');
      setCodeValidationResult(null);
    }
  };
  
  // Función para validar el código de creador
  const handleValidateCreatorCode = async () => {
    if (!creatorCode.trim()) {
      toast.error('Ingresa un código de creador');
      return;
    }
    
    setIsValidatingCode(true);
    try {
      const result = await validateCreatorCode(creatorCode);
      
      if (result.success) {
        setCodeValidationResult({
          valid: true,
          promotion: result.promotion
        });
        setSelectedPromotion(result.promotion);
        toast.success(`¡Código aplicado! ${result.promotion.discountValue}% de descuento`);
      } else {
        setCodeValidationResult({
          valid: false,
          message: result.message || 'Código inválido'
        });
        setSelectedPromotion(null);
        toast.error(result.message || 'Código inválido');
      }
    } catch (error) {
      console.error('Error al validar código:', error);
      setCodeValidationResult({
        valid: false,
        message: 'Error al validar el código'
      });
      toast.error('Error al validar el código');
    } finally {
      setIsValidatingCode(false);
    }
  };

  return (
    <div className='space-y-6 bg-black/40 p-6 mb-8 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl text-amber-500 font-bold flex items-center gap-2'>
          <Ticket className='w-5 h-5' />
          Selección de Tickets
        </h2>
        <span className='text-sm text-gray-400'>
          Mínimo: {raffle.minTickets} tickets
        </span>
      </div>

      {raffle.randomTickets ? (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
              <Ticket className='w-4 h-4 text-gray-400' />
              Cantidad de tickets
            </label>
            <Input
              type='number'
              min={1}
              value={randomTicketCount || ''}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value >= 0) {
                  setRandomTicketCount(value)
                  setValue('selectedTickets', Array(value).fill(''), {
                    shouldValidate: true,
                  })
                }
              }}
              className='bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 transition-colors ring-black'
              placeholder={`Mínimo ${raffle.minTickets} tickets`}
            />
          </div>

          <div className='grid grid-cols-2 gap-2'>
            {/* Botones para establecer cantidad exacta de tickets */}
            <Button 
              className='bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300' 
              type='button' 
              onClick={() => {
                setRandomTicketCount(3);
                setValue('selectedTickets', Array(3).fill(''), { shouldValidate: true });
              }}
            >
              3 Tickets
            </Button>
            <Button 
              className='bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300' 
              type='button' 
              onClick={() => {
                setRandomTicketCount(5);
                setValue('selectedTickets', Array(5).fill(''), { shouldValidate: true });
              }}
            >
              5 Tickets
            </Button>
            <Button 
              className='bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300' 
              type='button' 
              onClick={() => {
                setRandomTicketCount(10);
                setValue('selectedTickets', Array(10).fill(''), { shouldValidate: true });
              }}
            >
              10 Tickets
            </Button>
            <Button 
              className='bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300' 
              type='button' 
              onClick={() => {
                setRandomTicketCount(15);
                setValue('selectedTickets', Array(15).fill(''), { shouldValidate: true });
              }}
            >
              15 Tickets
            </Button>
            <Button 
              className='bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300' 
              type='button' 
              onClick={() => {
                setRandomTicketCount(20);
                setValue('selectedTickets', Array(20).fill(''), { shouldValidate: true });
              }}
            >
              20 Tickets
            </Button>
            <Button 
              className='bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300' 
              type='button' 
              onClick={() => {
                setRandomTicketCount(50);
                setValue('selectedTickets', Array(50).fill(''), { shouldValidate: true });
              }}
            >
              50 Tickets
            </Button>
            <Button 
              className='bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300' 
              type='button' 
              onClick={() => {
                setRandomTicketCount(100);
                setValue('selectedTickets', Array(100).fill(''), { shouldValidate: true });
              }}
            >
              100 Tickets
            </Button>
          </div>
          
          {/* Mostrar promociones disponibles */}
          <div className='mt-4 pt-4 border-t border-gray-700'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-sm font-medium text-gray-200 flex items-center gap-2'>
                <Tag className='w-4 h-4 text-primary' />
                Promociones Disponibles
              </h3>
              {selectedPromotion ? (
                <button 
                  type="button" 
                  className="text-xs text-gray-400 hover:text-white underline"
                  onClick={() => {
                    setSelectedPromotion(null);
                    setCreatorCode('');
                    setCodeValidationResult(null);
                  }}
                >
                  Quitar promoción
                </button>
              ) : (
                <span className="text-xs text-gray-400 italic">Selecciona una promoción o usa un código</span>
              )}
            </div>
            
            {/* Sección para código de creador */}
            <div className='p-3 rounded-lg border border-purple-500/30 bg-black/50 hover:border-purple-500/50 transition-all duration-300 mb-3'>
              <h4 className='font-medium text-white flex items-center gap-2'>
                <Tag className='w-4 h-4 text-purple-400' />
                Código de Creador
              </h4>
              
              <div className='mt-2 flex gap-2'>
                <Input
                  type='text'
                  placeholder='Ingresa el código'
                  value={creatorCode}
                  onChange={(e) => setCreatorCode(e.target.value.toUpperCase())}
                  className='bg-black/50 border-gray-700/50 focus-visible:ring-purple-500/50 transition-colors ring-black'
                  disabled={isValidatingCode || codeValidationResult?.valid || (selectedPromotion && selectedPromotion.discountType !== 'creator_code')}
                />
                
                {codeValidationResult?.valid ? (
                  <Button 
                    type='button' 
                    variant='outline'
                    className='border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300'
                    onClick={() => {
                      setCreatorCode('');
                      setCodeValidationResult(null);
                      setSelectedPromotion(null);
                    }}
                  >
                    <XCircle className='w-4 h-4' />
                  </Button>
                ) : (
                  <Button 
                    type='button' 
                    variant='outline'
                    className='border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-300'
                    onClick={handleValidateCreatorCode}
                    disabled={isValidatingCode || !creatorCode.trim() || (selectedPromotion && selectedPromotion.discountType !== 'creator_code')}
                  >
                    {isValidatingCode ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      'Aplicar'
                    )}
                  </Button>
                )}
              </div>
              
              {codeValidationResult && (
                <div className={`mt-2 text-sm flex items-center gap-1 ${codeValidationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                  {codeValidationResult.valid ? (
                    <>
                      <CheckCircle className='w-4 h-4' />
                      <span>¡Código aplicado! {codeValidationResult.promotion.discountValue}% de descuento</span>
                    </>
                  ) : (
                    <>
                      <XCircle className='w-4 h-4' />
                      <span>{codeValidationResult.message}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Otras promociones disponibles */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-3 mb-3">
              <p className="text-xs text-blue-300">
                <span className="font-medium">Nota:</span> Solo puedes aplicar una promoción a la vez. Selecciona la que más te convenga.
              </p>
            </div>
            
            <div className='space-y-2'>
              {promotions && promotions.filter(promo => promo.active && promo.discountType !== 'creator_code').map(promo => (
                <div 
                  key={promo.id}
                  onClick={() => handleSelectPromotion(promo)}
                  className={cn(
                    'p-3 rounded-md border cursor-pointer transition-all',
                    selectedPromotion?.id === promo.id
                      ? 'bg-green-900/30 border-green-500/30 shadow-[0_0_10px_rgba(0,255,0,0.1)]'
                      : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                  )}
                >
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-white'>{promo.name}</span>
                    <div className="flex items-center gap-1">
                      {bestPromoId === promo.id && (
                        <span className='text-xs bg-blue-900/70 text-blue-300 px-2 py-0.5 rounded-full'>
                          Mejor oferta
                        </span>
                      )}
                      {selectedPromotion?.id === promo.id && (
                        <span className='text-xs bg-green-900/70 text-green-300 px-2 py-0.5 rounded-full'>
                          Aplicada
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className='text-sm text-gray-300 mt-1 flex items-center'>
                    {promo.discountType === 'percentage' && (
                      <>
                        <Percent className='w-3.5 h-3.5 mr-1 text-yellow-400' />
                        <span>{promo.discountValue}% de descuento</span>
                      </>
                    )}
                    {promo.discountType === 'lower_cost' && (
                      <>
                        <ArrowDownCircle className='w-3.5 h-3.5 mr-1 text-red-400' />
                        <span>Precio reducido: ${promo.newTicketPrice} por ticket</span>
                      </>
                    )}
                    {promo.discountType === 'package' && (
                      <>
                        <Package className='w-3.5 h-3.5 mr-1 text-blue-400' />
                        <span>{promo.minTickets} tickets por ${promo.packagePrice}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {(!promotions || promotions.filter(promo => promo.active && promo.discountType !== 'creator_code').length === 0) && (
                <p className='text-sm text-gray-400 italic'>No hay otras promociones disponibles</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Ticket className='w-4 h-4 text-gray-400' />
              <span className='text-sm font-medium text-gray-200'>
                Tickets Disponibles
              </span>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setShowAllTickets(!showAllTickets)}>
              {showAllTickets ? 'Mostrar Menos' : 'Mostrar Todos'}
            </Button>
          </div>

          <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[300px] overflow-y-auto p-2'>
            {availableTickets
              .slice(0, showAllTickets ? undefined : 40)
              .map((number) => (
                <button
                  key={number}
                  type='button'
                  onClick={() => handleTicketClick(number)}
                  className={cn(
                    'p-2 text-sm rounded-md transition-all duration-300',
                    'hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50',
                    selectedTickets.includes(number)
                      ? 'bg-primary text-gray-200 shadow-[0_0_10px_rgba(0,255,140,0.3)]'
                      : 'bg-black/50 text-gray-200 border border-gray-700/50'
                  )}>
                  {number}
                </button>
              ))}
          </div>

          {!showAllTickets && availableTickets.length > 40 && (
            <p className='text-center text-sm text-gray-400'>
              Mostrando 40 de {availableTickets.length} tickets disponibles
            </p>
          )}

          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-200'>
              Tickets Seleccionados ({selectedTickets.length}/
              {selectedTickets.length > raffle.minTickets
                ? selectedTickets.length
                : raffle.minTickets}
              )
            </h3>
            <div className='flex flex-wrap gap-2'>
              {selectedTickets.map((number) => (
                <span
                  key={number}
                  className='px-3 py-1 bg-primary/20 text-primary rounded-full text-sm'>
                  {number}
                </span>
              ))}
            </div>
          </div>
          
          {/* Código de creador para tickets específicos */}
          <div className='mt-4 pt-4 border-t border-gray-700'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-sm font-medium text-gray-200 flex items-center gap-2'>
                <Tag className='w-4 h-4 text-primary' />
                Promociones Disponibles
              </h3>
              {selectedPromotion ? (
                <button 
                  type="button" 
                  className="text-xs text-gray-400 hover:text-white underline"
                  onClick={() => {
                    setSelectedPromotion(null);
                    setCreatorCode('');
                    setCodeValidationResult(null);
                  }}
                >
                  Quitar promoción
                </button>
              ) : (
                <span className="text-xs text-gray-400 italic hover:cursor-pointer">Selecciona una promoción o usa un código</span>
              )}
            </div>
            
            {/* Sección para código de creador */}
            {!showCreatorCodeInput ? (
              <div className='p-3 rounded-lg border border-purple-500/30 bg-black/50 hover:border-purple-500/50 transition-all duration-300 mb-3'>
              <h4 className='font-medium text-white flex items-center gap-2'>
                <Tag className='w-4 h-4 text-purple-400' />
                Código de Creador
              </h4>
              
              <div className='mt-2 flex gap-2'>
                <Input
                  type='text'
                  placeholder='Ingresa el código'
                  value={creatorCode}
                  onChange={(e) => setCreatorCode(e.target.value.toUpperCase())}
                  className='bg-black/50 border-gray-700/50 focus-visible:ring-purple-500/50 transition-colors ring-black'
                  disabled={isValidatingCode || codeValidationResult?.valid || (selectedPromotion && selectedPromotion.discountType !== 'creator_code')}
                />
                
                {codeValidationResult?.valid ? (
                  <Button 
                    type='button' 
                    variant='outline'
                    className='border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300'
                    onClick={() => {
                      setCreatorCode('');
                      setCodeValidationResult(null);
                      setSelectedPromotion(null);
                    }}
                  >
                    <XCircle className='w-4 h-4' />
                  </Button>
                ) : (
                  <Button 
                    type='button' 
                    variant='outline'
                    className='border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-300'
                    onClick={handleValidateCreatorCode}
                    disabled={isValidatingCode || !creatorCode.trim() || (selectedPromotion && selectedPromotion.discountType !== 'creator_code')}
                  >
                    {isValidatingCode ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      'Aplicar'
                    )}
                  </Button>
                )}
              </div>
              
              {codeValidationResult && (
                <div className={`mt-2 text-sm flex items-center gap-1 ${codeValidationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                  {codeValidationResult.valid ? (
                    <>
                      <CheckCircle className='w-4 h-4' />
                      <span>¡Código aplicado! {codeValidationResult.promotion.discountValue}% de descuento</span>
                    </>
                  ) : (
                    <>
                      <XCircle className='w-4 h-4' />
                      <span>{codeValidationResult.message}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            ) : null}
            
            {/* Otras promociones disponibles */}
            {promotions && promotions.filter(promo => promo.active && promo.discountType !== 'creator_code').length > 0 && (
              <>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-3 mb-3">
                  <p className="text-xs text-blue-300">
                    <span className="font-medium">Nota:</span> Solo puedes aplicar una promoción a la vez. Selecciona la que más te convenga.
                  </p>
                </div>
                
                <div className='space-y-2'>
                  {promotions.filter(promo => promo.active && promo.discountType !== 'creator_code').map(promo => (
                    <div 
                      key={promo.id}
                      onClick={() => handleSelectPromotion(promo)}
                      className={cn(
                        'p-3 rounded-md border cursor-pointer transition-all',
                        selectedPromotion?.id === promo.id
                          ? 'bg-green-900/30 border-green-500/30 shadow-[0_0_10px_rgba(0,255,0,0.1)]'
                          : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                      )}
                    >
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-white'>{promo.name}</span>
                        <div className="flex items-center gap-1">
                          {bestPromoId === promo.id && (
                            <span className='text-xs bg-blue-900/70 text-blue-300 px-2 py-0.5 rounded-full'>
                              Mejor oferta
                            </span>
                          )}
                          {selectedPromotion?.id === promo.id && (
                            <span className='text-xs bg-green-900/70 text-green-300 px-2 py-0.5 rounded-full'>
                              Aplicada
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className='text-sm text-gray-300 mt-1 flex items-center'>
                        {promo.discountType === 'percentage' && (
                          <>
                            <Percent className='w-3.5 h-3.5 mr-1 text-yellow-400' />
                            <span>{promo.discountValue}% de descuento</span>
                          </>
                        )}
                        {promo.discountType === 'lower_cost' && (
                          <>
                            <ArrowDownCircle className='w-3.5 h-3.5 mr-1 text-red-400' />
                            <span>Precio reducido: ${promo.newTicketPrice} por ticket</span>
                          </>
                        )}
                        {promo.discountType === 'package' && (
                          <>
                            <Package className='w-3.5 h-3.5 mr-1 text-blue-400' />
                            <span>{promo.minTickets} tickets por ${promo.packagePrice}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedTickets.length > 0 &&
        selectedTickets.length < raffle.minTickets && (
          <div className='flex items-start gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20'>
            <AlertCircle className='w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-yellow-300'>
              Debes seleccionar al menos {raffle.minTickets} tickets para
              continuar
            </p>
          </div>
        )}

      <Controller
        name='selectedTickets'
        control={control}
        rules={{
          validate: (value) =>
            value?.length >= raffle.minTickets ||
            `Debes seleccionar al menos ${raffle.minTickets} tickets`,
        }}
        render={({ field }) => <input type='hidden' {...field} />}
      />
    </div>
  )
}

export default TicketSelectionSection

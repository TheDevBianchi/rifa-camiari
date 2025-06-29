// components/promos/PromoModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { getRaffles } from "@/app/dashboard/compras/actions";
import { useState, useEffect } from "react"; // At the top of the file
import { Controller } from "react-hook-form"; // Import Controller
import { Tag, Percent, Package, ArrowDownCircle, Edit, PlusCircle } from 'lucide-react'; // Import icons
import { createPromotion, updatePromotion } from '@/utils/firebase/promoService'; // Importar funciones de Firebase
import { toast } from 'sonner'; // Para notificaciones

export function PromoModal({ isOpen, onClose, raffleId, promotion, onPromotionSaved }) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
        getValues,
    } = useForm(); // Add control and watch
    const isEditing = !!promotion;
    const discountType = watch("discountType"); // Watch the discountType field
    const [raffles, setRaffles] = useState([]);
    const [loading, setLoading] = useState(false); // Estado para controlar la carga

    useEffect(() => {
        const fetchRaffles = async () => {
        const { raffles, success } = await getRaffles();
        if (success) {
            setRaffles(raffles);
        }
        };
        fetchRaffles();
    }, []);

    useEffect(() => {
        // (Keep the existing useEffect logic for resetting the form)
         if (isOpen && isEditing) {
             reset({
                 name: promotion.name,
                 raffleId: promotion.raffleId || raffleId,
                 discountType: promotion.discountType,
                 discountValue: promotion.discountValue,
                 minTickets: promotion.minTickets,
                 packagePrice: promotion.packagePrice,
                 newTicketPrice: promotion.newTicketPrice,
             });
         } else if (isOpen) {
             reset({
                 raffleId: raffleId || '',
                 name: '',
                 discountType: '',
                 discountValue: '',
                 minTickets: '',
                 packagePrice: '',
                 newTicketPrice: '',
             });
         }
    }, [isOpen, isEditing, promotion, reset, raffleId]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            
            // Preparar los datos según el tipo de descuento
            const promoData = {
                name: data.name,
                raffleId: data.raffleId,
                discountType: data.discountType,
                active: true // Por defecto, las promociones se crean activas
            };
            
            // Agregar campos específicos según el tipo de descuento
            if (data.discountType === 'percentage') {
                promoData.discountValue = data.discountValue;
            } else if (data.discountType === 'lower_cost') {
                promoData.newTicketPrice = data.newTicketPrice;
            } else if (data.discountType === 'package') {
                promoData.minTickets = data.minTickets;
                promoData.packagePrice = data.packagePrice;
            } else if (data.discountType === 'creator_code') {
                promoData.creatorCode = data.creatorCode;
                promoData.discountValue = data.discountValue;
            }
            
            let result;
            
            if (isEditing) {
                // Actualizar promoción existente
                result = await updatePromotion(promotion.id, promoData);
            } else {
                // Crear nueva promoción
                result = await createPromotion(promoData);
            }
            
            if (result.success) {
                toast.success(result.message);
                // Notificar al componente padre que se guardó la promoción
                if (onPromotionSaved) {
                    onPromotionSaved();
                }
                onClose(); // Cerrar el modal
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error al guardar promoción:', error);
            toast.error('Error al guardar la promoción: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-primary-950 border-primary-700 text-primary-100 shadow-2xl">
            <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center text-xl font-semibold text-primary-500">
                    {isEditing ? <Edit className="mr-2 h-5 w-5 text-secondary-500" /> : <PlusCircle className="mr-2 h-5 w-5 text-primary-500" />}
                    {isEditing ? "Editar Promoción" : "Crear Nueva Promoción"}
                </DialogTitle>
            <DialogDescription className="text-secondary-400">
                {isEditing
                ? "Modifica los detalles de la promoción existente."
                : "Define los detalles para una nueva promoción."}
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* General Promotion Details */}
                <div className="space-y-4 p-4 border border-primary-700 rounded-lg bg-primary-900/60">
                     <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                        <Label htmlFor="name" className="text-right col-span-1 text-sm text-primary-200">
                            Nombre
                        </Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'El nombre es requerido' })}
                            className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 placeholder-primary-400 focus:ring-primary-500 focus:border-primary-500"
                             placeholder="Ej: Promo Verano"
                        />
                        {errors.name && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.name.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                        <Label htmlFor="raffleId" className="text-right col-span-1 text-sm text-primary-200">
                            Rifa
                        </Label>
                         <Controller
                            name="raffleId"
                            control={control}
                            rules={{ required: 'Seleccionar una rifa es requerido' }}
                            defaultValue={raffleId || (isEditing ? promotion?.raffleId : '')}
                            render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || ''}
                                disabled={!!raffleId && !isEditing}
                            >
                                <SelectTrigger className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 focus:ring-primary-500 focus:border-primary-500 [&>svg]:text-primary-400">
                                <SelectValue placeholder="Selecciona una rifa" />
                                </SelectTrigger>
                                <SelectContent className="bg-primary-900 border-primary-700 text-primary-100">
                                    {raffles.map((raffle) => (
                                        <SelectItem key={raffle.id} value={raffle.id} className="hover:bg-primary-800 focus:bg-primary-800">
                                            {raffle.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            )}
                        />
                        {errors.raffleId && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.raffleId.message}</p>}
                    </div>
                </div>

                {/* Discount Type and Conditional Fields */}
                <div className="space-y-4 p-4 border border-primary-700 rounded-lg bg-primary-900/60">
                    <div className="space-y-2">
                        <Label htmlFor="discountType" className="text-sm text-primary-200">
                            Tipo de Descuento
                        </Label>
                        <Controller
                            name="discountType"
                            control={control}
                            rules={{ required: "El tipo de descuento es requerido" }}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        reset({
                                            ...getValues(),
                                            discountType: value,
                                            discountValue: '', 
                                            minTickets: '', 
                                            packagePrice: '', 
                                            newTicketPrice: '',
                                            creatorCode: ''
                                        });
                                    }}
                                    value={field.value || ''}
                                >
                                <SelectTrigger className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 focus:ring-primary-500 focus:border-primary-500 [&>svg]:text-primary-400">
                                    <SelectValue placeholder="Selecciona tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-primary-900 border-primary-700 text-primary-100">
                                    <SelectItem value="percentage" className="hover:bg-primary-800 focus:bg-primary-800"><Percent className="inline h-4 w-4 mr-2 text-primary-400"/>Porcentaje (%)</SelectItem>
                                    <SelectItem value="lower_cost" className="hover:bg-primary-800 focus:bg-primary-800"><ArrowDownCircle className="inline h-4 w-4 mr-2 text-secondary-400"/>Bajar Coste Tickets</SelectItem>
                                    <SelectItem value="package" className="hover:bg-primary-800 focus:bg-primary-800"><Package className="inline h-4 w-4 mr-2 text-primary-300"/>Paquete Boletos</SelectItem>
                                    <SelectItem value="creator_code" className="hover:bg-primary-800 focus:bg-primary-800"><Tag className="inline h-4 w-4 mr-2 text-secondary-400"/>Código de Creador</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.discountType && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.discountType.message}</p>}
                    </div>

                    {/* Conditional Fields Area */}
                    <div className="space-y-4 mt-4 pl-4 border-l-2 border-primary-500/50">
                        {discountType === 'percentage' && (
                            <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                <Label htmlFor="discountValue" className="text-right col-span-1 text-sm text-primary-200">
                                    Porcentaje (%)
                                </Label>
                                <Input
                                    id="discountValue" type="number" placeholder="Ej: 10"
                                    {...register('discountValue', { 
                                         required: 'El porcentaje es requerido', valueAsNumber: true,
                                         min: { value: 1, message: 'El porcentaje debe ser positivo' },
                                         max: { value: 99, message: 'El porcentaje debe ser menor a 100' }
                                     })}
                                    className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 placeholder-primary-400 focus:ring-primary-500 focus:border-primary-500"
                                />
                                {errors.discountValue && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.discountValue.message}</p>}
                            </div>
                        )}
                        
                        {discountType === 'creator_code' && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                    <Label htmlFor="creatorCode" className="text-right col-span-1 text-sm text-primary-200">
                                        Código
                                    </Label>
                                    <Input
                                        id="creatorCode" type="text" placeholder="Ej: CREADOR10"
                                        {...register('creatorCode', {
                                            required: 'El código de creador es requerido',
                                            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                            maxLength: { value: 20, message: 'Máximo 20 caracteres' },
                                            pattern: {
                                                value: /^[A-Za-z0-9_-]+$/,
                                                message: 'Solo letras, números, guiones y guiones bajos'
                                            }
                                        })}
                                        className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 placeholder-primary-400 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    {errors.creatorCode && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.creatorCode.message}</p>}
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                    <Label htmlFor="discountValue" className="text-right col-span-1 text-sm text-primary-200">
                                        Descuento (%)
                                    </Label>
                                    <Input
                                        id="discountValue" type="number" placeholder="Ej: 10"
                                        {...register('discountValue', {
                                            required: 'El porcentaje de descuento es requerido', 
                                            valueAsNumber: true,
                                            min: { value: 1, message: 'El porcentaje debe ser positivo' },
                                            max: { value: 99, message: 'El porcentaje debe ser menor a 100' }
                                        })}
                                        className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 placeholder-primary-400 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    {errors.discountValue && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.discountValue.message}</p>}
                                </div>
                            </>
                        )}

                        {discountType === 'lower_cost' && (
                             <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                <Label htmlFor="newTicketPrice" className="text-right col-span-1 text-sm text-primary-200">
                                    Nuevo Coste ($)
                                </Label>
                                <Input
                                    id="newTicketPrice" type="number" step="0.01" placeholder="Ej: 5.00"
                                    {...register('newTicketPrice', { 
                                        required: 'El nuevo coste es requerido', valueAsNumber: true,
                                        min: { value: 0.01, message: 'El coste debe ser positivo' }
                                    })}
                                    className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 placeholder-primary-400 focus:ring-primary-500 focus:border-primary-500"
                                />
                                {errors.newTicketPrice && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.newTicketPrice.message}</p>}
                            </div>
                        )}

                        {discountType === 'package' && (
                            <>
                                 <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                    <Label htmlFor="minTickets" className="text-right col-span-1 text-sm text-primary-200">
                                        Tickets Mín.
                                    </Label>
                                    <Input
                                        id="minTickets" type="number" placeholder="Ej: 5"
                                        {...register('minTickets', { 
                                            required: 'La cantidad mínima es requerida', valueAsNumber: true,
                                            min: { value: 2, message: 'Debe ser al menos 2 tickets' }
                                        })}
                                        className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 placeholder-primary-400 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    {errors.minTickets && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.minTickets.message}</p>}
                                </div>
                                 <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                    <Label htmlFor="packagePrice" className="text-right col-span-1 text-sm text-primary-200">
                                        Precio Paquete ($)
                                    </Label>
                                    <Input
                                        id="packagePrice" type="number" step="0.01" placeholder="Ej: 20.00"
                                        {...register('packagePrice', { 
                                            required: 'El precio del paquete es requerido', valueAsNumber: true,
                                            min: { value: 0.01, message: 'El precio debe ser positivo' }
                                        })}
                                        className="col-span-3 bg-primary-950 border-primary-700 text-primary-100 placeholder-primary-400 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    {errors.packagePrice && <p className="col-span-full text-secondary-400 text-xs mt-1 text-right">{errors.packagePrice.message}</p>}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button type='button' variant='outline' onClick={onClose} className="border-secondary-500 text-secondary-500 hover:bg-secondary-500/10 hover:text-white" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        className={`${isEditing ? 'bg-secondary-500 hover:bg-secondary-600' : 'bg-primary-500 hover:bg-primary-600'} text-white font-bold`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditing ? "Guardando..." : "Creando..."}
                            </span>
                        ) : (
                            isEditing ? "Guardar Cambios" : "Crear Promoción"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
}
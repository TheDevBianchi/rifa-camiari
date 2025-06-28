import React, { useState, useEffect } from 'react';
import { getPromotionsByRaffleId } from '@/utils/firebase/promoService';
import { Percent, Package, ArrowDownCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Componente para mostrar las promociones activas de una rifa
 */
export function PromoDisplay({ raffleId, ticketPrice }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!raffleId) return;
      
      try {
        setLoading(true);
        const result = await getPromotionsByRaffleId(raffleId);
        
        if (result.success) {
          // Solo mostrar promociones activas
          const activePromos = result.promotions.filter(promo => promo.active);
          setPromotions(activePromos);
        }
      } catch (error) {
        console.error('Error al cargar promociones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotions();
  }, [raffleId]);
  
  // Si no hay promociones o está cargando, no mostrar nada
  if (loading || promotions.length === 0) {
    return <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-white/80">No hay promociones disponibles</h4>
    </div>;
  }
  
  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-white/80">Promociones Disponibles:</h4>
      <div className="space-y-2">
        {promotions.map((promo) => (
          <div 
            key={promo.id} 
            className="bg-gray-800/60 border border-gray-700/50 rounded-md p-2 text-sm"
          >
            <div className="font-medium text-white mb-1">{promo.name}</div>
            {promo.discountType === 'percentage' && (
              <div className="flex items-center text-yellow-400">
                <Percent className="h-3.5 w-3.5 mr-1" />
                <span>{promo.discountValue}% de descuento</span>
              </div>
            )}
            
            {promo.discountType === 'lower_cost' && (
              <div className="flex items-center text-green-400">
                <ArrowDownCircle className="h-3.5 w-3.5 mr-1" />
                <span>Precio especial: ${promo.newTicketPrice} por ticket</span>
                <Badge className="ml-2 bg-green-900/50 text-green-300 text-xs">
                  Ahorra ${(ticketPrice - promo.newTicketPrice).toFixed(2)}
                </Badge>
              </div>
            )}
            
            {promo.discountType === 'package' && (
              <div className="flex items-center text-blue-400">
                <Package className="h-3.5 w-3.5 mr-1" />
                <span>{promo.minTickets} tickets por ${promo.packagePrice}</span>
                {ticketPrice && (
                  <Badge className="ml-2 bg-blue-900/50 text-blue-300 text-xs">
                    Ahorra ${((ticketPrice * promo.minTickets) - promo.packagePrice).toFixed(2)}
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

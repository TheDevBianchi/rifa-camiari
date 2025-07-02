"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CreditCard,
  Receipt,
  X,
  ArrowRight,
  Check,
} from "lucide-react";
import { useCountryStore } from "@/store/use-country-store";
import CountryPrice from "@/components/ui/country-price";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  purchaseData,
  raffle,
  paymentMethod,
  isSubmitting,
}) => {
  const { selectedCountry } = useCountryStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!purchaseData || !raffle) return null;

  const ticketCount = purchaseData.selectedTickets?.length || 0;
  const totalAmount =
    purchaseData.promotion?.discountedTotal || ticketCount * raffle.price;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[8888]"
            onClick={() => onClose()}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 w-full max-w-md z-[9999] sm:max-h-[90vh] sm:w-full rounded-2xl sm:rounded-2xl sm:translate-x-[-50%] sm:translate-y-[-50%] px-8"
            initial={{ opacity: 0, y: 100, x: "-50%" }}
            animate={{ opacity: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, y: 100 }}
          >
            <div className="relative flex flex-col max-h-[90vh] rounded-2xl overflow-hidden bg-gradient-to-br from-black to-gray-900 border border-primary-500/20 shadow-xl">
              {/* Close button */}
              <button
                onClick={() => onClose()}
                className="absolute right-4 top-4 text-gray-400 hover:text-primary-400 transition-colors z-20"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Scrollable content */}
              <ScrollArea className="flex-1 px-6 pt-6 pb-28 min-h-0 max-h-[60vh] sm:max-h-[60vh]">
                <div className="mb-6">
                  <h2
                    id="modal-title"
                    className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent mb-2"
                  >
                    Confirmar Compra
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Por favor revisa los detalles de tu compra antes de continuar.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Resumen de tickets */}
                  <div className="bg-black/40 p-4 rounded-lg border border-primary-500/10">
                    <h3 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Resumen de tickets
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      {!raffle.randomTickets ? (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tickets seleccionados:</span>
                          <span className="font-medium text-white">
                            {purchaseData.selectedTickets?.join(", ")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cantidad de tickets:</span>
                          <span className="font-medium text-white">{ticketCount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Precio por ticket:</span>
                        <CountryPrice amount={raffle.price} className="font-medium text-white" />
                      </div>
                      {purchaseData.promotion && (
                        <div className="flex justify-between text-primary-300">
                          <span>Promoción aplicada:</span>
                          <span>{purchaseData.promotion.name}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-800">
                        <span className="text-gray-300">Total a pagar:</span>
                        <CountryPrice amount={totalAmount} className="font-bold text-primary-400" />
                      </div>
                    </div>
                  </div>

                  {/* Método de pago */}
                  <div className="bg-black/40 p-4 rounded-lg border border-primary-500/10">
                    <h3 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Método de pago
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
                        {paymentMethod?.imageUrl ? (
                          <Image
                            src={paymentMethod.imageUrl}
                            alt={paymentMethod.name}
                            width={40}
                            height={40}
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <CreditCard className="w-6 h-6 text-primary-500/50" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{paymentMethod?.name}</p>
                        <p className="text-xs text-gray-400">Moneda: {selectedCountry}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Referencia de pago:</span>
                      <span className="text-white">{purchaseData.paymentReference}</span>
                    </div>
                  </div>

                  {/* Información personal */}
                  <div className="bg-black/40 p-4 rounded-lg border border-primary-500/10">
                    <h3 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Información personal
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nombre:</span>
                        <span className="text-white">{purchaseData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{purchaseData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Teléfono:</span>
                        <span className="text-white">{purchaseData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Botones fijos abajo */}
              <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-4 bg-black/80 border-t border-primary-500/10 flex gap-3 z-[9999]">
                <button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-[0_0_15px_rgba(140,82,255,0.3)] transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Procesando</span>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    </>
                  ) : (
                    <>
                      Confirmar Compra
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => onClose()}
                  className="flex-1 px-4 py-2 border border-gray-600 bg-transparent text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;

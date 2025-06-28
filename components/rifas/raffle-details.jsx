"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, DollarSign, Calendar, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PromoDisplay } from "./PromoDisplay";

export function RaffleDetails({ raffle }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = raffle.images;

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Calcular el progreso de la rifa
  const progress = ((raffle.totalTickets - raffle.availableNumbers) / raffle.totalTickets) * 100;
  const progressFormatted = Number(progress.toFixed(2));
  const progressRounded = Math.round(progress);

  return (
    <div className="w-full bg-[#111111] rounded-xl overflow-hidden border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
      {/* Carrusel de imágenes */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="relative h-[400px]">
                    <Image
                      src={`${image}`}
                      alt={`${raffle.title} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-[0_0_100%] min-w-0">
                <div className="relative h-[400px] bg-black/50 flex items-center justify-center">
                  <span className="text-gray-400">
                    No hay imágenes disponibles
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full 
          hover:bg-amber-500/30 transition-all duration-300 border border-amber-500/20 z-10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full 
          hover:bg-amber-500/30 transition-all duration-300 border border-amber-500/20 z-10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {raffle.images &&
            raffle.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "bg-amber-500" : "bg-white/30 hover:bg-amber-400/50"
                }`}
              />
            ))}
        </div>

        {/* Título superpuesto */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {raffle.title}
          </h1>
        </div>
      </div>

      {/* Información de la rifa */}
      <div className="p-6 space-y-6">
        {/* Descripción */}
        <div className="bg-black/40 p-5 rounded-xl border border-amber-500/5">
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {raffle.description}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-3 bg-black/40 p-5 rounded-xl border border-amber-500/5">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-white">
              Progreso del Sorteo
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {progressFormatted}%
              </span>
              <span className="text-gray-400 text-sm">completado</span>
            </div>
          </div>
          <div className="h-4 bg-black/60 rounded-full overflow-hidden border border-amber-500/10 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.1)_30%,rgba(255,255,255,0)_50%)] animate-shine"></div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-200 mix-blend-difference">
              {progressRounded}%
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles de la Rifa */}
          <div className="bg-black/40 p-5 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              Detalles de la Rifa
            </h3>
            <div className="space-y-3">
              <p className="flex justify-between items-center">
                <span className="text-white">Precio por ticket:</span>
                <span className="text-xl font-bold text-amber-400">
                  ${raffle.price} USD
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Tickets mínimos:</span>
                <span className="text-gray-300">{raffle.minTickets}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Total de tickets:</span>
                <span className="text-gray-300">{raffle.totalTickets}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Tickets vendidos:</span>
                <span className="text-gray-300">{raffle.soldTickets?.length || 0}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Tickets disponibles:</span>
                <span className="text-gray-300">{raffle.availableNumbers}</span>
              </p>

              {/* Promociones disponibles */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <h4 className="text-lg font-medium text-amber-400 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  Promociones Disponibles
                </h4>
                <PromoDisplay raffleId={raffle.id} ticketPrice={raffle.price} />
              </div>
            </div>
          </div>

          {/* Fechas Importantes */}
          <div className="bg-black/40 p-5 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Fechas Importantes
            </h3>
            <div className="space-y-3">
              <p className="flex justify-between items-center">
                <span className="text-white">Inicio:</span>
                <span className="text-gray-300">
                  {raffle.startDate ? formatDate(raffle.startDate) : 'Fecha no disponible'}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-white">Finalización:</span>
                <span className="text-gray-300">
                  {raffle.endDate ? formatDate(raffle.endDate) : 'Aún no está definida'}
                </span>
              </p>

              {/* Información adicional */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                  <h4 className="text-amber-400 font-medium mb-2">Información importante</h4>
                  <ul className="text-gray-300 text-sm space-y-2 list-disc pl-4">
                    <li>El sorteo se realizará en vivo por nuestras redes sociales.</li>
                    <li>Los ganadores serán contactados por correo electrónico y teléfono.</li>
                    <li>El premio será entregado en un plazo máximo de 7 días hábiles.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

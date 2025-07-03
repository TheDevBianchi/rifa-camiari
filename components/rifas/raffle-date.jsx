import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

function RaffleDate({ raffle }) {
  return (
    <div className="bg-black/40 p-5 rounded-xl border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(140,82,255,0.1)]">
      <h3 className="text-xl font-bold text-primary-400 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary-400" />
        Fechas Importantes
      </h3>
      <div className="space-y-3">
        <p className="flex justify-between items-center">
          <span className="text-white">Inicio:</span>
          <span className="text-gray-300">
            {raffle.startDate
              ? formatDate(raffle.startDate)
              : "Fecha no disponible"}
          </span>
        </p>
        <p className="flex justify-between items-center">
          <span className="text-white">Finalización:</span>
          <span className="text-gray-300">
            {raffle.endDate
              ? formatDate(raffle.endDate)
              : "Aún no está definida"}
          </span>
        </p>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="bg-primary-500/10 p-4 rounded-lg border border-primary-500/20">
            <h4 className="text-primary-400 font-medium mb-2">
              Información importante
            </h4>
            <ul className="text-gray-300 text-sm space-y-2 list-disc pl-4">
              <li>
                El sorteo se realizará en vivo por nuestras redes sociales.
              </li>
              <li>
                Los ganadores serán contactados por correo electrónico y
                teléfono.
              </li>
              <li>
                El premio será entregado en un plazo máximo de 7 días hábiles.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaffleDate;

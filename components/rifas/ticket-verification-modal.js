"use client";
import { useState } from "react";
import { verifyTickets } from "@/utils/ticketVerificationService";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ticket, CheckCircle, AlertCircle, X } from "lucide-react";
import CountryPrice from "@/components/ui/country-price";

export default function TicketVerificationModal({ isOpen, onClose, raffleId }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const result = await verifyTickets(raffleId, formData);
            setVerificationResult(result);
        } catch (error) {
            setVerificationResult({
                success: false,
                message: "Error al verificar tickets: " + error.message,
                tickets: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div 
                    className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 max-w-md w-full shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <Ticket className="h-5 w-5 mr-2 text-amber-500" />
                                Verificar Tickets
                            </h2>
                            <button 
                                onClick={onClose}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Nombre
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Tu nombre completo"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="correo@ejemplo.com"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Teléfono
                        </label>
                        <div className="relative">
                            <Input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="+123456789"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 text-sm font-medium text-black bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Verificar
                                    <Search className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {verificationResult && (
                    <div className="mt-6 border-t border-zinc-700/50 pt-6">
                        <div className={`p-4 rounded-lg mb-4 flex items-start ${verificationResult.success ? "bg-green-900/20 border border-green-700" : "bg-red-900/20 border border-red-700"}`}>
                            {verificationResult.success ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            )}
                            <p className={`text-sm ${verificationResult.success ? "text-green-300" : "text-red-300"}`}>
                                {verificationResult.message}
                            </p>
                        </div>
                        {verificationResult.tickets.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Ticket className="h-5 w-5 mr-2 text-amber-500" />
                                    Tus tickets:
                                </h3>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {verificationResult.tickets.map((item, index) => (
                                        <div key={index} 
                                            className="bg-zinc-800 border border-amber-500/10 p-4 rounded-xl hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-amber-400 font-medium">
                                                    {item.raffleName || `Rifa ${item.raffleId}`}
                                                </h4>
                                                <span className="text-white font-medium">
                                                    <CountryPrice amount={item.totalAmount} />
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {item.tickets.map((ticket, idx) => (
                                                    <span key={idx} 
                                                        className="px-2 py-1 bg-black/40 border border-amber-500/20 rounded-md text-sm text-white hover:border-amber-500/40 transition-colors"
                                                    >
                                                        #{ticket}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

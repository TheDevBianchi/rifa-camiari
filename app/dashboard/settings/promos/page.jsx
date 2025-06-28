// app/dashboard/settings/promos/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { PlusCircle, Tag, Package, Percent, ArrowDownCircle, Trash2, Edit, Loader2, Settings } from 'lucide-react'
import { PromoModal } from '@/components/promos/PromoModal'; 
import { db } from '@/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { getAllPromotions, getPromotionsByRaffleId, deletePromotion, togglePromoStatus } from '@/utils/firebase/promoService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

export default function PromosPage () {
  const [raffles, setRaffles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRaffleId, setSelectedRaffleId] = useState(null) // To pre-select raffle in modal
  const [editingPromotion, setEditingPromotion] = useState(null) // State for promo being edited
  const [promotions, setPromotions] = useState([]) // State for all promotions
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // State for delete confirmation dialog
  const [promotionToDelete, setPromotionToDelete] = useState(null) // State for promotion to delete
  const [isProcessing, setIsProcessing] = useState(false) // State for processing actions

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch raffles
        const rafflesCollection = collection(db, 'raffles')
        const raffleSnapshot = await getDocs(rafflesCollection)
        const rafflesList = raffleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setRaffles(rafflesList)
        
        // Fetch all promotions
        const result = await getAllPromotions()
        if (result.success) {
          setPromotions(result.promotions)
        } else {
          console.error('Error fetching promotions:', result.message)
          toast.error('Error al cargar promociones')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleOpenCreateModal = (raffleId = null) => {
    setSelectedRaffleId(raffleId);
    setEditingPromotion(null); // Ensure we are in create mode
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promotion) => {
    setSelectedRaffleId(promotion.raffleId);
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRaffleId(null);
    setEditingPromotion(null);
  };

  const handlePromotionSaved = async () => {
    // Refetch promotions after saving
    const result = await getAllPromotions();
    if (result.success) {
      setPromotions(result.promotions);
      toast.success('Promociones actualizadas');
    }
  };

  const handleDeletePromotion = (promotion) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePromotion = async () => {
    if (!promotionToDelete) return;
    
    try {
      const result = await deletePromotion(promotionToDelete.id);
      if (result.success) {
        // Remove from state
        setPromotions(promotions.filter(p => p.id !== promotionToDelete.id));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Error al eliminar la promoción');
    } finally {
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
    }
  };

  const handleTogglePromoStatus = async (promotion) => {
    try {
      setIsProcessing(true);
      const newStatus = !promotion.active;
      const result = await togglePromoStatus(promotion.id, newStatus);
      
      if (result.success) {
        // Update in state
        setPromotions(promotions.map(p => 
          p.id === promotion.id ? { ...p, active: newStatus } : p
        ));
        toast.success(newStatus ? 'Promoción activada' : 'Promoción desactivada');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      toast.error('Error al cambiar el estado de la promoción');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter promotions by raffle ID
  const getPromotionsByRaffle = (raffleId) => {
    return promotions.filter(promo => promo.raffleId === raffleId);
  };

  // Helper function to render promotion details based on type
  const renderPromoDetails = (promo) => {
    switch (promo.discountType) {
      case 'percentage':
        return (
          <div className="flex items-center">
            <Percent className="h-4 w-4 mr-2 text-yellow-400" />
            <span>{promo.discountValue}% de descuento</span>
          </div>
        );
      case 'lower_cost':
        return (
          <div className="flex items-center">
            <ArrowDownCircle className="h-4 w-4 mr-2 text-red-400" />
            <span>Precio reducido: ${promo.newTicketPrice}</span>
          </div>
        );
      case 'package':
        return (
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-2 text-green-400" />
            <span>{promo.minTickets} tickets por ${promo.packagePrice}</span>
          </div>
        );
      default:
        return <span>Tipo de promoción desconocido</span>;
    }
  };

  return (
    <div className='p-6 space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
        <div>
          <div className='flex items-center gap-2'>
            <Link 
              href='/dashboard/settings' 
              className='text-gray-400 hover:text-white transition-colors'
            >
              <Settings className='h-5 w-5' />
            </Link>
            <span className='text-gray-400'>/</span>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>Promociones</h1>
          </div>
          <p className='text-gray-400 mt-1 text-sm'>Gestiona las promociones para tus rifas</p>
        </div>
        <Button 
          onClick={() => handleOpenCreateModal()}
          className='bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black transition-all duration-300'
        >
          <PlusCircle className='h-4 w-4 mr-2' />
          Nueva Promoción
        </Button>
      </div>

      {loading ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <Loader2 className='w-10 h-10 animate-spin text-amber-500' />
          <p className='text-gray-400 mt-4'>Cargando promociones...</p>
        </div>
      ) : (
        <div className='space-y-8'>
          {raffles.map(raffle => {
            const rafflePromotions = getPromotionsByRaffle(raffle.id);
            
            return (
              <div key={raffle.id} className='bg-black/60 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 rounded-xl overflow-hidden'>
                <div className='bg-gradient-to-r from-amber-950/50 to-black p-4 flex justify-between items-center'>
                  <h2 className='text-xl font-semibold text-amber-300'>{raffle.title}</h2>
                  <Button 
                    onClick={() => handleOpenCreateModal(raffle.id)} 
                    size='sm'
                    className='border-amber-500/30 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-300'
                    variant='outline'
                    disabled={isProcessing}
                  >
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Agregar Promoción
                  </Button>
                </div>
                
                <div className='p-4'>
                  {rafflePromotions.length > 0 ? (
                    <div className='space-y-3'>
                      {rafflePromotions.map(promo => (
                        <div key={promo.id} className='flex justify-between items-center p-4 bg-gray-900/60 rounded-lg border border-gray-800 hover:border-amber-500/20 transition-all duration-300'>
                          <div>
                            <div className='flex items-center space-x-2 mb-1'>
                              <h3 className='font-medium text-white'>{promo.name}</h3>
                              {promo.active ? (
                                <Badge variant="outline" className="text-xs bg-green-900/20 text-green-400 border-green-500/30">
                                  Activa
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-gray-800 text-gray-400 border-gray-700">
                                  Inactiva
                                </Badge>
                              )}
                            </div>
                            <div className='text-sm text-gray-300'>
                              {renderPromoDetails(promo)}
                            </div>
                          </div>
                          
                          <div className='flex space-x-2'>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-8 w-8 p-0 rounded-full ${promo.active ? 'text-green-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'}`}
                              onClick={() => handleTogglePromoStatus(promo)}
                              title={promo.active ? "Desactivar" : "Activar"}
                              disabled={isProcessing}
                            >
                              <span className="sr-only">{promo.active ? "Desactivar" : "Activar"}</span>
                              {promo.active ? "🟢" : "⚪"}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300"
                              onClick={() => handleOpenEditModal(promo)}
                              disabled={isProcessing}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                              onClick={() => handleDeletePromotion(promo)}
                              disabled={isProcessing}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-8 bg-black/50 rounded-lg border border-dashed border-amber-500/20 px-4'>
                      <Tag className='w-10 h-10 text-amber-500/70 mx-auto mb-3' />
                      <h3 className='text-lg font-semibold text-amber-300 mb-2'>
                        Sin promociones
                      </h3>
                      <p className='text-gray-400 mb-4 text-sm'>
                        No hay promociones configuradas para esta rifa.
                      </p>
                      <Button 
                        onClick={() => handleOpenCreateModal(raffle.id)}
                        className='bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black transition-all duration-300'
                        size='sm'
                        disabled={isProcessing}
                      >
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Crear Promoción
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Render the Modal */}
      <PromoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        raffleId={selectedRaffleId}
        promotion={editingPromotion}
        onPromotionSaved={handlePromotionSaved}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 border-amber-500/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-400">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Esta acción eliminará permanentemente la promoción <span className="font-medium text-white">&quot;{promotionToDelete?.name}&quot;</span> y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDeletePromotion}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </span>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
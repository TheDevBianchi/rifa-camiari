'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { RaffleLoadingState } from '@/components/rifas/raffle-loading-state'
import { RaffleErrorState } from '@/components/rifas/raffle-error-state'
import { RaffleContent } from '@/components/rifas/raffle-content'
import SuccessModal from '@/components/rifas/success-modal'
import { useRaffleDetails } from '@/hooks/useRaffleDetails'

const RafflePage = () => {
  const { id } = useParams()
  const {
    raffle,
    isLoading,
    showSuccessModal,
    submittedData,
    fetchRaffle,
    handleSubmit,
    setShowSuccessModal
  } = useRaffleDetails(id)

  useEffect(() => {
    fetchRaffle()
  }, [fetchRaffle])

  return (
    <div className='min-h-screen bg-black relative overflow-hidden'>
      {/* Elementos decorativos */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent'></div>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]'></div>
      </div>
      
      <div className='relative'>
        <Header />
        {isLoading ? (
          <RaffleLoadingState />
        ) : raffle ? (
          <RaffleContent raffle={raffle} onSubmit={handleSubmit} />
        ) : (
          <RaffleErrorState />
        )}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          purchaseData={submittedData}
          raffle={raffle}
        />
        <Footer />
      </div>
    </div>
  )
}

export default RafflePage

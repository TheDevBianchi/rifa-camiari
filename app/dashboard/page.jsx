'use client'

import React from 'react'
import { Toaster } from 'sonner'
import PendingPurchasesList from '@/components/dashboard/pending-purchases-list'
import { UserRanking } from '@/components/dashboard/UserRanking'

function Dashboard() {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Panel de Control</h1>
      <div className='space-y-6'>
        <section>
          <h2 className='text-xl font-semibold mb-4'>Compras Pendientes</h2>
          <PendingPurchasesList />
        </section>
        <section>
          <UserRanking />
        </section>
      </div>
      <Toaster />
    </div>
  )
}

export default Dashboard

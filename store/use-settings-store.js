import { create } from 'zustand'
import { doc, getDoc, setDoc, collection, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export const useSettingsStore = create((set, get) => ({
  paymentMethods: [],
  dollarPrice: {
    ARS: 900,
    CLP: 950,
    USD: 1
  },
  promotions: [],
  loading: false,
  error: null,
  selectedMethod: null,
  isEditModalOpen: false,

  setEditModal: isOpen => set({ isEditModalOpen: isOpen }),
  setSelectedMethod: method => set({ selectedMethod: method }),

  // Fetch payment methods
  getPaymentMethods: async () => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'paymentMethods')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        set({ paymentMethods: docSnap.data().methods || [] })
      } else {
        // Initialize document if it doesn't exist
        await setDoc(docRef, { methods: [] })
        set({ paymentMethods: [] })
      }
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // Fetch dollar price for all countries
  getDollarPrice: async () => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'dollarPrice')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const rates = docSnap.data() || {}
        set({ 
          dollarPrice: {
            ARS: rates.ARS || 900,
            CLP: rates.CLP || 950,
            VES: rates.VES || 100, // Bolívares venezolanos
          }
        })
      } else {
        // Initialize document if it doesn't exist
        const defaultRates = {
          ARS: 900,
          CLP: 950,
          VES: 100, // Bolívares venezolanos
        }
        await setDoc(docRef, defaultRates)
        set({ dollarPrice: defaultRates })
      }
    } catch (error) {
      console.error('Error fetching dollar prices:', error)
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // Update dollar price for all countries
  updateDollarPrice: async rates => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'dollarPrice')
      await setDoc(docRef, rates)

      set({ dollarPrice: rates })
      return true
    } catch (error) {
      console.error('Error updating dollar prices:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Add new payment method
  addPaymentMethod: async paymentMethod => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'paymentMethods')
      const docSnap = await getDoc(docRef)

      let currentMethods = []
      if (docSnap.exists()) {
        currentMethods = docSnap.data().methods || []
      }

      const newMethod = {
        ...paymentMethod,
        id: Date.now().toString()
      }

      const updatedMethods = [...currentMethods, newMethod]

      // Usar setDoc en lugar de updateDoc para asegurar que el documento se cree
      await setDoc(docRef, { methods: updatedMethods })

      set({ paymentMethods: updatedMethods })
      return newMethod
    } catch (error) {
      console.error('Error adding payment method:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Delete payment method
  deletePaymentMethod: async id => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'paymentMethods')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const currentMethods = docSnap.data().methods || []
        const updatedMethods = currentMethods.filter(method => method.id !== id)

        await setDoc(docRef, { methods: updatedMethods })
        set({ paymentMethods: updatedMethods })
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updatePaymentMethod: async updatedMethod => {
    const id = updatedMethod.id
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'paymentMethods')
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('No se encontró el documento de métodos de pago')
      }

      const currentMethods = docSnap.data().methods || []
      const updatedMethods = currentMethods.map(method =>
        method.id === id ? { ...updatedMethod } : method
      )

      await setDoc(docRef, { methods: updatedMethods })

      set({
        paymentMethods: updatedMethods,
        isEditModalOpen: false,
        selectedMethod: null
      })

      return true
    } catch (error) {
      console.error('Error updating payment method:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Fetch promotions
  getPromotions: async () => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'promotions')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        set({ promotions: docSnap.data().items || [] })
      } else {
        // Initialize document if it doesn't exist
        await setDoc(docRef, { items: [] })
        set({ promotions: [] })
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // Add new promotion
  addPromotion: async promotion => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'promotions')
      const docSnap = await getDoc(docRef)

      let currentPromotions = []
      if (docSnap.exists()) {
        currentPromotions = docSnap.data().items || []
      }

      const newPromotion = {
        ...promotion,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }

      const updatedPromotions = [...currentPromotions, newPromotion]

      await setDoc(docRef, { items: updatedPromotions })

      set({ promotions: updatedPromotions })
      return newPromotion
    } catch (error) {
      console.error('Error adding promotion:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Update promotion
  updatePromotion: async updatedPromotion => {
    const id = updatedPromotion.id
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'promotions')
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('No se encontró el documento de promociones')
      }

      const currentPromotions = docSnap.data().items || []
      const updatedPromotions = currentPromotions.map(promo =>
        promo.id === id ? { ...updatedPromotion, updatedAt: new Date().toISOString() } : promo
      )

      await setDoc(docRef, { items: updatedPromotions })

      set({ promotions: updatedPromotions })
      return true
    } catch (error) {
      console.error('Error updating promotion:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Delete promotion
  deletePromotion: async id => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'promotions')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const currentPromotions = docSnap.data().items || []
        const updatedPromotions = currentPromotions.filter(promo => promo.id !== id)

        await setDoc(docRef, { items: updatedPromotions })
        set({ promotions: updatedPromotions })
      }
      return true
    } catch (error) {
      console.error('Error deleting promotion:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  }
}))

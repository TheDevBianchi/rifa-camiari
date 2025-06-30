import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { updateUserRanking } from '@/hooks/useUserRanking'

export const createApprovalSlice = (set, get) => ({
  approvePendingPurchase: async (raffleId, purchase) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()

      let selectedTickets = [...purchase.selectedTickets]

      // Remover la compra de pendingPurchases
      const updatedPendingPurchases = currentRaffle.pendingPurchases.filter(
        p => p.createdAt.seconds !== purchase.createdAt.seconds
      )

      // Agregar tickets a soldTickets
      const updatedSoldTickets = [
        ...(currentRaffle.soldTickets || []),
        ...selectedTickets
      ]

      // Validación de asignación correcta de tickets
      const ticketsValidation = selectedTickets.every(ticket => {
        // Verificar que el ticket esté en soldTickets
        const isInSoldTickets = updatedSoldTickets.includes(ticket)
        // Verificar que el ticket no esté duplicado en soldTickets
        const occurrences = updatedSoldTickets.filter(t => t === ticket).length
        return isInSoldTickets && occurrences === 1
      })

      if (!ticketsValidation) {
        throw new Error('Error en la asignación de tickets: Posible duplicado o ticket no asignado correctamente')
      }

      // Manejar tickets reservados según el tipo de rifa
      let updatedReservedTickets = [...(currentRaffle.reservedTickets || [])]

      if (currentRaffle.randomTickets) {
        // Para rifas aleatorias, eliminar la cantidad de tickets que se vendieron
        const ticketsToRemove = selectedTickets.length
        updatedReservedTickets = updatedReservedTickets.slice(ticketsToRemove)
      } else {
        // Para rifas normales, eliminar los tickets específicos
        updatedReservedTickets = updatedReservedTickets.filter(
          ticket => !selectedTickets.includes(ticket)
        )
      }

      // Agregar usuario a la lista de usuarios confirmados
      const updatedUsers = [
        ...(currentRaffle.users || []),
        {
          ...purchase,
          status: 'confirmed',
          purchaseDate: new Date()
        }
      ]

      const updatedRaffle = {
        ...currentRaffle,
        pendingPurchases: updatedPendingPurchases,
        soldTickets: updatedSoldTickets,
        reservedTickets: updatedReservedTickets,
        users: updatedUsers,
        availableNumbers: currentRaffle.totalTickets - updatedSoldTickets.length - updatedReservedTickets.length
      }

      // Validación de asignación de tickets al usuario
      const userTicketsValidation = updatedUsers.find(user => 
        user.email === purchase.email && 
        user.createdAt.seconds === purchase.createdAt.seconds
      )

      if (!userTicketsValidation) {
        throw new Error('Error: Usuario no encontrado en la lista de usuarios confirmados')
      }

      const userTicketsMatch = JSON.stringify(userTicketsValidation.selectedTickets.sort()) === 
                              JSON.stringify(selectedTickets.sort())

      if (!userTicketsMatch) {
        throw new Error('Error: Los tickets asignados al usuario no coinciden con los tickets seleccionados')
      }

      await updateDoc(docRef, updatedRaffle)

      // Actualizar el ranking de usuarios
      const { updateUserRanking } = get();
      if (updateUserRanking) {
        await updateUserRanking({
          name: purchase.name,
          email: purchase.email,
          phone: purchase.phone,
          selectedTickets: selectedTickets
        });
      } else {
        console.error('updateUserRanking no está disponible en el store');
      }

      // Generar el bloque HTML para los tickets (usando tablas para compatibilidad)
      let tickets_html = '';
      if (selectedTickets && selectedTickets.length > 0) {
        const columns = 5; // 5 tickets por fila
        let ticketRows = '';
        for (let i = 0; i < selectedTickets.length; i += columns) {
          const chunk = selectedTickets.slice(i, i + columns);
          let rowTds = chunk.map(ticket => 
            `<td align="center" style="padding: 5px;">
              <div style="background-color: #FFEBEC; border: 2px solid #ff5757; border-radius: 6px; padding: 8px 4px; text-align: center; font-family: 'Courier New', monospace; font-weight: 700; color: #ff5757; font-size: 14px;">
                ${ticket}
              </div>
            </td>`
          ).join('');
          
          ticketRows += `<tr>${rowTds}</tr>`;
        }

        tickets_html = `
          <div style="background-color: #F2EBFF; border: 1px solid #8c52ff; border-radius: 8px; padding: 20px; margin: 15px 0;">
            <h4 style="color: #8c52ff; margin: 0 0 15px 0; font-size: 16px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">🎫 Tus Tickets Asignados</h4>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                ${ticketRows}
              </tbody>
            </table>
          </div>
        `;
      }

      // Preparar los datos para el email (aplanados, sin JSON)
      const templateParams = {
        to_email: purchase.email,
        to_name: purchase.name || 'Cliente',
        subject: `Confirmación de Compra - ${currentRaffle.title}`,
        raffle_title: currentRaffle.title,
        ticket_count: selectedTickets.length,
        ticket_type: (currentRaffle.randomTickets || false) ? 'Aleatorios 🎲' : 'Específicos 🎯',
        payment_method: purchase.paymentMethod || 'No especificado',
        payment_reference: purchase.reference || 'No especificado',
        total_amount: `$${(selectedTickets.length * currentRaffle.price).toFixed(2)} USD`,
        tickets_html: tickets_html,
      };

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }));

      return { success: true, templateParams };

    } catch (error) {
      console.error('Error en approvePendingPurchase:', error);
      return { success: false, error: error.message };
    }
  },

  rejectPendingPurchase: async (raffleId, purchase) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()

      // Remover la compra de pendingPurchases
      const updatedPendingPurchases = currentRaffle.pendingPurchases.filter(
        p => p.createdAt.seconds !== purchase.createdAt.seconds
      )

      // Remover tickets de reservedTickets
      const updatedReservedTickets = currentRaffle.reservedTickets.filter(
        ticket => !purchase.selectedTickets.includes(ticket)
      )

      const updatedRaffle = {
        ...currentRaffle,
        pendingPurchases: updatedPendingPurchases,
        reservedTickets: updatedReservedTickets,
        availableNumbers: currentRaffle.totalTickets -
          (currentRaffle.soldTickets?.length || 0) -
          updatedReservedTickets.length
      }

      await updateDoc(docRef, updatedRaffle)

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error rejecting purchase:', error)
      throw error
    }
  }
}) 
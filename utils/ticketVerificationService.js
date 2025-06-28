import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const verifyTickets = async (raffleId, userData) => {
    try {
        const { name, email, phone } = userData;

        if (!name || !email || !phone) {
            return {
                success: false,
                message: "Por favor proporciona nombre, correo y teléfono",
                tickets: []
            };
        }

        if (!raffleId) {
            return {
                success: false,
                message: "ID de rifa no proporcionado",
                tickets: []
            };
        }

        // Obtener la rifa específica
        const raffleRef = doc(db, "raffles", raffleId);
        const raffleDoc = await getDoc(raffleRef);

        if (!raffleDoc.exists()) {
            return {
                success: false,
                message: "Rifa no encontrada",
                tickets: []
            };
        }

        const raffle = raffleDoc.data();
        let userTickets = [];

        // Verificar si hay users y es un array
        if (raffle.users && Array.isArray(raffle.users)) {
            // Buscar todas las coincidencias en el array de users
            const matchingUsers = raffle.users.filter(user => 
                user.email?.toLowerCase() === email.toLowerCase() &&
                user.phone == phone &&
                user.name == name
            );

            // Agregar cada coincidencia encontrada
            matchingUsers.forEach(userFound => {
                userTickets.push({
                    raffleId: raffleDoc.id,
                    raffleName: raffle.title,
                    tickets: userFound.selectedTickets || [],
                    totalAmount: userFound.selectedTickets.length * raffle.price || 0
                });
            });
        }

        console.log(userTickets);

        if (userTickets.length === 0) {
            return {
                success: true,
                message: "No se encontraron tickets comprados con estos datos",
                tickets: []
            };
        }

        return {
            success: true,
            message: "Tickets encontrados exitosamente",
            tickets: userTickets
        };
    } catch (error) {
        console.error("Error al verificar tickets:", error);
        return {
            success: false,
            message: "Error al verificar tickets: " + error.message,
            tickets: []
        };
    }
};

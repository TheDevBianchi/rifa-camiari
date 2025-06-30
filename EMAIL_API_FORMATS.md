# Formatos de Datos para la API de Email

La API `/api/email` soporta dos formatos de datos diferentes para mantener compatibilidad con el código existente.

## Formato Nuevo (Recomendado)

```javascript
{
  "to": "cliente@email.com",
  "subject": "Confirmación de Compra - Jirvin Rifas",
  "purchaseData": {
    "customerName": "Juan Pérez",
    "selectedTickets": ["001", "002", "003"],
    "paymentMethod": "Transferencia Bancaria",
    "paymentReference": "REF123456"
  },
  "raffle": {
    "title": "iPhone 15 Pro Max",
    "price": 10.00,
    "totalTickets": 100,
    "randomTickets": false
  }
}
```

### Propiedades del Formato Nuevo

#### `to` (string, requerido)
- Email del destinatario

#### `subject` (string, opcional)
- Asunto del email
- Por defecto: "Confirmación de Compra - Jirvin Rifas"

#### `purchaseData` (object, requerido)
- `customerName` (string): Nombre del cliente
- `selectedTickets` (array): Array de números de tickets
- `paymentMethod` (string): Método de pago utilizado
- `paymentReference` (string): Referencia o número de confirmación

#### `raffle` (object, requerido)
- `title` (string): Título de la rifa
- `price` (number): Precio por ticket
- `totalTickets` (number): Total de tickets disponibles
- `randomTickets` (boolean): Si la rifa usa tickets aleatorios

## Formato Antiguo (Compatibilidad)

```javascript
{
  "email": "cliente@email.com",
  "name": "Juan Pérez",
  "amount": "30.00",
  "date": "15/12/2024",
  "paymentMethod": "Transferencia Bancaria",
  "raffleName": "iPhone 15 Pro Max",
  "ticketsCount": 3,
  "confirmationNumber": "REF123456",
  "number": "001, 002, 003"
}
```

### Propiedades del Formato Antiguo

#### `email` (string, requerido)
- Email del destinatario

#### `name` (string, opcional)
- Nombre del cliente
- Por defecto: "Cliente"

#### `amount` (string, opcional)
- Monto total pagado
- Se usa para calcular el precio por ticket

#### `date` (string, opcional)
- Fecha de la compra
- No se usa en el email actual

#### `paymentMethod` (string, opcional)
- Método de pago utilizado
- Por defecto: "No especificado"

#### `raffleName` (string, opcional)
- Nombre de la rifa
- Por defecto: "Rifa"

#### `ticketsCount` (number, opcional)
- Cantidad de tickets comprados
- Se usa para calcular el precio por ticket
- Por defecto: 1

#### `confirmationNumber` (string, opcional)
- Número de confirmación
- Por defecto: "No especificado"

#### `number` (string, opcional)
- Lista de tickets separados por comas
- Se convierte a array automáticamente
- Por defecto: []

## Conversión Automática

La API detecta automáticamente el formato y convierte el formato antiguo al nuevo:

### Formato Antiguo → Nuevo
```javascript
// Entrada (formato antiguo)
{
  "email": "cliente@email.com",
  "name": "Juan Pérez",
  "amount": "30.00",
  "ticketsCount": 3,
  "number": "001, 002, 003"
}

// Conversión automática a formato nuevo
{
  "to": "cliente@email.com",
  "subject": "Confirmación de Compra - Jirvin Rifas",
  "purchaseData": {
    "customerName": "Juan Pérez",
    "selectedTickets": ["001", "002", "003"],
    "paymentMethod": "No especificado",
    "paymentReference": "No especificado"
  },
  "raffle": {
    "title": "Rifa",
    "price": 10.00, // 30.00 / 3
    "totalTickets": 100,
    "randomTickets": false
  }
}
```

## Ejemplos de Uso

### Con useSendEmail Hook (Formato Nuevo)
```javascript
import { useSendEmail } from '@/hooks/useSendEmail';

const { sendEmail } = useSendEmail();

await sendEmail({
  to: "cliente@email.com",
  subject: "Confirmación de Compra",
  purchaseData: {
    customerName: "Juan Pérez",
    selectedTickets: ["001", "002"],
    paymentMethod: "Transferencia",
    paymentReference: "REF123"
  },
  raffle: {
    title: "iPhone 15",
    price: 10.00,
    totalTickets: 100,
    randomTickets: false
  }
});
```

### Con approvalSlice (Formato Antiguo)
```javascript
// En approvalSlice.js - ya funciona sin cambios
const emailParams = {
  email: purchase.email,
  name: purchase.name,
  amount: (selectedTickets.length * currentRaffle.price).toFixed(2),
  paymentMethod: purchase.paymentMethod,
  raffleName: currentRaffle.title,
  ticketsCount: selectedTickets.length,
  confirmationNumber: purchase.reference,
  number: selectedTickets.join(', ')
};

const emailResponse = await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailParams)
});
```

## Validaciones

La API incluye validaciones robustas:

- ✅ Verifica que los datos requeridos estén presentes
- ✅ Maneja valores por defecto para campos opcionales
- ✅ Valida que haya tickets asignados
- ✅ Genera tickets aleatorios si es necesario
- ✅ Maneja errores de formato de datos

## Respuesta

La API devuelve:

```javascript
// Éxito
{
  "success": true,
  "message": "Email enviado exitosamente",
  "assignedTickets": ["001", "002", "003"]
}

// Error
{
  "error": "Descripción del error"
}
``` 
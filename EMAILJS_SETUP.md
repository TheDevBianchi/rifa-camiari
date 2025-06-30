# Configuración de EmailJS

## ⚠️ Importante: Ejecución en el Servidor

Esta configuración utiliza la **API REST de EmailJS** para enviar correos desde el **servidor**. Esto es más seguro y evita errores como `location is not defined`.

## Variables de Entorno Requeridas

Para que el sistema de emails funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

```env
# EmailJS - Claves Públicas (accesibles desde el cliente si es necesario)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here

# EmailJS - Clave Privada (SOLO para el servidor, NO exponer al cliente)
EMAILJS_PRIVATE_KEY=your_private_key_here
```

## Pasos para Configurar EmailJS

### 1. Crear una cuenta en EmailJS
- Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
- Crea una cuenta gratuita

### 2. Configurar un servicio de email
- En el dashboard de EmailJS, ve a "Email Services"
- Agrega un nuevo servicio (Gmail, Outlook, etc.)
- Copia el **Service ID**

### 3. Crear una plantilla de email
- Ve a "Email Templates"
- Crea una nueva plantilla
- **Copia y pega el contenido de `emailjs-template-advanced.html`**
- Copia el **Template ID**

### 4. Obtener tus API Keys
- Ve a "Account" > "API Keys"
- Copia tu **Public Key**
- Copia tu **Private Key** (¡mantenla segura!)

### 5. Configurar las variables de entorno
- Crea o edita tu archivo `.env.local`
- Agrega las cuatro variables con los valores obtenidos, como se muestra arriba.

## Templates Disponibles

### Template Avanzado (`emailjs-template-advanced.html`) ⭐ **RECOMENDADO**
- Template con JavaScript para procesar datos JSON.
- **Siempre muestra los tickets asignados** (específicos o aleatorios).
- Incluye un grid visual para los tickets y badges para el tipo de asignación.

## Funcionalidades

- ✅ **Envío seguro desde el servidor** a través de la API REST.
- ✅ Emails responsivos.
- ✅ **Siempre muestra tickets asignados** (específicos o aleatorios).
- ✅ Grid visual de tickets con diseño atractivo.
- ✅ Badges visuales para tipo de tickets (🎯/🎲).
- ✅ Procesamiento dinámico de datos JSON.
- ✅ Generación automática de tickets aleatorios.

## Estructura de Datos JSON

El campo `{{purchase_data}}` que se envía a la plantilla contiene un JSON con esta estructura:

```json
{
  "tickets": ["001", "002", "003"],
  "total": "30.00",
  "payment_method": "Transferencia Bancaria",
  "payment_reference": "REF123456",
  "raffle_title": "iPhone 15 Pro Max",
  "is_random": false
}
```

## Comportamiento de Tickets

### Tickets Específicos
- Se muestran los números seleccionados por el cliente.
- Badge visual: 🎯 "Específicos".

### Tickets Aleatorios
- Se generan automáticamente números aleatorios.
- Se asignan inmediatamente en el email.
- Badge visual: 🎲 "Aleatorios".
- **No se requiere email adicional**.

## Troubleshooting

### Error: "Configuración de EmailJS incompleta"
- Verifica que las **cuatro** variables de entorno (`NEXT_PUBLIC...` y `EMAILJS_PRIVATE_KEY`) estén configuradas.
- Asegúrate de que los IDs y claves sean correctos.

### Error: "Error al enviar el email..."
- Verifica que tu servicio de email esté activo en el dashboard de EmailJS.
- Revisa los logs de EmailJS para más detalles.
- Asegúrate de que la **Clave Privada** es correcta y no ha expirado.
- Confirma que la plantilla tenga las variables correctas.

## Estructura del Email

El sistema genera automáticamente un email HTML con:

- **Header**: Gradiente con los colores primary (#8c52ff) y secondary (#ff5757)
- **Sección de éxito**: Fondo con color primary-50 (#F2EBFF)
- **Detalles de compra**: Lista organizada con los datos de la transacción
- **Sección de tickets**: Grid visual con todos los tickets asignados
- **Información de la rifa**: Gradiente inverso con los colores de la marca
- **Footer**: Información de contacto y derechos de autor

## Colores Utilizados

Los colores del email están basados en tu configuración de Tailwind:

- **Primary**: #8c52ff (púrpura)
- **Primary-50**: #F2EBFF (púrpura claro)
- **Secondary**: #ff5757 (rojo)
- **Secondary-50**: #FFEBEC (rojo claro)

## Cómo Usar los Templates

### Opción 1: Template Básico
1. Abre `emailjs-template.html`
2. Copia todo el contenido
3. Pégalo en la sección de templates de EmailJS
4. Guarda el template

### Opción 2: Template Avanzado (Recomendado)
1. Abre `emailjs-template-advanced.html`
2. Copia todo el contenido
3. Pégalo en la sección de templates de EmailJS
4. Guarda el template
5. El JavaScript procesará automáticamente los datos JSON

## Estructura de Datos JSON

El campo `{{purchase_data}}` contiene un JSON con esta estructura:

```json
{
  "tickets": ["001", "002", "003"],
  "total": "30.00",
  "payment_method": "Transferencia Bancaria",
  "payment_reference": "REF123456",
  "raffle_title": "iPhone 15 Pro Max",
  "is_random": false
}
```

## Comportamiento de Tickets

### Tickets Específicos
- Se muestran los números seleccionados por el cliente
- Badge visual: 🎯 "Específicos"
- Color: Púrpura (primary)

### Tickets Aleatorios
- Se generan automáticamente números aleatorios
- Se asignan inmediatamente en el email
- Badge visual: 🎲 "Aleatorios"
- Color: Amarillo (warning)
- **No se requiere email adicional**

## Troubleshooting

### Error: "Configuración de EmailJS incompleta"
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que los IDs sean correctos

### Error: "Error al enviar el email"
- Verifica que tu servicio de email esté activo
- Revisa los logs de EmailJS en su dashboard
- Confirma que la plantilla tenga las variables correctas

### Los datos no se muestran correctamente
- Asegúrate de usar el template avanzado
- Verifica que el JSON en `{{purchase_data}}` sea válido
- Revisa la consola del navegador para errores de JavaScript

### El email no es responsivo
- Verifica que el template incluya la meta tag viewport
- Prueba el email en diferentes dispositivos
- Usa las clases CSS responsivas incluidas 
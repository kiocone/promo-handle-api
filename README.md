# Promo Handle API

API REST construida con Node.js, TypeScript y Express para la consulta y manejo de promociones.

## Requisitos Previos

- Node.js (v18 o superior)
- npm

## Instalación

```bash
npm install
```

## Configuración

Copia el archivo `.env.example` a `.env` y configura el token de autenticación:

```bash
cp .env.example .env
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con recarga automática.
- `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist`.
- `npm start`: Ejecuta el código compilado en producción.

## Endpoints

### GET `/api/v1/promos`

Retorna la información de promociones activas.

**Headers requeridos:**

```json
{
  "auth_token": "YOUR TOKEN"
}
```

**Respuesta exitosa (`200 OK`):**

```json
{
  "status": "success",
  "device_id": "eficair-002-123",
  "timestamp": "2024-07-15T23:31:22.588Z",
  "data": {
    "otp": "a1b23c",
    "url": "https://ejemplo.com/solicitud/paquete?otp=a1b23c",
    "rich_text": {
      "titulo": "Promo Especial",
      "descripcion": "Aprovecha esta oferta especial",
      "footer": "Válido hasta agotar stock"
    }
  }
}
```
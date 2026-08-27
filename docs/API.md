# Promo Handle API - Referencia de Endpoints

Documentación completa de los endpoints REST de la API Promo Handle.

---

## Autenticación General

Todos los endpoints protegidos requieren el siguiente header:

```http
auth_token: <VALOR_DE_AUTH_TOKEN>
```

Si el token es omitido o incorrecto:
```json
HTTP 401 Unauthorized
{
  "status": "error",
  "message": "Unauthorized"
}
```

---

## 1. Registro de Dispositivo

**`POST /api/v1/devices/register`**

Registra o actualiza de manera idempotente un dispositivo físico (hub ESP32 o pantalla display).

### Headers requeridos

| Header | Valor |
| :--- | :--- |
| `Content-Type` | `application/json` |
| `auth_token` | `<VALOR_DE_AUTH_TOKEN>` |

### Request Body (JSON)

```json
{
  "hardware_id": "A4CF12B89001",
  "name": "hub-recepcion",
  "location": "Bogota/Sede Norte/Recepcion",
  "role": "hub"
}
```

### Respuestas

#### `200 OK` (Creación o Actualización Idempotente)

```json
{
  "status": "success",
  "data": {
    "hardware_id": "A4CF12B89001",
    "requested_name": "hub-recepcion",
    "assigned_name": "hub-recepcion",
    "location": "Bogota/Sede Norte/Recepcion",
    "role": "hub",
    "created_at": "2026-08-27T20:00:00.000Z",
    "updated_at": "2026-08-27T20:05:00.000Z",
    "last_seen_at": "2026-08-27T20:05:00.000Z"
  }
}
```

*Si el nombre `hub-recepcion` ya estaba tomado por otro dispositivo, `assigned_name` devolverá `hub-recepcion-002`, `hub-recepcion-003`, etc.*

#### `400 Bad Request`

```json
{
  "status": "error",
  "message": "El campo \"hardware_id\" es obligatorio.",
  "errors": [
    "El campo \"hardware_id\" es obligatorio."
  ]
}
```

#### Ejemplo cURL

```bash
curl -X POST http://localhost:3000/api/v1/devices/register \
  -H "Content-Type: application/json" \
  -H "auth_token: YOUR_MOCKED_TOKEN" \
  -d '{
    "hardware_id": "A4CF12B89001",
    "name": "hub-recepcion",
    "location": "Bogota/Sede Norte/Recepcion",
    "role": "hub"
  }'
```

---

## 2. Ingesta de Eventos por Lote (Hubs ESP32)

**`POST /api/v1/events`**

Reenvío y recepción de lotes de eventos telemétricos y de sensores desde los hubs ESP32. Soporta deduplicación idempotente basada en `event_id` para reintentos de red.

### Headers requeridos

| Header | Valor |
| :--- | :--- |
| `Content-Type` | `application/json` |
| `auth_token` | `<VALOR_DE_AUTH_TOKEN>` |

### Request Body (JSON)

```json
{
  "hub": {
    "hardware_id": "SIM-HUB-001",
    "device_name": "hub-recepcion",
    "location": "Bogota/Sede Norte"
  },
  "source": {
    "hardware_id": "ESP32-A4CF12B89001",
    "device_name": "apartamento-301",
    "location": "Torre A/Apartamento 301",
    "role": "legacy"
  },
  "events": [
    {
      "event_id": "ESP32-A4CF12B89001:7f31a2:41",
      "seq": 41,
      "boot_id": "7f31a2",
      "type": "sensor",
      "source": "door-01",
      "value": "open",
      "uptime_ms": 152430,
      "received_at": "2026-08-27T21:30:05.000Z"
    }
  ]
}
```

### Respuestas

#### `200 OK` (Lote procesado / aceptado)

```json
{
  "status": "success",
  "accepted": [
    "ESP32-A4CF12B89001:7f31a2:41"
  ]
}
```

#### `400 Bad Request`

```json
{
  "status": "error",
  "message": "La lista \"events\" debe contener al menos un evento.",
  "errors": [
    "La lista \"events\" debe contener al menos un evento."
  ]
}
```

#### Ejemplo cURL

```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -H "auth_token: YOUR_MOCKED_TOKEN" \
  -d '{
    "hub": {
      "hardware_id": "SIM-HUB-001",
      "device_name": "hub-recepcion",
      "location": "Bogota/Sede Norte"
    },
    "source": {
      "hardware_id": "ESP32-A4CF12B89001",
      "device_name": "apartamento-301",
      "location": "Torre A/Apartamento 301",
      "role": "legacy"
    },
    "events": [
      {
        "event_id": "ESP32-A4CF12B89001:7f31a2:41",
        "seq": 41,
        "boot_id": "7f31a2",
        "type": "sensor",
        "source": "door-01",
        "value": "open",
        "uptime_ms": 152430,
        "received_at": "2026-08-27T21:30:05.000Z"
      }
    ]
  }'
```

---

## 3. Consulta de Promociones

**`GET /api/v1/promos`**

Consulta la promoción activa para el dispositivo.

### Headers

| Header | Requerido | Descripción |
| :--- | :--- | :--- |
| `auth_token` | **Sí** | Token de autenticación. |
| `device_id` | No | `hardware_id` del dispositivo solicitante. |
| `device_name` | No | `assigned_name` registrado localmente en el dispositivo. |

### Respuesta `200 OK`

```json
{
  "status": "success",
  "device_id": "A4CF12B89001",
  "device_name": "hub-recepcion-002",
  "timestamp": "2026-08-27T20:05:00.000Z",
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

#### Ejemplo cURL

```bash
curl -X GET http://localhost:3000/api/v1/promos \
  -H "auth_token: YOUR_MOCKED_TOKEN" \
  -H "device_id: A4CF12B89001" \
  -H "device_name: hub-recepcion-002"
```

---

## 4. Health Check

**`GET /health`**

Estado de salud del servicio.

```json
HTTP 200 OK
{
  "status": "ok",
  "timestamp": "2026-08-27T20:00:00.000Z"
}
```

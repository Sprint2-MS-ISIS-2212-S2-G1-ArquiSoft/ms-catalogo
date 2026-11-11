# Solventa · microservicio `catalogo`

ISIS-2212 Arquitecturas de software robustas · Grupo 1 · Sprint 2

**Responsabilidad:** Catálogo de productos de seguro y ramos.

| | |
|---|---|
| Nodo de despliegue | ASG Cotización ×2 (AZ a / AZ b), junto a cotizacion |
| Llama a | Ninguno |
| Lo llaman | distribucion |
| Base de datos | BD Catálogo (RDS PostgreSQL, Multi-AZ) |
| Puerto interno | 3000 |
| Origen en el monolito | `src/modules/catalogo` |

## Correr en local

```bash
cp .env.example .env
npm ci
npm run start:dev
```

El despliegue (docker-compose por nodo EC2), el gateway, los certificados y la documentación de experimentos viven en el repositorio paraguas `Sprint2-MS-ISIS-2212-S2-G1-ArquiSoft/ISIS2212_202620_S2_Grupo1`, rama `sprint-2-microservicios`.

## Correr en local con Docker

```bash
docker compose -f docker-compose.local.yml up -d --build
curl localhost:3004/health
docker compose -f docker-compose.local.yml down
```

`docker-compose.local.yml` es **solo para desarrollo**: levanta este servicio
(host `3004` → contenedor `3000`) y su propio `postgres:16-alpine` (host `5434`
→ contenedor `5432`), que carga `database/init.sql` al crearse.

## API

Contrato que consumen Distribución y Cotización. Todas las respuestas son
`application/json`. Ningún endpoint recibe body: Catálogo es de solo lectura.

### `GET /health`

Verifica el servicio y la conexión a la BD (`SELECT 1`).

| | |
|---|---|
| Body | — |
| `200` | `{ "status": "ok" }` |
| `503` | `{ "status": "error", "database": "unreachable" }` |

### `GET /productos`

Lista el catálogo completo, ordenado por `nombre`.

| | |
|---|---|
| Query | `ramo` (opcional): `VIDA` \| `SALUD` \| `AUTOS` \| `HOGAR` \| `DESEMPLEO` |
| Body | — |
| `200` | arreglo de productos (vacío si el filtro no encuentra nada) |
| `400` | `ramo` no es uno de los valores válidos |

```bash
curl "localhost:3004/productos?ramo=VIDA"
```

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Seguro de Vida Base",
    "ramo": "VIDA",
    "sumaAseguradaMaxima": "5000000.00"
  }
]
```

### `GET /productos/:id`

Un producto por id. Reemplaza la llamada `catalogoService.getProducto(id)` que
Distribución hacía en proceso dentro del monolito.

| | |
|---|---|
| Param | `id`: uuid del producto |
| Body | — |
| `200` | el producto |
| `404` | `{ "message": "Producto de seguro con id <id> no encontrado", "error": "Not Found", "statusCode": 404 }` |

Un `id` que no sea uuid también devuelve `404`, no `400`: para quien consume,
cualquier id que no exista en el catálogo se comporta igual.

```bash
curl localhost:3004/productos/123e4567-e89b-12d3-a456-426614174000
```

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "nombre": "Seguro de Vida Base",
  "ramo": "VIDA",
  "sumaAseguradaMaxima": "5000000.00"
}
```

Nota sobre `sumaAseguradaMaxima`: es `numeric(14,2)` en Postgres y viaja como
**string** para no perder precisión. El consumidor la convierte (en el monolito,
`cotizacion.service.ts` ya hacía `parseFloat`).

### `GET /ramos`

Ramos de seguro soportados.

| | |
|---|---|
| Body | — |
| `200` | `["VIDA","SALUD","AUTOS","HOGAR","DESEMPLEO"]` |

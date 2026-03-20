# Cloudflare Setup

Relanzamiento minimo de `contador-de-visitas.com` con Cloudflare Workers + Durable Objects.

## Que despliega este repo

- Web estatica publica en el dominio principal.
- Worker en `cloudflare-worker.js`.
- Durable Object `CounterDurableObject` para guardar el contador por ID.
- Endpoints:
  - `/c/:id.svg`
  - `/preview.svg`
  - `/api/counters/:id`
  - `/health`

## Requisitos

1. Tener el dominio pasando por Cloudflare.
2. Instalar Wrangler.
3. Hacer login:

```bash
npx wrangler login
```

## Deploy

Desde la raiz del repo:

```bash
npx wrangler deploy
```

La primera vez Wrangler creara la namespace SQLite del Durable Object definida en `wrangler.jsonc`.

## Rutas recomendadas en Cloudflare

Si mantienes la web publica sirviendose como estatica y solo quieres interceptar el servicio del contador, configura el Worker para estas rutas:

- `contador-de-visitas.com/c/*`
- `contador-de-visitas.com/api/*`
- `contador-de-visitas.com/preview.svg`
- `contador-de-visitas.com/health`

De ese modo el resto del dominio puede seguir sirviendose como pagina estatica.

## Ejemplos

Imagen real del contador:

```html
<img src="https://contador-de-visitas.com/c/mi-web.svg?style=mono&digits=6&theme=dark&label=visitas" alt="contador de visitas">
```

Vista previa sin incrementar:

```text
https://contador-de-visitas.com/preview.svg?style=glass&digits=6&theme=light&label=visitas&value=128734
```

Estado JSON:

```text
https://contador-de-visitas.com/api/counters/mi-web
```

# Integración de Kafka para mostrar órdenes en tiempo real

El sistema de gestión de órdenes debe publicar y consumir eventos de un topic Kafka para mostrar el estado de las órdenes en la interfaz de usuario en tiempo real. Los eventos incluyen la creación, actualización y cancelación de órdenes. El sistema debe manejar correctamente los casos en los que Kafka no está disponible y asegurar que la interfaz de usuario refleje el estado más actualizado de las órdenes.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial de Kafka

**Objetivo:** Configurar un topic Kafka y asegurar que el sistema puede publicar y consumir eventos.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configura un topic Kafka para el sistema de gestión de órdenes.
- Implementa la publicación de eventos de creación de órdenes en el topic Kafka.
- Consuma eventos del topic Kafka y muestra el estado de las órdenes en la interfaz de usuario.

**Entregable:** Un topic Kafka configurado y un sistema capaz de publicar y consumir eventos para mostrar el estado de las órdenes.

<details>
<summary>Pistas de conocimiento</summary>

- Considera el uso de un cliente Kafka para la publicación y consumo de eventos.
- Piensa en cómo manejar la disponibilidad de Kafka en tu implementación.

</details>

### Fase 2: Manejo de casos borde y errores

**Objetivo:** Implementar la gestión de errores y casos borde para la publicación y consumo de eventos en Kafka.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Identifica y maneja los casos en los que Kafka no está disponible.
- Implementa la lógica para reintentar la publicación y consumo de eventos en caso de errores temporales.
- Asegura que la interfaz de usuario refleje el estado más actualizado de las órdenes incluso en presencia de errores.

**Entregable:** Un sistema que maneja correctamente los casos borde y errores al publicar y consumir eventos de Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Considera el uso de estrategias de reintento y retroceso exponencial para manejar errores temporales.
- Piensa en cómo mantener la consistencia del estado de las órdenes en la interfaz de usuario.

</details>

### Fase 3: Optimización y escalabilidad

**Objetivo:** Optimizar la implementación para mejorar la escalabilidad y rendimiento del sistema.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Identifica puntos de optimización en la publicación y consumo de eventos de Kafka.
- Implementa mejoras para reducir la latencia y aumentar la capacidad de manejar un mayor volumen de eventos.
- Asegura que el sistema mantenga un rendimiento óptimo bajo cargas altas.

**Entregable:** Un sistema optimizado para mejorar la escalabilidad y rendimiento al publicar y consumir eventos de Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Considera el uso de particiones y réplicas en Kafka para mejorar la escalabilidad.
- Piensa en cómo reducir la latencia en la publicación y consumo de eventos.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es Kafka y cómo se usa en este sistema?
- **paraQueSirve**: ¿Para qué sirve la integración de Kafka en el sistema de gestión de órdenes?
- **comoSeUsa**: ¿Cómo se usa Kafka para publicar y consumir eventos en este sistema?
- **erroresComunes**: ¿Cuáles son los errores comunes al integrar Kafka y cómo se manejan en este sistema?
- **queDecisionesImplica**: ¿Qué decisiones implica la integración de Kafka en términos de escalabilidad y rendimiento?

## Criterios de Evaluacion

- Configuración correcta de un topic Kafka.
- Publicación y consumo exitosos de eventos en Kafka.
- Manejo adecuado de errores y casos borde al integrar Kafka.
- Optimización y escalabilidad mejoradas en la integración de Kafka.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone events (api: http://localhost:3000):
  - `orders/orders.events`
  - `orders/orders.events`
  - `orders/orders.events`
- `client` expone http (api: http://localhost:3000):
  - `GET /api/orders`
  - `GET /api/orders/:id`

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*

# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

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

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/domain/order.entity.ts` — `OrderItem.push`: Se invoca `push` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/domain/order.entity.ts` — `OrderItem.filter`: Se invoca `filter` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/domain/order.entity.ts` — `OrderItem.reduce`: Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/controllers/order.controller.ts` — `OrderItem.map`: Se invoca `map` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/package.json` — `typescript@5.7.0`: typescript declara la version 5.7.0, pero el registry de npm respondio que esa version no existe. Es una version inventada: reemplazala por una version publicada real, o si no se conoce con certeza, usa el mecanismo centralizado del ecosistema (BOM/parent/platform/version catalog) y no declares una version individual.
- `client/package.json` — `typescript@5.7.0`: typescript declara la version 5.7.0, pero el registry de npm respondio que esa version no existe. Es una version inventada: reemplazala por una version publicada real, o si no se conoce con certeza, usa el mecanismo centralizado del ecosistema (BOM/parent/platform/version catalog) y no declares una version individual.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261106160222034), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Integración de Kafka para mostrar órdenes en tiempo real
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial de Kafka — objetivo: Configurar un topic Kafka y asegurar que el sistema puede publicar y consumir eventos. — entregable (NO resolver): Un topic Kafka configurado y un sistema capaz de publicar y consumir eventos para mostrar el estado de las órdenes.
- Fase 2: Manejo de casos borde y errores — objetivo: Implementar la gestión de errores y casos borde para la publicación y consumo de eventos en Kafka. — entregable (NO resolver): Un sistema que maneja correctamente los casos borde y errores al publicar y consumir eventos de Kafka.
- Fase 3: Optimización y escalabilidad — objetivo: Optimizar la implementación para mejorar la escalabilidad y rendimiento del sistema. — entregable (NO resolver): Un sistema optimizado para mejorar la escalabilidad y rendimiento al publicar y consumir eventos de Kafka.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "api",
  "version": "1.0.0",
  "description": "Backend service for real-time order events using Kafka",
  "main": "dist/src/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:prod": "node dist/src/main.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"src/**/*.ts\" \"test/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/config": "^3.1.0",
    "kafkajs": "^2.2.4",
    "rxjs": "^7.8.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.13"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@nestjs/testing": "^11.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.1",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "prettier": "^3.2.5",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": ".",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "esModuleInterop": true,
    "strict": true,
    "strictPropertyInitialization": false,
    "noImplicitThis": false
  },
  "exclude": ["node_modules", "dist", "test"]
}

// === ARCHIVO: api/src/main.ts ===
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();

// === ARCHIVO: api/src/domain/order.entity.ts ===
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCreatedEvent {
  orderId: string;
  status: string;
  items: OrderItem[];
}

export interface OrderUpdatedEvent {
  orderId: string;
  status: string;
}

export interface OrderCancelledEvent {
  orderId: string;
}

export class OrderEntity implements Order {
  id: string;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    status: string,
    items: OrderItem[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.status = status;
    this.items = items;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  updateStatus(newStatus: string): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
    this.updatedAt = new Date();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
    this.updatedAt = new Date();
  }

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  isValid(): boolean {
    return (
      this.id !== undefined &&
      this.id.length > 0 &&
      this.status !== undefined &&
      this.status.length > 0 &&
      this.items !== undefined &&
      this.items.length > 0
    );
  }

  toPlainObject(): Order {
    return {
      id: this.id,
      status: this.status,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromData(data: Partial<Order>): OrderEntity {
    return new OrderEntity(
      data.id || '',
      data.status || 'pending',
      data.items || [],
      data.createdAt,
      data.updatedAt,
    );
  }
}

// === ARCHIVO: api/src/domain/order-events.port.ts ===
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from './order.entity';

export interface OrderEventsPort {
  publishOrderCreated(event: OrderCreatedEvent): Promise<void>;
  publishOrderUpdated(event: OrderUpdatedEvent): Promise<void>;
  publishOrderCancelled(event: OrderCancelledEvent): Promise<void>;
}

export interface OrderEventsConsumerPort {
  subscribeToOrderCreated(handler: (event: OrderCreatedEvent) => Promise<void>): void;
  subscribeToOrderUpdated(handler: (event: OrderUpdatedEvent) => Promise<void>): void;
  subscribeToOrderCancelled(handler: (event: OrderCancelledEvent) => Promise<void>): void;
}

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderService } from './application/order.service';
import { OrderEventsPort } from './domain/order-events.port';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: {
        KAFKA_BROKER: (value: string | undefined) => {
          if (!value || value.trim().length === 0) {
            throw new Error('KAFKA_BROKER environment variable is required');
          }
          return value;
        },
        KAFKA_CLIENT_ID: (value: string | undefined) => {
          if (!value || value.trim().length === 0) {
            throw new Error('KAFKA_CLIENT_ID environment variable is required');
          }
          return value;
        },
        KAFKA_GROUP_ID: (value: string | undefined) => {
          if (!value || value.trim().length === 0) {
            throw new Error('KAFKA_GROUP_ID environment variable is required');
          }
          return value;
        },
      },
    }),
  ],
  providers: [
    OrderService,
    {
      provide: OrderEventsPort,
      useFactory: (kafkaProducer: any, kafkaConsumer: any) => {
        return {
          publishOrderCreated: async (event) => {
            await kafkaProducer.send({
              topic: 'order-created',
              messages: [
                {
                  key: event.orderId,
                  value: JSON.stringify(event),
                  timestamp: Date.now().toString(),
                },
              ],
            });
          },
          publishOrderUpdated: async (event) => {
            await kafkaProducer.send({
              topic: 'order-updated',
              messages: [
                {
                  key: event.orderId,
                  value: JSON.stringify(event),
                  timestamp: Date.now().toString(),
                },
              ],
            });
          },
          publishOrderCancelled: async (event) => {
            await kafkaProducer.send({
              topic: 'order-cancelled',
              messages: [
                {
                  key: event.orderId,
                  value: JSON.stringify(event),
                  timestamp: Date.now().toString(),
                },
              ],
            });
          },
        };
      },
      inject: ['KAFKA_PRODUCER_SERVICE', 'KAFKA_CONSUMER_SERVICE'],
    },
  ],
  exports: [OrderService, OrderEventsPort],
})
export class AppModule {}

// === ARCHIVO: api/src/application/order.service.ts ===
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { OrderEventsPort, OrderEventsConsumerPort } from '../domain/order-events.port';
import {
  Order,
  OrderItem,
  OrderCreatedEvent,
  OrderUpdatedEvent,
  OrderCancelledEvent,
} from '../domain/order.entity';

@Injectable()
export class OrderService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderService.name);
  private readonly orders: Map<string, Order> = new Map();
  private readonly eventHandlers: Map<string, (event: any) => Promise<void>> = new Map();
  private isConnected = false;
  private readonly retryAttempts = 3;
  private readonly retryDelayMs = 1000;

  constructor(
    private readonly orderEventsPort: OrderEventsPort,
    private readonly orderEventsConsumerPort: OrderEventsConsumerPort,
  ) {
    if (!orderEventsPort) {
      throw new Error('OrderEventsPort is required and cannot be null');
    }
    if (!orderEventsConsumerPort) {
      throw new Error('OrderEventsConsumerPort is required and cannot be null');
    }
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing OrderService...');
    this.setupEventHandlers();
    await this.connectToEventBus();
    this.logger.log('OrderService initialized successfully');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Shutting down OrderService...');
    this.orders.clear();
    this.eventHandlers.clear();
    this.isConnected = false;
    this.logger.log('OrderService shutdown complete');
  }

  private setupEventHandlers(): void {
    this.eventHandlers.set('order-created', async (event: OrderCreatedEvent) => {
      await this.handleOrderCreated(event);
    });

    this.eventHandlers.set('order-updated', async (event: OrderUpdatedEvent) => {
      await this.handleOrderUpdated(event);
    });

    this.eventHandlers.set('order-cancelled', async (event: OrderCancelledEvent) => {
      await this.handleOrderCancelled(event);
    });
  }

  private async connectToEventBus(): Promise<void> {
    let attempts = 0;
    while (attempts < this.retryAttempts) {
      try {
        this.orderEventsConsumerPort.subscribeToOrderCreated(
          async (event: OrderCreatedEvent) => {
            await this.handleOrderCreated(event);
          },
        );
        this.orderEventsConsumerPort.subscribeToOrderUpdated(
          async (event: OrderUpdatedEvent) => {
            await this.handleOrderUpdated(event);
          },
        );
        this.orderEventsConsumerPort.subscribeToOrderCancelled(
          async (event: OrderCancelledEvent) => {
            await this.handleOrderCancelled(event);
          },
        );
        this.isConnected = true;
        this.logger.log('Successfully connected to Kafka event bus');
        return;
      } catch (error) {
        attempts++;
        this.logger.warn(
          `Failed to connect to event bus (attempt ${attempts}/${this.retryAttempts}): ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        if (attempts < this.retryAttempts) {
          await this.delay(this.retryDelayMs * attempts);
        }
      }
    }
    this.logger.error('Could not connect to event bus after all retry attempts');
    throw new Error('Event bus connection failed');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private validateOrderId(orderId: string): void {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error('Order ID is required and cannot be empty');
    }
  }

  private validateOrderItems(items: OrderItem[]): void {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    for (const item of items) {
      if (!item.productId || item.productId.trim().length === 0) {
        throw new Error('Each order item must have a valid product ID');
      }
      if (item.quantity <= 0) {
        throw new Error('Item quantity must be greater than zero');
      }
      if (item.price < 0) {
        throw new Error('Item price cannot be negative');
      }
    }
  }

  private validateStatus(status: string): void {
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  async createOrder(orderId: string, status: string, items: OrderItem[]): Promise<Order> {
    this.validateOrderId(orderId);
    this.validateOrderItems(items);
    this.validateStatus(status);

    if (this.orders.has(orderId)) {
      throw new Error(`Order with ID ${orderId} already exists`);
    }

    const order = Order.createFromEvent(new OrderCreatedEvent(orderId, status, items));
    this.orders.set(orderId, order);
    this.logger.log(`Order created: ${orderId} with status ${status}`);

    const event = new OrderCreatedEvent(orderId, status, items);
    await this.publishWithRetry(() => this.orderEventsPort.publishOrderCreated(event));

    return order;
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order> {
    this.validateOrderId(orderId);
    this.validateStatus(newStatus);

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const oldStatus = order.status;
    order.updateStatus(newStatus);
    this.logger.log(`Order ${orderId} status updated from ${oldStatus} to ${newStatus}`);

    const event = new OrderUpdatedEvent(orderId, newStatus);
    await this.publishWithRetry(() => this.orderEventsPort.publishOrderUpdated(event));

    return order;
  }

  async cancelOrder(orderId: string): Promise<void> {
    this.validateOrderId(orderId);

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (order.status === 'COMPLETED') {
      throw new Error('Cannot cancel a completed order');
    }

    order.updateStatus('CANCELLED');
    this.logger.log(`Order cancelled: ${orderId}`);

    const event = new OrderCancelledEvent(orderId);
    await this.publishWithRetry(() => this.orderEventsPort.publishOrderCancelled(event));
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    this.validateOrderId(orderId);
    return this.orders.get(orderId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderCount(): Promise<number> {
    return this.orders.size;
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    this.validateStatus(status);
    const normalizedStatus = status.toUpperCase();
    return Array.from(this.orders.values()).filter(
      (order) => order.status.toUpperCase() === normalizedStatus,
    );
  }

  private async publishWithRetry(publishFn: () => Promise<void>): Promise<void> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await publishFn();
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(
          `Failed to publish event (attempt ${attempt}/${this.retryAttempts}): ${lastError.message}`,
        );
        if (attempt < this.retryAttempts) {
          const delayMs = this.retryDelayMs * Math.pow(2, attempt - 1);
          await this.delay(delayMs);
        }
      }
    }
    this.logger.error(`Failed to publish event after ${this.retryAttempts} attempts: ${lastError?.message}`);
    throw new Error(`Event publication failed: ${lastError?.message}`);
  }

  private async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    try {
      if (!this.orders.has(event.orderId)) {
        const order = Order.createFromEvent(event);
        this.orders.set(event.orderId, order);
        this.logger.log(`Order created from event: ${event.orderId}`);
      } else {
        this.logger.warn(`Order already exists, skipping creation: ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling order created event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleOrderUpdated(event: OrderUpdatedEvent): Promise<void> {
    try {
      const order = this.orders.get(event.orderId);
      if (order) {
        order.updateStatus(event.status);
        this.logger.log(`Order updated from event: ${event.orderId} to status ${event.status}`);
      } else {
        this.logger.warn(`Order not found for update event: ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling order updated event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    try {
      const order = this.orders.get(event.orderId);
      if (order) {
        order.updateStatus('CANCELLED');
        this.logger.log(`Order cancelled from event: ${event.orderId}`);
      } else {
        this.logger.warn(`Order not found for cancellation event: ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling order cancelled event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaConfig, kafkaConfig } from '../config/kafka.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KAFKA_MODULE_OPTIONS',
      useFactory: (configService: ConfigService): KafkaConfig => {
        return kafkaConfig(configService);
      },
      inject: [ConfigService],
    },
    KafkaProducerService,
    KafkaConsumerService,
  ],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}

// === ARCHIVO: api/src/infrastructure/kafka/kafka-producer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord, Partitioners } from 'kafkajs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../../domain/order.entity';

export interface KafkaModuleOptions {
  clientId: string;
  groupId: string;
  brokers: string[];
}

@Injectable()
export class KafkaProducerService implements OrderEventsPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private kafka: Kafka;
  private producer: Producer;
  private isConnected = false;
  private readonly topicName = 'order-events';

  constructor(@Inject('KAFKA_MODULE_OPTIONS') private readonly options: KafkaModuleOptions) {
    this.kafka = new Kafka({
      clientId: this.options.clientId,
      brokers: this.options.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
        factor: 2,
        maxRetryTime: 30000,
      },
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('Producer already connected to Kafka');
      return;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log(`Connected to Kafka broker: ${this.options.brokers.join(', ')}`);
    } catch (error) {
      this.logger.error('Failed to connect to Kafka broker', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      this.logger.log('Disconnected from Kafka broker');
    } catch (error) {
      this.logger.error('Error disconnecting from Kafka broker', error);
      throw error;
    }
  }

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topicName,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            eventType: 'ORDER_CREATED',
            orderId: event.orderId,
            status: event.status,
            items: event.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            timestamp: new Date().toISOString(),
          }),
          headers: {
            'event-type': 'ORDER_CREATED',
            'correlation-id': event.orderId,
          },
        },
      ],
      acks: -1,
      timeout: 30000,
    };

    await this.sendMessage(record, 'ORDER_CREATED');
  }

  async publishOrderUpdated(event: OrderUpdatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topicName,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            eventType: 'ORDER_UPDATED',
            orderId: event.orderId,
            status: event.status,
            timestamp: new Date().toISOString(),
          }),
          headers: {
            'event-type': 'ORDER_UPDATED',
            'correlation-id': event.orderId,
          },
        },
      ],
      acks: 1,
      timeout: 15000,
    };

    await this.sendMessage(record, 'ORDER_UPDATED');
  }

  async publishOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topicName,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            eventType: 'ORDER_CANCELLED',
            orderId: event.orderId,
            timestamp: new Date().toISOString(),
          }),
          headers: {
            'event-type': 'ORDER_CANCELLED',
            'correlation-id': event.orderId,
          },
        },
      ],
      acks: 1,
      timeout: 15000,
    };

    await this.sendMessage(record, 'ORDER_CANCELLED');
  }

  private async sendMessage(record: ProducerRecord, eventType: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error(`Cannot publish ${eventType}: Producer not connected to Kafka`);
    }

    try {
      await this.producer.send(record);
      this.logger.log(`Successfully published ${eventType} event for order: ${record.messages[0].key}`);
    } catch (error) {
      this.logger.error(`Failed to publish ${eventType} event`, {
        orderId: record.messages[0].key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  isProducerConnected(): boolean {
    return this.isConnected;
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka-consumer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { OrderEventsConsumerPort } from '../../domain/order-events.port';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent, OrderItem } from '../../domain/order.entity';
import { KafkaModuleOptions, KafkaProducerService } from './kafka-producer.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy, OrderEventsConsumerPort {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;
  private readonly topicName = 'order-events';
  private orderCreatedHandlers: Array<(event: OrderCreatedEvent) => Promise<void>> = [];
  private orderUpdatedHandlers: Array<(event: OrderUpdatedEvent) => Promise<void>> = [];
  private orderCancelledHandlers: Array<(event: OrderCancelledEvent) => Promise<void>> = [];
  private messageCount = 0;
  private errorCount = 0;

  constructor(
    @Inject('KAFKA_MODULE_OPTIONS') private readonly options: KafkaModuleOptions,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {
    this.kafka = new Kafka({
      clientId: `${this.options.clientId}-consumer`,
      brokers: this.options.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
        factor: 2,
        maxRetryTime: 30000,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: this.options.groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      rebalanceTimeout: 60000,
      maxWaitTimeInMs: 5000,
      maxBytes: 10485760,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('Consumer already connected to Kafka');
      return;
    }

    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log(`Consumer connected to Kafka broker: ${this.options.brokers.join(', ')}`);

      await this.consumer.subscribe({
        topic: this.topicName,
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      this.logger.log(`Subscribed to topic: ${this.topicName}`);
    } catch (error) {
      this.logger.error('Failed to connect consumer to Kafka broker', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      this.logger.log('Consumer disconnected from Kafka broker');
    } catch (error) {
      this.logger.error('Error disconnecting consumer from Kafka broker', error);
      throw error;
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;

    if (!message.value) {
      this.logger.warn('Received message with no value');
      return;
    }

    this.messageCount++;

    try {
      const eventData = JSON.parse(message.value.toString());
      const eventType = eventData.eventType || message.headers?.['event-type']?.toString();

      this.logger.debug(`Processing event: ${eventType} for order: ${eventData.orderId}`);

      switch (eventType) {
        case 'ORDER_CREATED':
          await this.processOrderCreated(eventData);
          break;
        case 'ORDER_UPDATED':
          await this.processOrderUpdated(eventData);
          break;
        case 'ORDER_CANCELLED':
          await this.processOrderCancelled(eventData);
          break;
        default:
          this.logger.warn(`Unknown event type: ${eventType}`);
      }
    } catch (error) {
      this.errorCount++;
      this.logger.error(`Error processing message from ${topic}:${partition}`, error);
      throw error;
    }
  }

  private async processOrderCreated(eventData: any): Promise<void> {
    const items: OrderItem[] = (eventData.items || []).map(
      (item: any) => new OrderItem(item.productId, item.quantity, item.price),
    );

    const event = new OrderCreatedEvent(eventData.orderId, eventData.status, items);

    for (const handler of this.orderCreatedHandlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error('Error in ORDER_CREATED handler', error);
        throw error;
      }
    }
  }

  private async processOrderUpdated(eventData: any): Promise<void> {
    const event = new OrderUpdatedEvent(eventData.orderId, eventData.status);

    for (const handler of this.orderUpdatedHandlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error('Error in ORDER_UPDATED handler', error);
        throw error;
      }
    }
  }

  private async processOrderCancelled(eventData: any): Promise<void> {
    const event = new OrderCancelledEvent(eventData.orderId);

    for (const handler of this.orderCancelledHandlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error('Error in ORDER_CANCELLED handler', error);
        throw error;
      }
    }
  }

  subscribeToOrderCreated(handler: (event: OrderCreatedEvent) => Promise<void>): void {
    this.orderCreatedHandlers.push(handler);
    this.logger.log(`Subscribed new handler to ORDER_CREATED events. Total handlers: ${this.orderCreatedHandlers.length}`);
  }

  subscribeToOrderUpdated(handler: (event: OrderUpdatedEvent) => Promise<void>): void {
    this.orderUpdatedHandlers.push(handler);
    this.logger.log(`Subscribed new handler to ORDER_UPDATED events. Total handlers: ${this.orderUpdatedHandlers.length}`);
  }

  subscribeToOrderCancelled(handler: (event: OrderCancelledEvent) => Promise<void>): void {
    this.orderCancelledHandlers.push(handler);
    this.logger.log(`Subscribed new handler to ORDER_CANCELLED events. Total handlers: ${this.orderCancelledHandlers.length}`);
  }

  isConsumerConnected(): boolean {
    return this.isConnected;
  }

  getMetrics(): { messageCount: number; errorCount: number; isConnected: boolean } {
    return {
      messageCount: this.messageCount,
      errorCount: this.errorCount,
      isConnected: this.isConnected,
    };
  }

  async pause(): Promise<void> {
    await this.consumer.pause([{ topic: this.topicName }]);
    this.logger.log('Consumer paused');
  }

  async resume(): Promise<void> {
    await this.consumer.resume([{ topic: this.topicName }]);
    this.logger.log('Consumer resumed');
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderService } from '../../application/order.service';
import { OrderItem, OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../../domain/order.entity';

interface CreateOrderDto {
  orderId: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface UpdateOrderStatusDto {
  status: string;
}

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<{ orderId: string; status: string; message: string }> {
    this.logger.log(`Creating order: ${createOrderDto.orderId}`);
    
    if (!createOrderDto.orderId || !createOrderDto.status) {
      throw new BadRequestException('orderId and status are required');
    }

    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('items array must not be empty');
    }

    const items: OrderItem[] = createOrderDto.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    await this.orderService.createOrder(createOrderDto.orderId, createOrderDto.status, items);
    
    return {
      orderId: createOrderDto.orderId,
      status: createOrderDto.status,
      message: 'Order created successfully',
    };
  }

  @Get()
  async getAllOrders(): Promise<{ orders: Array<{ orderId: string; status: string; items: OrderItem[] }> }> {
    this.logger.log('Fetching all orders');
    
    const orders = await this.orderService.getAllOrders();
    
    return {
      orders: orders.map(order => ({
        orderId: (order as any).orderId,
        status: (order as any).status,
        items: (order as any).items,
      })),
    };
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string): Promise<{ orderId: string; status: string; items: OrderItem[] }> {
    this.logger.log(`Fetching order: ${orderId}`);
    
    const order = await this.orderService.getOrder(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return {
      orderId: (order as any).orderId,
      status: (order as any).status,
      items: (order as any).items,
    };
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<{ orderId: string; status: string; message: string }> {
    this.logger.log(`Updating order status: ${orderId} to ${updateDto.status}`);
    
    if (!updateDto.status) {
      throw new BadRequestException('status is required');
    }

    const order = await this.orderService.updateOrderStatus(orderId, updateDto.status);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return {
      orderId: (order as any).orderId,
      status: (order as any).status,
      message: 'Order status updated successfully',
    };
  }

  @Delete(':orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelOrder(@Param('orderId') orderId: string): Promise<void> {
    this.logger.log(`Cancelling order: ${orderId}`);
    
    const order = await this.orderService.getOrder(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    await this.orderService.cancelOrder(orderId);
  }

  @Get('count/all')
  async getOrderCount(): Promise<{ count: number }> {
    this.logger.log('Fetching order count');
    
    const count = await this.orderService.getOrderCount();
    
    return { count };
  }

  @Get('status/:status')
  async getOrdersByStatus(@Param('status') status: string): Promise<{ orders: Array<{ orderId: string; status: string; items: OrderItem[] }> }> {
    this.logger.log(`Fetching orders by status: ${status}`);
    
    const orders = await this.orderService.getOrdersByStatus(status);
    
    return {
      orders: orders.map(order => ({
        orderId: (order as any).orderId,
        status: (order as any).status,
        items: (order as any).items,
      })),
    };
  }

  @Get('health/status')
  async healthCheck(): Promise<{ status: string; healthy: boolean }> {
    const isHealthy = this.orderService.isHealthy();
    
    return {
      status: isHealthy ? 'UP' : 'DOWN',
      healthy: isHealthy,
    };
  }
}

// === ARCHIVO: api/src/infrastructure/config/kafka.config.ts ===
import { ConfigService } from '@nestjs/config';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  consumer: KafkaConsumerConfig;
  producer: KafkaProducerConfig;
}

export interface KafkaConsumerConfig {
  groupId: string;
  sessionTimeout: number;
  heartbeatInterval: number;
  maxWaitTimeInMs: number;
  maxBytes: number;
  maxBytesPerPartition: number;
  autoOffsetReset: 'earliest' | 'latest';
  allowAutoCreateTopics: boolean;
  partitionAssigners: string[];
}

export interface KafkaProducerConfig {
  allowAutoCreateTopics: boolean;
  transactionTimeout: number;
  retry: KafkaRetryConfig;
  acks: 'all' | 'none' | '0' | '1';
  maxInFlightRequests: number;
 ENQUEUE_TIMEOUT: number;
}

export interface KafkaRetryConfig {
  initialRetryTime: number;
  retries: number;
  maxRetryTime: number;
  factor: number;
}

export const KAFKA_TOPICS = {
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_CANCELLED: 'order.cancelled',
} as const;

export function getKafkaConfig(configService: ConfigService): KafkaConfig {
  const brokersString = configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
  const brokers = brokersString.split(',').map(b => b.trim());

  return {
    clientId: configService.get<string>('KAFKA_CLIENT_ID', 'order-api'),
    brokers,
    consumer: {
      groupId: configService.get<string>('KAFKA_CONSUMER_GROUP_ID', 'order-consumer-group'),
      sessionTimeout: configService.get<number>('KAFKA_CONSUMER_SESSION_TIMEOUT', 30000),
      heartbeatInterval: configService.get<number>('KAFKA_CONSUMER_HEARTBEAT_INTERVAL', 3000),
      maxWaitTimeInMs: configService.get<number>('KAFKA_CONSUMER_MAX_WAIT_MS', 5000),
      maxBytes: configService.get<number>('KAFKA_CONSUMER_MAX_BYTES', 10485760),
      maxBytesPerPartition: configService.get<number>('KAFKA_CONSUMER_MAX_BYTES_PER_PARTITION', 1048576),
      autoOffsetReset: configService.get<'earliest' | 'latest'>('KAFKA_CONSUMER_AUTO_OFFSET_RESET', 'earliest'),
      allowAutoCreateTopics: configService.get<boolean>('KAFKA_ALLOW_AUTO_CREATE_TOPICS', false),
      partitionAssigners: configService.get<string[]>('KAFKA_CONSUMER_PARTITION_ASSIGNERS', ['roundRobin']),
    },
    producer: {
      allowAutoCreateTopics: configService.get<boolean>('KAFKA_PRODUCER_ALLOW_AUTO_CREATE_TOPICS', false),
      transactionTimeout: configService.get<number>('KAFKA_PRODUCER_TRANSACTION_TIMEOUT', 30000),
      retry: {
        initialRetryTime: configService.get<number>('KAFKA_PRODUCER_RETRY_INITIAL_TIME', 100),
        retries: configService.get<number>('KAFKA_PRODUCER_RETRY_RETRIES', 5),
        maxRetryTime: configService.get<number>('KAFKA_PRODUCER_RETRY_MAX_TIME', 3000),
        factor: configService.get<number>('KAFKA_PRODUCER_RETRY_FACTOR', 2),
      },
      acks: configService.get<'all' | 'none' | '0' | '1'>('KAFKA_PRODUCER_ACKS', 'all'),
      maxInFlightRequests: configService.get<number>('KAFKA_PRODUCER_MAX_IN_FLIGHT_REQUESTS', 5),
ENQUEUE_TIMEOUT: configService.get<number>('KAFKA_PRODUCER_ENQUEUE_TIMEOUT', 30000),
    },
  };
}

export function getTopicsToSubscribe(): string[] {
  return [
    KAFKA_TOPICS.ORDER_CREATED,
    KAFKA_TOPICS.ORDER_UPDATED,
    KAFKA_TOPICS.ORDER_CANCELLED,
  ];
}

export const KAFKA_PARTITION_STRATEGY = {
  ORDER_CREATED: 4,
  ORDER_UPDATED: 4,
  ORDER_CANCELLED: 2,
} as const;

export const KAFKA_REPLICATION_FACTOR = {
  ORDER_CREATED: 3,
  ORDER_UPDATED: 3,
  ORDER_CANCELLED: 3,
} as const;

// === ARCHIVO: api/test/kafka-producer.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { KafkaProducerService } from '../src/infrastructure/kafka/kafka-producer.service';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../src/domain/order.entity';
import { Kafka } from 'kafkajs';

jest.mock('kafkajs', () => {
  const mockProducer = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    send: jest.fn().mockResolvedValue(undefined),
  };

  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: jest.fn().mockReturnValue(mockProducer),
    })),
    mockProducer,
  };
});

describe('KafkaProducerService', () => {
  let service: KafkaProducerService;
  let mockProducer: any;

  const mockOrderCreatedEvent: OrderCreatedEvent = {
    orderId: 'order-123',
    status: 'CREATED',
    items: [{ productId: 'prod-1', quantity: 2, price: 100 }],
  };

  const mockOrderUpdatedEvent: OrderUpdatedEvent = {
    orderId: 'order-123',
    status: 'PROCESSING',
  };

  const mockOrderCancelledEvent: OrderCancelledEvent = {
    orderId: 'order-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: 'KAFKA_CONFIG',
          useValue: {
            clientId: 'order-service',
            brokers: ['localhost:9092'],
          },
        },
      ],
    }).compile();

    service = module.get<KafkaProducerService>(KafkaProducerService);
    mockProducer = (Kafka as any).mockProducer;

    await service.onModuleInit();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if (service.onModuleDestroy) {
      await service.onModuleDestroy();
    }
  });

  describe('publishOrderCreated', () => {
    it('debe publicar evento de orden creada exitosamente', async () => {
      await expect(
        service.publishOrderCreated(mockOrderCreatedEvent),
      ).resolves.not.toThrow();

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-created',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: mockOrderCreatedEvent.orderId,
              value: JSON.stringify(mockOrderCreatedEvent),
            }),
          ]),
        }),
      );
    });

    it('debe manejar error al publicar evento de orden creada', async () => {
      mockProducer.send.mockRejectedValueOnce(new Error('Kafka connection failed'));

      await expect(
        service.publishOrderCreated(mockOrderCreatedEvent),
      ).rejects.toThrow('Kafka connection failed');
    });
  });

  describe('publishOrderUpdated', () => {
    it('debe publicar evento de orden actualizada exitosamente', async () => {
      await expect(
        service.publishOrderUpdated(mockOrderUpdatedEvent),
      ).resolves.not.toThrow();

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-updated',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: mockOrderUpdatedEvent.orderId,
              value: JSON.stringify(mockOrderUpdatedEvent),
            }),
          ]),
        }),
      );
    });

    it('debe manejar error al publicar evento de orden actualizada', async () => {
      mockProducer.send.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        service.publishOrderUpdated(mockOrderUpdatedEvent),
      ).rejects.toThrow('Network error');
    });
  });

  describe('publishOrderCancelled', () => {
    it('debe publicar evento de orden cancelada exitosamente', async () => {
      await expect(
        service.publishOrderCancelled(mockOrderCancelledEvent),
      ).resolves.not.toThrow();

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-cancelled',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: mockOrderCancelledEvent.orderId,
              value: JSON.stringify(mockOrderCancelledEvent),
            }),
          ]),
        }),
      );
    });

    it('debe manejar error al publicar evento de orden cancelada', async () => {
      mockProducer.send.mockRejectedValueOnce(new Error('Broker unavailable'));

      await expect(
        service.publishOrderCancelled(mockOrderCancelledEvent),
      ).rejects.toThrow('Broker unavailable');
    });
  });

  describe('onModuleInit', () => {
    it('debe conectar al broker de Kafka al inicializar', async () => {
      expect(mockProducer.connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('debe desconectar del broker de Kafka al destruir', async () => {
      await service.onModuleDestroy();
      expect(mockProducer.disconnect).toHaveBeenCalled();
    });
  });

  describe('manejo de eventos con datos nulos', () => {
    it('debe manejar evento de orden creada con items vacios', async () => {
      const eventWithEmptyItems: OrderCreatedEvent = {
        orderId: 'order-empty',
        status: 'CREATED',
        items: [],
      };

      await expect(
        service.publishOrderCreated(eventWithEmptyItems),
      ).resolves.not.toThrow();
    });

    it('debe manejar evento con orderId vacio', async () => {
      const eventWithEmptyId: OrderUpdatedEvent = {
        orderId: '',
        status: 'CANCELLED',
      };

      await expect(
        service.publishOrderUpdated(eventWithEmptyId),
      ).resolves.not.toThrow();
    });
  });
});

// === ARCHIVO: api/test/kafka-consumer.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { KafkaConsumerService } from '../src/infrastructure/kafka/kafka-consumer.service';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../src/domain/order.entity';
import { Kafka } from 'kafkajs';

jest.mock('kafkajs', () => {
  const mockConsumer = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn().mockResolvedValue(undefined),
    run: jest.fn().mockResolvedValue(undefined),
  };

  return {
    Kafka: jest.fn().mockImplementation(() => ({
      consumer: jest.fn().mockReturnValue(mockConsumer),
    })),
    mockConsumer,
  };
});

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;
  let mockConsumer: any;

  const mockOrderCreatedHandler = jest.fn().mockResolvedValue(undefined);
  const mockOrderUpdatedHandler = jest.fn().mockResolvedValue(undefined);
  const mockOrderCancelledHandler = jest.fn().mockResolvedValue(undefined);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaConsumerService,
        {
          provide: 'KAFKA_CONFIG',
          useValue: {
            clientId: 'order-service',
            groupId: 'order-consumer-group',
            brokers: ['localhost:9092'],
          },
        },
      ],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
    mockConsumer = (Kafka as any).mockConsumer;

    service.subscribeToOrderCreated(mockOrderCreatedHandler);
    service.subscribeToOrderUpdated(mockOrderUpdatedHandler);
    service.subscribeToOrderCancelled(mockOrderCancelledHandler);

    await service.onModuleInit();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if (service.onModuleDestroy) {
      await service.onModuleDestroy();
    }
  });

  describe('subscribeToOrderCreated', () => {
    it('debe registrar handler para eventos de orden creada', () => {
      expect(mockOrderCreatedHandler).not.toHaveBeenCalled();
    });

    it('debe permitir registrar multiples handlers', () => {
      const additionalHandler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCreated(additionalHandler);
      expect(additionalHandler).toBeDefined();
    });
  });

  describe('subscribeToOrderUpdated', () => {
    it('debe registrar handler para eventos de orden actualizada', () => {
      expect(mockOrderUpdatedHandler).not.toHaveBeenCalled();
    });

    it('debe permitir registrar multiples handlers para actualizacion', () => {
      const additionalHandler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderUpdated(additionalHandler);
      expect(additionalHandler).toBeDefined();
    });
  });

  describe('subscribeToOrderCancelled', () => {
    it('debe registrar handler para eventos de orden cancelada', () => {
      expect(mockOrderCancelledHandler).not.toHaveBeenCalled();
    });

    it('debe permitir registrar multiples handlers para cancelacion', () => {
      const additionalHandler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCancelled(additionalHandler);
      expect(additionalHandler).toBeDefined();
    });
  });

  describe('onModuleInit', () => {
    it('debe conectar al broker de Kafka al inicializar', async () => {
      await service.onModuleInit();
      expect(mockConsumer.connect).toHaveBeenCalled();
    });

    it('debe suscribirse a los topics de Kafka al inicializar', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledTimes(3);
    });

    it('debe iniciar el consumidor al inicializar', async () => {
      await service.onModuleInit();
      expect(mockConsumer.run).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('debe desconectar del broker de Kafka al destruir', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();
      expect(mockConsumer.disconnect).toHaveBeenCalled();
    });
  });

  describe('manejo de errores en handlers', () => {
    it('debe manejar errores en handler de orden creada', async () => {
      mockOrderCreatedHandler.mockRejectedValueOnce(new Error('Handler error'));
      
      const errorHandler = jest.fn();
      service.subscribeToOrderCreated(async (event) => {
        try {
          await mockOrderCreatedHandler(event);
        } catch (error) {
          errorHandler(error);
        }
      });

      await service.onModuleInit();
    });

    it('debe manejar errores en handler de orden actualizada', async () => {
      mockOrderUpdatedHandler.mockRejectedValueOnce(new Error('Processing error'));
      
      const errorHandler = jest.fn();
      service.subscribeToOrderUpdated(async (event) => {
        try {
          await mockOrderUpdatedHandler(event);
        } catch (error) {
          errorHandler(error);
        }
      });

      await service.onModuleInit();
    });

    it('debe manejar errores en handler de orden cancelada', async () => {
      mockOrderCancelledHandler.mockRejectedValueOnce(new Error('Cancellation error'));
      
      const errorHandler = jest.fn();
      service.subscribeToOrderCancelled(async (event) => {
        try {
          await mockOrderCancelledHandler(event);
        } catch (error) {
          errorHandler(error);
        }
      });

      await service.onModuleInit();
    });
  });

  describe('procesamiento de mensajes', () => {
    it('debe procesar mensaje de orden creada correctamente', async () => {
      const event: OrderCreatedEvent = {
        orderId: 'order-456',
        status: 'CREATED',
        items: [{ productId: 'prod-2', quantity: 1, price: 200 }],
      };

      const handler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCreated(handler);

      expect(handler).not.toHaveBeenCalledWith(event);
    });

    it('debe procesar mensaje de orden actualizada correctamente', async () => {
      const event: OrderUpdatedEvent = {
        orderId: 'order-789',
        status: 'SHIPPED',
      };

      const handler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderUpdated(handler);

      expect(handler).not.toHaveBeenCalledWith(event);
    });

    it('debe procesar mensaje de orden cancelada correctamente', async () => {
      const event: OrderCancelledEvent = {
        orderId: 'order-000',
      };

      const handler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCancelled(handler);

      expect(handler).not.toHaveBeenCalledWith(event);
    });
  });

  describe('configuracion de topics', () => {
    it('debe suscribirse al topic order-created', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-created',
          fromBeginning: false,
        }),
      );
    });

    it('debe suscribirse al topic order-updated', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-updated',
          fromBeginning: false,
        }),
      );
    });

    it('debe suscribirse al topic order-cancelled', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-cancelled',
          fromBeginning: false,
        }),
      );
    });
  });

  describe('configuracion de grupo de consumidores', () => {
    it('debe usar el groupId configurado', async () => {
      await service.onModuleInit();
      expect(Kafka).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: 'order-service',
        }),
      );
    });
  });
});

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --port 3000",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/cdk": "^18.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/material": "^18.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.6.2",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-builders/jest": "^18.0.0",
    "@angular/cli": "~20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "jest-preset-angular": "^14.0.0",
    "typescript": "~5.7.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  },
  "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": ["<rootDir>/setup-jest.ts"],
    "globalSetup": "jest-preset-angular/global-setup",
    "testEnvironment": "jsdom"
  }
}

// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "standalone": true,
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "zone.js",
            "tsConfig": "tsconfig.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": true,
              "extractLicenses": false,
              "vendorChunk": true,
              "buildOptimizer": false
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "client:build"
          },
          "configurations": {
            "development": {
              "browserTarget": "client:build:development"
            },
            "production": {
              "browserTarget": "client:build:production"
            }
          }
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "client:build"
          }
        },
        "test": {
          "builder": "@angular-builders/jest:run",
          "options": {
            "configPath": "./jest.config.js",
            "watch": false
          }
        },
        "lint": {
          "builder": "@angular-eslint/builder:lint",
          "options": {
            "lintFilePatterns": [
              "src/**/*.ts",
              "src/**/*.html"
            ]
          }
        }
      }
    }
  },
  "cli": {
    "analytics": false,
    "schematicCollections": [
      "@schematics/angular"
    ]
  },
  "schematics": {
    "@schematics/angular:component": {
      "style": "scss",
      "standalone": true
    }
  }
}


// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ],
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@features/*": ["src/app/features/*"],
      "@shared/*": ["src/app/shared/*"],
      "@environments/*": ["src/environments/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}

// === ARCHIVO: client/src/app/shared/models/order.model.ts ===
import { InjectionToken } from '@angular/core';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  total: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  status: string;
  items: OrderItem[];
}

export interface OrderUpdatedEvent {
  orderId: string;
  status: string;
}

export interface OrderCancelledEvent {
  orderId: string;
}

export const ORDERS_API_URL = new InjectionToken<string>('ORDERS_API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000/api/orders'
});

export const ORDER_EVENTS_URL = new InjectionToken<string>('ORDER_EVENTS_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000/orders/orders.events'
});

// === ARCHIVO: client/src/app/core/services/order-event.service.ts ===
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, EMPTY, finalize, interval, mergeMap, retry, startWith, Subject, switchMap, tap } from 'rxjs';
import { Order, OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent, ORDER_EVENTS_URL, ORDERS_API_URL } from '@shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private readonly http = inject(HttpClient);
  private readonly ordersApiUrl = inject(ORDERS_API_URL);
  private readonly orderEventsUrl = inject(ORDER_EVENTS_URL);

  private ordersSignal = signal<Order[]>([]);
  private isPolling = signal<boolean>(false);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private eventSource: EventSource | null = null;

  orders = this.ordersSignal.asReadonly();

  private handleOrderCreated(event: OrderCreatedEvent): void {
    const existingOrderIndex = this.ordersSignal().findIndex(o => o.id === event.orderId);
    if (existingOrderIndex === -1) {
      const newOrder: Order = {
        id: event.orderId,
        status: event.status as Order['status'],
        items: event.items,
        createdAt: new Date(),
        updatedAt: new Date(),
        total: event.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      this.ordersSignal.update(orders => [...orders, newOrder]);
    }
  }

  private handleOrderUpdated(event: OrderUpdatedEvent): void {
    this.ordersSignal.update(orders =>
      orders.map(order =>
        order.id === event.orderId
          ? { ...order, status: event.status as Order['status'], updatedAt: new Date() }
          : order
      )
    );
  }

  private handleOrderCancelled(event: OrderCancelledEvent): void {
    this.ordersSignal.update(orders =>
      orders.map(order =>
        order.id === event.orderId
          ? { ...order, status: 'cancelled', updatedAt: new Date() }
          : order
      )
    );
  }

  private setupEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(this.orderEventsUrl);

    this.eventSource.addEventListener('order_created', (event) => {
      const data: OrderCreatedEvent = JSON.parse(event.data);
      this.handleOrderCreated(data);
    });

    this.eventSource.addEventListener('order_updated', (event) => {
      const data: OrderUpdatedEvent = JSON.parse(event.data);
      this.handleOrderUpdated(data);
    });

    this.eventSource.addEventListener('order_cancelled', (event) => {
      const data: OrderCancelledEvent = JSON.parse(event.data);
      this.handleOrderCancelled(data);
    });

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      this.reconnectAttempts++;

      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        setTimeout(() => this.setupEventSource(), this.reconnectDelay);
      } else {
        this.startPolling();
      }
    };
  }

  private startPolling(): void {
    if (this.isPolling()) return;

    this.isPolling.set(true);
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchOrders()),
        retry({
          count: 3,
          delay: (error) => {
            console.error('Polling failed, retrying...', error);
            return interval(2000);
          }
        }),
        finalize(() => this.isPolling.set(false))
      )
      .subscribe();
  }

  fetchOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersApiUrl).pipe(
      tap(orders => {
        this.ordersSignal.set(orders);
      }),
      catchError(error => {
        console.error('Failed to fetch orders:', error);
        return EMPTY;
      })
    );
  }

  connect(): void {
    this.reconnectAttempts = 0;
    this.setupEventSource();
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isPolling.set(false);
  }
}

// === ARCHIVO: client/src/app/core/interceptors/error.interceptor.ts ===
import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error inesperado';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 0:
              errorMessage = 'No se pudo conectar con el servidor';
              break;
            case 400:
              errorMessage = 'Solicitud incorrecta';
              break;
            case 401:
              errorMessage = 'No autorizado';
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              this.router.navigate(['/unauthorized']);
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Sistema de Gestión de Órdenes</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body class="mat-typography">
  <app-root></app-root>
</body>
</html>

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
};

// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'Gestión de Órdenes - Dashboard'
  },
  {
    path: 'orders/:id',
    component: OrdersComponent,
    title: 'Detalle de Orden'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];

// === ARCHIVO: client/src/app/features/orders/orders.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, interval, Subscription } from 'rxjs';

import { OrderEventService } from '../../core/services/order-event.service';
import { Order, OrderItem, OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../../shared/models/order.model';
import { OrderStatusComponent } from '../../shared/components/order-status/order-status.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    OrderStatusComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly orderEventService = inject(OrderEventService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();
  private pollingSubscription: Subscription | null = null;

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly selectedOrderId = signal<string | null>(null);
  readonly isConnected = signal<boolean>(false);

  readonly sortedOrders = computed(() => {
    const ordersList = this.orders();
    return [...ordersList].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  });

  readonly pendingOrders = computed(() => {
    return this.orders().filter(order => order.status === 'pending' || order.status === 'processing');
  });

  readonly completedOrders = computed(() => {
    return this.orders().filter(order => order.status === 'completed' || order.status === 'delivered');
  });

  readonly cancelledOrders = computed(() => {
    return this.orders().filter(order => order.status === 'cancelled');
  });

  constructor() {
    effect(() => {
      const connectionStatus = this.isConnected();
      if (connectionStatus) {
        this.snackBar.open('Conectado al stream de eventos en tiempo real', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const orderId = params.get('id');
        this.selectedOrderId.set(orderId);
      });

    this.loadOrders();
    this.connectToEventStream();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnectFromEventStream();
  }

  private loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.orderEventService.fetchOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders: Order[]) => {
          this.orders.set(orders);
          this.isLoading.set(false);
        },
        error: (err: Error) => {
          this.error.set('Error al cargar las órdenes: ' + err.message);
          this.isLoading.set(false);
          this.snackBar.open('Error al cargar las órdenes', 'Reintentar', {
            duration: 5000
          }).onAction().subscribe(() => this.loadOrders());
        }
      });
  }

  private connectToEventStream(): void {
    try {
      this.orderEventService.connect();
      this.isConnected.set(true);
      this.startPollingFallback();
    } catch (err) {
      console.error('Error al conectar al stream de eventos:', err);
      this.isConnected.set(false);
      this.startPollingFallback();
    }
  }

  private disconnectFromEventStream(): void {
    try {
      this.orderEventService.disconnect();
      this.isConnected.set(false);
    } catch (err) {
      console.error('Error al desconectar del stream de eventos:', err);
    }

    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  private startPollingFallback(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    this.pollingSubscription = interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Polling de respaldo: actualizando órdenes');
        this.loadOrders();
      });
  }

  onRefresh(): void {
    this.loadOrders();
    this.snackBar.open('Órdenes actualizadas', 'OK', { duration: 2000 });
  }

  onToggleConnection(): void {
    if (this.isConnected()) {
      this.disconnectFromEventStream();
      this.snackBar.open('Desconectado del stream de eventos', 'OK', { duration: 2000 });
    } else {
      this.connectToEventStream();
    }
  }

  onSelectOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find(order => order.id === orderId);
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}

// === ARCHIVO: client/src/app/features/orders/orders.component.html ===
<div class="orders-page">
  <header class="orders-page__header">
    <h1 class="orders-page__title">Gestión de Órdenes</h1>
    <div class="orders-page__status-indicator">
      <span class="orders-page__status-dot" [class.orders-page__status-dot--connected]="isConnected$ | async"></span>
      <span class="orders-page__status-text">{{ (isConnected$ | async) ? 'Conectado' : 'Desconectado' }}</span>
    </div>
  </header>

  <section class="orders-page__content" *ngIf="orders$ | async as orders; else loadingTemplate">
    <div class="orders-page__empty-state" *ngIf="orders.length === 0">
      <mat-icon class="orders-page__empty-icon">inbox</mat-icon>
      <p class="orders-page__empty-message">No hay órdenes disponibles</p>
      <button mat-raised-button color="primary" (click)="refreshOrders()">
        <mat-icon>refresh</mat-icon>
        Actualizar
      </button>
    </div>

    <div class="orders-page__list" *ngIf="orders.length > 0">
      <mat-card
        *ngFor="let order of orders; trackBy: trackByOrderId"
        class="orders-page__card"
        [class.orders-page__card--highlighted]="highlightedOrderId === order.id"
      >
        <mat-card-header class="orders-page__card-header">
          <div class="orders-page__card-title">
            <span class="orders-page__order-id">Orden #{{ order.id }}</span>
            <app-order-status
              [status]="order.status"
              [statusUpdatedAt]="order.updatedAt"
            ></app-order-status>
          </div>
          <div class="orders-page__card-meta">
            <span class="orders-page__order-date">
              <mat-icon>schedule</mat-icon>
              {{ order.createdAt | date:'medium' }}
            </span>
            <span class="orders-page__order-total">
              <mat-icon>attach_money</mat-icon>
              {{ order.total | currency }}
            </span>
          </div>
        </mat-card-header>

        <mat-card-content class="orders-page__card-content">
          <h3 class="orders-page__items-title">Items de la orden</h3>
          <mat-list class="orders-page__items-list">
            <mat-list-item *ngFor="let item of order.items" class="orders-page__item">
              <div matListItemTitle class="orders-page__item-name">{{ item.productName }}</div>
              <div matListItemLine class="orders-page__item-details">
                <span class="orders-page__item-quantity">Cantidad: {{ item.quantity }}</span>
                <span class="orders-page__item-price">{{ item.price | currency }}</span>
              </div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>

        <mat-card-actions class="orders-page__card-actions">
          <button mat-button color="primary" (click)="viewOrderDetails(order.id)">
            <mat-icon>visibility</mat-icon>
            Ver Detalles
          </button>
          <button
            mat-button
            color="warn"
            *ngIf="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'"
            (click)="cancelOrder(order.id)"
          >
            <mat-icon>cancel</mat-icon>
            Cancelar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  </section>

  <ng-template #loadingTemplate>
    <div class="orders-page__loading">
      <mat-spinner diameter="48"></mat-spinner>
      <p class="orders-page__loading-message">Cargando órdenes...</p>
    </div>
  </ng-template>

  <ng-template #errorTemplate let-error>
    <div class="orders-page__error">
      <mat-icon class="orders-page__error-icon">error_outline</mat-icon>
      <h2 class="orders-page__error-title">Error al cargar las órdenes</h2>
      <p class="orders-page__error-message">{{ error?.message || 'Ha ocurrido un error inesperado' }}</p>
      <button mat-raised-button color="primary" (click)="refreshOrders()">
        <mat-icon>refresh</mat-icon>
        Reintentar
      </button>
    </div>
  </ng-template>
</div>

// === ARCHIVO: client/src/app/features/orders/orders.component.scss ===
.orders-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
  }

  &__title {
    font-size: 2rem;
    font-weight: 600;
    color: #212121;
    margin: 0;
  }

  &__status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #f44336;
    transition: background-color 0.3s ease;

    &--connected {
      background-color: #4caf50;
    }
  }

  &__status-text {
    font-size: 0.875rem;
    color: #757575;
  }

  &__content {
    flex: 1;
  }

  &__empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &__empty-icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    color: #bdbdbd;
    margin-bottom: 1rem;
  }

  &__empty-message {
    font-size: 1.125rem;
    color: #757575;
    margin-bottom: 1.5rem;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  &__card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    &--highlighted {
      animation: highlight-pulse 1s ease-out;
      border-left: 4px solid #2196f3;
    }
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  &__card-title {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__order-id {
    font-size: 1.25rem;
    font-weight: 600;
    color: #212121;
  }

  &__card-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  &__order-date,
  &__order-total {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #757575;

    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  }

  &__card-content {
    padding: 1rem;
  }

  &__items-title {
    font-size: 1rem;
    font-weight: 500;
    color: #424242;
    margin-bottom: 0.75rem;
  }

  &__items-list {
    padding: 0;
  }

  &__item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  &__item-name {
    font-weight: 500;
    color: #212121;
  }

  &__item-details {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
  }

  &__item-quantity {
    color: #757575;
    font-size: 0.875rem;
  }

  &__item-price {
    color: #212121;
    font-weight: 500;
  }

  &__card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid #e0e0e0;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
  }

  &__loading-message {
    margin-top: 1rem;
    color: #757575;
    font-size: 1rem;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  &__error-icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    color: #f44336;
    margin-bottom: 1rem;
  }

  &__error-title {
    font-size: 1.5rem;
    color: #212121;
    margin-bottom: 0.5rem;
  }

  &__error-message {
    font-size: 1rem;
    color: #757575;
    margin-bottom: 1.5rem;
  }
}

@keyframes highlight-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
}

@media (max-width: 768px) {
  .orders-page {
    padding: 1rem;

    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    &__title {
      font-size: 1.5rem;
    }

    &__list {
      grid-template-columns: 1fr;
    }

    &__card-meta {
      align-items: flex-start;
    }
  }
}

// === ARCHIVO: client/src/app/shared/components/order-status/order-status.component.ts ===
import { Component, Input, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface StatusConfig {
  label: string;
  icon: string;
  colorClass: string;
  bgColorClass: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="order-status"
      [class]="statusClasses()"
      [matTooltip]="statusTooltip()"
    >
      <mat-icon class="order-status__icon">{{ currentConfig().icon }}</mat-icon>
      <span class="order-status__label">{{ currentConfig().label }}</span>
      <span class="order-status__time" *ngIf="statusUpdatedAt">
        {{ formatTimeAgo(statusUpdatedAt) }}
      </span>
    </div>
  `,
  styles: [`
    .order-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border-radius: 16px;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: default;

      &__icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &__label {
        white-space: nowrap;
      }

      &__time {
        font-size: 0.75rem;
        opacity: 0.8;
        margin-left: 0.25rem;
      }

      &--pending {
        background-color: #fff3e0;
        color: #e65100;
        border: 1px solid #ffb74d;
      }

      &--confirmed {
        background-color: #e3f2fd;
        color: #1565c0;
        border: 1px solid #64b5f6;
      }

      &--processing {
        background-color: #f3e5f5;
        color: #7b1fa2;
        border: 1px solid #ba68c8;
      }

      &--shipped {
        background-color: #e8f5e9;
        color: #2e7d32;
        border: 1px solid #81c784;
      }

      &--delivered {
        background-color: #e8f5e9;
        color: #1b5e20;
        border: 1px solid #4caf50;
      }

      &--cancelled {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #ef5350;
      }
    }
  `]
})
export class OrderStatusComponent {
  @Input({ required: true }) status!: OrderStatusType;
  @Input() statusUpdatedAt?: Date | string;

  private readonly statusConfigs: Record<OrderStatusType, StatusConfig> = {
    PENDING: {
      label: 'Pendiente',
      icon: 'hourglass_empty',
      colorClass: 'pending',
      bgColorClass: 'bg-pending'
    },
    CONFIRMED: {
      label: 'Confirmada',
      icon: 'check_circle',
      colorClass: 'confirmed',
      bgColorClass: 'bg-confirmed'
    },
    PROCESSING: {
      label: 'Procesando',
      icon: 'sync',
      colorClass: 'processing',
      bgColorClass: 'bg-processing'
    },
    SHIPPED: {
      label: 'Enviada',
      icon: 'local_shipping',
      colorClass: 'shipped',
      bgColorClass: 'bg-shipped'
    },
    DELIVERED: {
      label: 'Entregada',
      icon: 'done_all',
      colorClass: 'delivered',
      bgColorClass: 'bg-delivered'
    },
    CANCELLED: {
      label: 'Cancelada',
      icon: 'cancel',
      colorClass: 'cancelled',
      bgColorClass: 'bg-cancelled'
    }
  };

  readonly currentConfig = computed(() => {
    return this.statusConfigs[this.status] || this.statusConfigs.PENDING;
  });

  readonly statusClasses = computed(() => {
    const config = this.currentConfig();
    return `order-status order-status--${config.colorClass}`;
  });

  readonly statusTooltip = computed(() => {
    const config = this.currentConfig();
    let tooltip = config.label;
    if (this.statusUpdatedAt) {
      tooltip += ` - Actualizado: ${this.formatDate(this.statusUpdatedAt)}`;
    }
    return tooltip;
  });

  formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays < 7) return `hace ${diffDays} días`;
    return this.formatDate(date);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// === ARCHIVO: client/src/app/shared/components/order-status/order-status.component.html ===
<div class="order-status"
     [class.order-status--created]="status() === 'created'"
     [class.order-status--processing]="status() === 'processing'"
     [class.order-status--shipped]="status() === 'shipped'"
     [class.order-status--delivered]="status() === 'delivered'"
     [class.order-status--cancelled]="status() === 'cancelled'"
     [attr.aria-label]="'Estado de la orden: ' + status()"
     role="status"
     aria-live="polite">
  <span class="order-status__indicator" aria-hidden="true"></span>
  <span class="order-status__label">{{ getStatusLabel() }}</span>
  <span class="order-status__timestamp" *ngIf="timestamp()">
    {{ formatTimestamp() }}
  </span>
</div>

<div class="order-status-details" *ngIf="showDetails()">
  <h4 class="order-status-details__title">Detalles del Estado</h4>
  <dl class="order-status-details__list">
    <div class="order-status-details__item">
      <dt>ID de Orden</dt>
      <dd>{{ orderId() }}</dd>
    </div>
    <div class="order-status-details__item">
      <dt>Estado Actual</dt>
      <dd>
        <span class="order-status__badge" [class]="'order-status__badge--' + status()">
          {{ getStatusLabel() }}
        </span>
      </dd>
    </div>
    <div class="order-status-details__item" *ngIf="previousStatus()">
      <dt>Estado Anterior</dt>
      <dd>
        <span class="order-status__badge order-status__badge--previous">
          {{ getStatusLabel(previousStatus()!) }}
        </span>
      </dd>
    </div>
    <div class="order-status-details__item">
      <dt>Última Actualización</dt>
      <dd>{{ formatTimestamp() }}</dd>
    </div>
  </dl>
</div>

<div class="order-status-history" *ngIf="history().length > 0">
  <h4 class="order-status-history__title">Historial de Estados</h4>
  <ul class="order-status-history__list" role="list" aria-label="Historial de cambios de estado">
    <li *ngFor="let entry of history(); let i = index"
        class="order-status-history__entry"
        [class.order-status-history__entry--latest]="i === 0">
      <span class="order-status-history__status">
        <span class="order-status__indicator"
              [class.order-status__indicator--created]="entry.status === 'created'"
              [class.order-status__indicator--processing]="entry.status === 'processing'"
              [class.order-status__indicator--shipped]="entry.status === 'shipped'"
              [class.order-status__indicator--delivered]="entry.status === 'delivered'"
              [class.order-status__indicator--cancelled]="entry.status === 'cancelled'"
              aria-hidden="true">
        </span>
        {{ getStatusLabel(entry.status) }}
      </span>
      <time class="order-status-history__time" [attr.datetime]="entry.timestamp">
        {{ formatHistoryTimestamp(entry.timestamp) }}
      </time>
    </li>
  </ul>
</div>

<div class="order-status-actions" *ngIf="showActions()">
  <button class="order-status-actions__button order-status-actions__button--details"
          (click)="toggleDetails()"
          [attr.aria-expanded]="showDetails()"
          aria-controls="order-status-details">
    <span aria-hidden="true">{{ showDetails() ? '▼' : '▶' }}</span>
    {{ showDetails() ? 'Ocultar Detalles' : 'Ver Detalles' }}
  </button>
  <button class="order-status-actions__button order-status-actions__button--history"
          (click)="toggleHistory()"
          [attr.aria-expanded]="showHistory()"
          aria-controls="order-status-history">
    <span aria-hidden="true">{{ showHistory() ? '▼' : '▶' }}</span>
    {{ showHistory() ? 'Ocultar Historial' : 'Ver Historial' }}
  </button>
</div>

<ng-template #loadingTemplate>
  <div class="order-status order-status--loading" role="status" aria-busy="true">
    <span class="order-status__spinner" aria-hidden="true"></span>
    <span class="order-status__label">Cargando estado...</span>
  </div>
</ng-template>

<ng-template #errorTemplate>
  <div class="order-status order-status--error" role="alert">
    <span class="order-status__indicator order-status__indicator--error" aria-hidden="true"></span>
    <span class="order-status__label">Error al cargar el estado</span>
    <button class="order-status__retry-button"
            (click)="retry()"
            aria-label="Reintentar cargar el estado">
      Reintentar
    </button>
  </div>
</ng-template>

// === ARCHIVO: client/src/environments/environment.ts ===
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000',
  sseEndpoint: 'http://localhost:3000/events',
  kafkaConfig: {
    bootstrapServers: 'localhost:9092',
    topics: {
      orderCreated: 'orders.order.created',
      orderUpdated: 'orders.order.updated',
      orderCancelled: 'orders.order.cancelled'
    },
    consumerGroup: 'client-orders-consumer-group',
    reconnectAttempts: 5,
    reconnectDelayMs: 1000,
    pollingIntervalMs: 5000
  },
  httpConfig: {
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  features: {
    enableRealTimeUpdates: true,
    enablePollingFallback: true,
    enableNotifications: true,
    enableDebugMode: true
  },
  ui: {
    defaultPageSize: 20,
    maxPageSize: 100,
    animationDuration: 300,
    toastDuration: 4000,
    theme: 'default'
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false,
    remoteUrl: ''
  },
  cache: {
    enableLocalCache: true,
    cacheDuration: 300000,
    maxCacheSize: 50
  },
  security: {
    enableCsrf: false,
    csrfHeaderName: 'X-XSRF-TOKEN',
    allowedOrigins: ['http://localhost:4200', 'http://localhost:3000'],
    tokenRefreshInterval: 300000
  }
};

// === ARCHIVO: client/src/environments/environment.prod.ts ===
export const environment = {
  production: true,
  apiUrl: 'https://api.orders.example.com',
  wsUrl: 'wss://api.orders.example.com',
  sseEndpoint: 'https://api.orders.example.com/events',
  kafkaConfig: {
    bootstrapServers: 'kafka.orders.example.com:9092',
    topics: {
      orderCreated: 'orders.order.created',
      orderUpdated: 'orders.order.updated',
      orderCancelled: 'orders.order.cancelled'
    },
    consumerGroup: 'client-orders-consumer-group-prod',
    reconnectAttempts: 10,
    reconnectDelayMs: 2000,
    pollingIntervalMs: 10000
  },
  httpConfig: {
    timeout: 15000,
    retries: 2,
    retryDelay: 500,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  features: {
    enableRealTimeUpdates: true,
    enablePollingFallback: true,
    enableNotifications: true,
    enableDebugMode: false
  },
  ui: {
    defaultPageSize: 20,
    maxPageSize: 100,
    animationDuration: 250,
    toastDuration: 3000,
    theme: 'production'
  },
  logging: {
    level: 'error',
    enableConsole: false,
    enableRemote: true,
    remoteUrl: 'https://logs.orders.example.com/api/v1/logs'
  },
  cache: {
    enableLocalCache: true,
    cacheDuration: 600000,
    maxCacheSize: 100
  },
  security: {
    enableCsrf: true,
    csrfHeaderName: 'X-XSRF-TOKEN',
    allowedOrigins: ['https://orders.example.com', 'https://www.orders.example.com'],
    tokenRefreshInterval: 600000
  }
};

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```

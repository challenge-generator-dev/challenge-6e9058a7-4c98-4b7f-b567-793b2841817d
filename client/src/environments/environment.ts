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
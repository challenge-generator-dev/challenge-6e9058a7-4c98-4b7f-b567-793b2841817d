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
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
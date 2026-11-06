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
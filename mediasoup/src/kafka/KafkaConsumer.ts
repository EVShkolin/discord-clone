import { Kafka, KafkaConfig, Consumer, ConsumerConfig, KafkaMessage } from 'kafkajs';
import { WsServer } from '../WsServer.js';
import {
  ChannelCreatedEvent,
  ChannelDeletedEvent,
  ChannelUpdatedEvent,
  MemberJoinedEvent,
  MemberLeftEvent,
  MessageCreatedEvent,
  MessageDeletedEvent,
  MessageUpdatedEvent,
} from '../messages/kafkaEvents.js';

const kafkaConfig: KafkaConfig = {
  clientId: 'mediasoup-consumer',
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
};

const consumerConfig: ConsumerConfig = {
  groupId: 'mediasoup',
  allowAutoTopicCreation: true,
};

export class KafkaConsumer {
  #consumer: Consumer;
  #wsServer: WsServer;

  static create(wsServer: WsServer) {
    const kafka = new Kafka(kafkaConfig);
    const consumer = kafka.consumer(consumerConfig);
    return new KafkaConsumer(consumer, wsServer);
  }

  private constructor(consumer: Consumer, wsServer: WsServer) {
    this.#consumer = consumer;
    this.#wsServer = wsServer;
  }

  async startConsumer(topics: string[]) {
    await this.#consumer.connect();
    console.log('Consumer connected');
    await this.#consumer.subscribe({ topics, fromBeginning: false });

    await this.#consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`New message from ${topic}[${partition}], offset ${message.offset}`);
        this.processMessage(message);
      },
    });
  }

  private processMessage(message: KafkaMessage) {
    const eventType = message.headers?.['__TypeId__']?.toString();
    console.log('Event', eventType);
    if (!eventType) return;

    try {
      if (!message.value) return;
      const messageValue = message.value.toString();
      const event = JSON.parse(messageValue);

      switch (eventType) {
        case 'messageCreated': {
          const data = event as MessageCreatedEvent;
          this.#wsServer.emitToServer(data.serverId, 'messageCreated', data);
          break;
        }
        case 'messageUpdated': {
          const data = event as MessageUpdatedEvent;
          this.#wsServer.emitToServer(data.serverId, 'messageUpdated', data);
          break;
        }
        case 'messageDeleted': {
          const data = event as MessageDeletedEvent;
          this.#wsServer.emitToServer(data.serverId, 'messageDeleted', data);
          break;
        }
        case 'channelCreated': {
          const data = event as ChannelCreatedEvent;
          this.#wsServer.emitToServer(data.serverId, 'channelCreated', data);
          break;
        }
        case 'channelUpdated': {
          const data = event as ChannelUpdatedEvent;
          this.#wsServer.emitToServer(data.serverId, 'channelUpdated', data);
          break;
        }
        case 'channelDeleted': {
          const data = event as ChannelDeletedEvent;
          this.#wsServer.emitToServer(data.serverId, 'channelDeleted', data);
          break;
        }
        case 'memberJoined': {
          const data = event as MemberJoinedEvent;
          this.#wsServer.emitToServer(data.serverId, 'memberJoined', data);
          break;
        }
        case 'memberLeft': {
          const data = event as MemberLeftEvent;
          this.#wsServer.emitToServer(data.serverId, 'memberLeft', data);
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  disconnect() {
    this.#consumer.disconnect();
  }
}

import { Socket } from 'socket.io';
import { Consumer, MediaKind, Producer, RtpCapabilities, WebRtcTransport } from 'mediasoup/types';
import { ClientToServerEvents, ProducerData, ServerToClientEvents } from './messages/wsMessages.js';
import { EnhancedEventEmitter } from 'mediasoup/extras';

export type PeerEvents = {
  'join-room': [
    { serverId: number; channelId: number },
    callback: (response: { rtpCapabilities?: RtpCapabilities; error?: string }) => void,
  ];

  'leave-room': [];

  closed: [];

  'create-webrtc-transport': [resolve: (transport: WebRtcTransport) => void, reject: (error: Error) => void];

  'get-producers': [callback: (response: ProducerData[]) => void];

  'new-producer': [{ userId: number; producerId: string; kind: MediaKind }];

  'get-can-consume': [
    {
      producerId: string;
      rtpCapabilities: RtpCapabilities;
    },
    callback: (canConsume: boolean) => void,
  ];
};

export class Peer extends EnhancedEventEmitter<PeerEvents> {
  readonly #userId: number;
  readonly #socket: Socket<ClientToServerEvents, ServerToClientEvents>;
  #currentRoomId: number | null = null;
  #producerTransport: WebRtcTransport | null = null;
  #consumerTransport: WebRtcTransport | null = null;
  #producers: Producer[] = [];
  #consumers: Map<string, Consumer> = new Map();

  constructor(userId: number, socket: Socket) {
    super();
    this.#userId = userId;
    this.#socket = socket;

    this.handleGeneralMessages();
    this.handleSignalingMessages();
  }

  get userId() {
    return this.#userId;
  }

  get producers() {
    return this.#producers;
  }

  close(): void {
    this.leaveRoom();
    this.emit('closed');
  }

  leaveRoom(): void {
    this.emit('leave-room');

    this.#producerTransport?.close();
    this.#producerTransport = null;
    this.#consumerTransport?.close();
    this.#consumerTransport = null;

    this.#producers.forEach((producer) => producer.close());
    this.#producers = [];
    this.#consumers.forEach((consumer) => consumer.close());
    this.#consumers = new Map();

    this.#currentRoomId = null;
  }

  sendToUser<K extends keyof ServerToClientEvents>(event: K, ...args: Parameters<ServerToClientEvents[K]>): void {
    this.#socket.emit(event, ...args);
  }

  private handleGeneralMessages(): void {}

  private handleSignalingMessages(): void {
    this.#socket.on('joinRoom', async ({ serverId, channelId }, callback) => {
      if (this.#currentRoomId === channelId) {
        callback({ error: 'Peer already in this channel' });
        return;
      }

      if (this.#currentRoomId) this.leaveRoom();

      this.emit('join-room', { serverId, channelId }, callback);
    });

    this.#socket.on('createWebRtcTransport', async ({ consumer }, callback) => {
      const transport = await new Promise<WebRtcTransport>((resolve, reject) => {
        this.emit('create-webrtc-transport', resolve, reject);
      });

      if (consumer) {
        this.#consumerTransport = transport;
      } else {
        this.#producerTransport = transport;
      }

      callback({
        params: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
      });
    });

    this.#socket.on('getProducers', (_data, callback) => {
      this.emit('get-producers', callback);
    });

    this.#socket.on('producerTransportConnect', async ({ dtlsParameters }, callback) => {
      await this.#producerTransport!.connect({ dtlsParameters });
      callback();
      console.log(this.#userId, 'connected producer transport');
    });

    this.#socket.on('produce', async ({ kind, rtpParameters }, callback) => {
      const producer = await this.#producerTransport!.produce({ kind, rtpParameters });
      this.#producers.push(producer);

      this.emit('new-producer', { userId: this.#userId, producerId: producer.id, kind });

      producer.on('transportclose', () => {
        producer.close();
        this.#producers = this.#producers.filter((p) => p.id !== producer.id);
      });

      callback({ id: producer.id });
    });

    this.#socket.on('recvTransportConnect', async ({ dtlsParameters }, callback) => {
      await this.#consumerTransport!.connect({ dtlsParameters });
      callback();
    });

    this.#socket.on('consume', async ({ rtpCapabilities, remoteProducerId }, callback) => {
      let canConsume: boolean = false;
      this.emit('get-can-consume', { producerId: remoteProducerId, rtpCapabilities }, (_canConsume) => {
        canConsume = _canConsume;
      });

      if (!canConsume) {
        callback({ error: `Cannot consume producer ${remoteProducerId}` });
        return;
      }

      const consumer = await this.#consumerTransport!.consume({
        producerId: remoteProducerId,
        rtpCapabilities,
        paused: true,
      });

      this.#consumers.set(consumer.id, consumer);

      consumer.on('transportclose', () => {
        this.#consumers.delete(consumer.id);
      });

      consumer.on('producerclose', () => {
        this.#socket.emit('producerClosed', { remoteProducerId });
        consumer.close();
        this.#consumers.delete(consumer.id);
      });

      console.log(this.#userId, 'added new consumer', consumer.id);
      callback({
        id: consumer.id,
        producerId: remoteProducerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      });
    });

    this.#socket.on('consumerResume', async ({ serverConsumerId }) => {
      const consumer = this.#consumers.get(serverConsumerId);
      if (consumer) await consumer.resume();
    });

    this.#socket.on('closeProducer', ({ producerId }) => {
      const producer = this.#producers.find((p) => p.id === producerId);
      if (!producer) return;

      producer.close();
      this.#producers = this.#producers.filter((p) => p.id !== producerId);
      console.log(this.#userId, 'closed producer', producerId);
    });

    this.#socket.on('leaveRoom', (_data, callback) => {
      this.leaveRoom();
      callback();
    });

    this.#socket.on('disconnect', () => {
      this.close();
    });
  }
}

import { Peer } from './Peer.js';
import { DtlsState, Router, RtpCapabilities, WebRtcTransport, WebRtcTransportOptions } from 'mediasoup/types';
import { EnhancedEventEmitter } from 'mediasoup/extras';
import { ProducerData } from './messages/wsMessages.js';

const MEDIASOUP_IP = process.env.MEDIASOUP_IP || '127.0.0.1';

const webRtcTransportOptions: WebRtcTransportOptions = {
  listenInfos: [
    {
      protocol: 'udp',
      ip: '0.0.0.0',
      announcedAddress: MEDIASOUP_IP,
      portRange: { min: 2000, max: 2020 },
    },
    {
      protocol: 'tcp',
      ip: '0.0.0.0',
      announcedAddress: MEDIASOUP_IP,
      portRange: { min: 2000, max: 2020 },
    },
  ],
  enableUdp: true,
  enableTcp: true,
  preferUdp: true,
};

export type RoomEvents = {
  'joined-voice-channel': [{ userId: number }];

  'left-voice-channel': [{ userId: number; channelId: number }];

  closed: [];
};

export class Room extends EnhancedEventEmitter<RoomEvents> {
  readonly #serverId: number;
  readonly #channelId: number;
  readonly #userLimit: number;
  #peers: Map<number, Peer> = new Map();
  readonly #router: Router;

  constructor(serverId: number, channelId: number, userLimit: number, router: Router) {
    super();
    this.#serverId = serverId;
    this.#channelId = channelId;
    this.#userLimit = userLimit;
    this.#router = router;
  }

  get serverId() {
    return this.#serverId;
  }
  get channelId() {
    return this.#channelId;
  }
  get userLimit() {
    return this.#userLimit;
  }

  get peers() {
    return this.#peers;
  }

  getMemberCount(): number {
    return this.#peers.size;
  }

  getRtpCapabilities(): RtpCapabilities {
    return this.#router.rtpCapabilities;
  }

  close(): void {
    this.#peers.forEach((peer) => peer.leaveRoom());
    this.#router.close();
    this.emit('closed');
  }

  connectPeer(peer: Peer) {
    this.#peers.set(peer.userId, peer);
    this.handlePeer(peer);
    this.emit('joined-voice-channel', { userId: peer.userId });
    console.log(`User ${peer.userId} connected to room ${this.#channelId}`);
  }

  toJSON() {
    return {
      serverId: this.#serverId,
      channelId: this.#channelId,
      userLimit: this.#userLimit,
      routerId: this.#router.id,
    };
  }

  private async createWebRtcTransport(): Promise<WebRtcTransport> {
    try {
      const transport: WebRtcTransport = await this.#router.createWebRtcTransport(webRtcTransportOptions);

      transport.on('dtlsstatechange', (dtlsState: DtlsState) => {
        if (dtlsState === 'closed') transport.close();
      });

      transport.on('@close', () => {
        console.log(`Transport ${transport.id} closed`);
      });

      return transport;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private handlePeer(peer: Peer): void {
    peer.on('create-webrtc-transport', async (resolve, reject) => {
      try {
        const transport = await this.createWebRtcTransport();
        resolve(transport);
      } catch (error) {
        reject(error as Error);
      }
    });

    peer.on('get-producers', (callback) => {
      const producersData: ProducerData[] = [];
      this.#peers.forEach((member, userId) => {
        if (userId !== peer.userId) {
          member.producers.forEach((producer) => {
            producersData.push({
              userId,
              producerId: producer.id,
              kind: producer.kind,
            });
          });
        }
      });

      callback(producersData);
    });

    peer.on('new-producer', (data) => {
      console.log(peer.userId, 'created new producer, currently in room', this.#peers.size, 'peers');
      this.#peers.forEach((p: Peer) => {
        if (p.userId !== peer.userId) {
          p.sendToUser('newProducer', data);
          console.log('Sending to user', p.userId);
        }
      });
    });

    peer.on('get-can-consume', ({ producerId, rtpCapabilities }, callback) => {
      callback(this.#router.canConsume({ producerId, rtpCapabilities }));
    });

    peer.on('leave-room', () => {
      this.#peers.delete(peer.userId);
      this.emit('left-voice-channel', { userId: peer.userId, channelId: this.#channelId });
      peer.removeAllListeners('create-webrtc-transport');
      peer.removeAllListeners('get-producers');
      peer.removeAllListeners('new-producer');
      peer.removeAllListeners('get-can-consume');
      peer.removeAllListeners('leave-room');

      if (this.#peers.size === 0) this.close();
    });
  }
}

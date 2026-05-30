import * as http from 'node:http';
import { ApiServer } from './ApiServer.js';
import { WsServer } from './WsServer.js';
import { Worker } from 'mediasoup/types';
import mediasoup from 'mediasoup';
import { RoomManager } from './RoomManager.js';
import { VoiceChatMember } from './messages/serverRequestTypes.js';
import { KafkaConsumer } from './kafka/KafkaConsumer.js';
import { Channel } from './messages/kafkaEvents.js';

const topics = ['messages'];

export class Server {
  #httpServer: http.Server;
  #apiServer: ApiServer;
  #wsServer: WsServer;
  #roomManager: RoomManager;

  static async create(port: number) {
    const httpServer = await Server.createHttpServer(port);
    const apiServer = ApiServer.create();
    const worker = await Server.createWorker();
    const roomManager = new RoomManager(worker);
    const wsServer = WsServer.create(httpServer, roomManager);
    this.createKafkaConsumer(wsServer);

    return new Server(httpServer, apiServer, wsServer, roomManager);
  }

  private constructor(httpServer: http.Server, apiServer: ApiServer, wsServer: WsServer, roomManager: RoomManager) {
    this.#httpServer = httpServer;
    this.#apiServer = apiServer;
    this.#wsServer = wsServer;
    this.#roomManager = roomManager;

    this.handleRoomManager();
    this.handleWsServer();
  }

  private static async createHttpServer(port: number): Promise<http.Server> {
    const httpServer = http.createServer();

    await new Promise<void>((resolve, reject) => {
      httpServer.listen(port, resolve);
      httpServer.on('error', (err) => {
        reject(err);
      });
    });
    return httpServer;
  }

  private static async createWorker(): Promise<Worker> {
    const newWorker: Worker = await mediasoup.createWorker();
    console.log(`worker pid ${newWorker.pid}`);

    newWorker.on('died', (error) => {
      console.error('Mediasoup worker has died:', error);
    });

    return newWorker;
  }

  private static createKafkaConsumer(wsServer: WsServer): void {
    const consumer = KafkaConsumer.create(wsServer);
    consumer.startConsumer(topics);
  }

  private handleRoomManager(): void {
    this.#roomManager.on('get-channel-info', async ({ serverId, channelId }, resolve, reject) => {
      try {
        const channelInfo: Channel = await this.#apiServer.fetchChannelData(serverId, channelId);
        resolve(channelInfo);
      } catch (err) {
        console.log(err);
        reject(err as Error);
      }
    });

    this.#roomManager.on('joined-voice-channel', async ({ userId, serverId, channelId }) => {
      try {
        const user = await this.#apiServer.fetchUserData(serverId, userId);
        this.#wsServer.emitToServer(serverId, 'joinedVoiceChannel', { serverId, channelId, user });
      } catch (err) {
        console.log(err);
      }
    });

    this.#roomManager.on('left-voice-channel', ({ userId, serverId, channelId }) => {
      this.#wsServer.emitToServer(serverId, 'leftVoiceChannel', { serverId, channelId, userId });
    });
  }

  private handleWsServer(): void {
    this.#wsServer.on('get-voice-chat-members', async ({ serverId }, callback) => {
      const members: Map<number, VoiceChatMember> = this.#roomManager.getVoiceChatMembersByServerId(serverId);
      const membersInfo = await this.#apiServer.fetchVoiceChatMembers(serverId, members.keys().toArray());
      const membersMap = new Map<number, VoiceChatMember[]>();

      for (const member of membersInfo) {
        const roomId = members.get(member.userId)?.currentChannelId;
        if (roomId && membersMap.has(roomId)) {
          membersMap.get(roomId)?.push(member);
        } else if (roomId) {
          membersMap.set(roomId, [member]);
        }
      }
      console.log('result', Object.fromEntries(membersMap));

      callback({
        members: Object.fromEntries(membersMap),
      });
    });
  }
}

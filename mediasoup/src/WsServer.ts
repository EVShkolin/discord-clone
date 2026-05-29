import { Server } from 'socket.io';
import { Peer } from './Peer.js';
import * as http from 'node:http';
import { getDataFromToken } from './jwtUtils.js';
import { ClientToServerEvents, ServerToClientEvents } from './messages/wsMessages.js';
import { RoomManager, VoiceChatMember } from './RoomManager.js';
import { EnhancedEventEmitter } from 'mediasoup/extras';

type WsServerEvents = {
  'get-voice-chat-members': [
    { serverId: number },
    callback: (response: { members: Record<number, VoiceChatMember[]> }) => void,
  ];
};

export class WsServer extends EnhancedEventEmitter<WsServerEvents> {
  #socketIoServer: Server<ClientToServerEvents, ServerToClientEvents>;
  #peers: Map<number, Peer> = new Map();
  #roomManager: RoomManager;

  static create(httpServer: http.Server, roomManager: RoomManager): WsServer {
    const socketIoServer = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
    return new WsServer(socketIoServer, roomManager);
  }

  private constructor(socketIoServer: Server, roomManager: RoomManager) {
    super();
    this.#socketIoServer = socketIoServer;
    this.#roomManager = roomManager;

    this.handleSocketIoServer();
  }

  public emitToServer<K extends keyof ServerToClientEvents>(
    serverId: number,
    event: K,
    ...args: Parameters<ServerToClientEvents[K]>
  ): void {
    this.#socketIoServer.to(serverId.toString()).emit(event, ...args);
  }

  private handleSocketIoServer(): void {
    this.#socketIoServer.on('connection', (socket) => {
      const token = socket.handshake.auth.token;
      const tokenData = getDataFromToken(token);
      if (!tokenData || tokenData.userId == null) return;

      const peer = new Peer(tokenData.userId, socket);
      this.#peers.set(peer.userId, peer);
      console.log(`User ${peer.userId} connected new socket ${socket.id}`);
      socket.emit('connectionSuccess', { socketId: socket.id });

      socket.on('subscribeToServer', ({ serverId }, callback) => {
        socket.join(serverId.toString());
        this.emit('get-voice-chat-members', { serverId }, callback);
      });

      this.handlePeer(peer);
    });
  }

  private handlePeer(peer: Peer) {
    peer.on('join-room', async ({ serverId, channelId }, callback) => {
      await this.#roomManager.connectPeerToRoom({ peer, serverId, channelId }, callback);
    });

    peer.on('closed', () => {
      this.#peers.delete(peer.userId);
    });
  }
}

import { io } from 'socket.io-client';
import { useVoiceMembersStore } from '@entities/channel/model/voiceMembersStore.js';
import { addMessageToCache, deleteMessageFromCache, updateMessageInCache } from '@features/message-list/index.js';

class WebSocketService {
  socket = null;
  connectionPromise = null;
  resolveConnection = null;

  connect(token) {
    if (!this.socket) {
      this.connectionPromise = new Promise((resolve) => {
        this.resolveConnection = resolve;
      });

      this.socket = io('/', { auth: { token } });
      this.handleWebsocket();
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  async emitWithAck(event, data) {
    await this.waitForConnection();
    return new Promise((resolve, reject) => {
      if (!this.socket) reject('Socket not connected');
      this.socket.emit(event, data, (response) => {
        if (response?.error) reject(response.error);
        else resolve(response);
      });
    });
  }

  subscribeToServer(serverId) {
    this.emitWithAck('subscribeToServer', { serverId: Number(serverId) })
      .then((res) => {
        useVoiceMembersStore.getState().setVoiceChatMembers(serverId, res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async waitForConnection() {
    if (this.socket?.connected) return;
    if (this.connectionPromise) return this.connectionPromise;
  }

  handleWebsocket() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.socket.on('connectionSuccess', ({ socketId }) => {
      console.log('Connected to mediasoup, socketId: ', socketId);
      if (this.resolveConnection) {
        this.resolveConnection();
        this.resolveConnection = null;
      }
    });

    this.socket.on('joinedVoiceChannel', ({ serverId, channelId, user }) => {
      useVoiceMembersStore.getState().addMember(serverId, channelId, user);
    });

    this.socket.on('leftVoiceChannel', ({ serverId, channelId, userId }) => {
      useVoiceMembersStore.getState().removeMember(serverId, channelId, userId);
    });

    this.socket.on('messageCreated', ({ message }) => {
      if (message.author.id !== user.id) {
        addMessageToCache(message.channelId, message);
      }
    });

    this.socket.on('messageUpdated', ({ message }) => {
      updateMessageInCache(message.channelId, message);
    });

    this.socket.on('messageDeleted', ({ channelId, messageId }) => {
      deleteMessageFromCache(channelId, messageId);
    });
  }
}

export const wsService = new WebSocketService();

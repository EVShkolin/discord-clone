import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';
import { addMessageToCache, deleteMessageFromCache, updateMessageInCache } from '@/features/message-list';

export const createWebSocketService = () => {
  let client = null;
  let isConnecting = false;
  const subscriptions = new Map();
  const onConnectCallbacks = new Set();

  const connect = (token) => {
    if (isConnected() || isConnecting) return;
    isConnecting = true;
    client = new Client({
      webSocketFactory: () => new SockJS(`/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log('WebSocket connected');
        onConnectCallbacks.forEach((cb) => cb());
        isConnecting = false;
      },
      onDisconnect: () => console.log('WebSocket disconnected'),
    });
    client.activate();
  };

  const disconnect = () => {
    if (client) {
      client.deactivate();
      client = null;
      subscriptions.clear();
    }
  };

  const isConnected = () => client?.connected || false;

  const onConnect = (callback) => {
    if (isConnected()) {
      callback();
    } else {
      onConnectCallbacks.add(callback);
    }
  };

  const subscribeToServer = (serverId) => {
    if (!client?.connected || !serverId) return;
    const user = JSON.parse(localStorage.getItem('user'));
    const destination = `/topic/server/${serverId}`;
    if (subscriptions.has(destination)) return;

    const subscription = client.subscribe(destination, (message) => {
      const event = JSON.parse(message.body);
      switch (event.type) {
        case 'MESSAGE_CREATED':
          if (event.message.author.id !== user.id) {
            addMessageToCache(event.message.channelId, event.message);
          }
          break;
        case 'MESSAGE_UPDATED':
          updateMessageInCache(event.message.channelId, event.message);
          break;
        case 'MESSAGE_DELETED':
          deleteMessageFromCache(event.channelId, event.messageId);
          break;
        default:
          break;
      }
    });
    subscriptions.set(destination, subscription);
    console.log('Subscribed to server', serverId);
  };

  const unsubscribeFromServer = (serverId) => {
    const destination = `/topic/server/${serverId}`;
    const subscription = subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptions.delete(destination);
    }
  };

  return {
    connect,
    disconnect,
    onConnect,
    subscribeToServer,
    unsubscribeFromServer,
  };
};

export const webSocketService = createWebSocketService();

import mediasoup from 'mediasoup';
import { Server } from 'socket.io'
import { getDataFromToken } from './jwtUtils.js';
import { createWebRtcTransport } from './createWebRtcTransport.js';

const PORT = Number(process.env.MEDIASOUP_PORT) || 4000;
console.log(PORT)

const rooms = new Map();
const connections = new Map();

const createWorker = async () => {
  const newWorker = await mediasoup.createWorker({
    rtcMinPort: 2000, rtcMaxPort: 2020,
  })
  console.log(`worker pid ${newWorker.pid}`)

  newWorker.on('died', error => {
    console.error('mediasoup worker has died');
    setTimeout(() => process.exit(1), 2000);
  });

  return newWorker;
};

const worker = await createWorker();

const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000,
    },
  },
];

const io = new Server(PORT);

io.on('connection', async socket => {
  const token = socket.handshake.auth.token;
  const { userId } = getDataFromToken(token);
  console.log(`User ${userId} connected new socket ${socket.id}`);

  const connection = createConnection(socket, userId);
  socket.emit('connectionSuccess', { socketId: socket.id });

  socket.on('joinRoom', async (voiceToken, callback) => {
    const channelId = 2; // TODO get from voice token
    leaveRoom(connection);
    const room = await joinRoom(channelId, connection);

    const rtpCapabilities = room.router.rtpCapabilities;
    callback({ rtpCapabilities });
  });

  socket.on('createWebRtcTransport', async ({ consumer }, callback) => {
    const room = rooms.get(connection.currentRoomId);
    const transport = await createWebRtcTransport(room.router);

    if (consumer) {
      connection.consumerTransport = transport;
    } else {
      connection.producerTransport = transport;
    }

    callback({
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      }
    });
  });

  socket.on('getProducers', (data, callback) => {
    const room = rooms.get(connection.currentRoomId);
    const producerIds = [];
    room.members.forEach((member, memberId) => {
      if (memberId !== connection.userId) {
        member.producers.forEach((producer) => {
          producerIds.push(producer.id);
        });
      }
    });

    callback(producerIds);
  });

  socket.on('producerTransportConnect', async ({ dtlsParameters }, callback) => {
    await connection.producerTransport.connect({ dtlsParameters });
    callback();
    console.log(connection.userId, "connected producer transport");
  });

  socket.on('produce', async ({ kind, rtpParameters, appData }, callback) => {
    const producer = await connection.producerTransport.produce({ kind, rtpParameters });
    connection.producers.push(producer);

    const room = rooms.get(connection.currentRoomId);
    room.members.forEach((member) => {
      if (member.userId !== connection.userId) {
        member.socket.emit('newProducer', { producerId: producer.id });
      }
    });

    producer.on('transportclose', () => {
      producer.close();
      connection.producers = connection.producers.filter(p => p.id !== producer.id);
    });

    // console.log(connection.userId, "added new producer:", producer.kind);
    // console.log(`Producers in ${room.channelId} room has ${room.members.size} members and ${Array.from(room.members.values()).reduce((sum, member) => sum + member.producers.length, 0)} producers`)
    callback({ id: producer.id });
  });

  socket.on('recvTransportConnect', async ({ dtlsParameters }, callback) => {
    await connection.consumerTransport.connect({ dtlsParameters });
    callback();
  });

  socket.on('consume', async ({ rtpCapabilities, remoteProducerId }, callback) => {
    const router = rooms.get(connection.currentRoomId).router;
    const consumerTransport = connection.consumerTransport;

    if (!router.canConsume({ producerId: remoteProducerId, rtpCapabilities })) {
      return;
    }

    const consumer = await consumerTransport.consume({
      producerId: remoteProducerId,
      rtpCapabilities,
      paused: true
    });

    connection.consumers.set(consumer.id, consumer);

    consumer.on('transportclose', () => {
      connection.consumers.delete(consumer.id);
    });

    consumer.on('producerclose', () => {
      connection.socket.emit('producerClosed', { remoteProducerId });
      consumer.close();
      connection.consumers.delete(consumer.id);
    });

    console.log(connection.userId, "added new consumer", consumer.id);
    callback({
      id: consumer.id,
      producerId: remoteProducerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters
    });
  });

  socket.on('consumerResume', async ({ serverConsumerId }) => {
    const consumer = connection.consumers.get(serverConsumerId);
    await consumer.resume();
  });

  socket.on('closeProducer', ({ producerId }) => {
    const producer = connection.producers.find(p => p.id === producerId);
    if (!producer) return;

    producer.close();
    connection.producers = connection.producers.filter(p => p.id !== producerId);
    console.log(connection.userId, 'closed producer', producerId);
  });

  socket.on('leaveRoom', (data, callback) => {
    leaveRoom(connection);
    callback();
  });

  socket.on('disconnect', () => {
    console.log("Socket disconnected", socket.id);
    leaveRoom(connection);
    connections.delete(connection.userId);
  });
});

const createConnection = (socket, userId) => {
  const connection = {
    userId,
    socket,
    currentRoomId: null,
    producerTransport: null,
    consumerTransport: null,
    producers: [],
    consumers: new Map()
  };

  connections.set(userId, connection);
  return connection;
};

const createRoom = async (channelId) => {
  if (rooms.has(channelId)) return rooms.get(channelId);
  const router = await worker.createRouter({ mediaCodecs });

  const room = {
    channelId,
    router,
    members: new Map()
  };

  rooms.set(channelId, room);
  return room;
};

const joinRoom = async (channelId, connection) => {
  const room = rooms.has(channelId) ? rooms.get(channelId) : await createRoom(channelId);
  room.members.set(connection.userId, connection);
  connection.currentRoomId = channelId;
  return room;
};

const leaveRoom = (connection) => {
  for (const room of rooms.values()) {
    if (room.members.has(connection.userId)) {
      connection.producers.forEach(p => p.close());
      connection.producers = [];

      connection.consumers.forEach(c => c.close());
      connection.consumers.clear();

      connection.producerTransport?.close();
      connection.consumerTransport?.close();
      connection.producerTransport = null;
      connection.consumerTransport = null

      room.members.delete(connection.userId);
      connection.currentRoomId = null;
      break;
    }
  }
};


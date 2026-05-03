import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';
import { useAuth } from '@app/provider/AuthProvider.jsx';

const MediasoupContext = createContext(undefined);

export const MediasoupProvider = ({ children }) => {
  const [consumers, setConsumers] = useState(new Map());
  const { token } = useAuth();
  const deviceRef = useRef(null);
  const socketRef = useRef(null);
  const consumerTransportRef = useRef(null);
  const producerTransportRef = useRef(null);
  const voiceChannelIdRef = useRef(null);

  useEffect(() => {
    const socket = io('/', {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connectionSuccess', ({ socketId }) => {
      console.log('Connected to mediasoup, socketId: ', socketId);
    });

    socket.on('disconnect', () => {});

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewProducer = ({ producerId }) => {
      console.log('New producer connected!');
      if (voiceChannelIdRef.current) {
        consumeRemoteProducer(producerId);
      }
    };

    const handleProducerClosed = ({ remoteProducerId }) => {
      setConsumers((prev) => {
        const newConsumers = new Map(prev);

        for (const [consumerId, consumer] of newConsumers) {
          if (consumer.producerId === remoteProducerId) {
            newConsumers.delete(consumerId);
            break;
          }
        }

        return newConsumers;
      });
    };

    socket.on('newProducer', handleNewProducer);
    socket.on('producerClosed', handleProducerClosed);

    return () => {
      socket.off('newProducer', handleNewProducer);
      socket.off('producerClosed', handleProducerClosed);
    };
  }, []);

  const emitWithAck = (event, data) => {
    return new Promise((resolve, reject) => {
      socketRef.current.emit(event, data, (response) => {
        if (response?.error) reject(response.error);
        else resolve(response);
      });
    });
  };

  const joinVoiceChannel = async (channelId) => {
    if (!socketRef.current) return;
    if (channelId === voiceChannelIdRef.current) return;

    await leaveVoiceChannel();
    try {
      voiceChannelIdRef.current = channelId;

      const { rtpCapabilities } = await emitWithAck('joinRoom', { roomId: channelId });

      await createDevice(rtpCapabilities);

      await createConsumerTransportAndConsume();

      await createProducerTransport();
    } catch (err) {
      console.log(err);
      await leaveVoiceChannel();
    }
  };

  const createDevice = async (rtpCapabilities) => {
    try {
      const newDevice = new mediasoupClient.Device();
      await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
      deviceRef.current = newDevice;
    } catch (err) {
      console.log(err);
      if (err.name === 'UnsupportedError') console.warn('browser not supported');
    }
  };

  const createConsumerTransportAndConsume = async () => {
    const { params } = await emitWithAck('createWebRtcTransport', { consumer: true });

    const consumerTransport = deviceRef.current.createRecvTransport(params);
    consumerTransportRef.current = consumerTransport;

    consumerTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      emitWithAck('recvTransportConnect', { dtlsParameters })
        .then(() => callback())
        .catch(errback);
    });

    const producerIds = await emitWithAck('getProducers');
    producerIds.forEach(consumeRemoteProducer);
  };

  const consumeRemoteProducer = async (remoteProducerId) => {
    const params = await emitWithAck('consume', {
      rtpCapabilities: deviceRef.current.rtpCapabilities,
      remoteProducerId,
    });

    const consumer = await consumerTransportRef.current.consume({
      id: params.id,
      producerId: params.producerId,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
    });

    setConsumers((prev) => new Map(prev).set(consumer.id, consumer));

    socketRef.current.emit('consumerResume', { serverConsumerId: params.id });
  };

  const createProducerTransport = async () => {
    const { params } = await emitWithAck('createWebRtcTransport', { consumer: false });

    const producerTransport = deviceRef.current.createSendTransport(params);
    producerTransportRef.current = producerTransport;
    console.log('producerTransport:', producerTransport);

    producerTransport.on('produce', async (parameters, callback, errback) => {
      try {
        const { id } = await emitWithAck('produce', {
          kind: parameters.kind,
          rtpParameters: parameters.rtpParameters,
          appData: parameters.appData,
        });
        callback({ id });
      } catch (err) {
        errback(err);
      }
    });

    producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await emitWithAck('producerTransportConnect', {
          dtlsParameters,
          serverProducerTransportId: params.id,
        });
        callback();
        console.log('Connected producer transport');
      } catch (err) {
        errback(err);
      }
    });
  };

  const createProducer = async (params) => {
    if (!producerTransportRef.current) throw new Error('Producer transport not ready');
    return producerTransportRef.current.produce(params);
  };

  const closeProducer = (producerId) => {
    socketRef.current.emit('closeProducer', { producerId });
  };

  const leaveVoiceChannel = async () => {
    consumerTransportRef.current?.close();
    producerTransportRef.current?.close();
    consumerTransportRef.current = null;
    producerTransportRef.current = null;

    setConsumers(new Map());
    voiceChannelIdRef.current = null;

    await emitWithAck('leaveRoom');
  };

  return (
    <MediasoupContext.Provider
      value={{
        joinVoiceChannel,
        leaveVoiceChannel,
        consumers,
        createProducer,
        closeProducer,
        voiceChannelIdRef,
      }}
    >
      {children}
    </MediasoupContext.Provider>
  );
};

export const useMediasoup = () => {
  return useContext(MediasoupContext);
};

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import { wsService } from '@shared/api/websocket/websocketClient.js';
import { useVoiceSessionStore } from '@app/provider/voiceSessionStore.js';

const MediasoupContext = createContext(undefined);

export const MediasoupProvider = ({ children }) => {
  const deviceRef = useRef(null);
  const consumerTransportRef = useRef(null);
  const producerTransportRef = useRef(null);

  const { voiceChannelId, setVoiceChannelId, addConsumer, removeConsumer, reset } = useVoiceSessionStore();

  useEffect(() => {
    const socket = wsService.socket;
    if (!socket) return;

    const handleNewProducer = ({ userId, producerId, kind }) => {
      consumeRemoteProducer(userId, producerId, kind);
    };

    const handleProducerClosed = ({ remoteProducerId }) => {
      removeConsumer(remoteProducerId);
    };

    socket.on('newProducer', handleNewProducer);
    socket.on('producerClosed', handleProducerClosed);

    return () => {
      socket.off('newProducer', handleNewProducer);
      socket.off('producerClosed', handleProducerClosed);
    };
  }, [wsService.socket]);

  const joinVoiceChannel = async (serverId, channelId) => {
    if (!wsService.socket || channelId === voiceChannelId) return;

    await leaveVoiceChannel();
    try {
      setVoiceChannelId(channelId);

      const { rtpCapabilities } = await wsService.emitWithAck('joinRoom', { serverId, channelId });

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
    const { params } = await wsService.emitWithAck('createWebRtcTransport', { consumer: true });

    const consumerTransport = deviceRef.current.createRecvTransport(params);
    consumerTransportRef.current = consumerTransport;

    consumerTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      wsService
        .emitWithAck('recvTransportConnect', { dtlsParameters })
        .then(() => callback())
        .catch(errback);
    });

    const producersData = await wsService.emitWithAck('getProducers');

    producersData.forEach(({ userId, producerId, kind }) => {
      consumeRemoteProducer(userId, producerId, kind);
    });
  };

  const consumeRemoteProducer = async (userId, remoteProducerId, kind) => {
    const params = await wsService.emitWithAck('consume', {
      rtpCapabilities: deviceRef.current.rtpCapabilities,
      remoteProducerId,
    });

    const consumer = await consumerTransportRef.current.consume({
      id: params.id,
      producerId: params.producerId,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
    });

    if (!consumer.track) {
      await new Promise((resolve) => {
        consumer.once('track', () => {
          console.log(`Track received for ${kind} from ${userId}`);
          resolve();
        });
      });
    }

    addConsumer(userId, kind, consumer);

    wsService.socket.emit('consumerResume', { serverConsumerId: params.id });
  };

  const createProducerTransport = async () => {
    const { params } = await wsService.emitWithAck('createWebRtcTransport', { consumer: false });

    const producerTransport = deviceRef.current.createSendTransport(params);
    producerTransportRef.current = producerTransport;

    producerTransport.on('produce', async (parameters, callback, errback) => {
      try {
        const { id } = await wsService.emitWithAck('produce', {
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
        await wsService.emitWithAck('producerTransportConnect', {
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
    wsService.socket.emit('closeProducer', { producerId });
  };

  const leaveVoiceChannel = async () => {
    consumerTransportRef.current?.close();
    producerTransportRef.current?.close();
    consumerTransportRef.current = null;
    producerTransportRef.current = null;

    reset();

    await wsService.emitWithAck('leaveRoom');
  };

  return (
    <MediasoupContext.Provider
      value={{
        joinVoiceChannel,
        leaveVoiceChannel,
        createProducer,
        closeProducer,
      }}
    >
      {children}
    </MediasoupContext.Provider>
  );
};

export const useMediasoup = () => {
  return useContext(MediasoupContext);
};

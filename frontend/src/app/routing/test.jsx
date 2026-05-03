import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';

const VoiceChannelContext = createContext(undefined);

export const VoiceChannelProvider = ({ children }) => {
  const [device, setDevice] = useState(null);
  const [consumers, setConsumers] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const consumerTransportRef = useRef(null);
  const producerTransportRef = useRef(null);
  const roomChannelIdRef = useRef(null); // храним текущий channelId

  // Инициализация сокета
  useEffect(() => {
    const socket = io('/mediasoup', {
      auth: { token: 'token' }, // TODO
    });
    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Подписка на новых продюсеров (глобально, но с проверкой roomChannelIdRef)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewProducer = ({ producerId }) => {
      // подключаем только если мы в голосовом канале
      if (roomChannelIdRef.current) {
        consumeRemoteProducer(producerId);
      }
    };

    const handleProducerClosed = ({ remoteProducerId }) => {
      setConsumers((prev) => {
        const newConsumers = new Map(prev);
        newConsumers.delete(remoteProducerId);
        return newConsumers;
      });
    };

    socket.on('new-producer', handleNewProducer);
    socket.on('producer-closed', handleProducerClosed);

    return () => {
      socket.off('new-producer', handleNewProducer);
      socket.off('producer-closed', handleProducerClosed);
    };
  }, []); // этих обработчиков достаточно, они проверяют roomChannelIdRef

  // --- Функции ---

  /** Обещает результат emit с колбэком */
  const emitWithAck = (event, data) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject(new Error('Socket not connected'));
      socketRef.current.emit(event, data, (response) => {
        if (response?.error) reject(response.error);
        else resolve(response);
      });
    });
  };

  const createDevice = async (rtpCapabilities) => {
    const newDevice = new mediasoupClient.Device();
    await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
    setDevice(newDevice);
    return newDevice; // возвращаем, чтобы использовать в цепочке
  };

  /** Создаёт consumer transport и потребляет всех текущих продюсеров */
  const createConsumerTransportAndConsume = async () => {
    const { params } = await emitWithAck('createWebRtcTransport', { consumer: true });
    console.log('Consumer transport params:', params);

    const consumerTransport = device.createRecvTransport(params);
    consumerTransportRef.current = consumerTransport;

    // Ожидаем успешного подключения транспорта
    await new Promise((resolve, reject) => {
      consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await emitWithAck('recvTransportConnect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          });
          callback();
          resolve();
        } catch (err) {
          errback(err);
          reject(err);
        }
      });
    });

    // После подключения запрашиваем список существующих продюсеров
    const producerIds = await emitWithAck('getProducers');
    producerIds.forEach((producerId) => consumeRemoteProducer(producerId));
  };

  /** Потребить одного удалённого продюсера */
  const consumeRemoteProducer = async (remoteProducerId) => {
    const { params } = await emitWithAck('consume', {
      rtpCapabilities: device.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId: consumerTransportRef.current.id,
    });

    const consumer = await consumerTransportRef.current.consume({
      id: params.id,
      producerId: params.producerId,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
    });

    // Иммутабельно добавляем в Map
    setConsumers((prev) => new Map(prev).set(params.id, consumer));

    // Возобновляем (сервер стартует paused)
    if (consumer.paused) {
      await socketRef.current.emit('consumer-resume', { serverConsumerId: params.serverConsumerId });
    }

    return consumer;
  };

  /** Создаёт producer transport (для последующей отправки аудио/видео) */
  const createProducerTransport = async () => {
    const { params } = await emitWithAck('createWebRtcTransport', { consumer: false });
    console.log('Producer transport params:', params);

    const producerTransport = device.createSendTransport(params);
    producerTransportRef.current = producerTransport;

    await new Promise((resolve, reject) => {
      producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await emitWithAck('producerTransportConnect', { dtlsParameters });
          callback();
          resolve();
        } catch (err) {
          errback(err);
          reject(err);
        }
      });
    });

    // Обработчик produce (будет вызываться, когда мы вызовем transport.produce())
    producerTransport.on('produce', async (parameters, callback, errback) => {
      try {
        const { id } = await emitWithAck('transportProduce', {
          kind: parameters.kind,
          rtpParameters: parameters.rtpParameters,
          appData: parameters.appData,
        });
        callback({ id });
      } catch (err) {
        errback(err);
      }
    });

    // Обработчик закрытия (добавим для надёжности)
    producerTransport.on('connectionstatechange', (state) => {
      if (state === 'closed' || state === 'failed') {
        // возможно, нужно переподключение
      }
    });
  };

  // --- Основная функция входа в голосовой канал ---
  const joinVoiceChannel = useCallback(async (channelId) => {
    if (!socketRef.current) return;
    try {
      roomChannelIdRef.current = channelId;

      // 1. Заходим в комнату, получаем rtpCapabilities
      const { rtpCapabilities } = await emitWithAck('joinRoom', { roomName: `channel_${channelId}` });

      // 2. Создаём и загружаем девайс
      const newDevice = await createDevice(rtpCapabilities);

      // 3. Создаём consumer transport и начинаем потреблять
      await createConsumerTransportAndConsume();

      // 4. Создаём producer transport (пока без отправки медиа)
      await createProducerTransport();

      // Теперь producerTransportRef.current готов для useLocalStream и produce
    } catch (err) {
      console.error('Failed to join voice channel:', err);
      setError(err.message);
      // при ошибке откатываем состояние
      leaveVoiceChannel();
    }
  }, []);

  // --- Выход из голосового канала ---
  const leaveVoiceChannel = useCallback(() => {
    // Закрываем транспорты
    consumerTransportRef.current?.close();
    producerTransportRef.current?.close();
    consumerTransportRef.current = null;
    producerTransportRef.current = null;

    // Сбрасываем consumers
    setConsumers(new Map());
    roomChannelIdRef.current = null;

    // Сокет не отключаем, только покидаем комнату (если сервер ожидает явного выхода)
    if (socketRef.current) {
      socketRef.current.emit('leaveRoom');
    }
  }, []);

  // Значение контекста
  const contextValue = {
    device,
    consumers,
    isConnected,
    error,
    joinVoiceChannel,
    leaveVoiceChannel,
    // для доступа к producer transport из хука useLocalStream
    producerTransportRef,
  };

  return <VoiceChannelContext.Provider value={contextValue}>{children}</VoiceChannelContext.Provider>;
};

export const useVoiceChannel = () => {
  const ctx = useContext(VoiceChannelContext);
  if (!ctx) throw new Error('useVoiceChannel must be used within MediasoupProvider');
  return ctx;
};

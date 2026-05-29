import { create } from 'zustand';

export const useVoiceSessionStore = create((set) => ({
  voiceChannelId: null,
  consumers: new Map(), // Map<userId, { video?: consumer, audio?: consumer }>

  isMuted: true,
  isDeafen: false,
  audioProducer: null,
  audioStream: null,

  isVideoOn: false,
  isSharingScreen: false,
  videoProducer: null,
  videoStream: null,

  setVoiceChannelId: (id) => set({ voiceChannelId: id }),

  addConsumer: (userId, kind, consumer) =>
    set((state) => {
      const newConsumers = new Map(state.consumers);
      const userEntry = { ...newConsumers.get(userId) };
      userEntry[kind] = consumer;
      newConsumers.set(userId, userEntry);
      return { consumers: newConsumers };
    }),

  removeConsumer: (remoteProducerId) =>
    set((state) => {
      const newConsumers = new Map(state.consumers);
      for (const [userId, media] of newConsumers.entries()) {
        for (const [kind, consumer] of Object.entries(media)) {
          if (consumer?.producerId === remoteProducerId) {
            const updatedMedia = { ...media };
            updatedMedia[kind] = null;
            newConsumers.set(userId, updatedMedia);
            return { consumers: newConsumers };
          }
        }
      }
      return { consumers: newConsumers };
    }),

  setIsMuted: (isMuted) => set({ isMuted }),
  setIsDeafen: (isDeafen) => set({ isDeafen }),
  setAudioProducer: (audioProducer) => set({ audioProducer }),
  setAudioStream: (audioStream) => set({ audioStream }),

  setIsVideoOn: (isVideoOn) => set({ isVideoOn }),
  setIsSharingScreen: (isSharingScreen) => set({ isSharingScreen }),
  setVideoProducer: (videoProducer) => set({ videoProducer }),
  setVideoStream: (videoStream) => set({ videoStream }),

  reset: () =>
    set({
      voiceChannelId: null,
      consumers: new Map(),
      audioProducer: null,
      audioStream: null,
      isMuted: true,
      isDeafen: false,
      isVideoOn: false,
      isSharingScreen: false,
      videoStream: null,
      videoProducer: null,
    }),
}));

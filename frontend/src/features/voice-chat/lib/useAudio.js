import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { useVoiceSessionStore } from '@app/provider/voiceSessionStore.js';

export const useAudio = () => {
  const { createProducer } = useMediasoup();
  const {
    isMuted,
    isDeafen,
    audioProducer,
    audioStream,
    consumers,
    setIsMuted,
    setIsDeafen,
    setAudioProducer,
    setAudioStream,
  } = useVoiceSessionStore();

  const toggleVoice = () => {
    if (!audioStream) {
      requestAudioStream();
    } else {
      isMuted ? audioProducer.resume() : audioProducer.pause();
      setIsMuted(!isMuted);
    }
  };

  const requestAudioStream = async () => {
    if (audioStream) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);

    const audioParams = { track: stream.getTracks()[0] };
    setAudioProducer(await createProducer(audioParams));
    setIsMuted(false);
  };

  const toggleDeafen = () => {
    consumers.forEach((consumer) => {
      if (isDeafen) {
        consumer.audio?.resume();
      } else {
        consumer.audio?.pause();
      }
    });

    setIsDeafen(!isDeafen);
  };

  return { toggleVoice, toggleDeafen, requestAudioStream };
};

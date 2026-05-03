import { useRef, useState } from 'react';
import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';

export const useAudio = () => {
  const [isMicrophoneAllowed, setIsMicrophoneAllowed] = useState(false); // need to check it first
  const [isMuted, setIsMuted] = useState(true);
  const [isDeafen, setIsDeafen] = useState(false);
  const audioProducerRef = useRef(null);
  const audioStreamRef = useRef(null);
  const { createProducer, consumers } = useMediasoup();

  const toggleVoice = () => {
    if (!isMicrophoneAllowed) {
      requestAudioStream();
    } else {
      isMuted ? audioProducerRef.current.resume() : audioProducerRef.current.pause();
      setIsMuted((prev) => !prev);
    }
  };

  const requestAudioStream = async () => {
    if (isMicrophoneAllowed) return;

    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = audioStream;

    const audioParams = { track: audioStream.getTracks()[0] };
    audioProducerRef.current = await createProducer(audioParams);

    setIsMicrophoneAllowed(true);
    setIsMuted(false);
  };

  const toggleDeafen = () => {
    consumers.forEach((consumer) => {
      if (isDeafen) {
        consumer.resume();
      } else {
        consumer.pause();
      }
    });

    setIsDeafen((prev) => !prev);
  };

  return {
    isMuted,
    toggleVoice,
    isDeafen,
    toggleDeafen,
    requestAudioStream,
  };
};

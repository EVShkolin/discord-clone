import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { useVoiceSessionStore } from '@app/provider/voiceSessionStore.js';

export const useVideo = () => {
  const { createProducer, closeProducer } = useMediasoup();
  const {
    isVideoOn,
    isSharingScreen,
    videoProducer,
    videoStream,
    setIsVideoOn,
    setIsSharingScreen,
    setVideoProducer,
    setVideoStream,
  } = useVoiceSessionStore();

  const startVideo = async () => {
    if (isVideoOn) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 640, max: 1920 },
        height: { min: 400, max: 1080 },
      },
    });
    setVideoStream(stream);

    let videoParams = {
      encodings: [
        { rid: 'r0', maxBitrate: 100000, scalabilityMode: 'S1T3' },
        { rid: 'r1', maxBitrate: 300000, scalabilityMode: 'S1T3' },
        { rid: 'r2', maxBitrate: 900000, scalabilityMode: 'S1T3' },
      ],
      codecOptions: {
        videoGoogleStartBitrate: 1000,
      },
    };
    videoParams = { track: stream.getTracks()[0], ...videoParams };

    setVideoProducer(await createProducer(videoParams));
    setIsVideoOn(true);
  };

  const shareScreen = async () => {
    if (isSharingScreen) return;

    stopVideo();
    const stream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
    setVideoStream(stream);

    const track = stream.getTracks()[0];
    setVideoProducer(await createProducer({ track }));

    track.onended = () => stopVideo();

    setIsSharingScreen(true);
  };

  const stopVideo = () => {
    if (videoProducer) {
      videoProducer.close();
      closeProducer(videoProducer.id);
      setVideoProducer(null);
    }
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setIsVideoOn(false);
    setIsSharingScreen(false);
  };

  return { startVideo, shareScreen, stopVideo };
};

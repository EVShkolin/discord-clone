import { useRef, useState } from 'react';
import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';

export const useVideo = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoProducerRef = useRef(null);
  const videoStreamRef = useRef(null);
  const { createProducer, closeProducer } = useMediasoup();

  const startVideo = async () => {
    if (isVideoOn) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 640, max: 1920 },
        height: { min: 400, max: 1080 },
      },
    });
    videoStreamRef.current = stream;
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
    videoProducerRef.current = await createProducer(videoParams);

    setIsVideoOn(true);
  };

  const shareScreen = async () => {
    if (isSharingScreen) return;

    stopVideo();
    const stream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
    videoStreamRef.current = stream;
    setVideoStream(stream);

    const track = stream.getTracks()[0];
    videoProducerRef.current = await createProducer({ track });

    track.onended = () => stopVideo();

    setIsSharingScreen(true);
  };

  const stopVideo = () => {
    if (videoProducerRef.current) {
      videoProducerRef.current.close();
      closeProducer(videoProducerRef.current.id);
      videoProducerRef.current = null;
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    setVideoStream(null);
    setIsVideoOn(false);
    setIsSharingScreen(false);
  };

  return {
    isVideoOn,
    startVideo,
    shareScreen,
    isSharingScreen,
    stopVideo,
    videoStream,
  };
};

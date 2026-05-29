import { useState, useEffect, useRef } from 'react';

export const useAudioLevel = (audioTrack, threshold = 0.05) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!audioTrack) {
      setIsSpeaking(false);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    audioContextRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const stream = new MediaStream([audioTrack]);
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    sourceRef.current = source;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkLevel = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const normalized = average / 255;
      setIsSpeaking(normalized > threshold);
      animationFrameRef.current = requestAnimationFrame(checkLevel);
    };

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => checkLevel());
    } else {
      checkLevel();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioTrack, threshold]);

  return isSpeaking;
};

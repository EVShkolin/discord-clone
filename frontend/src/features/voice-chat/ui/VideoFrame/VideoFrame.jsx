import { useEffect, useRef } from 'react';
import styles from './VideoFrame.module.css';
import {useAudioLevel} from "@features/voice-chat/lib/useAudioLevel.js";

export const VideoFrame = ({ videoTrack, audioTrack }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const isSpeaking = useAudioLevel(audioTrack);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.srcObject = null;
    videoElement.defaultMuted = true;
    videoElement.muted = true;

    if (videoTrack) {
      videoElement.srcObject = new MediaStream([videoTrack]);
    }

    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [videoTrack]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (audioTrack) {
      audioElement.srcObject = new MediaStream([audioTrack]);
    }

    return () => {
      if (audioElement) {
        audioElement.srcObject = null;
      }
    }
  }, [audioTrack]);

  return (
    <div className={`${styles.videoFrame} ${isSpeaking ? styles.speaking : ''}`}>
      <video className={styles.video} ref={videoRef} autoPlay playsInline muted />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

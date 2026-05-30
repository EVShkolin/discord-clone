import { useEffect, useRef } from 'react';
import styles from './VideoFrame.module.css';
import { useAudioLevel } from '@features/voice-chat/lib/useAudioLevel.js';
import { Avatar } from '@shared/ui/Avatar/index.js';
import { useVoiceSessionStore } from '@app/provider/voiceSessionStore.js';

export const VideoFrame = ({ member }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const consumer = useVoiceSessionStore((s) => s.consumers.get(member.userId));
  const videoTrack = consumer?.video?.track;
  const audioTrack = consumer?.audio?.track;
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
    };
  }, [audioTrack]);

  return (
    <div className={`${styles.videoFrame} ${isSpeaking ? styles.speaking : ''}`}>
      {videoTrack ? (
        <video className={styles.video} ref={videoRef} autoPlay playsInline muted />
      ) : (
        <div className={styles.placeholder}>
          <Avatar avatarUrl={member.avatarUrl} size={40} />
          <span>{member.name}</span>
        </div>
      )}

      <audio ref={audioRef} autoPlay />
    </div>
  );
};

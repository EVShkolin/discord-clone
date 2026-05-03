import { useEffect, useRef } from 'react';
import styles from './VideoFrame.module.css';

export const VideoFrame = ({ track }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.srcObject = null;
    videoElement.defaultMuted = true;
    videoElement.muted = true;

    if (track) {
      videoElement.srcObject = new MediaStream([track]);
    }

    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [track]);

  return (
    <div className={styles.videoFrame}>
      <video className={styles.video} ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

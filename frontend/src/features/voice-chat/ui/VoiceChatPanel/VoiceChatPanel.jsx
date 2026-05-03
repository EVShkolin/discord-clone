import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { useMemo } from 'react';
import { VideoFrame } from '@features/voice-chat/ui/VideoFrame/index.js';
import { useAudio } from '@features/voice-chat/lib/useAudio.js';
import { useVideo } from '@features/voice-chat/lib/useVideo.js';

import styles from './VoiceChatPanel.module.css';

export const VoiceChatPanel = () => {
  const { consumers } = useMediasoup();
  const { videoStream, isVideoOn, startVideo, shareScreen, isSharingScreen, stopVideo } = useVideo();
  const { isMuted, toggleVoice } = useAudio();

  const consumerArray = useMemo(() => {
    return Array.from(consumers.values());
  }, [consumers]);

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <button onClick={toggleVoice}>{isMuted ? '🔇 Вкл. микрофон' : '🎤 Выкл. микрофон'}</button>
        <button onClick={isVideoOn ? stopVideo : startVideo}>{isVideoOn ? '📹 Выкл. камеру' : '📷 Вкл. камеру'}</button>
        <button onClick={isSharingScreen ? stopVideo : shareScreen}>
          {isSharingScreen ? 'Stop sharing' : 'Share screen'}
        </button>
      </div>

      {videoStream && <VideoFrame track={videoStream.getTracks()[0]} />}

      {consumerArray.map((consumer) => (
        <VideoFrame key={consumer.id} track={consumer.track} />
      ))}
    </div>
  );
};

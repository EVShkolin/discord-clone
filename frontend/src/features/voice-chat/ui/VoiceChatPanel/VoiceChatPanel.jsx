import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { VideoFrame } from '@features/voice-chat/ui/VideoFrame/index.js';
import { useAudio } from '@features/voice-chat/lib/useAudio.js';
import { useVideo } from '@features/voice-chat/lib/useVideo.js';

import styles from './VoiceChatPanel.module.css';

export const VoiceChatPanel = () => {
  const { consumers, leaveVoiceChannel } = useMediasoup();
  const { videoStream, isVideoOn, startVideo, shareScreen, isSharingScreen, stopVideo } = useVideo();
  const { isMuted, toggleVoice } = useAudio();

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <button onClick={toggleVoice}>{isMuted ? '🔇 Вкл. микрофон' : '🎤 Выкл. микрофон'}</button>
        <button onClick={isVideoOn ? stopVideo : startVideo}>{isVideoOn ? '📹 Выкл. камеру' : '📷 Вкл. камеру'}</button>
        <button onClick={isSharingScreen ? stopVideo : shareScreen}>
          {isSharingScreen ? 'Stop sharing' : 'Share screen'}
        </button>
        <button onClick={leaveVoiceChannel}>Покинуть комнату</button>
      </div>

      {videoStream && <VideoFrame key='local' videoTrack={videoStream.getTracks()[0]} />}

      {Array.from(consumers, ([userId, data]) => (
          <VideoFrame key={userId} videoTrack={data.video?.track} audioTrack={data.audio?.track} />
      ))}
    </div>
  );
};

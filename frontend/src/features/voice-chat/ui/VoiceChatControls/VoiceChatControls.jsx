import styles from './VoiceChatControls.module.css';
import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { useVideo } from '@features/voice-chat/lib/useVideo.js';
import { useAudio } from '@features/voice-chat/lib/useAudio.js';
import { useVoiceSessionStore } from '@app/provider/voiceSessionStore.js';
import { MicrophoneMutedIcon } from '@shared/assets/MicrophoneMutedIcon.jsx';
import { LeaveChatIcon } from '@shared/assets/LeaveChatIcon.jsx';
import { ScreenIcon } from '@shared/assets/ScreenIcon.jsx';
import { CameraOffIcon } from '@shared/assets/CameraOffIcon.jsx';
import { CameraIcon } from '@shared/assets/CameraIcon.jsx';
import { MicrophoneIcon } from '@shared/assets/MicrophoneIcon.jsx';

export const VoiceChatControls = () => {
  const { leaveVoiceChannel } = useMediasoup();
  const { startVideo, shareScreen, stopVideo } = useVideo();
  const { toggleVoice } = useAudio();
  const { isMuted, isVideoOn, isSharingScreen } = useVoiceSessionStore();

  return (
    <div className={styles.controls}>
      <button className={styles.controlButton} onClick={toggleVoice}>
        {isMuted ? <MicrophoneMutedIcon /> : <MicrophoneIcon />}
      </button>

      <button className={styles.controlButton} onClick={isVideoOn ? stopVideo : startVideo}>
        {isVideoOn ? <CameraIcon /> : <CameraOffIcon />}
      </button>

      <button
        className={`${styles.controlButton} ${isSharingScreen ? styles.active : ''}`}
        onClick={isSharingScreen ? stopVideo : shareScreen}
      >
        <ScreenIcon />
      </button>

      <button className={styles.controlButton} onClick={leaveVoiceChannel}>
        <LeaveChatIcon />
      </button>
    </div>
  );
};

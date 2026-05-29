import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { VideoFrame } from '@features/voice-chat/ui/VideoFrame/index.js';
import { useAudio } from '@features/voice-chat/lib/useAudio.js';
import { useVideo } from '@features/voice-chat/lib/useVideo.js';

import styles from './VoiceChatPanel.module.css';
import {useVoiceSessionStore} from "@app/provider/voiceSessionStore.js";
import {useParams} from "react-router";
import {useVoiceMembersStore} from "@entities/channel/model/voiceMembersStore.js";
import {EMPTY_ARRAY} from "@entities/channel/ui/VoiceChannel/VoiceChannel.jsx";
import {LocalVideoFrame} from "@features/voice-chat/ui/VideoFrame/LocalVideoFrame.jsx";
import {useAuth} from "@app/provider/AuthProvider.jsx";

export const VoiceChatPanel = () => {
  const { user } = useAuth();
  const { leaveVoiceChannel } = useMediasoup();
  const { startVideo, shareScreen, stopVideo } = useVideo();
  const { toggleVoice, toggleDeafen } = useAudio();
  const { isMuted, isDeafen, isVideoOn, isSharingScreen, videoStream } = useVoiceSessionStore();

  const { serverId, channelId } = useParams();
  const voiceChatMembers = useVoiceMembersStore(
      (state) => state.voiceMembers[serverId]?.[channelId] ?? EMPTY_ARRAY
  );

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <button onClick={toggleVoice}>{isMuted ? '🔇 Вкл. микрофон' : '🎤 Выкл. микрофон'}</button>
        <button onClick={isVideoOn ? stopVideo : startVideo}>{isVideoOn ? '📹 Выкл. камеру' : '📷 Вкл. камеру'}</button>
        <button onClick={isSharingScreen ? stopVideo : shareScreen}>
          {isSharingScreen ? 'Stop sharing' : 'Share screen'}
        </button>
        <button onClick={toggleDeafen}>{isDeafen ? 'Undeaf' : 'Deaf'}</button>
        <button onClick={leaveVoiceChannel}>Покинуть комнату</button>
      </div>

      <LocalVideoFrame />

      {voiceChatMembers.filter(m => m.userId !== user.id).map(m => (
        <VideoFrame key={m.userId} member={m} />
      ))}
    </div>
  );
};

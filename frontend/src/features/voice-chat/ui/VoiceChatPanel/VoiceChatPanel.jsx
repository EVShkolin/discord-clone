import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { VideoFrame } from '@features/voice-chat/ui/VideoFrame/index.js';
import { useAudio } from '@features/voice-chat/lib/useAudio.js';
import { useVideo } from '@features/voice-chat/lib/useVideo.js';

import styles from './VoiceChatPanel.module.css';
import { useVoiceSessionStore } from '@app/provider/voiceSessionStore.js';
import { useParams } from 'react-router';
import { useVoiceMembersStore } from '@entities/channel/model/voiceMembersStore.js';
import { EMPTY_ARRAY } from '@entities/channel/ui/VoiceChannel/VoiceChannel.jsx';
import { LocalVideoFrame } from '@features/voice-chat/ui/VideoFrame/LocalVideoFrame.jsx';
import { useAuth } from '@app/provider/AuthProvider.jsx';
import { VoiceChatControls } from '@features/voice-chat/ui/VoiceChatControls/index.js';

export const VoiceChatPanel = () => {
  const { user } = useAuth();

  const { serverId, channelId } = useParams();
  const voiceChatMembers = useVoiceMembersStore((state) => state.voiceMembers[serverId]?.[channelId] ?? EMPTY_ARRAY);

  return (
    <div className={styles.panel}>
      <VoiceChatControls />

      <LocalVideoFrame />

      {voiceChatMembers
        .filter((m) => m.userId !== user.id)
        .map((m) => (
          <VideoFrame key={m.userId} member={m} />
        ))}
    </div>
  );
};

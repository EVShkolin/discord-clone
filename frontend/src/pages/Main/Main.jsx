import { NavigationPanel } from '@features/navigation';
import { MessagePanel } from '@features/message-list';
import { MemberPanel } from '@features/member-actions';

import styles from './Main.module.css';
import { useParams } from 'react-router';
import { useCurrentUserServers } from '@features/navigation/lib/useCurrentUserServers.js';
import { VoiceChatPanel } from '@features/voice-chat/index.js';
import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';

const Main = () => {
  const { serverId, channelId } = useParams();
  const { voiceChannelIdRef } = useMediasoup();
  const { data: servers } = useCurrentUserServers();

  const isVoiceChannel = () => {
    const server = servers?.find((s) => s.id === Number(serverId));
    const channel = server?.channels.find((c) => c.id === Number(channelId));
    return channel && channel.type.toLowerCase() === 'voice';
  };

  if (!serverId || !channelId) {
    return (
      <div className={styles.appLayout}>
        <NavigationPanel serverId={serverId} channelId={channelId} />
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <div className={styles.appLayout}>
      <NavigationPanel />
      {voiceChannelIdRef.current && (
        <div style={{ display: isVoiceChannel() ? 'block' : 'none' }}>
          <VoiceChatPanel />
        </div>
      )}
      {!isVoiceChannel() && <MessagePanel />}
      {!isVoiceChannel() && <MemberPanel />}
    </div>
  );

};

export default Main;

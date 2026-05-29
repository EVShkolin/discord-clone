import styles from './ChannelPanel.module.css';
import { useNavigate, useParams } from 'react-router';
import { useCurrentUserServers } from '@features/navigation/lib/useCurrentUserServers.js';
import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { useVideo } from '@features/voice-chat/lib/useVideo.js';
import { VoiceChannel } from '@entities/channel/ui/VoiceChannel/index.js';
import {useVoiceSessionStore} from "@app/provider/voiceSessionStore.js";

const ChannelPanel = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const { joinVoiceChannel } = useMediasoup();
  const { voiceChannelId } = useVoiceSessionStore();
  const { stopVideo } = useVideo();
  const { data: servers } = useCurrentUserServers();
  const server = servers?.find((s) => s.id === Number(serverId));

  const handleVoiceChannelClick = (id) => {
    navigate(`/channels/${serverId}/${id}`);
    if (voiceChannelId !== id) {
      stopVideo();
      joinVoiceChannel(Number(serverId), id);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.serverName}>{server?.name}</div>

      <p>Text Channels</p>
      <ul>
        {server?.channels
          .filter((ch) => ch.type.toLowerCase() === 'text')
          .map((ch) => (
            <li key={ch.id} className={styles.channelItem} onClick={() => navigate(`/channels/${server.id}/${ch.id}`)}>
              # {ch.name}
            </li>
          ))}
      </ul>

      <p>Voice Channels</p>
      <ul>
        {server?.channels
          .filter((ch) => ch.type.toLowerCase() === 'voice')
          .map((ch) => (
            // <li key={ch.id} className={styles.channelItem} onClick={() => handleVoiceChannelClick(ch.id)}>
            //   🔊 {ch.name}
            // </li>
            <VoiceChannel key={ch.id} channel={ch} onClick={() => handleVoiceChannelClick(ch.id)} />
          ))}
      </ul>
    </div>
  );
};

export default ChannelPanel;

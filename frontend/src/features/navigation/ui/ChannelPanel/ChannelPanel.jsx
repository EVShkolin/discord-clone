import styles from './ChannelPanel.module.css';
import { useNavigate, useParams } from 'react-router';
import { useCurrentUserServers } from '@features/navigation/lib/useCurrentUserServers.js';
import { useMediasoup } from '@app/provider/MediasoupProvider.jsx';
import { useVideo } from '@features/voice-chat/lib/useVideo.js';

const ChannelPanel = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const { joinVoiceChannel, voiceChannelIdRef } = useMediasoup();
  const { stopVideo } = useVideo();
  const { data: servers } = useCurrentUserServers();
  const server = servers?.find((s) => s.id === Number(serverId));

  const handleVoiceChannelClick = (id) => {
    navigate(`/channels/${serverId}/${id}`);
    if (voiceChannelIdRef.current !== id) {
      stopVideo();
      joinVoiceChannel(id);
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
            <li key={ch.id} className={styles.channelItem} onClick={() => handleVoiceChannelClick(ch.id)}>
              🔊 {ch.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChannelPanel;

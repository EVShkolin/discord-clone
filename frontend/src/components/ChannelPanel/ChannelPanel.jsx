import styles from './ChannelPanel.module.css';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '@/app/provider/AuthProvider.jsx';
import { useServerQuery } from '@/shared/hooks/useServerQuery.js';

const ChannelPanel = () => {
  const { user } = useAuth();
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const { data: servers } = useServerQuery(user.id);
  const server = servers?.find((s) => s.id === Number(serverId));

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
            <li key={ch.id} className={styles.channelItem} onClick={() => navigate(`/channels/${server.id}/${ch.id}`)}>
              🔊 {ch.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChannelPanel;

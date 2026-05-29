import styles from './ServerList.module.css';
import ServerIcon from '@entities/ServerIcon/ServerIcon.jsx';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '@app/provider/AuthProvider.jsx';
import { ServerCreateModal } from '@features/server-actions';
import { useServerQuery } from '@shared/hooks/useServerQuery.js';
import { useRef } from 'react';
import { webSocketService } from '@features/websocket/lib/websocket.js';
import { wsService } from '@shared/api/websocket/websocketClient.js';

const ServerList = () => {
  const { serverId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: servers, isLoading, isError } = useServerQuery(user.id);
  const dialogRef = useRef(null);

  const handleServerClick = (serverId, channels) => {
    const firstChannelId = channels[0].id;
    webSocketService.subscribeToServer(serverId);
    wsService.subscribeToServer(serverId);
    navigate(`/channels/${serverId}/${firstChannelId}`);
  };

  const toggleServerModal = () => {
    if (!dialogRef.current) return;
    dialogRef.current.hasAttribute('open') ? dialogRef.current.close() : dialogRef.current.showModal();
  };

  return (
    <>
      <ul className={styles.serverList}>
        <li onClick={() => navigate('/channels/@me')}>
          <ServerIcon />
          <div className={styles.divider}></div>
        </li>
        {servers?.map((s) => (
          <li key={s.id} onClick={() => handleServerClick(s.id, s.channels)}>
            <ServerIcon iconUrl={s.iconUrl} />
          </li>
        ))}
        <li onClick={toggleServerModal}>
          <div className={styles.divider}></div>
          <ServerIcon iconUrl={'https://images.icon-icons.com/916/PNG/512/Plus_icon-icons.com_71848.png'} />
        </li>
      </ul>
      <ServerCreateModal dialogRef={dialogRef} />
    </>
  );
};

export default ServerList;

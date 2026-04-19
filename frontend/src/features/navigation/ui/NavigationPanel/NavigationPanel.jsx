import ServerList from '../ServerList/ServerList.jsx';
import ChannelPanel from '../ChannelPanel/ChannelPanel.jsx';

import styles from './NavigationPanel.module.css';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { webSocketService } from '@/features/websocket/lib/websocket.js';

const NavigationPanel = () => {
  const { serverId, channelId } = useParams();

  useEffect(() => {
    if (serverId) {
      const subscribe = () => webSocketService.subscribeToServer(serverId);
      webSocketService.onConnect(subscribe);
    }
  }, []);

  return (
    <div className={styles.navigationPanel}>
      <ServerList />
      {serverId && channelId && <ChannelPanel />}
    </div>
  );
};

export default NavigationPanel;

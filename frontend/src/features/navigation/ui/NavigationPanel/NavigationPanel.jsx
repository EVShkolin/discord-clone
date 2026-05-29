import ServerList from '../ServerList/ServerList.jsx';
import ChannelPanel from '../ChannelPanel/ChannelPanel.jsx';

import styles from './NavigationPanel.module.css';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { webSocketService } from '@/features/websocket/lib/websocket.js';
import {wsService} from "@shared/api/websocket/websocketClient.js";

const NavigationPanel = () => {
  const { serverId, channelId } = useParams();

  useEffect(() => {
    if (serverId) {
      const subscribe = () => webSocketService.subscribeToServer(serverId);
      console.log('Subscribing to server', serverId);
      wsService.subscribeToServer(serverId);
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

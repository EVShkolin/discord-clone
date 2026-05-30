import ServerList from '../ServerList/ServerList.jsx';
import ChannelPanel from '../ChannelPanel/ChannelPanel.jsx';

import styles from './NavigationPanel.module.css';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import {wsService} from "@shared/api/websocket/websocketClient.js";

const NavigationPanel = () => {
  const { serverId, channelId } = useParams();

  useEffect(() => {
    if (serverId) {
      console.log('Subscribing to server', serverId);
      wsService.subscribeToServer(serverId);
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

import ServerList from '../ServerList/ServerList.jsx';
import ChannelPanel from '../ChannelPanel/ChannelPanel.jsx';

import styles from './NavigationPanel.module.css';
import { useParams } from 'react-router';

const NavigationPanel = () => {
  const { serverId, channelId } = useParams();

  return (
    <div className={styles.navigationPanel}>
      <ServerList />
      {serverId && channelId && <ChannelPanel />}
    </div>
  );
};

export default NavigationPanel;

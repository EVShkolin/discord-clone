import { NavigationPanel } from '@features/navigation';
import { MessagePanel } from '@features/message-list';
import { MemberPanel } from '@features/member-actions';

import styles from './Main.module.css';
import { useParams } from 'react-router';

const Main = () => {
  const { serverId, channelId } = useParams();

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
      <MessagePanel />
      <MemberPanel />
    </div>
  );
};

export default Main;

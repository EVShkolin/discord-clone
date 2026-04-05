import NavigationPanel from '@/components/NavigationPanel/NavigationPanel.jsx';
import MessagePanel from '@/components/MessagePanel';
import MemberPanel from '@/components/MemberPanel/MemberPanel.jsx';

import { useState } from 'react';

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

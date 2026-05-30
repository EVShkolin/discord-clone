import {useAvailableServers} from "@shared/hooks/useServerQuery.js";
import {useAuth} from "@app/provider/AuthProvider.jsx";
import {ServerCard} from "@entities/server/ui/ServerCard/index.js";

import styles from './FindServersPanel.module.css';

export const FindServersPanel = () => {
    const { user } = useAuth();
    const { data: servers } = useAvailableServers(user.id);

    return (
      <div className={styles.panel}>
          {servers?.map(s => <ServerCard key={s.id} server={s} />)}
      </div>
    );
};
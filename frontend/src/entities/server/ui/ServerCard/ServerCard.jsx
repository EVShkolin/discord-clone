import { ServerIcon } from "@entities/server/ui/ServerIcon";
import styles from './ServerCard.module.css';
import {useAuth} from "@app/provider/AuthProvider.jsx";
import {memberApi} from "@shared/api/member.js";

export const ServerCard = ({ server }) => {
    const { user } = useAuth();


    return (
        <div className={styles.card}>
            <div className={styles.icon}>
                <ServerIcon iconUrl={server.iconUrl} />
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{server.name}</h3>
                <span className={styles.description}>{server.description}</span>
            </div>
            <button
                className={styles.joinButton}
                onClick={() => memberApi.add(user.id, server.id)}
            >
                Вступить
            </button>
        </div>
    );
};
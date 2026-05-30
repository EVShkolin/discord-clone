import styles from './MemberPanel.module.css';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { memberApi } from '@shared/api/member.js';
import {Avatar} from "@shared/ui/Avatar/index.js";
import {useAuth} from "@app/provider/AuthProvider.jsx";
import {useServerQuery} from "@shared/hooks/useServerQuery.js";
import {CrownIcon} from "@shared/assets/CrownIcon.jsx";

const MemberPanel = () => {
  const { serverId } = useParams();
  const { user } = useAuth();
  const { data: servers } = useServerQuery(user.id);
  const currentServer = servers?.find(s => s.id === Number(serverId));

  const { data } = useQuery({
    queryKey: ['members', serverId],
    queryFn: () => memberApi.getAll(serverId),
  });

  const members = data?.content;

  return (
    <ul className={styles.memberList}>
      {members?.map((m) => {
        console.log(m, currentServer.creatorId);
        return (
            <li key={m.id} className={styles.member}>
              <Avatar avatarUrl={m.avatarUrl} size={32} />
              <span>{m.name}</span>
              {m.userId === currentServer.creatorId && <CrownIcon />}
            </li>
        )})
      }
    </ul>
  );
};

export default MemberPanel;

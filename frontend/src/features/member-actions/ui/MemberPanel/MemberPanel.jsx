import styles from './MemberPanel.module.css';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { memberApi } from '@shared/api/member.js';

const MemberPanel = () => {
  const { serverId } = useParams();

  const { data } = useQuery({
    queryKey: ['members', serverId],
    queryFn: () => memberApi.getAll(serverId),
  });

  const members = data?.content;

  return (
    <ul className={styles.memberList}>
      {members?.map((m) => (
        <li key={m.id}>
          id: {m.id} name: {m.name}
        </li>
      ))}
    </ul>
  );
};

export default MemberPanel;

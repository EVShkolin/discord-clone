import styles from './MessagePanel.module.css';
import Message from '@/components/Message/Message.jsx';
import { useParams } from 'react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { messageApi } from '@/shared/api/message.js';
import MessageForm from '@/components/MessageForm/MessageForm.jsx';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const MessagePanel = () => {
  const { channelId } = useParams();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['messages', channelId],
    queryFn: ({ pageParam }) => messageApi.getAll(channelId, pageParam),
    getNextPageParam: (lastPage) => (lastPage.last ? null : lastPage.number + 1),
  });

  const messages = data?.pages.flatMap((page) => page.content);

  useEffect(() => {
    if (inView) {
      console.log('IN VIEW');
      fetchNextPage().then((res) => res.data);
    }
  }, [fetchNextPage, inView]);

  return (
    <div className={styles.messagePanel}>
      <ul className={styles.messageList}>
        {messages?.map((m) => (
          <li key={m.id}>
            <Message message={m} />
          </li>
        ))}
        <div ref={ref}>{isFetchingNextPage && 'Loading...'}</div>
      </ul>
      <MessageForm />
    </div>
  );
};

export default MessagePanel;

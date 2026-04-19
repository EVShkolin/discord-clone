import styles from './MessagePanel.module.css';
import Message from '@entities/Message/Message.jsx';
import { useParams } from 'react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { messageApi } from '@shared/api/message.js';
import MessageForm from '@features/message-list/ui/MessageForm/MessageForm.jsx';
import { useRef } from 'react';

const MessagePanel = () => {
  const { channelId } = useParams();
  const messageListRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['messages', channelId],
    queryFn: ({ pageParam }) => messageApi.getAll(channelId, pageParam),
    getNextPageParam: (lastPage) => (lastPage.last ? null : lastPage.number + 1),
  });

  const messages = data?.pages.flatMap((page) => page.content);

  const handleScroll = () => {
    const container = messageListRef.current;
    if (!container || isFetchingNextPage || !hasNextPage) return;
    const isAtTop = container.scrollHeight + container.scrollTop - container.clientHeight <= 1;

    if (isAtTop) {
      fetchNextPage().then((res) => res.data);
    }
  };

  return (
    <div className={styles.messagePanel}>
      <ul className={styles.messageList} ref={messageListRef} onScroll={handleScroll}>
        {messages?.map((m) => (
          <li key={m.id}>
            <Message message={m} />
          </li>
        ))}
      </ul>
      <MessageForm />
    </div>
  );
};

export default MessagePanel;

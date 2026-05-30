import styles from './MessageForm.module.css';
import { useParams } from 'react-router';
import { useState } from 'react';
import { useMessageActions } from '@features/message-list/lib/useMessageActions.js';
import { SendIcon } from '@shared/assets/SendIcon.jsx';

const MessageForm = () => {
  const { channelId } = useParams();
  const { createTextMessage } = useMessageActions(channelId);

  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = text.trim();
    if (message === '') return;
    try {
      await createTextMessage.mutateAsync(message);
      setText('');
    } catch (err) {
      console.log('Failed to create message', err);
    }
  };

  return (
    <form className={styles.messageForm} onSubmit={handleSubmit}>
      <input className={styles.textarea} value={text} onChange={(e) => setText(e.target.value)} />
      <button className={styles.sendBtn}>
        <SendIcon />
      </button>
    </form>
  );
};

export default MessageForm;

import styles from './Message.module.css';
import { formatDateTime } from '@shared/utils/dateTimeFormatter.js';
import { useState } from 'react';
import { useAuth } from '@app/provider/AuthProvider.jsx';
import { useMessageActions } from '@features/message-list/lib/useMessageActions.js';
import { useParams } from 'react-router';
import { Avatar } from '@shared/ui/Avatar';
import { EditIcon } from '@shared/assets/EditIcon.jsx';
import { DeleteIcon } from '@shared/assets/DeleteIcon.jsx';

const isEdited = (createdAt, updatedAt) => {
  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();
  return Math.abs(updated - created) > 1000;
};

const Message = ({ message }) => {
  const { user } = useAuth();
  const { channelId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const { updateMessage, deleteMessage } = useMessageActions(channelId);

  const ownMessage = user.id === message.author.id;

  const handleUpdate = async () => {
    if (content.trim() === message.content) {
      setIsEditing(false);
      setContent(message.content);
      return;
    }
    try {
      await updateMessage.mutateAsync({ id: message.id, content });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update message', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    }
    if (e.key === 'Escape') {
      setContent(message.content);
      setIsEditing(false);
    }
  };

  return (
    <div className={`${styles.message} ${ownMessage ? styles.ownMessage : ''}`}>
      <Avatar avatarUrl={message.author.avatarUrl} size="40" />
      <div className={styles.messageContent}>
        <div className={styles.messageInfo}>
          <span className={styles.author}>{message.author.name}</span>
          <span className={styles.date}>{formatDateTime(message.createdAt)}</span>
          <span>{isEdited(message.createdAt, message.updatedAt) && ' (edited)'}</span>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => setIsEditing(true)}>
              <EditIcon />
            </button>
            <button className={styles.actionBtn} onClick={() => deleteMessage.mutateAsync(message.id)}>
              <DeleteIcon />
            </button>
          </div>
        </div>
        {isEditing ? (
          <input
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
};

export default Message;

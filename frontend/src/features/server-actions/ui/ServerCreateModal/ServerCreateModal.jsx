import styles from './ServerCreateModal.module.css';
import { useEffect, useState } from 'react';
import ImageInput from '@shared/ui/ImageInput/index.js';
import { useServerActions } from '@features/server-actions/lib/useServerActions.js';

const ServerCreateModal = ({ dialogRef }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createServer } = useServerActions();
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createServer.mutateAsync({ name, description });
      handleClose();
      dialogRef.current.close();
    } catch (err) {
      console.error("Couldn't create server", err);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [dialogRef]);

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <h1 className={styles.title}>Create Server</h1>
      <p>Give your new server a personality with a name and an icon. You can always change it later</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <ImageInput key={resetKey} />

        <label htmlFor="serverNameInput" className={styles.label}>
          Server Name
        </label>
        <input
          id="serverNameInput"
          className={`${styles.nameInput} input`}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          className={`${styles.description} input`}
          autoComplete="off"
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        ></textarea>

        <button className={styles.button}>Create</button>
      </form>

      <button className={styles.closeBtn} onClick={() => dialogRef.current.close()}>
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"
            className=""
          ></path>
        </svg>
      </button>
    </dialog>
  );
};

export default ServerCreateModal;

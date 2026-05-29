import styles from './Avatar.module.css';

export const Avatar = ({ avatarUrl, size }) => {
  return (
    <img
      className={styles.avatar}
      src={avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNY2BGn3ylJRLM2yL2_f_q_g9iEOOR_t_kAQ&s'}
      style={{ width: `${size}px`, height: `${size}px` }}
      alt="avatar"
    />
  );
};

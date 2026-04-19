import styles from './ServerIcon.module.css';

const ServerIcon = ({ iconUrl }) => {
  return (
    <div className={styles.wrapper}>
      <img
        src={iconUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNY2BGn3ylJRLM2yL2_f_q_g9iEOOR_t_kAQ&s'}
        className={styles.icon}
        alt=""
      />
    </div>
  );
};

export default ServerIcon;

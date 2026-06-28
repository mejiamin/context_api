import styles from './profile.module.css';

export const Profile = () => {
  return (
    <div className={styles.profileCard}>
      <h2>Привет, name!</h2>
      <p>Твой уровень доступа: role</p>
    </div>
  )
}

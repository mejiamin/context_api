import styles from './themeToggler.module.css';

export const ThemeToggler = () => {


  return (
    <div className={`
      ${styles.box}
    `}>
      <p>Текущая тема: <strong>theme</strong></p>
      <button className={styles.button}>
        Переключить тему
      </button>
    </div>
  );
}
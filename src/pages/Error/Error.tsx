import styles from './Error.module.scss';

export const Error = () => {
  return (
    <div className={styles.error} id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
};

import { PropsWithChildren } from 'react';
import styles from './Container.module.scss';
import { Header } from '../Header';

export const Container = ({ children }: PropsWithChildren) => (
  <div className={styles.container}>
    <Header />
    <main className={styles.main}>{children}</main>
  </div>
);

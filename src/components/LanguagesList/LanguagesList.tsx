import styles from './LanguagesList.module.scss';

interface LanguagesListProps {
  languages: string[];
}

export const LanguagesList = ({ languages }: LanguagesListProps) => (
  <div className={styles.languagesList}>
    <h3>Languages used</h3>
    <ul className={styles.languagesList}>
      {languages?.map((lang, index) => (
        <li key={index}>{lang}</li>
      ))}
    </ul>
  </div>
);

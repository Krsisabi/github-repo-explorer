import styles from './LanguagesList.module.scss';

interface LanguagesListProps {
  languages: string[];
}

export const LanguagesList = ({ languages }: LanguagesListProps) => (
  <div className={styles.languagesList}>
    <h3>Languages used</h3>
    <ul>
      {languages.map((lang) => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
  </div>
);

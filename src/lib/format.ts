// One locale for the whole interface, which is in English and says so in
// `<html lang>`. Kept in one place because a list and a details page showing
// the same number in two shapes reads as two applications.
const LOCALE = 'en-US';

const dateFormat = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatDate = (value: Date | string) =>
  dateFormat.format(new Date(value));

export const formatCount = (value: number) => value.toLocaleString(LOCALE);

import clsx from 'clsx';

import { usePagination, DOTS } from '~/hooks/usePagination';

import styles from './Pagination.module.scss';

export type PaginationProps = {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
  onPageChange:
    React.Dispatch<React.SetStateAction<number>> | ((value: number) => void);
};

export const Pagination = (props: PaginationProps) => {
  const { onPageChange, totalCount, siblingCount, currentPage, pageSize } =
    props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (!paginationRange || paginationRange.length < 2) {
    return null;
  }

  const onTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goTo = (page: number) => {
    onTop();
    onPageChange(page);
  };

  const lastPage = paginationRange.at(-1);

  // Every control is a real <button>: keyboard focus, Enter and Space, and the
  // disabled state come from the element instead of being drawn with CSS. The
  // previous version put onClick on <li>, which meant the list could only be
  // used with a mouse - `pointer-events: none` is invisible to a screen reader.
  return (
    <nav aria-label="Pagination">
      <ul className={styles.paginationContainer} data-testid="pagination-block">
        <li>
          <button
            type="button"
            className={styles.paginationItem}
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <span
              className={`${styles.arrow} ${styles.left}`}
              data-testid="left-arrow"
            />
          </button>
        </li>

        {paginationRange.map((pageNumber, i) => {
          if (pageNumber === DOTS) {
            return (
              <li
                className={`${styles.paginationItem} ${styles.dots}`}
                key={`dots-${i}`}
                aria-hidden="true"
              >
                &#8230;
              </li>
            );
          }

          const page = +pageNumber;
          const isCurrent = page === currentPage;

          return (
            <li key={pageNumber}>
              <button
                type="button"
                className={clsx(styles.paginationItem, {
                  [styles.selected]: isCurrent,
                })}
                onClick={() => goTo(page)}
                // Announces the current page to assistive technology; the
                // `selected` class only makes it visible.
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${page}`}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className={styles.paginationItem}
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === lastPage}
            aria-label="Next page"
          >
            <span
              className={`${styles.arrow} ${styles.right}`}
              data-testid="right-arrow"
            />
          </button>
        </li>
      </ul>
    </nav>
  );
};

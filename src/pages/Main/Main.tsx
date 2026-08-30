import { RepoList } from '~/components/RepoList';
import { SearchInput } from '~/components/SearchInput';

export const Main = () => {
  return (
    <>
      <SearchInput />
      <RepoList />
    </>
  );
};

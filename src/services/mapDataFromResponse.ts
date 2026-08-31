import { GetRepoQuery } from '~/__generated__/graphql';
import { Repo, SearchRepoQueryResponse, RepoItem } from './types';

export const mapFetchRepoResponseToRepo = (res: GetRepoQuery): Repo => {
  const repository = res.repository;

  const languages = res.repository?.languages?.nodes
    ?.map((n) => n?.name)
    .filter(Boolean) as string[] | undefined;

  return {
    stargazerCount: repository?.stargazerCount,
    login: repository?.owner.login,
    avatar: repository?.owner.avatarUrl,
    name: repository?.name,
    description: repository?.description,
    updatedAt: repository?.updatedAt as Date | string | null | undefined,
    languages: languages?.length ? languages : undefined,
    url: repository?.url,
  };
};

export const mapSearchRepoQueryResponseToRepos = (
  res: SearchRepoQueryResponse
): RepoItem[] => {
  const repoItems: RepoItem[] = [];

  res.search.edges?.forEach((e) => {
    if (!e?.node) return;
    const { id, name, url, stargazers, defaultBranchRef } = e.node;

    repoItems.push({
      id,
      name,
      url,
      stargazersCount: stargazers.totalCount,
      committedDate: defaultBranchRef?.target?.committedDate,
    });
  });

  return repoItems;
};

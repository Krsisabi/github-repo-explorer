import { GetRepoQuery } from '~/__generated__/graphql';
import {
  Repo,
  SearchRepoQueryResponse,
  RepoItem,
  ReposQueryResponse,
} from './types';

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

export const mapReposQueryResponseToRepos = (
  res: ReposQueryResponse
): RepoItem[] => {
  const repoItems: RepoItem[] = [];

  res.viewer.repositories.edges?.forEach((e) => {
    if (!e?.node) return null;
    const { id, name, url, stargazers, defaultBranchRef } = e.node;

    const repoItem: RepoItem = {
      id,
      name,
      url,
      stargazersCount: stargazers.totalCount,
      committedDate: defaultBranchRef?.target?.committedDate,
    };

    repoItems.push(repoItem);
  });

  return repoItems;
};

export const mapSearchRepoQueryResponseToRepos = (
  res: SearchRepoQueryResponse
): RepoItem[] => {
  const repoItems: RepoItem[] = [];

  const { search } = res;

  search.edges?.forEach((e) => {
    if (!e?.node) return null;
    const { id, name, stargazers, url, defaultBranchRef } = e?.node;
    const repoItem: RepoItem = {
      id,
      name,
      url,
      stargazersCount: stargazers.totalCount,
      committedDate: defaultBranchRef?.target?.committedDate,
    };
    repoItems.push(repoItem);
  });

  return repoItems;
};

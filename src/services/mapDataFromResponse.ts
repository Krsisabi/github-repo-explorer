import { FetchRepoQuery } from '~/__generated__/graphql';
import {
  Repo,
  SearchRepoQueryResponse,
  RepoItem,
  Repos,
  ReposQueryResponse,
} from './types';

export const mapFetchRepoResponseToRepo = (res: FetchRepoQuery): Repo => {
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
): Repos => {
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

  return {
    repoItems,
    repositoryCount: res.viewer.repositories.totalCount,
    pageInfo: res.viewer.repositories.pageInfo,
  };
};

export const mapSearchRepoQueryResponseToRepos = (
  res: SearchRepoQueryResponse
): Repos => {
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

  return {
    repoItems,
    repositoryCount: search.repositoryCount,
    pageInfo: search.pageInfo,
  };
};

import { GetRepoQuery } from '~/__generated__/graphql';
import { Repo, RepoSearchConnection, RepoItem, RepoWindow } from './types';

export const mapFetchRepoResponseToRepo = (res: GetRepoQuery): Repo => {
  const repository = res.repository;

  const languages = res.repository?.languages?.nodes
    ?.map((n) => n?.name)
    .filter(Boolean) as string[] | undefined;

  return {
    stargazerCount: repository?.stargazerCount,
    login: repository?.owner.login,
    ownerUrl: repository?.owner.url,
    avatar: repository?.owner.avatarUrl,
    name: repository?.name,
    description: repository?.description,
    updatedAt: repository?.updatedAt as Date | string | null | undefined,
    languages: languages?.length ? languages : undefined,
    url: repository?.url,
  };
};

export const mapSearchConnectionToRepoWindow = (
  search: RepoSearchConnection
): RepoWindow => {
  const items: RepoItem[] = [];

  search.edges?.forEach((edge) => {
    const node = edge?.node;
    // `search` can return issues and users as well, and the generated type
    // says so: only the Repository branch of the union carries these fields.
    if (!node || !('id' in node)) return;

    items.push({
      id: node.id,
      name: node.name,
      url: node.url,
      stargazersCount: node.stargazerCount,
      lastPushedAt: node.pushedAt,
    });
  });

  return {
    items,
    totalCount: search.repositoryCount,
    endCursor: search.pageInfo.endCursor,
    hasNextPage: search.pageInfo.hasNextPage,
  };
};

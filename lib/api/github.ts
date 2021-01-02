import { Octokit } from "@octokit/rest";
import { VAULT_DIRECTORY } from "../obsidian";
import { AsyncReturnType } from "type-fest";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

function fetchCommits(opts: { path: string; page?: number; branch?: string }) {
  return octokit.repos.listCommits({
    owner: "richardcrng",
    repo: "richard.ng",
    path: opts.path,
    per_page: 100,
    page: opts.page ?? 1,
    sha: opts.branch ?? "develop",
  });
}

export async function getAllGardenCommits() {
  let page = 1;
  let res = await fetchCommits({
    path: `${VAULT_DIRECTORY}`,
    page,
  });

  const results = [...res.data];

  while (res.data.length === 100) {
    page += 1;
    res = await fetchCommits({
      path: `${VAULT_DIRECTORY}`,
      page,
    });
    res.data && results.push(...res.data);
  }

  return mapCommitsToDates(results);
}

export async function getTotalCommitCount() {
  const allCommits = await getAllGardenCommits()
  return allCommits.length
}

export async function getCommitsForGardenNote(noteId: string) {
  let page = 1;
  let res = await fetchCommits({
    path: `${VAULT_DIRECTORY}/${noteId}.md`,
    page,
  });

  const results = [...res.data];

  while (res.data.length === 100) {
    page += 1;
    res = await fetchCommits({
      path: `${VAULT_DIRECTORY}/${noteId}.md`,
      page,
    });
    res.data && results.push(...res.data);
  }

  return results;
}

export async function getCommitDatesForGardenNote(noteId: string) {
  const commitData = await getCommitsForGardenNote(noteId);
  return mapCommitsToDates(commitData);
}

function mapCommitsToDates(
  commitData: AsyncReturnType<typeof fetchCommits>["data"]
) {
  return commitData.map((commitDatum) => {
    return {
      message: commitDatum.commit.message,
      date: commitDatum.commit.author?.date,
      sha: commitDatum.sha,
    };
  });
}

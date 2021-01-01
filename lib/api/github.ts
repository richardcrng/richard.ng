import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function getCommitsForGardenNote(noteId: string) {
  let page = 1;
  let res = await octokit.repos.listCommits({
    owner: "richardcrng",
    repo: "richard.ng",
    path: `_garden/${noteId}.md`,
    per_page: 100,
    page,
  });

  const results = [...res.data];

  while (res.data.length === 100) {
    page += 1;
    res = await octokit.repos.listCommits({
      owner: "richardcrng",
      repo: "richard.ng",
      path: `_garden/${noteId}.md`,
      per_page: 100,
      page,
    });
    res.data && results.push(...res.data);
  }

  return results;
}

export async function getCommitDatesForGardenNote(noteId: string) {
  const commitData = await getCommitsForGardenNote(noteId);
  return commitData.map((commitDatum) => {
    return {
      message: commitDatum.commit.message,
      date: commitDatum.commit.author?.date,
    };
  });
}

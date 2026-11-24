/** Builds links into GitHub's own UI, so visitors submit with their own account and no backend is needed. */

const repository = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "hynding/in2eat";
const defaultBranch = process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "main";
const GITHUB = "https://github.com";

/** Browsers and GitHub start to reject URLs beyond this length. */
export const MAX_URL_LENGTH = 8000;

export const repositoryUrl = `${GITHUB}/${repository}`;

/** Opens a new issue from the named issue form, with fields prefilled by their ids. */
export function issueFormUrl(template: string, fields: Readonly<Record<string, string>>, title?: string): string {
  const params = new URLSearchParams({ template });
  if (title) params.set("title", title);
  for (const [id, value] of Object.entries(fields)) if (value) params.set(id, value);
  return `${repositoryUrl}/issues/new?${params}`;
}

/**
 * Opens GitHub's "create new file" page. Visitors without write access are
 * offered a fork automatically, and committing leads straight into a pull request.
 */
export function newFileUrl(path: string, contents?: string, message?: string): string {
  const params = new URLSearchParams({ filename: path });
  if (contents !== undefined) params.set("value", contents);
  if (message) params.set("message", message);
  return `${repositoryUrl}/new/${defaultBranch}?${params}`;
}

/** Opens GitHub's editor for an existing file, for corrections. */
export const editFileUrl = (path: string): string => `${repositoryUrl}/edit/${defaultBranch}/${path}`;

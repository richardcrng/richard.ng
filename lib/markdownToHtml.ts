import remark from "remark";
import html from "remark-html";
import { getInternalObsidianLinkMatches } from "./obsidian";

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function obsidianMarkdownToHtml(markdown: string) {
  const defaultMarkdown = await markdownToHtml(markdown);
  const internalLinks = getInternalObsidianLinkMatches(defaultMarkdown);
  const internalLinkedMarkdown = internalLinks.reduce((acc, internalLink) => {
    const sansBrackets = internalLink.substring(2, internalLink.length - 2);
    const [noteId, text] = sansBrackets.split("|");
    const href = `<a href="/garden/${encodeURIComponent(noteId)}">${text}</a>`;
    return acc.replace(internalLink, href);
  }, defaultMarkdown);
  return internalLinkedMarkdown;
}

import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml, { obsidianMarkdownToHtml } from "./markdownToHtml";

export interface ObsidianNoteFrontMatter {
  isPublic?: boolean;
  title?: string;
}

const obsidianVaultDirectory = () => join(process.cwd(), "vault");

export function getInternalObsidianLinks(markdown: string) {
  const linkRegex = /\[\[([a-zA-Z0-9-| ]+)\]\]/g;
  const matches = markdown.match(linkRegex) || [];
  return matches;
}

export function getObsidianNoteSlugs() {
  return fs
    .readdirSync(obsidianVaultDirectory())
    .filter((path) => path !== ".obsidian");
}

// type SlugField = keyof ObsidianNoteFrontMatter | "slug" | "content";

export interface ObsidianNote {
  frontMatter: ObsidianNoteFrontMatter;
  content: string;
  slug: string;
}

export function getAllObsidianNotes(): ObsidianNote[] {
  const slugs = getObsidianNoteSlugs();
  const notes = slugs.map((slug) => getObsidianNoteBySlug(slug));
  return notes;
}

export async function getAndParseAllObsidianNotes(): Promise<ObsidianNote[]> {
  const notes = getAllObsidianNotes();
  const parsedNotes = await Promise.all(
    notes.map(async (note) => {
      const parsedContent = await markdownToHtml(note.content);
      return {
        ...note,
        content: parsedContent,
      };
    })
  );
  return parsedNotes;
}

export function getObsidianNoteBySlug(slug: string): ObsidianNote {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(obsidianVaultDirectory(), `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontMatter, content } = matter(fileContents);
  return {
    frontMatter,
    content,
    slug: realSlug,
  } as ObsidianNote;
}

export async function getAndParseObsidianNoteBySlug(
  slug: string
): Promise<ObsidianNote> {
  const { content, ...note } = getObsidianNoteBySlug(slug);
  const parsedContent = await obsidianMarkdownToHtml(content);
  return {
    ...note,
    content: parsedContent,
  };
}

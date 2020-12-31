import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml, { obsidianMarkdownToHtml } from "./markdownToHtml";

export interface ObsidianNoteFrontMatter {
  isPublic?: boolean;
  title?: string;
}

const obsidianVaultDirectory = join(process.cwd(), "vault");

export function getInternalObsidianLinks(markdown: string) {
  const linkRegex = /\[\[([a-zA-Z0-9-| ]+)\]\]/g;
  const matches = markdown.match(linkRegex) || [];
  return matches;
}

export function getObsidianNoteFileNames() {
  return fs
    .readdirSync(obsidianVaultDirectory)
    .filter((path) => path !== ".obsidian");
}

// type SlugField = keyof ObsidianNoteFrontMatter | "slug" | "content";

export interface ObsidianNote {
  frontMatter: ObsidianNoteFrontMatter;
  content: string;
  slug: string;
  fileName: string;
}

export function getAllObsidianNotes(): ObsidianNote[] {
  const fileNames = getObsidianNoteFileNames();
  const notes = fileNames.map((fileName) =>
    getObsidianNoteByFileName(fileName)
  );
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

export function getObsidianNoteByFileName(fileName: string): ObsidianNote {
  const fileNameNoExtension = fileName.replace(/\.md$/, "");
  const fullPath = join(obsidianVaultDirectory, `${fileNameNoExtension}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontMatter, content } = matter(fileContents);
  console.log(frontMatter, content);
  return {
    frontMatter,
    content,
    slug: encodeURIComponent(fileNameNoExtension),
    fileName: fileNameNoExtension,
  } as ObsidianNote;
}

export function getObsidianNoteBySlug(slug: string): ObsidianNote {
  const fileNameNoExtension = decodeURIComponent(slug);
  const fullPath = join(obsidianVaultDirectory, `${fileNameNoExtension}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontMatter, content } = matter(fileContents);
  console.log(frontMatter, content);
  return {
    frontMatter,
    content,
    slug,
    fileName: fileNameNoExtension,
  } as ObsidianNote;
}

export async function getAndParseObsidianNoteByFileName(
  fileName: string
): Promise<ObsidianNote> {
  const { content, ...note } = getObsidianNoteByFileName(fileName);
  const parsedContent = await obsidianMarkdownToHtml(content);
  return {
    ...note,
    content: parsedContent,
  };
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

import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml, { obsidianMarkdownToHtml } from "./markdownToHtml";

export interface ObsidianNoteFrontMatter {
  isPublic?: boolean;
  title?: string;
}

export interface InternalLinkPoint {
  match: string;
  fileName: string;
  slug: string;
  anchorText: string;
}

export interface ObsidianNote {
  frontMatter: ObsidianNoteFrontMatter;
  markdownContent: string;
  htmlContent?: string;
  slug: string;
  fileName: string;
  internalLinks: Record<string, InternalLinkPoint>;
}

export interface ObsidianNoteWithHTML extends ObsidianNote {
  htmlContent: string;
}

const obsidianVaultDirectory = join(process.cwd(), "vault");

export function convertObsidianNoteFromRaw(
  raw: string,
  identifier: string,
  isURIEncoded = false
): ObsidianNote {
  const { data: frontMatter, content: markdownContent } = matter(raw);
  const internalLinkMatches = getInternalObsidianLinkMatches(markdownContent);

  const internalLinks: Record<
    string,
    InternalLinkPoint
  > = internalLinkMatches.reduce((acc, internalLink) => {
    const sansBrackets = internalLink.substring(2, internalLink.length - 2);
    const [noteId, text] = sansBrackets.split("|");
    return {
      ...acc,
      [noteId]: {
        match: internalLink,
        fileName: noteId,
        slug: encodeURIComponent(noteId),
        anchorText: text,
      },
    };
  }, {});

  return {
    frontMatter,
    markdownContent,
    slug: isURIEncoded ? identifier : encodeURIComponent(identifier),
    fileName: isURIEncoded ? decodeURIComponent(identifier) : identifier,
    internalLinks,
  };
}

export function getInternalObsidianLinkMatches(markdown: string) {
  const linkRegex = /\[\[([a-zA-Z0-9-| ]+)\]\]/g;
  const matches = markdown.match(linkRegex) || [];
  return matches;
}

export function getObsidianNoteFileNames() {
  return fs
    .readdirSync(obsidianVaultDirectory)
    .filter((path) => path !== ".obsidian");
}

export function getAllObsidianNotes(): ObsidianNote[] {
  const fileNames = getObsidianNoteFileNames();
  const notes = fileNames.map((fileName) =>
    getObsidianNoteByFileName(fileName)
  );
  return notes;
}

export async function getAndParseAllObsidianNotes(): Promise<
  ObsidianNoteWithHTML[]
> {
  const notes = getAllObsidianNotes();
  const parsedNotes = await Promise.all(
    notes.map(async (note) => {
      const htmlContent = await markdownToHtml(note.markdownContent);
      return {
        ...note,
        htmlContent,
      };
    })
  );
  return parsedNotes;
}

export function getObsidianNoteByFileName(
  fileNameNotURIEncoded: string
): ObsidianNote {
  const fileNameNoExtension = fileNameNotURIEncoded.replace(/\.md$/, "");
  const fullPath = join(obsidianVaultDirectory, `${fileNameNoExtension}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return convertObsidianNoteFromRaw(fileContents, fileNameNoExtension);
}

export function getObsidianNoteBySlug(slugURIEncoded: string): ObsidianNote {
  const fileNameNoExtension = decodeURIComponent(slugURIEncoded);
  const fullPath = join(obsidianVaultDirectory, `${fileNameNoExtension}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return convertObsidianNoteFromRaw(fileContents, fileNameNoExtension);
}

export async function getAndParseObsidianNoteByFileName(
  fileName: string
): Promise<ObsidianNoteWithHTML> {
  const note = getObsidianNoteByFileName(fileName);
  const htmlContent = await obsidianMarkdownToHtml(note.markdownContent);
  return {
    ...note,
    htmlContent,
  };
}

export async function getAndParseObsidianNoteBySlug(
  slug: string
): Promise<ObsidianNoteWithHTML> {
  const note = getObsidianNoteBySlug(slug);
  const htmlContent = await obsidianMarkdownToHtml(note.markdownContent);
  return {
    ...note,
    htmlContent,
  };
}

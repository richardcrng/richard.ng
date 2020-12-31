import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml, { obsidianMarkdownToHtml } from "./markdownToHtml";

const VAULT_DIRECTORY = "_garden";

export interface ObsidianNoteFrontMatter {
  isHome?: boolean;
  isPublic?: boolean;
  title?: string;
}

export interface InternalLinkPoint {
  match: string;
  fileName: string;
  slug: string;
  anchorText: string;
}

export interface ObsidianNoteBase {
  frontMatter: ObsidianNoteFrontMatter;
  markdownContent: string;
  slug: string;
  fileName: string;
}

export interface ObsidianNoteWithInternalLinks extends ObsidianNoteBase {
  internalLinks: Record<string, InternalLinkPoint>;
}

export interface ObsidianNoteWithBacklinks
  extends ObsidianNoteWithInternalLinks {
  backlinks: Record<string, ObsidianNoteBase>;
}

export type WithHTMLContent<T extends ObsidianNoteBase> = T & {
  htmlContent: string;
};

const obsidianVaultDirectory = join(process.cwd(), VAULT_DIRECTORY);

export function convertObsidianNoteFromRaw(
  raw: string,
  fileName: string
): ObsidianNoteWithInternalLinks {
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
    slug: encodeURIComponent(fileName),
    fileName,
    internalLinks,
  };
}

export function getInternalObsidianLinkMatches(markdown: string) {
  const linkRegex = /\[\[([a-zA-Z0-9-| ]+)\]\]/g;
  const matches = markdown.match(linkRegex) || [];
  return matches;
}

export function getAllObsidianNoteFileNames() {
  const markdownFileNames = fs
    .readdirSync(obsidianVaultDirectory)
    .filter((path) => path.match(/\.md$/))
    .map((fileName) => fileName.replace(/\.md$/, ""));

  return markdownFileNames;
}

export function getAllObsidianNoteSlugs() {
  const fileNames = getAllObsidianNoteFileNames();
  return fileNames.map(encodeURIComponent);
}

export function getAllObsidianNotes(): ObsidianNoteWithInternalLinks[] {
  const fileNames = getAllObsidianNoteFileNames();
  const notes = fileNames.map((fileName) =>
    getObsidianNoteByFileName(fileName)
  );
  return notes;
}

export async function getAndParseAllObsidianNotes(): Promise<
  WithHTMLContent<ObsidianNoteWithInternalLinks>[]
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
  fileNameNotURIEncodedNoExtension: string
): ObsidianNoteWithInternalLinks {
  const fullPath = join(
    obsidianVaultDirectory,
    `${fileNameNotURIEncodedNoExtension}.md`
  );
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return convertObsidianNoteFromRaw(
    fileContents,
    fileNameNotURIEncodedNoExtension
  );
}

export function getObsidianNoteBySlug(
  slugURIEncoded: string
): ObsidianNoteWithInternalLinks {
  const fileNameNoExtension = decodeURIComponent(slugURIEncoded);
  const fullPath = join(obsidianVaultDirectory, `${fileNameNoExtension}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return convertObsidianNoteFromRaw(fileContents, fileNameNoExtension);
}

export async function getAndParseObsidianNoteByFileName(
  fileName: string
): Promise<WithHTMLContent<ObsidianNoteWithInternalLinks>> {
  const note = getObsidianNoteByFileName(fileName);
  const htmlContent = await obsidianMarkdownToHtml(note.markdownContent);
  return {
    ...note,
    htmlContent,
  };
}

export async function getAndParseObsidianNoteBySlug(
  slug: string
): Promise<WithHTMLContent<ObsidianNoteWithInternalLinks>> {
  const note = getObsidianNoteBySlug(slug);
  const htmlContent = await obsidianMarkdownToHtml(note.markdownContent);
  return {
    ...note,
    htmlContent,
  };
}

export function addBacklinksToNote(
  note: ObsidianNoteWithInternalLinks,
  vault: ObsidianNoteWithInternalLinks[]
): ObsidianNoteWithBacklinks {
  const backlinks: ObsidianNoteWithBacklinks["backlinks"] = {};
  vault.forEach((vaultNote) => {
    if (vaultNote.internalLinks[note.fileName]) {
      backlinks[vaultNote.fileName] = {
        frontMatter: vaultNote.frontMatter,
        fileName: vaultNote.fileName,
        markdownContent: vaultNote.markdownContent,
        slug: vaultNote.slug,
      };
    }
  });
  return {
    ...note,
    backlinks,
  };
}

export function addBacklinks(
  notes: ObsidianNoteWithInternalLinks[]
): ObsidianNoteWithBacklinks[] {
  return notes.map((note) => addBacklinksToNote(note, notes));
}

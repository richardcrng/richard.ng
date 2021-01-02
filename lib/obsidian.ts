import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

export const VAULT_DIRECTORY = "_garden";

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

  const internalLinks: ObsidianNoteWithInternalLinks["internalLinks"] = internalLinkMatches.reduce(
    (acc, internalLink) => {
      const sansBrackets = internalLink.substring(2, internalLink.length - 2);
      const [internalLinkId, anchorText = internalLinkId] = sansBrackets.split(
        "|"
      );
      return {
        ...acc,
        [internalLinkId]: {
          match: internalLink,
          fileName: internalLinkId,
          slug: encodeURIComponent(internalLinkId),
          anchorText,
        },
      };
    },
    {}
  );

  return {
    frontMatter,
    markdownContent,
    slug: encodeURIComponent(fileName),
    fileName,
    internalLinks,
  };
}

export function getInternalObsidianLinkMatches(markdown: string) {
  const linkRegex = /\[\[.*?\]\]/g;
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

export function getAllObsidianNotes(): Record<
  string,
  ObsidianNoteWithInternalLinks
> {
  const fileNames = getAllObsidianNoteFileNames();
  const notes = fileNames.map((fileName) =>
    getObsidianNoteByFileName(fileName)
  );
  return Object.fromEntries(notes.map((note) => [note.fileName, note]));
}

export function getCommonObsidianNoteProps() {
  return {
    slugs: getAllObsidianNoteSlugs(),
    publicSlugs: getPublicObsidianSlugs(),
    publicNotes: getPublicObisidanNotes(),
  };
}

export function getPublicObisidanNotes(): Record<
  string,
  ObsidianNoteWithInternalLinks
> {
  return Object.fromEntries(
    Object.entries(getAllObsidianNotes()).filter(
      ([_, note]) => note.frontMatter.isPublic
    )
  );
}

export function getPublicObsidianSlugs(): string[] {
  return Object.values(getPublicObisidanNotes()).map((note) => note.slug);
}

export function getPublicObsidianNotesHome(): ObsidianNoteWithInternalLinks {
  const home = Object.values(getPublicObisidanNotes()).find(
    (note) => note.frontMatter.isHome
  );
  if (!home) {
    throw new Error("Couldn't find a public Obsidian note home");
  }
  return home;
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

export function addBacklinksToNote(
  note: ObsidianNoteWithInternalLinks,
  vault: Record<string, ObsidianNoteWithInternalLinks>
): ObsidianNoteWithBacklinks {
  type BacklinksStore = ObsidianNoteWithBacklinks["backlinks"];

  const backlinks: BacklinksStore = Object.values(vault).reduce(
    (acc, vaultNote) => {
      if (vaultNote.internalLinks[note.fileName]) {
        return {
          ...acc,
          [vaultNote.fileName]: {
            frontMatter: vaultNote.frontMatter,
            fileName: vaultNote.fileName,
            markdownContent: vaultNote.markdownContent,
            slug: vaultNote.slug,
          },
        };
      } else {
        return acc;
      }
    },
    {} as BacklinksStore
  );

  return {
    ...note,
    backlinks,
  };
}

export function addBacklinks(
  notes: Record<string, ObsidianNoteWithInternalLinks>
): Record<string, ObsidianNoteWithInternalLinks> {
  return Object.fromEntries(
    Object.entries(notes).map(([noteId, note]) => [
      noteId,
      addBacklinksToNote(note, notes),
    ])
  );
}

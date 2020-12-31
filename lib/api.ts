import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

export interface ObsidianNoteFrontMatter {
  isPublished?: boolean;
}

const obsidianVaultDirectory = join(process.cwd(), "vault");

export function getObsidianNoteSlugs() {
  return fs
    .readdirSync(obsidianVaultDirectory)
    .filter((path) => path !== ".obsidian");
}

// type SlugField = keyof ObsidianNoteFrontMatter | "slug" | "content";

export interface ObsidianNote {
  frontMatter: ObsidianNoteFrontMatter;
  content: string;
}

export function getObsidianNoteBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(obsidianVaultDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontMatter, content } = matter(fileContents);
  return {
    frontMatter,
    content,
  } as ObsidianNote;
}

export function getAllObsdianNotes() {
  const slugs = getObsidianNoteSlugs();
  const posts = slugs.map((slug) => getObsidianNoteBySlug(slug));
  return posts;
}

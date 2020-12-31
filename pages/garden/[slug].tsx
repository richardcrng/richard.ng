import { GetStaticPropsResult } from "next";
import GardenNote, { GardenNoteProps } from "../../components/GardenNote";
import Page from "../../components/Page";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getAllObsidianNoteSlugs,
  getObsidianNoteBySlug,
  getPublicObisidanNotes,
  getPublicObsidianSlugs,
} from "../../lib/obsidian";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<GetStaticPropsResult<GardenNoteProps>> {
  const allNotes = getAllObsidianNotes();
  const publicNotes = getPublicObisidanNotes();
  const note = getObsidianNoteBySlug(slug);
  const noteWithBacklinks = addBacklinksToNote(note, allNotes);

  if (!note) {
    return {
      notFound: true,
    };
  }

  const allSlugs = getAllObsidianNoteSlugs();
  const publicSlugs = getPublicObsidianSlugs();

  return {
    props: {
      note: noteWithBacklinks,
      slugs: allSlugs,
      publicSlugs,
      publicNotes,
    },
  };
}

function Note({ note, slugs, publicSlugs, publicNotes }: GardenNoteProps) {
  return (
    <Page
      head={
        <title>{note.frontMatter.title ?? note.fileName} | Richard Ng</title>
      }
    >
      <GardenNote {...{ note, slugs, publicSlugs, publicNotes }} />
    </Page>
  );
}

export async function getStaticPaths() {
  const slugs = getPublicObsidianSlugs();
  return {
    paths: slugs.map((slug) => `/garden/${slug}`),
    fallback: false,
  };
}

export default Note;

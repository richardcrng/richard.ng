import GardenNote, { GardenNoteProps } from "../../components/GardenNote";
import Page from "../../components/Page";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getObsidianNoteBySlug,
  getPublicObsidianSlugs,
} from "../../lib/obsidian";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const allNotes = getAllObsidianNotes();
  const note = getObsidianNoteBySlug(slug);
  const noteWithBacklinks = addBacklinksToNote(note, allNotes);

  if (!note) {
    return {
      notFound: true,
    };
  }

  const allSlugs = allNotes.map((note) => note.slug);
  const publicSlugs = allNotes
    .filter((note) => note.frontMatter.isPublic)
    .map((note) => note.slug);

  return {
    props: {
      note: noteWithBacklinks,
      slugs: allSlugs,
      publicSlugs,
    },
  };
}

function Note({ note, slugs, publicSlugs }: GardenNoteProps) {
  return (
    <Page
      head={
        <title>{note.frontMatter.title ?? note.fileName} | Richard Ng</title>
      }
    >
      <GardenNote {...{ note, slugs, publicSlugs }} />
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

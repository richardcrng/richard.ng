import { GetStaticPropsResult } from "next";
import GardenMessage from "../../components/GardenMessage";
import GardenNote, { GardenNoteProps } from "../../components/GardenNote";
import Page from "../../components/Page";
import { getCommitDatesForGardenNote } from "../../lib/api/github";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getCommonObsidianNoteProps,
  getObsidianNoteBySlug,
  getPublicObsidianSlugs,
} from "../../lib/obsidian";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<GetStaticPropsResult<GardenNoteProps>> {
  const allNotes = getAllObsidianNotes();
  const note = getObsidianNoteBySlug(slug);
  const noteWithBacklinks = addBacklinksToNote(note, allNotes);
  const commitData = await getCommitDatesForGardenNote(
    decodeURIComponent(slug)
  );

  if (!note) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      note: noteWithBacklinks,
      ...getCommonObsidianNoteProps(),
      commitData,
    },
  };
}

function Note({
  note,
  slugs,
  publicSlugs,
  publicNotes,
  commitData,
}: GardenNoteProps) {
  console.log(publicNotes);

  return (
    <Page
      head={
        <title>{note.frontMatter.title ?? note.fileName} | Richard Ng</title>
      }
    >
      <GardenMessage />
      <GardenNote {...{ note, slugs, publicSlugs, publicNotes, commitData }} />
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

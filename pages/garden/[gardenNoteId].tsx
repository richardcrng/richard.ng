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
  params: { gardenNoteId },
}: {
  params: { gardenNoteId: string };
}): Promise<GetStaticPropsResult<GardenNoteProps>> {
  const allNotes = getAllObsidianNotes();
  const note = getObsidianNoteBySlug(gardenNoteId);
  const noteWithBacklinks = addBacklinksToNote(note, allNotes);
  const commitData = await getCommitDatesForGardenNote(
    decodeURIComponent(gardenNoteId)
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
      commitDenominator: 14,
    },
  };
}

function Note({
  note,
  slugs,
  publicSlugs,
  publicNotes,
  commitData,
  commitDenominator,
}: GardenNoteProps) {
  return (
    <Page
      head={
        <title>{note.frontMatter.title ?? note.fileName} | Richard Ng</title>
      }
    >
      <GardenMessage />
      <GardenNote
        {...{
          note,
          slugs,
          publicSlugs,
          publicNotes,
          commitData,
          commitDenominator,
        }}
      />
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
